var
  DeploymentConfiguration = require('./lib/models/DeploymentConfiguration').DeploymentConfiguration,
  AppLibrary = require('./lib/AppLibrary').AppLibrary,
  DeploymentManager = require('./lib/DeploymentManager').DeploymentManager,
  CommonIngressManager = require('./lib/CommonIngressManager').CommonIngressManager,
  DataStore = require('./lib/DataStore').DataStore,
  bunyan = require('bunyan')

var log = bunyan.createLogger({
	name: "TESTCLIENT",
	level: "debug"
});


var token = process.env.TOKEN
var userId = "9f70f418-3a75-4617-8375-883ab6c2b0af"
var deploymentId = 'wordpress-5b533263e9fd'

var data = {
  token: token
}

return this.getDeployment(deploymentId)
  .then((d) => {
    deployment = d
    return this.getServerDeployment(deployment)
      .then((d) => {
        serverdeployment = d
        log.info({"deployment": deployment}, "Successfully loaded stored deployment object")
      })
  })
  .then(() => {
    kubeclient = new KubeClient(deployment.deploymentConfiguration.infrastructure)
    deployment.requireAuthorizedUser(userId, ['delete'], log)
    return kubeclient.deleteDeployment(deploymentId)
      .then(() => {
        log.info("Successfully deleted deployment object")
      })
  })
  .then(() => {
    if (deployment.application.template.service) {
      return kubeclient.deleteService(deploymentId)
        .then(() => {
          log.info("Successfully deleted service object")
        })
    } else {
      log.info("No service object to delete")
    }
  })
  .then(() => {
    return Promise.all(
      Object.keys(deployment.application.services).map((service) => {
        return ServiceManager.deProvisonService(deployment, serverdeployment, service, data)
      })
    )
      .then(() => {
        log.info("Successfully deprovisioned all provisioned services for this deployment")
      })
  })
