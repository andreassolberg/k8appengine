var
	fs = require('fs'),
	path = require('path'),

	Deployment = require('./models/Deployment').Deployment,
	Application = require('./models/Application').Application,
	DataStore = require('./DataStore').DataStore,
	ServiceManager = require('./ServiceManager').ServiceManager,

	KubeClient = require('./KubeClient').KubeClient


var DeploymentManager = {


	/**
	 * Create a new deployment
	 */
	"create": function(application, deploymentConfig, log) {

		var deployment = new Deployment()
		deployment
			.setDeploymentConfiguration(deploymentConfig)
			.setApplication(application)

		return Promise.all(
			Object.keys(application.services).map((service) => {

				var need = application.services[service]
				var config = deploymentConfig.services[service]
				return ServiceManager.requestService(deployment, service, need, config)

			})
		)
		.then(() => {
			deployment.generate()

			log.info("Generated deployment", deployment)

			return KubeClient.create(deployment.getDeployment())

			// TODO: Release provisioned services when deploying to kubernets API fails.
		})
		.then(() => {
			log.debug("Successfully created Kubernetes object.")
			return DataStore.insertDeployment(deploymentConfig)
		})
		.then(() => {
			log.debug("Successfully registered deployment entry in storage (DB).")
			return deployment
		})
	},

	/**
	 * Update an existing deployment
	 */
	"update": function(application, deploymentConfig) {

		var deployment = new Deployment()

		deployment
			.setDeploymentConfiguration(deploymentConfig)
			.setApplication(application)

		return Promise.all(
			Object.keys(application.services).map((service) => {

				var need = application.services[service]
				var config = deploymentConfig.services[service]
				return ServiceManager.requestService(deployment, service, need, config)

			})
		)
		.then(() => {
			// console.log("Completed with service deployment..")
			return deployment
		})
	},

	"delete":  function(deploymentId) {
		throw new Error("Deleting deployment not yet implemented")
	}

}


exports.DeploymentManager = DeploymentManager;
