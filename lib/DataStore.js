
var
  mysql   = require('mysql2'), // or require('mysql2').createConnectionPromise
	Config   = require('./Config').Config,

  Application = require('./models/Application').Application;

var dbConfig = Config.get("database");

// console.log("----- Initializing database");
// console.log(dbConfig);
// console.log("---------------------------")

// console.log("mysql", pool);

// mysql
var pool = mysql.createPoolPromise(dbConfig); // or mysql.createPoolPromise({})


var qf = function (query, values) {
  if (!values) return query;
  return query.replace(/\:(\w+)/g, function (txt, key) {
    if (values.hasOwnProperty(key)) {
      return this.escape(values[key]);
    }
    return txt;
  }.bind(this));
};


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
  }
};

exports.DataStore = DataStore;
