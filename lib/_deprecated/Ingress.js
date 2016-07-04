var
	extend = require('extend');

var Ingress = function(data) {
	extend(this, {
		"kind": "Ingress",
		"apiVersion": "extensions/v1beta1",
		"metadata": {},
		"type": "Opaque",
		"spec": {
			"backend": {
				"serviceName": "web-server-service",
				"servicePort": 80
			},
			"rules": []
		}
	});
	extend(true, this, data);

	this.setName("ingress-apps");
};

Ingress.prototype.setName = function(id) {
	extend(true, this, {
		"metadata": {
			"name": id
		}
	});
}

Ingress.prototype.addHost = function(hostName, serviceName) {

	var h = {
		"host": hostName,
		"http": {
			"paths": [{
				"path": "/",
				"backend": {
					"serviceName": serviceName,
					"servicePort": 80
				}
			}]
		}
	};
	this.spec.rules.push(h);
};


Ingress.prototype.setDataJSON = function(key, data) {
	this.data[key] = new Buffer(JSON.stringify(data, undefined, 4)).toString('base64');
}
Ingress.prototype.setDataString = function(key, data) {
	this.data[key] = new Buffer(data).toString('base64');
}

exports.Ingress = Ingress;