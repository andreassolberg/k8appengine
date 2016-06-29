var
	fs = require('fs'),
	path = require('path'),

	Application = require('./models/Application').Application,
	DataStore = require('./DataStore').DataStore,
	ServiceManager = require('./ServiceManager').ServiceManager;;

var DeploymentManager = {

	"apply": function(application, deploymentConfig) {
		return new Promise(function(resolve, reject) {

			for(let service in application.services) {

				var need = application.services[service];
				var config = deploymentConfig.services[service];

				ServiceManager.requestService(service, need, config);
			}

			resolve(deploymentConfig);
		});
	}

}


exports.DeploymentManager = DeploymentManager;
