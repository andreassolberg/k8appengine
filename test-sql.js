var
  SQL = require('./lib/services/SQL').SQL,

  Deployment = require('./lib/models/Deployment').Deployment,
  DeploymentConfiguration = require('./lib/models/DeploymentConfiguration').DeploymentConfiguration,

  bunyan = require('bunyan')

var log = bunyan.createLogger({
	name: "TESTCLIENT",
	level: "debug"
});

var deploymentId = 'xxayay'
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

var provisioned = SQL.get(deploymentId, need, config, deployment, create)


log.info(provisioned, "Provisioned SQL database")

SQL.remove(deployment, serverdeployment, config)



// this.library.getItem(applicationId)
//   .then((a) => {
//     application = a
//
//     console.log("--- Application ---");
//     console.log(application)
//     console.log("--- ----------- ---");
//
//     return DeploymentManager.create(application, deploymentConfiguration, log)
//   })
//   .then((deployment) => {
//     console.log('Successfully created deployment', deployment)
//     // Update DNS as well
//     // return CommonIngressManager.update()
//   })
//   .then(() => {
//     console.log("COMPLETED...")
//   })
//   .catch((error) => {
//     console.error("ERROR", error)
//   })
