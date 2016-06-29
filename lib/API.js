var
  express    = require('express'),

  DeploymentConfiguration = require('./models/DeploymentConfiguration').DeploymentConfiguration,
  AppLibrary = require('./AppLibrary').AppLibrary,
  DeploymentManager = require('./DeploymentManager').DeploymentManager

class API {
  constructor(p) {
    this.library = new AppLibrary()
    this.router = express.Router()
    this.setupRoutes()
  }

  getRouter() {
    return this.router
  }

  setupRoutes() {
    this.router.get('/applications', this.getApplications.bind(this))
    this.router.get('/applications/:id', this.getApplication.bind(this))
    this.router.post('/deployments', this.deploy.bind(this))
  }

  getApplications(req, res) {
    this.library.getAll()
      .then((apps) => {
        res.json(apps);
      })
  }

  getApplication(req, res) {
    this.library.getItem(req.params.id)
      .then(function(item) {
        if (item === null) {
          return res.status(404).send({ error: 'Application not found' });
        }
        res.json(item);
      })

  }


  deploy(req, res) {

    var deploymentConfiguration = new DeploymentConfiguration(req.body)
    deploymentConfiguration.owner = "4bc98825-1a44-4880-a1d7-021f3028c7cf"
    var applicationId = req.body.application

    return this.library.getItem(applicationId)
      .then(function(application) {

        // console.log(deploymentConfiguration)
        return DeploymentManager.apply(application, deploymentConfiguration)
          .then((result) => {
            res.json(result)
          })

      })
      .catch((err) => {
        console.error("Error", err);
      })

  }

}

exports.API = API;
