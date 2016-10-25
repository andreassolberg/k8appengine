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

let max = 999; let min = 100;
var random = Math.floor(Math.random() * (max - min)) + min

var domains = {
  "gke": "apps.uninett-labs.no",
  "sigma": "daas.labs.uninett.no"
}
var infra = "gke"
var token = process.env.TOKEN
var input = {
  "application": "jupyter",
  "meta": {
    "title": "jupyter " + random
  },
  "services": {
    "dns": {
      "hostname": "jupyter" + random,
      "domain": domains[infra]
    },
    "dataporten": {
      "token": token
    }
  },
  "infrastructure": infra,
  "size": "small",
  "admingroup": "fc:org:uninett.no"
}
input = {
  "application": "wordpress",
  "meta": {
    "title": "blog " + random
  },
  "services": {
    "dns": {
      "hostname": "blog" + random,
      "domain": domains[infra]
    },
    "dataporten": {
      "token": token
    }
  },
  "infrastructure": infra,
  "size": "small",
  "admingroup": "fc:org:uninett.no"
}

var userId = "9f70f418-3a75-4617-8375-883ab6c2b0af"

this.library = new AppLibrary()

var deploymentConfiguration = new DeploymentConfiguration(input)
deploymentConfiguration.owner = userId
var applicationId = input.application

console.log("About to get application " + applicationId)

// DataStore.getAllDNSentriesFromInfrastructure("gke")
//   .then(function(data) {
//     console.log("Data", JSON.stringify(data, undefined, 2))
//   })
//
// DataStore.getDeployment(req.dataporten.userid, req.params.id)
// var deployments = DataStore.getDeployments(req.dataporten.userid)

var application = null
var deployment = null

this.library.getItem(applicationId)
  .then((a) => {
    application = a

    console.log("--- Application ---");
    console.log(application)
    console.log("--- ----------- ---");

    return DeploymentManager.create(application, deploymentConfiguration, log)
  })
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
