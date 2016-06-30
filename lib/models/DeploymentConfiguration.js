var
	Model = require('./Model').Model,
	// ServiceLibrary = require('../ServiceLibrary').ServiceLibrary,
	// ReplicationController = require('./kube/ReplicationController').ReplicationController,

	Moniker = require('moniker');


class DeploymentConfiguration extends Model {
	constructor(props) {
		super(props);
		this.setID();
	}

	setID() {
		if (!this.id) {
				this.id = this.application + '-' + Moniker.choose();
		}
	}

	// addServiceConfiguration = function(id, config) {
	// 	this.serviceConfiguration[id] = config;
	// }
	//
	// getServiceConfiguration = function(id, config) {
	// 	if (this.serviceConfiguration.hasOwnProperty(id)) {
	// 		return this.serviceConfiguration[id];
	// 	}
	// 	return {};
	// }
	//
	// provisionServices = function() {
	// 	for(var key in this.app.services) {
	// 		console.log(" --- Provisioning ", key);
	// 		var p = this.servicelibrary.provision(key, this.getServiceConfiguration(key));
	// 		if (p) {
	// 			this.provisionedServices[key] = p;
	// 		}
	// 	}
	// }
	//
	// getObjects = function() {
	//
	// 	var objects = [];
	// 	var rc = this.getRC();
	//
	// 	for(var key in this.provisionedServices) {
	// 		var no = this.provisionedServices[key].getObjects(this, rc);
	// 		objects = objects.concat(no);
	// 	}
	//
	// 	objects.push(rc);
	// 	return objects;
	//
	// }
	//
	// getRC = function() {
	// 	var tag = '';
	//
	// 	var instance = new ReplicationController(this.app.template.rc);
	// 	instance.setID(this.id);
	// 	return instance;
	// }

	toDB() {
		var x = {
			"id": this.id,
			"application": this.application,
			"meta": JSON.stringify(this.meta),
			"services": JSON.stringify(this.services),
			"infrastructure": this.infrastructure,
			"size": this.size,
			"admingroup": this.admingroup,
			"owner": this.owner,
		}
		return x
	}
}

DeploymentConfiguration.fromDB = function(raw) {
  raw.meta = JSON.parse(raw.meta);
  raw.services = JSON.parse(raw.services);
	if (!raw.services) {
		raw.services = {};
	}
  return new DeploymentConfiguration(raw);
}



exports.DeploymentConfiguration = DeploymentConfiguration;
