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

	getObjects() {
		var objects = [];
		objects.push(this.getDeployment())
		if (this.objects.service) {
			objects.push(this.objects.service)
		}
		return objects
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

		if (this.application.template.configmaps) {

			for(var i = 0; i < this.application.template.configmaps.length; i++) {
				let template = this.application.template.configmaps[i]
				let cm = new KubeConfigMap(template)
				cm.setId(this.getId())
				this.objects["configmap-" + cm.getId()] = cm
			}

		}

		for(let serviceKey in this.appservices) {
			this.appservices[serviceKey].enrichDeployment(this)
		}

		this.objects.deployment.addAnnotations(this.annotations)

		return this.objects;
	}

}




exports.Deployment = Deployment;
