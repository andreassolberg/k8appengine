var
  gcloud = require('gcloud'),
	Config = require('../Config').Config

var conf = Config.get("googleapi")


console.log("Config", Config.get("googleapi"))


var gce = gcloud.compute({
  projectId: conf.projectid,
  keyFilename: conf.keyfile
});



var GKE = {
  "updateFirewall": function() {

    console.log("YaY")
    var config = {
      name: "yayfw",
      protocols: {
        tcp: [3000],
        udp: [] // An empty array means all ports are allowed.
      },

      ranges: ['0.0.0.0/0']
    };


    gce.createFirewall('new-firewall-name', config,(err, firewall, operation, apiResponse) => {
      console.log("Err", err)
      console.log("firewall", firewall)
      console.log("operation", operation)
      console.log("apiResponse", apiResponse)
    } );

  }
}


exports.GKE = GKE
