var
	extend = require('extend');

var Secret = function(data) {
	extend(this, {
		"kind": "Secret",
		"apiVersion": "v1",
		"metadata": {},
		"type": "Opaque",
		"data": {}
	});
	extend(true, this, data);
};

Secret.prototype.setID = function(id) {
	extend(true, this, {
		"metadata": {
			"name": id
		}
	});
}

Secret.prototype.setDataJSON = function(key, data) {
	this.data[key] = new Buffer(JSON.stringify(data, undefined, 4)).toString('base64');
}
Secret.prototype.setDataString = function(key, data) {
	this.data[key] = new Buffer(data).toString('base64');
}

exports.Secret = Secret;