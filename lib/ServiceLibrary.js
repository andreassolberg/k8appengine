var
	provision = require('./models/ProvisionedService');


var Dataporten = function() {

};

Dataporten.prototype.provision = function() {

	var ps = new provision.DataportenResult({
		"config": {
			"client_id": "blah",
			"client_secret": "blub",
			"redirect_uri": "https://localhost:7079/"
		}
	});
	// console.log("Provisioning for Dataporten");
	// console.log(ps);
	return ps;
}

var DNS = function() {
};

DNS.prototype.provision = function() {
	var ps = new provision.ProvisionedService({});
	return ps;
}


var SQL = function() {
};

SQL.prototype.provision = function() {
	var ps = new provision.ProvisionedService({});
	return ps;
}


var Certificate = function() {
};

Certificate.prototype.provision = function() {
	var ps = new provision.ProvisionedService({});
	return ps;
}



var ServiceLibrary = function() {
	this.lib = {};
	this.lib.dataporten = new Dataporten();
	this.lib.dns = new DNS();
	this.lib.sql = new SQL();
	this.lib.certificate = new Certificate();
};

ServiceLibrary.prototype.provision = function(serviceID, config) {
	if (!this.lib[serviceID]) {
		throw new Error("Cannot provision service " + serviceID + ". Not available in service library");
	}
	return this.lib[serviceID].provision(config);
}


exports.ServiceLibrary = ServiceLibrary;