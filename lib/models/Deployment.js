var
	Model = require('./Model').Model,
	// ServiceLibrary = require('../ServiceLibrary').ServiceLibrary,
	// ReplicationController = require('./kube/ReplicationController').ReplicationController,

	KubeDeployment = require('./kube/KubeDeployment').KubeDeployment,

	Moniker = require('moniker');


class Deployment extends Model {

	constructor(props) {
		super(props)
		this.objects = {
			"deployment": null
		}
		this.appservices = {}
	}

	getDeployment() {
		return this.objects.deployment;
	}

  setDeploymentConfiguration(deploymentConfiguration) {
    this.deploymentConfiguration = deploymentConfiguration
    return this;
  }
  setApplication(application) {
    this.application = application
    return this;
  }

	addService(type, service) {
		console.log("Adding appservices of type  " + type);
		this.appservices[type] = service
	}

  getId() {
    return this.deploymentConfiguration.id
  }

	generate() {
		var items = [];
		this.objects.deployment = new KubeDeployment(this.application.template.deployment);
		this.objects.deployment.setId(this.getId());
		this.objects.deployment.setApplicationId(this.application.application);
		// if (this.application.template.service) {
		// 		this.objects.service = new KubeDeployment(this.application.template.service);
		// }

		for(let serviceKey in this.appservices) {
			this.appservices[serviceKey].encrichDeployment(this);
		}

		return this.objects;
	}

}




exports.Deployment = Deployment;