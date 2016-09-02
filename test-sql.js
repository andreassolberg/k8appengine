var
  SQL = require('./lib/services/SQL').SQL,

  Deployment = require('./lib/models/Deployment').Deployment,
  DeploymentConfiguration = require('./lib/models/DeploymentConfiguration').DeploymentConfiguration,

  bunyan = require('bunyan')

var log = bunyan.createLogger({
	name: "TESTCLIENT",
	level: "debug"
});


var deploymentConfiguration = new DeploymentConfiguration({
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
    },
    "sql": {}
  },
  "infrastructure": "sigma",
  "size": "small",
  "admingroup": "fc:org:uninett.no"
})
var need = {

}
var deployment = new Deployment()
deployment
  .setDeploymentConfiguration(deploymentConfiguration)
  .setApplication("helloworld")
var create = true
var config = {}
SQL.get(deployment.getId(), need, config, deployment, create)
  .then((provisioned) => {
      log.info(provisioned, "Provisioned SQL database")
  })
  .then(() => {
    var serverdeployment = {}
    return SQL.remove(deployment, serverdeployment, config)
  })
  .catch((err) => {
    console.error(" ---- ERROR -----")
    console.error(err)
  })
