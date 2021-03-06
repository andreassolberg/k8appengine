var
	rp = require('request-promise'),
	Config = require('./Config').Config,
	extend = require('extend'),
  bunyan = require('bunyan'),
	qs = require('querystring'),

	KubeDeployment = require('./models/kube/KubeDeployment').KubeDeployment

var baseConfigOpts = Config.get('k8api')
var log = bunyan.createLogger({
	name: "KubernetesClient",
	level: "debug"
});

const prefixes = {
	"v1": "/api/v1",
	"v1beta1": "/apis/extensions/v1beta1"
}

var getPrefix = function(ropts) {
	var prefixTag = ropts.prefix || "v1"
	return prefixes[prefixTag]
}


const typeEndpoints = {
	"Deployment": {
		"path": "deployments",
		"prefix": "v1beta1"
	},
	"Pod": {
		"path": "pods",
		"prefix": "v1"
	},
	"Service": {
		"path": "services",
		"prefix": "v1"
	},
	"ReplicationController": {
		"path": "replicationcontrollers",
		"prefix": "v1"
	},
	"Secret": {
		"path": "secrets",
		"prefix": "v1"
	},
	"ConfigMap": {
		"path": "configmaps",
		"prefix": "v1"
	},
	"Ingress": {
		"path": "ingresses",
		"prefix": "v1beta1"
	}
}


var KubeClient = function(infrastructure) {

	this.infrastructure = infrastructure

	if (!baseConfigOpts.hasOwnProperty(infrastructure)) {
		throw new Error("Could not find configuration for infrastructure " + infrastructure)
	}
	this.config = baseConfigOpts[infrastructure]
	// log.debug({"requestOptions": this.config}, "KUBECTL config object...")

}



KubeClient.prototype.getOptions = function(ropts) {

	var options = extend({}, ropts);
	options.url = this.config.endpoint + getPrefix(ropts) + "/" + ropts.kpath;
	// options.json = true
	options.headers = {
			"Content-Type": "application/json"
	}
	options.strictSSL = false;
	if (this.config.auth.type === 'password') {
			const authstr = new Buffer(this.config.auth.username + ':' + this.config.auth.password).toString('base64')
			options.headers.Authorization = 'Basic ' + authstr
	} else if (this.config.auth.type === 'tls') {
		options.cert = new Buffer(this.config.auth["client-certificate-data"], 'base64').toString("ascii");
		options.key = new Buffer(this.config.auth["client-key-data"], 'base64').toString("ascii");
		options.ca = new Buffer(this.config.auth["ca"], 'base64').toString("ascii");
	}

	// console.log("Request options", options);
	// log.debug({"requestOptions": options}, "Request options prepared...")
	return options;
}


KubeClient.prototype.getObject = function(type, id, path) {
	var path
	var prefix

	if (typeEndpoints[type]) {
		path = "namespaces/" + this.config.namespace + "/" + typeEndpoints[type].path + '/' + id + (path ? '/' + path : '')
		prefix = typeEndpoints[type].prefix
	} else {
		throw new Error("Cannot identify Kubernetes object type of an object when about to post to the API.")
	}

	var rpopts = this.getOptions({
		"method": "GET",
		"kpath": path,
		"prefix": prefix
	})

	log.info(rpopts, "Request objects")

	return rp(this.getOptions(rpopts))
}

KubeClient.prototype.getObjects = function(type, query) {
	var path
	var prefix

	if (typeEndpoints[type]) {
		path = "namespaces/" + this.config.namespace + "/" + typeEndpoints[type].path + (query ? '?' + qs.stringify(query) : '')
		prefix = typeEndpoints[type].prefix
	} else {
		throw new Error("Cannot identify Kubernetes object type of an object when about to post to the API.")
	}

	var rpopts = this.getOptions({
		"method": "GET",
		"kpath": path,
		"prefix": prefix
	})

	log.info(rpopts, "Request objects")

	return rp(this.getOptions(rpopts))
}

KubeClient.prototype.getDeployment = function(deploymentId) {
	return this.getObject("Deployment", deploymentId)
		.then((data) => {
			return new KubeDeployment(JSON.parse(data))
		})

}

KubeClient.prototype.getDeploymentStatus = function(deploymentId) {
	return this.getObject("Deployment", deploymentId, 'status')
		.then((data) => {
			return new KubeDeployment(JSON.parse(data))
			// return JSON.parse(data)

		})

}


