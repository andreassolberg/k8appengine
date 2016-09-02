var
	DataStore = require('../DataStore').DataStore,
	SQLService = require('../models/appservices/SQLService').SQLService,
	Config = require('../Config').Config,

	generatePassword = require('password-generator'),
  mysql = require('mysql2')

var host = ''
var sqlconf = Config.get('sqlservice')
var connectstr = 'msql://' + sqlconf.user + ':' + sqlconf.password + '@' + sqlconf.host + '/information_schema'
var pool = mysql.createPoolPromise(connectstr)

/*
 * For now, the password is not possible to retrieve once issued a new account.
 * Will generate a placeholder SQLservice with a wrong password for now (for subsequent requests)
 * It should not matter until you would like to recrete a secret object or similar where the password is present.
 */
var SQL = {

  "get": function(deploymentId, need, config, deployment, create) {

    var database = 's_' + deploymentId
    var username = deploymentId
    var password = generatePassword(18)

		var sqlservice = new SQLService({
			"host": sqlconf.host,
			"database": database,
      "username": username,
      "password": password
		})

		if (!create) {
				return Promise.resolve(sqlservice)
		}


		// console.log("About to start")

    return pool.query('CREATE DATABASE `' + database + '`')
      .then((res) => {
        // console.log(res, "Database created")
				var query = 'GRANT ALL ON `' + database + '`.* TO `' + username +'`@\'%\' IDENTIFIED BY \'' + password + '\''
				// console.log(query)
        return pool.query(query)
      })
      .then((res) => {
        console.log(res, "User created")
				return sqlservice
      })

  },

	"remove": function(deployment, serverdeployment, config) {
		var deploymentId = deployment.deploymentConfiguration.id

		var database = 's_' + deploymentId
    var username = deploymentId
		// console.log("ABOUT to drop database")
		var q1 = 'DROP DATABASE `' + database + '`'
		// console.log(q1)
		return pool.query(q1)
      .then((res) => {
        // console.log(res, "Database created")
				var query = 'DROP USER \'' + username + '\'@\'%\''
				// console.log(query)
        return pool.query(query)
      })

  }

}

exports.SQL = SQL;
