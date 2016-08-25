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
  "id":"helloworld-24a026a05a82",
  "size":"medium"
}

var userId = "9f70f418-3a75-4617-8375-883ab6c2b0af"


return DeploymentManager.patch(userId, patch, log)
  .catch((err) => {
    log.error(err, "error")
  })
