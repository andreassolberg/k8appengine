var
	Application = require('./models/Application').Application,
	DataStore = require('./DataStore').DataStore;

var ServiceManager = {

	"requestService": function(type, need, config) {
    console.log(" ------------------------")
    console.log(" ---- type " + type);
    console.log(" ---- need ", need);
    console.log(" ---- config ", config)


    switch(type) {
      case 'dns':
        break;
    }

	}

}

exports.ServiceManager = ServiceManager;
