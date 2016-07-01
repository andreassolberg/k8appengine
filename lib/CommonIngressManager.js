var
	DataStore = require('./DataStore').DataStore,
	KubeClient = require('./KubeClient').KubeClient



var ingressConfig = {
  "apiVersion": "extensions/v1beta1",
  "kind": "Ingress",
  "metadata": {
    "name": "appengine-common-webrouter"
  },
  "spec": {
    "backend": {
      "serviceName": "default-webserver",
      "servicePort": 80
    },
    "rules": []
  }
}


var re = function(hostname, service) {
	return {
    "host": hostname,
    "http": {
      "paths": [
        {
          "backend": {
            "serviceName": service,
            "servicePort": 80
          }
        }
      ]
    }
  }
}


var CommonIngressManager = {


	"update": function(log) {

    return DataStore.getAllDNSentries()
      .then((entries) => {
        console.log("All entries", entries)

				var ing = Object.assign({}, ingressConfig);
				entries.forEach(function(entry) {
					ing.spec.rules.push(re(entry.hostname + '.' + entry.domain, entry.deployment))
				})

				return KubeClient.update(ing)


				// return ing
      })


	}



}


exports.CommonIngressManager = CommonIngressManager;
