var
	K8s = require('k8s'),
	Config = require('./Config').Config,
	extend = require('extend')


var opts = Config.get('api')
var kubeapi = K8s.api(opts)
var betaOpts = extend({}, opts, {
	"api": {
		"version": "extensions/v1beta1"
	}
})
var kubeapiBeta = K8s.api(betaOpts)


var KubeClient = {
  "create": function(object) {

		var typeEndpoints = {
			"Deployment": "deployments",
			"ReplicationController": "replicationcontrollers",
			"Secret": "secrets"
		}

		console.log("--- object is ")
		console.log(object)

		var typeid = null;
		if (!object.hasOwnProperty("kind")) {
			console.error("Object", object)
			throw new Error("Cannot identify Kubernetes object Kind property.")
		}
		if (typeEndpoints[object.kind]) {
			typeid = typeEndpoints[object.kind]
		}
		if (typeid === null) {
			throw new Error("Cannot identify Kubernetes object type of an object when about to post to the API.")
		}

		console.log("---- about to create a new object ----" + 'namespaces/default/' + typeid)
		console.log(object);

		return kubeapiBeta.post('namespaces/default/' + typeid, object)
			.then((data) => {
				console.log("Kuberentes OK", data)
			})
			.catch((err) => {
				console.error("Kubernetes error", err)
			})

  }
}


exports.KubeClient = KubeClient;
