var
	Model = require('./Model').Model,
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
			"services": JSON.stringify(this.services),
			"sizes": JSON.stringify(this.sizes)
		};
		return x;
	}
}

Application.fromDB = function(raw) {
  raw.template = JSON.parse(raw.template);
  raw.services = JSON.parse(raw.services);
	raw.sizes = JSON.parse(raw.sizes);
	if (!raw.services) {
		raw.services = {};
	}
	if (!raw.sizes) {
		raw.sizes = {};
	}
  return new Application(raw);
}

exports.Application = Application;
