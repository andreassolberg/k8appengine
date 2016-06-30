var
	K8s = require('k8s'),
	Config = require('./Config').Config



var opts = Config.get('api')
var kubeapi = K8s.api(opts)


var KubeClient = {
  "create": function(object) {


		var typeEndpoints = {
			"Deployment": "deployments",
			"ReplicationController": "replicationcontrollers",
			"Secret": "secrets"
		}

		console.log("--- object is ")
		console.log(object)

		return new Promise(function(resolve, reject) {

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

			kubeapi.post('namespaces/default/' + typeid, object, function(err, data) {
				console.log("---- CREATE response ----")
				// console.log(data);
				console.log(data)

				if (err) {
					return reject(err)
				}
				return resolve(data)
			});
		});

  }
}


exports.KubeClient = KubeClient;
