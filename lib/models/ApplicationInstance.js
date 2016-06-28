var
	ServiceLibrary = require('../ServiceLibrary').ServiceLibrary,
	ReplicationController = require('./kube/ReplicationController').ReplicationController,

	extend = require('extend'),
	Moniker = require('moniker');


var ApplicationInstance = function(app) {
	this.app = app;
	this.servicelibrary = new ServiceLibrary();

	this.setID();

	this.provisionedServices = {};
	this.serviceConfiguration = {};
};

ApplicationInstance.prototype.setID = function() {
	this.id = this.app.id + '-' + Moniker.choose();
};

ApplicationInstance.prototype.addServiceConfiguration = function(id, config) {
	this.serviceConfiguration[id] = config;
};

ApplicationInstance.prototype.getServiceConfiguration = function(id, config) {
	if (this.serviceConfiguration.hasOwnProperty(id)) {
		return this.serviceConfiguration[id];
	}
	return {};
};

ApplicationInstance.prototype.provisionServices = function() {
	for(var key in this.app.services) {
		console.log(" --- Provisioning ", key);
		var p = this.servicelibrary.provision(key, this.getServiceConfiguration(key));
		if (p) {
			this.provisionedServices[key] = p;
		}
	}
};

ApplicationInstance.prototype.getObjects = function() {

	var objects = [];
	var rc = this.getRC();

	for(var key in this.provisionedServices) {
		var no = this.provisionedServices[key].getObjects(this, rc);
		objects = objects.concat(no);
	}

	objects.push(rc);
	return objects;

}


ApplicationInstance.prototype.getRC = function() {
	var tag = '';

	var instance = new ReplicationController(this.app.template.rc);
	instance.setID(this.id);
	return instance;
};

exports.ApplicationInstance = ApplicationInstance;