KubeClient.prototype.getPodStatus = function(deploymentId) {
	return this.getObjects("Pod", {
		"labelSelector": "deployment=" + deploymentId
	})
		.then((data) => {
			// return new KubeDeployment(JSON.parse(data))

			var x = JSON.parse(data)
			return x.items.map((item) => {
				return {
					"metadata": item.metadata,
					"status": item.status
				}
			});
			// return JSON.parse(data)

		})

}

KubeClient.prototype.update = function(object) {

	log.debug({"kuberequest": object}, "Kube update")

	var path = null
	var prefix = null
	if (!object.hasOwnProperty("kind")) {
		// console.error("Object", object)
		throw new Error("Cannot identify Kubernetes object Kind property.")
	}
	if (typeEndpoints[object.kind]) {
		path = "namespaces/" + this.config.namespace + "/" + typeEndpoints[object.kind].path + '/' + object.metadata.name
		prefix = typeEndpoints[object.kind].prefix
	} else {
		throw new Error("Cannot identify Kubernetes object type of an object when about to post to the API.")
	}

	var rpopts = this.getOptions({
		"method": "PUT",
		"kpath": path,
		"prefix": prefix,
		"json": object
	})

	return rp(rpopts)
	.then((data) => {
		log.debug({"kuberesponse": data}, "Successfull response from Kubernetes API")
		return data
		// console.log("Kuberentes OK", data)
	})
	.catch((err) => {
		log.error({"error": err, "url": rpopts.url}, "Kubernetes error accessing API " + rpopts.url)
		throw new Error("Could not successfullly create object at Kubernetes API")
	})

}

KubeClient.prototype.create = function(object) {

	log.debug({"kuberequest": object}, "Kube create")

	var path = null
	var prefix = null
	if (!object.hasOwnProperty("kind")) {
		// console.error("Object", object)
		throw new Error("Cannot identify Kubernetes object Kind property.")
	}
	if (typeEndpoints[object.kind]) {
		path = "namespaces/" + this.config.namespace +"/" + typeEndpoints[object.kind].path
		prefix = typeEndpoints[object.kind].prefix
	} else {
		throw new Error("Cannot identify Kubernetes object type of an object when about to post to the API.")
	}

	var rpopts = this.getOptions({
		"method": "POST",
		"kpath": path,
		"prefix": prefix,
		"json": object
	})

	return rp(rpopts)
		.then((data) => {
			log.debug({"kuberesponse": data}, "Successfull response from Kubernetes API")
			return data
			// console.log("Kuberentes OK", data)
		})
		.catch((err) => {
			log.error({"error": err, "url": rpopts.url}, "Kubernetes error accessing API " + rpopts.url)
			throw new Error("Could not successfullly create object at Kubernetes API")
		})

}


KubeClient.prototype.delete = function(path, prefix) {


	// log.debug({"requestOptions": this.config}, "KUBECTL DELETE  .... config object...")

	var rpopts = this.getOptions({
		"method": "DELETE",
		"prefix": prefix,
		"kpath": path
	})

	return rp(rpopts)
		.then((data) => {
			log.info({"kuberesponse": data}, "Successfull response from Kubernetes API")
			return data
			// console.log("Kuberentes OK", data)
		})
		.catch((err) => {
			log.error({"error": err, "url": rpopts.url}, "Kubernetes error accessing API " + rpopts.url)
			throw new Error("Could not successfullly delete object at Kubernetes API")
		})
}

KubeClient.prototype.deleteDeployment = function(id) {
	return this.delete('namespaces/' + this.config.namespace + '/deployments/' + id, "v1beta1")
}

KubeClient.prototype.deleteService = function(id) {
	return this.delete('namespaces/' + this.config.namespace + '/services/' + id, "v1")
}

KubeClient.prototype.deleteSecrets = function(deploymentId) {
	var q = qs.stringify({
		"labelSelector": "deployment=" + deploymentId
	})
	return this.delete('namespaces/' + this.config.namespace + '/secrets?' + q, "v1")
}

KubeClient.prototype.deleteConfigmaps = function(deploymentId) {
	var q = qs.stringify({
		"labelSelector": "deployment=" + deploymentId
	})
	return this.delete('namespaces/' + this.config.namespace + '/configmaps?' + q, "v1")
}

KubeClient.prototype.deleteReplicasets = function(deploymentId) {
	var q = qs.stringify({
		"labelSelector": "deployment=" + deploymentId
	})
	return this.delete('namespaces/' + this.config.namespace + '/replicasets?' + q, "v1beta1")
}






exports.KubeClient = KubeClient;
