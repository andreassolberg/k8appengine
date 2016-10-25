var
	rp = require('request-promise'),
	Config = require('../Config').Config,
	extend = require('extend'),
  bunyan = require('bunyan'),

  uuid = require('uuid'),

	DataStore = require('../DataStore').DataStore,
	DataportenService = require('../models/appservices/DataportenService').DataportenService

var conf = Config.get('dataportenapi')
var log = bunyan.createLogger({
	name: "DataportenClient",
	level: "debug"
});

var getOptions = function(ropts) {

	var options = extend({}, ropts);
	options.url = conf.base + ropts.path
	options.headers = {
			"Content-Type": "application/json"
	}
	options.strictSSL = false
	if (ropts.token) {
			options.headers.Authorization = 'Bearer ' + ropts.token
	}

	// console.log("Request options", options);
	// log.debug({"requestOptions": options}, "Request options prepared...")
	return options;
}



var Dataporten = {

  "get": function(deploymentId, need, config, deployment, create) {

    // TODO: Fix strict ordering, such that DNS always is executed before Dataporten

    // var dataporten = new DataportenService({
    //   "config": config
    // })
    //
    // console.log("YAY", dataporten)



    var token = config.token
    var name = deployment.deploymentConfiguration.meta.title
    var descr = deployment.deploymentConfiguration.meta.descr || deployment.application.descr

    var hostname = deployment.deploymentConfiguration.services.dns.hostname + '.' + deployment.deploymentConfiguration.services.dns.domain
    var redirect_uri = 'https://' + hostname + need.path

    var reqobj = {
      "name": name + " (k8e)",
      "descr": descr,
      "client_secret": uuid.v4(),
      "redirect_uri": [redirect_uri],
      "scopes_requested": need.scopes,
      "authproviders": [
        "feide|all",
        "other|openidp",
        "social|all"
      ]
    }

    var opts = {
      "path": "/clientadm/clients/",
      "method": "POST",
      "json": reqobj,
      "token": token
    }

    log.info({
      "request": getOptions(opts),
      "token": token
    }, "Prepared request to Dataporten API")

    return rp(getOptions(opts))
      .then((res) => {
        log.info({"res": res}, "Result from dataporten api")
        var dataporten = new DataportenService(res)
        return dataporten
      })
  },

	"remove": function(deployment, serverdeployment, config) {
    var token = config.token

    // log.info({
    //   "request": getOptions(opts),
    //   "token": token
    // }, "Prepared request to Dataporten API")

		var opts = {
      "path": "/clientadm/clients/" + serverdeployment.getAnnotation("dataportenClientId"),
      "method": "DELETE",
      "token": token
    }
		return rp(getOptions(opts))
      .then((res) => {
				console.log("SUCCESSFULLY DELETED DATAPORTEN FOR " + serverdeployment.getId())
        // log.info({"res": res}, "Result from dataporten api")
        // var dataporten = new DataportenService(res)
        // return dataporten
      })


  }

}

exports.Dataporten = Dataporten;
