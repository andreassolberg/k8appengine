var
  express    = require('express'),

  DeploymentConfiguration = require('./models/DeploymentConfiguration').DeploymentConfiguration,
  AppLibrary = require('./AppLibrary').AppLibrary,
  DeploymentManager = require('./DeploymentManager').DeploymentManager,
  CommonIngressManager = require('./CommonIngressManager').CommonIngressManager,
  DataStore = require('./DataStore').DataStore

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
    this.router.get('/deployments', this.getDeployments.bind(this))
    this.router.get('/deployments/:id', this.getDeployment.bind(this))
    this.router.post('/deployments', this.deployCreate.bind(this))
    this.router.put('/deployments/:id', this.deployUpdate.bind(this))

    this.router.post('/servicemanager/dns', this.dnsUpdate.bind(this))
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


  deployCreate(req, res) {

    if (req.body.id) {
      return res.status(500).send({ error: 'Error applying a new deployment with an identifier applied in the configuration.' });
    }

    var deploymentConfiguration = new DeploymentConfiguration(req.body)
    deploymentConfiguration.owner = "4bc98825-1a44-4880-a1d7-021f3028c7cf"
    var applicationId = req.body.application

    return this.library.getItem(applicationId)
      .then(function(application) {

        // console.log(deploymentConfiguration)
        return DeploymentManager.create(application, deploymentConfiguration, req.log)
          .then((deployment) => {

            req.log.debug('Successfully created deployment', deployment)
            res.json(deploymentConfiguration)
          })

      })
      .catch((err) => {
        return res.status(500).send({ error: 'Error applying requested deployment', "message": err.message });
      })

  }
  deployUpdate(req, res) {

    var deploymentConfiguration = new DeploymentConfiguration(req.body)
    deploymentConfiguration.owner = "4bc98825-1a44-4880-a1d7-021f3028c7cf"
    var applicationId = req.body.application

    return this.library.getItem(applicationId)
      .then(function(application) {

        // console.log(deploymentConfiguration)
        return DeploymentManager.create(application, deploymentConfiguration)
          .then((deployment) => {
            req.log.debug('Successfully updated deployment', deployment)
            return res.json(deployment.generate())
          })

      })
      .catch((err) => {
        req.log.error('Error updating requested deployment', err)
        return res.status(500).send({ error: 'Error updating requested deployment', "message": err.message });
      })

  }

  getDeployments(req, res) {
    var deployments = DataStore.getDeployments()
      .then(function(list) {
        return res.json(list)
      })
      .catch((err) => {
        req.log.error('Error getDeployments', err)
        return res.status(500).send({ error: 'Error getting deployments', "message": err.message });
      })
  }

  getDeployment(req, res) {
    var deployments = DataStore.getDeployment(req.params.id)
      .then(function(deployment) {
        if (deployment === null) {
          return res.status(404).send({ error: 'Deployment not found' });
        }
        return res.json(deployment)
      })
      .catch((err) => {
        req.log.error('Error getting deployment', err)
        return res.status(500).send({ error: 'Error getting deployment', "message": err.message });
      })
  }

  dnsUpdate(req, res) {
    CommonIngressManager.update()
      .then(function(list) {
        return res.json(list)
      })
      .catch((err) => {
        req.log.error('Error dnsUpdate', err)
        return res.status(500).send({ error: 'Error getting deployments', "message": err.message });
      })
  }

}

exports.API = API;
