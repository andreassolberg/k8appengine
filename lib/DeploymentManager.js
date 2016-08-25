var
	fs = require('fs'),
	path = require('path'),

	Deployment = require('./models/Deployment').Deployment,
	Application = require('./models/Application').Application,
	DataStore = require('./DataStore').DataStore,
	ServiceManager = require('./ServiceManager').ServiceManager,
	CommonIngressManager = require('./CommonIngressManager').CommonIngressManager,
	KubeClient = require('./KubeClient').KubeClient,
	GKE = require('./custom/GKE').GKE

var DeploymentManager = {

	/**
	 * Create a new deployment
	 */
	"create": function(application, deploymentConfig, log) {


		var kubeclient = new KubeClient(deploymentConfig.infrastructure)
		var deployment = new Deployment()
		deployment
			.setDeploymentConfiguration(deploymentConfig)
			.setApplication(application)

		return Promise.all(
			Object.keys(application.services).map((service) => {
				var need = application.services[service]
				var config = deploymentConfig.services[service]

				log.info({service, need, config}, "About to request service " + service)
				return ServiceManager.requestService(deployment, service, need, config, true)
			})
		)
		.then(() => {

			deployment.generate()
			log.debug({"deployment": deployment.objects}, "Generated deployment")

			var objectkeys = Object.keys(deployment.objects)
			return Promise.all(objectkeys.map((okey) => {
				// return Promise.resolve()
				log.info({"object": deployment.objects[okey], "key": okey}, "About to deploy object")
				return kubeclient.create(deployment.objects[okey])
					.then((result) => {
						deployment.objects[okey] = result
						return result
					})
			}))

			// TODO: Release provisioned services when deploying to kubernets API fails.
		})
		.then(() => {

			log.info({"objects": deployment.objects}, "Successfully created Kubernetes objects.")

			if (deployment.deploymentConfiguration.infrastructure === 'gke' && deployment.objects.service) {

				let port = deployment.objects.service.spec.ports[0].nodePort

				log.info({"service": deployment.objects.service, port}, "Special handling for Google Container Engine (GKE) – setting up firewall")
				return GKE.updateFirewall(deploymentConfig.id, port, log)

			}

		})
		.then(() => {
			log.info("Successfull special handling for Google Container Engine (GKE) – setting up firewall")
			return DataStore.insertDeployment(deploymentConfig)

		})
		.then(() => {
			log.info("Successfully registered deployment entry in storage (DB).")
			// Update DNS as well

			if (deployment.deploymentConfiguration.infrastructure === 'gke') {
				return CommonIngressManager.update(deployment.deploymentConfiguration.infrastructure, log)
			}

		})
		.then(() => {
			log.info("Successfull updated common ingress")
			return deployment
		})

	},


	"patch": function(userId, patch, log) {

		var kubeclient
		var deployment

		log.info({patch}, "about to load deployment")
		return this.getDeployment(patch.id)
      .then((d) => {
				deployment = d;
				deployment.requireAuthorizedUser(userId, ['update'], log)

				log.info({"deploymentConfiguration": deployment.deploymentConfiguration}, "about to load deployment")
				kubeclient = new KubeClient(deployment.deploymentConfiguration.infrastructure)

			})
			.then(() => {

				return Promise.all(
					Object.keys(deployment.application.services).map((service) => {

						// log.info({applicationServices: deployment.application.services, deploymentConfig: deployment.deploymentConfiguration}, "Application loaded")
						var need = deployment.application.services[service]
						var config = deployment.deploymentConfiguration.services[service]

						log.info({service, need, config}, "About to request service " + service)
						return ServiceManager.requestService(deployment, service, need, config, false)
					})
				)
			})
			.then(() => {

				log.info({deployment: deployment.deploymentConfiguration, patch}, "Successfully loaded stored deployment object")

				deployment.patch(patch)
				deployment.generate()

				log.info({deployment: deployment.deploymentConfiguration, patch}, "After patching")

				log.info({objects: deployment.objects.deployment, patch}, "Deployment object after patching")


				return kubeclient.update(deployment.objects.deployment)


			})

	},

	/**
	 * Update an existing deployment
	 TODO: Implement this. only a plcaeholder.
	 */
	"update": function(application, deploymentConfig, log) {

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
			return CommonIngressManager.update(deploymentConfig.infrastructure, log)
		})
		.then(() => {
			// console.log("Completed with service deployment..")
			return deployment
		})
	},


	"delete":  function(userId, deploymentId, data, log) {

		var kubeclient = null
		var deployment = null
		var serverdeployment = null

		log.info({deploymentId}, "About to get deployment")
		return this.getDeployment(deploymentId)
      .then((d) => {
				deployment = d
				return this.getServerDeployment(deployment)
			})
			.then((d) => {
				serverdeployment = d
				log.info({"deployment": deployment}, "Successfully loaded stored deployment object")

				kubeclient = new KubeClient(deployment.deploymentConfiguration.infrastructure)

				deployment.requireAuthorizedUser(userId, ['delete'], log)
				return kubeclient.deleteDeployment(deploymentId)
			})
      .then(() => {
				log.info("Successfully deleted deployment object")
				if (deployment.application.template.service) {
					return kubeclient.deleteService(deploymentId)
				}
			})
			.then(() => {
				log.info("Successfully deleted service object")
				return Promise.all(
					Object.keys(deployment.application.services).map((service) => {
						return ServiceManager.deProvisonService(deployment, serverdeployment, service, data)
					})
				)
			})
			.then(() => {
				log.info("Successfully deprovisioned all provisioned services for this deployment")
				return DataStore.removeDeployment(deploymentId)
			})
			.then(() => {
				log.info("Successfully deleted deployment entry in storage (DB).")
				if (deployment.deploymentConfiguration.infrastructure === 'gke') {
					return CommonIngressManager.update(deployment.deploymentConfiguration.infrastructure, log)
				}
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
          throw new Error("Deployment not found " + deploymentId)
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
	},

	"getServerDeployment": function(deployment) {

		var kubeclient = new KubeClient(deployment.deploymentConfiguration.infrastructure)

		return kubeclient.getDeployment(deployment.getId())
			.then((serverdeployment) => {
				console.log("SERVER----", JSON.stringify(serverdeployment, undefined, 2))
				return serverdeployment
			})



	}



}


exports.DeploymentManager = DeploymentManager;
