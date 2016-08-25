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


var input = {
  "application": "helloworld",
  "meta": {
    "title": "Hei verden!"
  },
  "services": {
    "dns": {
      "hostname": "heiverden5",
      "domain": "apps.uninett-labs.no"
    },
    "dataporten": {
      "token": "xxx"
    }
  },
  "infrastructure": "sigma",
  "size": "small",
  "admingroup": "fc:org:uninett.no"
}
var patch = {
  "id":"jupyter-03f971500edb",
  "application":"jupyter",
  "size":"medium"
}



var userId = "9f70f418-3a75-4617-8375-883ab6c2b0af"

// this.library = new AppLibrary()
//
// var deploymentConfiguration = new DeploymentConfiguration(input)
// deploymentConfiguration.owner = userId
// var applicationId = input.application
//
// console.log("About to get application " + applicationId)

// DataStore.getAllDNSentriesFromInfrastructure("gke")
//   .then(function(data) {
//     console.log("Data", JSON.stringify(data, undefined, 2))
//   })

// DataStore.getDeployment(req.dataporten.userid, req.params.id)
// var deployments = DataStore.getDeployments(req.dataporten.userid)
//
//
// var application = null
// var deployment = null


return DeploymentManager.patch(userId, patch, log)
  .catch((err) => {
    log.error(err, "error")
  })




//
// this.library.getItem(applicationId)
//   .then((a) => {
//     application = a
//     return this.getDeployment(deploymentConfiguration.id)
//   })
//   .then((d) => {
//     deployment = d
//
//
//     console.log("--- Application ---");
//     console.log(application)
//     console.log(deployment)
//     console.log("--- ----------- ---");
//
//   //   return DeploymentManager.patch(application, deploymentConfigurationPatch, log)
//   // })
//   // .then((deployment) => {
//   //   console.log('Successfully created deployment', deployment)
//   //   // Update DNS as well
//   //   // return CommonIngressManager.update()
//   // })
//   // .then(() => {
//   //   console.log("COMPLETED...")
//   // })
//   // .catch((error) => {
//   //   console.error("ERROR", error)
//   })
