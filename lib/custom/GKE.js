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
  "updateFirewall": function(id, tcpport, log) {

    var config = {
      protocols: {
        tcp: [tcpport],
        udp: [] // An empty array means all ports are allowed.
      },
      ranges: ['0.0.0.0/0']
    }

      // console.log("YaY")
    return new Promise((resolve, reject) => {

      gce.createFirewall("ae-" + id, config, (err, firewall, operation, apiResponse) => {

        if (err) {
          log.error({err, apiResponse, firewall, operation}, "Error updating GKE firewall")
          return reject(err)
        }
        log.debug({apiResponse, firewall, operation}, "Firewall updated successfully")
        return resolve(apiResponse)
      } )
    })
  },

  "removeFirewall": function(id) {

    return new Promise(function(resolve, reject) {
      gce.firewall("ae-" + id).delete((err, operation, apiResponse) => {
        if (err) {
          return reject(err)
        }
        return resolve(apiResponse)
      } );
    });
  }
}


exports.GKE = GKE
