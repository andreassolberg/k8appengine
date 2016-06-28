var
	ApplicationInstance = require('./ApplicationInstance').ApplicationInstance,

	extend = require('extend'),
	Moniker = require('moniker');



var Application = function(data) {
	extend(this, data);
};

Application.prototype.getInstance = function() {
	var appinstance = new ApplicationInstance(this);
	return appinstance;
}


Application.prototype.getServiceNeeds = function() {
	if (!this.hasOwnProperty("services")) {
		return {};
	}
	return this.services;
}



exports.Application = Application;

