var
  express    = require('express'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  bunyanlogger = require('express-bunyan-logger'),
  bunyan = require('bunyan')

var API      = require('./lib/API').API;



var logger  = bunyan.createLogger({name: 'appengine-server'});

var app      = express();

app.use(cors());
app.use(bunyanlogger({
  "parseUA": false
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var a = new API();

app.use('/', a.getRouter());
app.listen(port);

logger.info({"port": port}, "API running and listening to port " + port)

// console.log('API listening to port ' + port);



// var DataStore = require('./lib/DataStore').DataStore
// var AppLibrary = require('./lib/AppLibrary').AppLibrary
// var lib = new AppLibrary();
// var apps = lib.getAll()
//
// apps.forEach((app) => {
//   // console.log("Processing ", apps[0])
//   DataStore.insertApplication(app)
// });
