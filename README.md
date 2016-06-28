# App Engine (Kubernetes)


An application spec is stored in `/etc/{app}.js`:


	{
		"name": "Dataporten Demo",
		"id": "dataporten-demo",
		"descr": "A simple app that authenticates the user with Dataporten.",
		"template": {
			"rc": {
				...
			}
		},
		"services": {
			"sql": {},
			"dns": {},
			"dataporten": {},
			"certificate": {}
		}
	}


Obtain a new instance of an application:

	var dataportenApp = lib.get('dataporten-demo');
	var dataportenAppInstance = dataportenApp.getInstance();


Some of the services that are referred to in the application spec needs user configuration before they can be provisioned. This can be things like application name of this specific instance, owner and authorization info etc.

	dataportenAppInstance.addServiceConfiguration('dataporten', {
		'title': 'Dataporten Demo App Engine 1',
		'': ''
	});
	dataportenAppInstance.addServiceConfiguration('dns', {
		'hostname': 'dpdemo1.apps.labs.uninett.no',
	});

Then services can be provisioned:

	dataportenAppInstance.provisionServices();


Each service will perform provisioning, and add a provision result entry in the application instance object. The instance is now ready to be deployed.

	var a = new AppEngine();
	a.deploy(dataportenAppInstance);





