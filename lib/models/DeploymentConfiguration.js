var
	crypto = require('crypto'),
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

		var token = crypto.randomBytes(6).toString('hex');
		if (!this.id) {
				this.id = this.application + '-' + token;
		}

	}

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
