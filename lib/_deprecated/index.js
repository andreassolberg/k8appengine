var
	fs    = require('fs'),
	nconf = require('nconf'),
	cliff = require('cliff'),

	Ingress = require('./lib/models/kube/Ingress').Ingress,
	AppEngine = require('./lib/AppEngine').AppEngine,
	AppLibrary = require('./lib/AppLibrary').AppLibrary;



nconf.argv()
	.env()
	.file({ file: 'etc/config.json' })
	.defaults({
		"": ""
	});


var lib = new AppLibrary();
var app = lib.get('helloworld');

var appinstance = app.getInstance();
appinstance.addServiceConfiguration('dataporten', {
	'title': 'Hello world',
	'': ''
});
appinstance.addServiceConfiguration('dns', {
	'hostname': 'jalla.apps.labs.uninett.no',
});
appinstance.provisionServices();


var dataportenApp = lib.get('dataporten-demo');
var dataportenAppInstance = dataportenApp.getInstance();
dataportenAppInstance.addServiceConfiguration('dataporten', {
	'title': 'Dataporten Demo App Engine 1',
	'': ''
});
dataportenAppInstance.addServiceConfiguration('dns', {
	'hostname': 'dpdemo1.apps.labs.uninett.no',
});
dataportenAppInstance.provisionServices();



console.log("--- app ---");
// var objects = appinstance.getObjects();

// objects.forEach(function(o) {
// 	console.log("---");
// 	console.log(cliff.inspect(o));
// });


var ingress = new Ingress();
ingress.addHost('dpdemo1.apps.labs.uninett.no', "AA");

console.log(cliff.inspect(dataportenAppInstance));
console.log(cliff.inspect(ingress));

process.exit();

var a = new AppEngine();
// a.deploy(appinstance);
a.deploy(dataportenAppInstance);
