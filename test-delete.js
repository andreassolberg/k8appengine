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
var deploymentId = 'jupyter-c7247e30523f'

var data = {
  token: token
}

DeploymentManager.delete(userId, deploymentId, data, log)
  .then((deployment) => {
    console.log('Successfully created deployment', deployment)
    // Update DNS as well
    // return CommonIngressManager.update()
  })
  .then(() => {
    console.log("COMPLETED...")
  })
  .catch((error) => {
    console.error("ERROR", error)
  })
