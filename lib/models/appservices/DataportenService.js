var AppService = require('./AppService').AppService;

class DataportenService extends AppService {
  constructor(props) {
    super(props);
  }

  enrichDeployment(deployment) {
    // console.log("Encirch deployment with DNS service", this)
    deployment.getDeployment().addEnv("DATAPORTEN_CLIENTID", this.id)
    deployment.getDeployment().addEnv("DATAPORTEN_CLIENTSECRET", this.client_secret)
    deployment.getDeployment().addEnv("DATAPORTEN_CREATOR", this.owner)
    deployment.getDeployment().addEnv("DATAPORTEN_SCOPES", this.scopes.join(' '))
    deployment.getDeployment().addEnv("DATAPORTEN_REDIRECTURI", this.redirect_uri[0])
    deployment.annotate("dataportenClientId", this.id)
  }
}

exports.DataportenService = DataportenService;
