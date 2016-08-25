var
	DataStore = require('../DataStore').DataStore,
	DNSService = require('../models/appservices/DNSService').DNSService

var DNS = {

  "get": function(deploymentId, need, config, deployment, create) {


		var dns = new DNSService({
			"domain": config.domain,
			"hostname": config.hostname
		})

		if (!create) {
				return Promise.resolve(dns)
		}

    return DataStore.insertDomain(config.domain, config.hostname, deploymentId)
			.then(() => {
				return dns
			})
  },

	"remove": function(deployment, serverdeployment, config) {
    return DataStore.removeDomain(deployment.getId())
			.then(() => {
				return true
			})
  }

}

exports.DNS = DNS;
