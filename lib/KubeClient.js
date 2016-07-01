var
	rp = require('request-promise'),
	Config = require('./Config').Config,
	extend = require('extend'),
  bunyan = require('bunyan')


var configOpts = Config.get('api')
var log = bunyan.createLogger({
	name: "KubernetesClient",
	level: "debug"
});

const prefixes = {
	"v1": "/api",
	"v1beta1": "/apis/extensions/v1beta1"
}

var getPrefix = function(ropts) {
	var prefixTag = ropts.prefix || "v1"
	return prefixes[prefixTag]
}


var getOptions = function(ropts) {

	var options = extend({}, ropts);
	options.url = configOpts.endpoint + getPrefix(ropts) + "/" + ropts.kpath;
	// options.json = true
	options.headers = {
			"Content-Type": "application/json"
	}
	options.strictSSL = false;
	if (configOpts.auth.type === 'password') {
			const authstr = new Buffer(configOpts.auth.username + ':' + configOpts.auth.password).toString('base64')
			options.headers.Authorization = 'Basic ' + authstr
	}

	// console.log("Request options", options);
	log.error({"requestOptions": options}, "REquest options prepared...")
	return options;
}

const typeEndpoints = {
	"Deployment": {
		"path": "deployments",
		"prefix": "v1beta1"
	},
	"ReplicationController": {
		"path": "replicationcontrollers",
		"prefix": "v1"
	},
	"Secret": {
		"path": "secrets",
		"prefix": "v1"
	}
}


var KubeClient = {

	"getObject": function(type, id) {
		var path = typeEndpoints[type]
		if (id) {
			path += '/' + id
		}
		return rp(getOptions({"kpath": path}))
	},

  "create": function(object) {


		log.debug({"kuberequest": object}, "Kube create")

		var path = null
		var prefix = null
		if (!object.hasOwnProperty("kind")) {
			// console.error("Object", object)
			throw new Error("Cannot identify Kubernetes object Kind property.")
		}
		if (typeEndpoints[object.kind]) {
			path = "namespaces/default/" + typeEndpoints[object.kind].path
			prefix = typeEndpoints[object.kind].prefix
		} else {
			throw new Error("Cannot identify Kubernetes object type of an object when about to post to the API.")
		}

		var rpopts = getOptions({
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

}


exports.KubeClient = KubeClient;
