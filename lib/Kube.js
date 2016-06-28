var
	K8s = require('k8s'),
	nconf = require('nconf'),
	cliff = require('cliff');



var Kube = function() {

	var opts = nconf.get('api');
	this.kubeapi = K8s.api(opts);
};

Kube.prototype.getRCs = function() {

	return new Promise(function(resolve, reject) {
		this.kubeapi.get('namespaces/default/replicationcontrollers', function(err, data) {
			console.log("---- replication controllers ----");
			// console.log(data);
			console.log(cliff.inspect(data));
		});
	});

};


Kube.prototype.createRC = function(rc) {

	console.log("---- about to create RC ----")
	console.log(cliff.inspect(rc));
	this.kubeapi.post('namespaces/default/replicationcontrollers', rc, function(err, data) {
		console.log("---- replication controller response ----");
		// console.log(data);
		console.log(cliff.inspect(data));
	});


};



Kube.prototype.create = function(object) {

	var typeid = null;
	if (object.kind === 'ReplicationController') {
		typeid = 'replicationcontrollers';
	} else if (object.kind === 'Secret') {
		typeid = 'secrets';
	}

	console.log("---- about to create a new object ----")
	console.log(cliff.inspect(object));
	this.kubeapi.post('namespaces/default/' + typeid, object, function(err, data) {
		console.log("---- CREATE response ----");
		// console.log(data);
		console.log(cliff.inspect(data));
	});


};



exports.Kube = Kube;