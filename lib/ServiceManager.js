var

  bunyan = require('bunyan'),

	Application = require('./models/Application').Application,
	DataStore = require('./DataStore').DataStore,
	DNS = require('./services/DNS').DNS,
  SQL = require('./services/SQL').SQL,
	Dataporten = require('./services/Dataporten').Dataporten

var log = bunyan.createLogger({name: "ServiceManager"});

var ServiceManager = {

	"requestService": function(deployment, type, need, config, create) {


		log.info({
			"deploymentId": deployment.getId(),
			"type": type,
			"need": need,
			"config": config,
      "create": create
		}, "Requesting provisioned service")

    if (type === "dns") {
      return DNS.get(deployment.getId(), need, config, deployment, create)
				.then((service) => {
					log.info(service, "DNS Successfully provisioned")
					deployment.addService(type, service)
          return service
				})

    } else if (type === "dataporten") {
			return Dataporten.get(deployment.getId(), need, config, deployment, create)
				.then((service) => {
					log.info(service, "Dataporten Successfully provisioned ")
					deployment.addService(type, service)
          return service
				})
    } else if (type === "sql") {
			return SQL.get(deployment.getId(), need, config, deployment, create)
				.then((service) => {
					log.info(service, "SQL Successfully provisioned ")
					deployment.addService(type, service)
          return service
				})
		}

		log.warn("Request for provisioned service not supported: " +  type)


	},


	"deProvisonService": function(deployment, serverdeployment, type, data) {

    if (type === "dns") {
			return DNS.remove(deployment, serverdeployment, data)
				.then(() => {
					log.info({"deploymentId": deployment.getId()}, "DNS Successfully removed")
				})
    } else if (type === "dataporten") {
			return Dataporten.remove(deployment, serverdeployment, data)
      .then(() => {
        log.info({"deploymentId": deployment.getId(), data}, "Dataporten successfully removed")
      })
    } else if (type === "sql") {
      return SQL.remove(deployment, serverdeployment, data)
      .then(() => {
        log.info({"deploymentId": deployment.getId(), data}, "SQL successfully removed")
      })
		}

		log.warn("Request to delete for provisioned service not supported: " +  type)

	}

}

exports.ServiceManager = ServiceManager;
