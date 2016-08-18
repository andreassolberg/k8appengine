
var
  mysql   = require('mysql2'), // or require('mysql2').createConnectionPromise
	Config   = require('./Config').Config,

  bunyan = require('bunyan'),

  Application = require('./models/Application').Application,
  DeploymentConfiguration = require('./models/DeploymentConfiguration').DeploymentConfiguration


var log = bunyan.createLogger({name: "DataStore"});
var dbConfig = Config.get("database");
var pool = mysql.createPoolPromise(dbConfig); // or mysql.createPoolPromise({})

// Query, data object, extended Model adapter, single item ? (alternatively will return a list)
var simpleQuery = function(query, data, model, oneItem) {
  return pool.getConnection()
    .then((conn) => {
      var res = conn.query(query, data);
      conn.release();
      return res;
    }).then( (result) => {
      if (!model) {
        return result[0];
      }
      if (result[0].length === 0) {
        return [];
      }
      return result[0].map(model.fromDB);
    }).then( (objects) => {
      if (oneItem === true) {
        if (objects.length === 0) {
          return null;
        }
        return objects[0];
      }
      return objects;
    }).catch(function(err) {
      log.error("Error fetching from SQL: " + query, data, err);
      throw err;
    });
}

var DataStore = {
  "getApplications": function() {
    return pool.getConnection()
      .then((conn) => {
         var res = conn.query('select * from applications');
         conn.release();
         return res;
      }).then( (result) => {
        return result[0].map(Application.fromDB);
      }).catch((err) => {
        log.error("Error fetching applications", err);
      });
  },
  "___getApplication": function(id) {
    log.info({"application": id}, "getApplication")
    return pool.getConnection()
      .then((conn) => {
         var res = conn.query('select * from applications WHERE application = ?', id);
         conn.release();
         return res;
      }).then( (result) => {
        return result[0].map(Application.fromDB);
      }).catch((err) => {
        log.error("Error fetching applications", err);
      });
  },

  "getApplication": function(id) {
    return simpleQuery("SELECT * FROM applications WHERE application = ?", [id], Application, true);
  },

  "insertApplication": function(app) {
    return pool.getConnection()
      .then((conn) => {
        var res = conn.query('INSERT INTO applications SET ?', app.toDB());
        log.debug("Inserting", x);
        conn.release();
        return res;
      }).then( (result) => {
        log.debug("Successfully inserted application", result);
      }).catch(function(err) {
        log.error("Error inserting application", err);
      });
  },

  "getDomain": function(domain, hostname) {
    return simpleQuery("SELECT * FROM service_dns WHERE domain = ? AND hostname = ?", [domain, hostname], null, true);
  },
  "insertDomain": function(domain, hostname, deployment) {
    return simpleQuery("INSERT INTO service_dns SET ?", {
      "deployment": deployment,
      "domain": domain,
      "hostname": hostname
    });
  },

  "removeDomain": function(deploymentId) {
    return simpleQuery("DELETE FROM service_dns WHERE deployment = ?", [deploymentId]);
  },

  "insertDeployment": function(deploymentConfig) {
    return simpleQuery("INSERT INTO deployments SET ?", deploymentConfig.toDB());
  },

  "removeDeployment": function(deploymentId) {
    return simpleQuery("DELETE FROM deployments WHERE id = ?", [deploymentId]);
  },

  "getDeployments": function(userid) {
    return simpleQuery("SELECT * FROM deployments WHERE owner = ?", [userid], DeploymentConfiguration);
  },

  "getDeployment": function(id) {
    return simpleQuery("SELECT * FROM deployments WHERE id = ?", [id], DeploymentConfiguration, true);
  },

  "getAllDNSentries": function(id) {
    return simpleQuery("SELECT * FROM service_dns", []);
  }




};

exports.DataStore = DataStore;
