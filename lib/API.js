var
  express    = require('express'),

  AppLibrary = require('./AppLibrary').AppLibrary;;

class API {
  constructor(p) {
    this.router = express.Router();
    this.setupRoutes();

    this.library = new AppLibrary();
    // this.library = lib.get('helloworld');

    this.data = { message: 'hooray! welcome to our api!' };
  }

  getRouter() {
    return this.router;
  }

  setupRoutes() {
    console.log("setup routes");
    this.router.get('/applications', this.getApplications.bind(this));
    this.router.get('/applications/:id', this.getApplication.bind(this));
    this.router.post('/deployments', this.deploy.bind(this));
  }

  getApplications(req, res) {

    res.json(this.library.getAll());
  }

  getApplication(req, res) {
    var item = this.library.getItem(req.params.id);
    if (item === null) {
      return res.status(404).send({ error: 'Application not found' });
    }
    res.json(item);
  }


  deploy(req, res) {
    console.log(req.body);      // your JSON
    res.json(req.body);    // echo the result back
  }

}

exports.API = API;
