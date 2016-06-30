var
	DataStore = require('../DataStore').DataStore,
	DNSService = require('../models/appservices/DNSService').DNSService

var DNS = {

  "get": function(deploymentId, need, config) {
    console.log(" Get domain " + config.domain + "  " + config.hostname)
    // DataStore.getDomain(config.domain, config.hostname)
    return DataStore.insertDomain(config.domain, config.hostname, deploymentId)
			.then((yay) => {
				var dns = new DNSService({
					"domain": config.domain,
					"hostname": config.hostname
				});
				return dns;
			})
  }

}

exports.DNS = DNS;
