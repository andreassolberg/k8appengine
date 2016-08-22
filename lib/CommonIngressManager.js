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


	"update": function(infrastructure, log) {

		log.debug({"infrastructure": infrastructure }, "About to fetch dns..")

		var kubectl = new KubeClient(infrastructure)
    return DataStore.getAllDNSentriesFromInfrastructure(infrastructure)
      .then((entries) => {

				log.debug({"dnsEntries": entries, "infrastructure": infrastructure }, "Updating common ingress. Fetched these dns registrations..")

				var ing = Object.assign({}, ingressConfig);
				entries.forEach(function(entry) {
					ing.spec.rules.push(re(entry.hostname + '.' + entry.domain, entry.deployment))
				})

				return kubectl.update(ing)
      })


	}



}


exports.CommonIngressManager = CommonIngressManager;
