var
	DataStore = require('../DataStore').DataStore,
	DNSService = require('../models/appservices/DNSService').DNSService

var DNS = {

  "get": function(deploymentId, need, config) {
    return DataStore.insertDomain(config.domain, config.hostname, deploymentId)
			.then((yay) => {
				var dns = new DNSService({
					"domain": config.domain,
					"hostname": config.hostname
				})
				return dns
			})
  },

	"remove": function(deploymentId) {
    return DataStore.removeDomain(deploymentId)
			.then(() => {
				return true
			})
  }

}

exports.DNS = DNS;
