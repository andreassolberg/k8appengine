var
	DataStore = require('../DataStore').DataStore,
	DNSService = require('../models/appservices/DNSService').DNSService,
	Config = require('../Config').Config,
  mysql = require('mysql2')

var host = ''

var sqlconf = Config.get('sqlservice')
var pool = mysql.createPoolPromise('msql://' + sqlconf.username + ':' + sqlconf.password + '@' + sqlconf.host + '/information_schema')

var SQL = {

  "get": function(deploymentId, need, config, deployment, create) {



    var database = 's_' + deploymentId
    var username = 'appengine'
    var password = 'skdjfhsdkjfh'

		var sqlservice = new SQLService({
			"host": sqlconf.host,
			"database": database,
      "username": username,
      "password": password
		})

		if (!create) {
				return Promise.resolve(sqlservice)
		}



    pool.query('CREATE NEW DATABASE ? ', database)
      .then((res) => {
        log.info(res, "Database created")
        return pool.query('GRANT ALL ON ?.* TO ?@\'%\'  IDENTIFIED BY ?', [username, database, password])
      })
      .then((res) => {
        log.info(res, "User created")
      })
      .catch((err) => {
        log.error(err, "Error creating database")
      })



    // return DataStore.insertDomain(config.domain, config.hostname, deploymentId)
		// 	.then(() => {
		// 		return dns
		// 	})
  },

	"remove": function(deployment, serverdeployment, config) {
    // return DataStore.removeDomain(deployment.getId())
		// 	.then(() => {
		// 		return true
		// 	})
  }

}

exports.SQL = SQL;
