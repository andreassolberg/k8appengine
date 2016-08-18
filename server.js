var
  express    = require('express'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  bunyanlogger = require('express-bunyan-logger'),
  bunyan = require('bunyan'),
  config = require('./lib/Config').Config

var DataportenAPI = require('dataportenapi').DataportenAPI;

var API      = require('./lib/API').API;

var logger  = bunyan.createLogger({name: 'appengine-server'});

var app      = express();

app.set('json spaces', 2);

app.use(cors());
app.use(bunyanlogger({
  "parseUA": false
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;


var fakeMiddleware = function(req, res, next) {
	req.headers.authorization = 'Basic ' + (new Buffer("dataporten:" + config.get("dataportenapi:password")).toString('base64'));
	req.headers['x-dataporten-userid'] = '9f70f418-3a75-4617-8375-883ab6c2b0af';
	req.headers['x-dataporten-userid-sec'] = 'feide:andreas@uninett.no,feide:andreas2@uninett.no';
	req.headers['x-dataporten-clientid'] = '610cbba7-3985-45ae-bc9f-0db0e36f71ad';
	next();
};




var dataportenapi = new DataportenAPI({
    "password": config.get("dataportenapi:password")
});
var a = new API(dataportenapi);

if (config.get('dataportenapi:fakeMiddleware')) {
  logger.info("Using fake middleware. DEVELOPMENT ONLY!")
  app.use('/', fakeMiddleware, dataportenapi.setup(), a.getRouter());
} else {
  app.use('/', dataportenapi.setup(), a.getRouter());
}

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
