var
	Model = require('./Model').Model,
	// ServiceLibrary = require('../ServiceLibrary').ServiceLibrary,
	// ReplicationController = require('./kube/ReplicationController').ReplicationController,

	Moniker = require('moniker');


class Application extends Model {

	constructor(props) {
		super(props);
		// this.setID();
	}

	toDB() {
		var x = {
			"application": this.application,
			"title": this.title,
			"subtitle": this.subtitle,
			"descr": this.descr,
			"thumbnail": this.thumbnail,
			"price": this.price,
			"template": JSON.stringify(this.template),
			"services": JSON.stringify(this.services)
		};
		return x;
	}
}

Application.fromDB = function(raw) {
  raw.template = JSON.parse(raw.template);
  raw.services = JSON.parse(raw.services);
	if (!raw.services) {
		raw.services = {};
	}
  return new Application(raw);
}

exports.Application = Application;


// Application.prototype.getInstance = function() {
// 	var appinstance = new ApplicationInstance(this);
// 	return appinstance;
// }


// Application.prototype.getServiceNeeds = function() {
// 	if (!this.hasOwnProperty("services")) {
// 		return {};
// 	}
// 	return this.services;
// }
