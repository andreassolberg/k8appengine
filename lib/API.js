var express    = require('express');

class API {
  constructor(p) {
    this.router = express.Router();
    this.setupRoutes();

    this.data = { message: 'hooray! welcome to our api!' };
  }

  getRouter() {
    return this.router;
  }

  setupRoutes() {
    console.log("setup routes");
    this.router.get('/library', this.getLibrary.bind(this));
  }

  getLibrary(req, res) {
    console.log("getlibrary");
    res.json(this.data);
  }

}

exports.API = API;
