var

  bunyan = require('bunyan'),

	Application = require('./models/Application').Application,
	DataStore = require('./DataStore').DataStore,
	DNS = require('./services/DNS').DNS,
	Dataporten = require('./services/Dataporten').Dataporten

var log = bunyan.createLogger({name: "ServiceManager"});

var ServiceManager = {

	"requestService": function(deployment, type, need, config) {


		log.info({
			"deploymentId": deployment.getId(),
			"type": type,
			"need": need,
			"config": config
		}, "Requesting provisioned service")

    if (type === "dns") {
      return DNS.get(deployment.getId(), need, config, deployment)
				.then((service) => {
					log.info("DNS Successfully provisioned", service)
					deployment.addService(type, service)
          return service
				})

    } else if (type === "dataporten") {
			return Dataporten.get(deployment.getId(), need, config, deployment)
				.then((service) => {
					log.info("Dataporten Successfully provisioned " + service)
					deployment.addService(type, service)
          return service
				})
		}

		log.warn("Request for provisioned service not supported: " +  type)


	},

	"deProvsionService": function(deploymentId, type) {

    if (type === "dns") {
			return DNS.remove(deploymentId)
				.then(() => {
					log.info({"deploymentId": deploymentId}, "DNS Successfully removed")
				})
		}
		log.warn("Request to delete for provisioned service not supported: " +  type)

	}

}

exports.ServiceManager = ServiceManager;
