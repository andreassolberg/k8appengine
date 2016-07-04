var
  gcloud = require('gcloud'),
	Config = require('../Config').Config

var conf = Config.get("googleapi")


// console.log("Config", Config.get("googleapi"))


var gce = gcloud.compute({
  projectId: conf.projectid,
  keyFilename: conf.keyfile
});

/*
 * Docs on Google API for firewall
 https://googlecloudplatform.github.io/gcloud-node/#/docs/v0.34.0/compute?method=createFirewall
 */


var GKE = {
  "updateFirewall": function(id, tcpport) {

    var config = {
      id: id,
      protocols: {
        tcp: [tcpport],
        udp: [] // An empty array means all ports are allowed.
      },

      ranges: ['0.0.0.0/0']
    }

      // console.log("YaY")
    return new Promise(function(resolve, reject) {
      gce.createFirewall('new-firewall-name', config, (err, firewall, operation, apiResponse) => {

        if (err) {
          return reject(err)
        }
        return resolve(apiResponse)
        // console.log("Err", err)
        // console.log("firewall", firewall)
        // console.log("operation", operation)
        // console.log("apiResponse", apiResponse)
      } );
    });


  },

  "removeFirewall": function(id) {

    return new Promise(function(resolve, reject) {
      gce.firewall(id).delete((err, operation, apiResponse) => {
        if (err) {
          return reject(err)
        }
        return resolve(apiResponse)
      } );
    });
  }
}


exports.GKE = GKE
