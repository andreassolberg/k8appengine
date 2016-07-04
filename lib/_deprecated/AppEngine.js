var

	Kube = require('./Kube').Kube;

var AppEngine = function() {

	this.kube = new Kube();
	this.kube.getRCs();
	

};


AppEngine.prototype.deploy = function(application) {


	var objects = application.getObjects();
	for(var i = 0; i < objects.length; i++) {
		this.kube.create(objects[i]);
	}

}


exports.AppEngine = AppEngine;

