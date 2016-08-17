# App Engine (Kubernetes)



To run the app engine:

```
NODE_ENV=development npm start | bunyan -l debug -L
```


----

Text below is OUTDATED


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



## Deploying a new application

* Process an instance of an `DeploymentConfiguration`.
* Check if `DeploymentConfiguration` is already deployed, or get the status.
* Check if the `DeploymentConfiguration` differ from existing deployment.
* Update or create.

Provision all missing service provisions.

Combine application defintion, provisoned services and deployment configuraiton and get all kubernetes objects that needs to be created.
