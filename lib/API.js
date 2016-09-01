var
  express    = require('express'),

  DeploymentConfiguration = require('./models/DeploymentConfiguration').DeploymentConfiguration,
  AppLibrary = require('./AppLibrary').AppLibrary,
  DeploymentManager = require('./DeploymentManager').DeploymentManager,
  CommonIngressManager = require('./CommonIngressManager').CommonIngressManager,
  DataStore = require('./DataStore').DataStore

class API {
  constructor(dataportenapi) {
    this.dataportenapi = dataportenapi;
    this.library = new AppLibrary()
    this.router = express.Router()
    this.setupRoutes()
  }

  getRouter() {
    return this.router
  }

  setupRoutes() {


    var userPolicy = this.dataportenapi.policy({requireUser: true})

    // Applications
    this.router.get('/applications', this.getApplications.bind(this))
    this.router.get('/applications/:id', this.getApplication.bind(this))

    // Deployments
    this.router.get('/deployments', userPolicy, this.getDeployments.bind(this))
    this.router.get('/deployments/:id', userPolicy, this.getDeployment.bind(this))
    this.router.get('/deployments/:id/status', userPolicy, this.getDeploymentStatus.bind(this))
    this.router.post('/deployments', userPolicy, this.deployCreate.bind(this))
    // this.router.put('/deployments/:id', userPolicy, this.deployUpdate.bind(this))
    this.router.patch('/deployments/:id', userPolicy, this.deployPatch.bind(this))
    this.router.delete('/deployments/:id', userPolicy, this.deployDelete.bind(this))

    // Service managers
    this.router.post('/servicemanager/dns', userPolicy, this.dnsUpdate.bind(this))
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
    deploymentConfiguration.owner = req.dataporten.userid
    var applicationId = req.body.application

    req.log.debug("About to get application " + applicationId)

    return this.library.getItem(applicationId)
      .then((application) => {
        return DeploymentManager.create(application, deploymentConfiguration, req.log)
      })
      .then((deployment) => {
        req.log.debug('Successfully created deployment', deployment)
      })
      .then(() => {
        res.json(deploymentConfiguration)
      })
      .catch((err) => {
        res.status(500).send({ error: 'Error applying requested deployment', "message": err.message })
        req.log.error({"error": err}, "Error applying requested deployment")
      })

  }

  deployPatch(req, res) {


    return DeploymentManager.patch(req.dataporten.userid, req.body, req.log)
      .then((data) => {
        req.log.debug('Successfully updated deployment', data)
        res.json(data)
      })
      .catch((err) => {
        req.log.error('Error updating requested deployment', err)
        return res.status(500).send({ error: 'Error updating requested deployment', "message": err.message });
      })

  }

  deployDelete(req, res) {
    var deploymentId = req.params.id;
    req.log.info({"deploymentId": deploymentId, "UserID": req.dataporten.userid}, "Deleting deployment")

    if (!req.query.token) {
      throw new Error("Provided token is required in order to delete deployment.")
    }
    var data = {
      token: req.query.token
    }
    return DeploymentManager.delete(req.dataporten.userid, deploymentId, data, req.log)
      .then(() => {
        return res.json({"success": true})
      })
      .catch((err) => {
        req.log.error('Error updating requested deployment', err)
        return res.status(500).send({ error: 'Error deleting requested deployment', "message": err.message });
      })

  }


  getDeployments(req, res) {
    DataStore.getDeployments(req.dataporten.userid)
      .then(function(list) {
        return res.json(list)
      })
      .catch((err) => {
        req.log.error('Error getDeployments', err)
        return res.status(500).send({ error: 'Error getting deployments', "message": err.message });
      })
  }

  getDeployment(req, res) {

    DataStore.getDeployment(req.dataporten.userid, req.params.id)
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


  getDeploymentStatus(req, res) {

    return DeploymentManager.getStatus(req.dataporten.userid, req.params.id, req.log)
      .then((data) => {
        return res.json(data)
      })
      .catch((err) => {
        req.log.error('Error updating requested deployment', err)
        return res.status(500).send({ error: 'Error deleting requested deployment', "message": err.message });
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
