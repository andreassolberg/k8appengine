var
	K8s = require('k8s'),
	Config = require('./Config').Config



var opts = Config.get('api')
var kubeapi = K8s.api(opts)


var KubeClient = {
  "create": function(object) {

		var typeid = null;
		if (object.kind === 'ReplicationController') {
			typeid = 'replicationcontrollers';
		} else if (object.kind === 'Secret') {
			typeid = 'secrets';
		}

		return new Promise(function(resolve, reject) {


			if (typeid === null) {
				throw new Error("Cannot identify Kubernetes object type of an object when about to post to the API.")
			}

			console.log("---- about to create a new object ----")
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
