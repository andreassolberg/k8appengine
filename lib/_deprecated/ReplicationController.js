var
	extend = require('extend');

var ReplicationController = function(data) {
	extend(this, data);
};
ReplicationController.prototype.setID = function(id) {

	extend(true, this, {
		"metadata": {
			"name": id
		}
	});

}

ReplicationController.prototype.addVolume = function(v) {
	if (!this.spec.template.spec.volumes) {
		this.spec.template.spec.volumes = [];
	}
	this.spec.template.spec.volumes.push(v);
}

ReplicationController.prototype.addVolumeMount = function(v) {
	var containers = this.spec.template.spec.containers;
	for(var i = 0; i < containers.length; i++) {
		if (!containers[i].volumeMounts) {
			containers[i].volumeMounts = [];
		}
		containers[i].volumeMounts.push(v);
	}
}


ReplicationController.prototype.mountSecret = function(secret, path) {
	console.log("about to mount", secret, path);
	this.addVolume({
		"name": secret.metadata.name,
		"secret": {
			"secretName": secret.metadata.name
		}
	});
	this.addVolumeMount({
		"name": secret.metadata.name,
		"mountPath": path,
		"readOnly": true
	});
}

exports.ReplicationController = ReplicationController;
