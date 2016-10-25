var
	Model = require('./Model').Model,
	// ServiceLibrary = require('../ServiceLibrary').ServiceLibrary,
	// ReplicationController = require('./kube/ReplicationController').ReplicationController,

	KubeDeployment = require('./kube/KubeDeployment').KubeDeployment,
	KubeService = require('./kube/KubeService').KubeService,
	KubeIngress = require('./kube/KubeIngress').KubeIngress,
	KubeConfigMap = require('./kube/KubeConfigMap').KubeConfigMap,

	Moniker = require('moniker'),
	extend = require('extend');


class Deployment extends Model {

	constructor(props) {
		super(props)
		this.objects = {
			"deployment": null
		}
		this.appservices = {}
		this.annotations = {}
		this.secrets = []
	}

	// Ops parameter is not implemented yet.
	requireAuthorizedUser(userId, ops, log) {
		log.info({userId, ops, owner: this.deploymentConfiguration.owner}, "about to verify ownership of deployment")
		if (userId !== this.deploymentConfiguration.owner) {
			throw new Error("Authenticated user is not authorized to perform this operation")
		}
	}

	getDeployment() {
		return this.objects.deployment
	}

	getAppService(service) {
		if (this.appservices[service]) {
			return this.appservices[service]
		}
		return null
	}

  setDeploymentConfiguration(deploymentConfiguration) {
    this.deploymentConfiguration = deploymentConfiguration
    return this;
  }

	patch(patch) {
		extend(this.deploymentConfiguration, patch)
	}

  setApplication(application) {
    this.application = application
    return this;
  }

	addKubeSecret(secret) {
		this.secrets.push(secret)
	}

	addService(type, service) {
		// console.log("Adding appservices of type  " + type);
		this.appservices[type] = service
	}

  getId() {
    return this.deploymentConfiguration.id
  }

	addRoute(host) {
		if (this.objects.ingress && this.objects.service) {
			var port = this.objects.service.getPort()
			this.objects.ingress.addRoute(host, this.getId(), port)
		}
	}

	annotate(key, value) {
		this.annotations[key] = value
	}

	generate() {
		var items = [];

		// First prepare a Kubernets Deployment object.
		this.objects.deployment = new KubeDeployment(this.application.template.deployment)
		this.objects.deployment.setId(this.getId())
		this.objects.deployment.setApplicationId(this.application.application)

		/// The updateReferences function will prefix all references to other objects, such as secrets, configmaps and pvcs.
		this.objects.deployment.updateReferences(this.getId())


		if (!this.deploymentConfiguration.size) {
			throw new Error("deploymentConfiguration does not contain a required size option")
		}
		if (!this.application.sizes[this.deploymentConfiguration.size]) {
			throw new Error("Configured size is not defined for this applicaiton template.")
		}

		var sizeConfig = this.application.sizes[this.deploymentConfiguration.size]
		this.objects.deployment.setSizeConfig(sizeConfig)


		// then the Service object.
		if (this.application.template.service) {
			this.objects.service = new KubeService(this.application.template.service)
			this.objects.service.setId(this.getId())
			this.objects.service.setApplicationId(this.application.application)
		}

		// An then an Ingress object
		if (this.application.template.ingress) {
			this.objects.ingress = new KubeIngress(this.application.template.ingress)
			this.objects.ingress.setId(this.getId())
		}


		for(let serviceKey in this.appservices) {
			this.appservices[serviceKey].enrichDeployment(this)
		}


		if (this.application.template.configmaps) {
			for(var i = 0; i < this.application.template.configmaps.length; i++) {
				let template = this.application.template.configmaps[i]
				let cm = new KubeConfigMap(template)
				cm.setId(this.getId())
				cm.setDeploymentId(this.getId())
				this.objects["configmap-" + cm.getId()] = cm
			}

		}

		for(var i = 0; i < this.secrets.length; i++) {
			let x = this.secrets[i]
			x.setDeploymentId(this.getId())
			this.objects["secret-" + x.getId()] = x
		}




		this.objects.deployment.addAnnotations(this.annotations)

		return this.objects;
	}

}




exports.Deployment = Deployment;
