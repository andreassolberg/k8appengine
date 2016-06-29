var
  express    = require('express'),
  bodyParser = require('body-parser');
var API      = require('./lib/API').API;

var app      = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var a = new API();

app.use('/', a.getRouter());
app.listen(port);
console.log('API listening to port ' + port);



// var DataStore = require('./lib/DataStore').DataStore
// var AppLibrary = require('./lib/AppLibrary').AppLibrary
// var lib = new AppLibrary();
// var apps = lib.getAll()
//
// apps.forEach((app) => {
//   // console.log("Processing ", apps[0])
//   DataStore.insertApplication(app)
// });
