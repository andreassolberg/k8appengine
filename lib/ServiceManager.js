var
	Application = require('./models/Application').Application,
	DataStore = require('./DataStore').DataStore,
  bunyan = require('bunyan')

var log = bunyan.createLogger({name: "ServiceManager"});

var DNS = require('./services/DNS').DNS;

var ServiceManager = {

	"requestService": function(deployment, type, need, config) {


		log.info("Requesting provisioned service", {
			"deploymentId": deployment.getId(),
			"type": type,
			"need": need,
			"config": config
		})

    if (type === "dns") {
      return DNS.get(deployment.getId(), need, config)
				.then((service) => {
					log.info("DNS Successfully provisioned", service)
					deployment.addService(type, service);
				})
    }


		log.warn("Request for provisioned service not supported: " +  type)

	}

}

exports.ServiceManager = ServiceManager;
