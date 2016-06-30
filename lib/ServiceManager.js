var
	Application = require('./models/Application').Application,
	DataStore = require('./DataStore').DataStore;


var DNS = require('./services/DNS').DNS;

var ServiceManager = {

	"requestService": function(deployment, type, need, config) {
    console.log(" ------------------------")
    console.log("   deploymentId " + deployment.getId());
    console.log(" ---- type " + type);
    console.log(" ---- need ", need);
    console.log(" ---- config ", config)

    if (type === "dns") {
      return DNS.get(deployment.getId(), need, config)
				.then((service) => {
					console.log("YES DNS provisioned..");
					deployment.addService(type, service);
				})
    }

		console.log("No service provisioned..");

	}

}

exports.ServiceManager = ServiceManager;
