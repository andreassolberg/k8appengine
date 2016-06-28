var

	Secret = require('./kube/Secret').Secret,

	extend = require('extend'),
	Moniker = require('moniker'),

	util = require('util');


var ProvisionedService = function(data) {
	extend(this, data);
};

ProvisionedService.prototype.getObjects = function(rc) {
	console.log("Get objects from generic ProvisionedService");
	return [];
};





var DataportenResult = function(data) {
	extend(this, data);

	this.secret = new Secret();
	this.secret.setID(Moniker.choose() + '-' + 'dataporten');
	this.secret.setDataJSON('dataportenconfig', this.config);

};

DataportenResult.prototype.getObjects = function(appinstance, rc) {

	console.log("Get objects from dataporten results");

	rc.mountSecret(this.secret, '/etc/dataportenconfig');
	rc.setEnv('DATAPORTEN_CLIENTID', this.config.client_id);
	return [this.secret];
};
// util.inherits(DataportenResult, ProvisionedService);




exports.ProvisionedService = ProvisionedService;
exports.DataportenResult = DataportenResult;

