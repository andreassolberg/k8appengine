var
	DataStore = require('./DataStore').DataStore,
	KubeClient = require('./KubeClient').KubeClient


var CommonIngressManager = {


	"update": function(log) {

    DataStore.getAllDNSentries()
      .then((entries) => {
        console.log("All entries", entries)
      })


	}



}


exports.CommonIngressManager = CommonIngressManager;
