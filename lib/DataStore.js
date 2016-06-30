
var
  mysql   = require('mysql2'), // or require('mysql2').createConnectionPromise
	Config   = require('./Config').Config,

  Application = require('./models/Application').Application;

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
        return result[0];
      }
      return objects;
    }).catch(function(err) {
      console.error("Error fetching from SQL: " + query, data);
      console.error(err);
      return err;
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
        console.error("Error fetching applications", err);
      });
  },
  "getApplication": function(id) {
    console.log("getItem", id)
    return pool.getConnection()
      .then((conn) => {
         var res = conn.query('select * from applications WHERE application = ?', id);
         conn.release();
         return res;
      }).then( (result) => {
        return result[0].map(Application.fromDB);
      }).catch((err) => {
        console.error("Error fetching applications", err);
      });
  },
  "insertApplication": function(app) {
    return pool.getConnection()
      .then((conn) => {
        var res = conn.query('INSERT INTO applications SET ?', app.toDB());
        console.log("Inserting");
        console.log(x);
        conn.release();
        return res;
      }).then( (result) => {
        console.log("results", result);
      }).catch(function(err) {
        console.error("ERRROR");
        console.error(err);
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

  }
};

exports.DataStore = DataStore;
