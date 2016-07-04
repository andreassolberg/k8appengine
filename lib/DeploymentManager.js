var
	fs = require('fs'),
	path = require('path'),

	Deployment = require('./models/Deployment').Deployment,
	Application = require('./models/Application').Application,
	DataStore = require('./DataStore').DataStore,
	ServiceManager = require('./ServiceManager').ServiceManager,
	CommonIngressManager = require('./CommonIngressManager').CommonIngressManager,
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
			log.debug({"deployment": deployment}, "Generated deployment")

			var objectkeys = Object.keys(deployment.objects)
			return Promise.all(objectkeys.map((okey) => {
				// return Promise.resolve()
				log.info({"object": deployment.objects[okey], "key": okey}, "About to deploy object")
				return KubeClient.create(deployment.objects[okey])
					.then((result) => {
						deployment.objects[okey] = result
						return result
					})
			}))

			// TODO: Release provisioned services when deploying to kubernets API fails.
		})
		.then(() => {
			log.info({"objects": deployment.objects}, "Successfully created Kubernetes object.")

			if (deployment.deploymentConfiguration.infra === 'gke' && deployment.objects.service) {
				log.info({"service": deployment.objects.service}, "Special handling for Google Container Engine (GKE) – setting up firewall")

				// TODO: Fix GKE Firewall
			}

		})
		.then(() => {
			return DataStore.insertDeployment(deploymentConfig)
		})
		.then(() => {
			log.info("Successfully registered deployment entry in storage (DB).")
			return deployment
		})
	},

	/**
	 * Update an existing deployment
	 TODO: Implement this. only a plcaeholder.
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
			return CommonIngressManager.update()
		})
		.then(() => {
			// console.log("Completed with service deployment..")
			return deployment
		})
	},


	"delete":  function(deploymentId, log) {

		var deployment = null;
		return this.getDeployment(deploymentId)
      .then((d) => {
				deployment = d;
				log.info({"deployment": deployment}, "Successfully loaded stored deployment object")
				return KubeClient.deleteDeployment(deploymentId)
			})
      .then(() => {
				log.info("Successfully deleted deployment object")
				if (deployment.application.template.service) {
					return KubeClient.deleteService(deploymentId)
				}
			})
			.then(() => {
				log.info("Successfully deleted service object")
				return Promise.all(
					Object.keys(deployment.application.services).map((service) => {
						return ServiceManager.deProvsionService(deploymentId, service)
					})
				)
			})
			.then(() => {
				log.info("Successfully deprovisioned all provisioned services for this deployment")
				return DataStore.removeDeployment(deploymentId)
			})
			.then(() => {
				log.info("Successfully deleted deployment entry in storage (DB).")
				return CommonIngressManager.update()
			})
			.then(() => {
				log.info("Successfully updated common ingress manager")
				return true
			})

	},

	// Helper function to get a full deployment object when not creating a new one.
	"getDeployment": function(deploymentId) {

		var deployment = new Deployment()
		return DataStore.getDeployment(deploymentId)
      .then((deploymentConfig) => {
        if (deploymentConfig === null) {
          throw new Error("Deployment not found")
        }
				deployment
					.setDeploymentConfiguration(deploymentConfig)

				return DataStore.getApplication(deploymentConfig.application)
			})
			.then((application) => {
				if (application === null) {
          throw new Error("Application not found")
        }
				deployment
					.setApplication(application)

				return deployment
			})
	}

}


exports.DeploymentManager = DeploymentManager;
