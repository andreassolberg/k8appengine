var AppService = require('./AppService').AppService

class DNSService extends AppService {
  constructor(props) {
    super(props)
  }

  encrichDeployment(deployment) {
    // console.log("Encirch deployment with DNS service", this)
    deployment.getDeployment().addEnv("DATAPORTEN_CLIENTID", this.id)
    deployment.getDeployment().addEnv("DATAPORTEN_CLIENTSECRET", this.client_id)
    deployment.getDeployment().addEnv("DATAPORTEN_SCOPES", this.client_id)
    deployment.getDeployment().addEnv("DATAPORTEN_CREATOR", this.owner)
    deployment.getDeployment().addEnv("DATAPORTEN_SCOPES", this.scopes.join(', '))
    deployment.getDeployment().addEnv("DATAPORTEN_REDIRECTURI", this.redirect_uri[0])

  }

  getHost() {
    return this.hostname + '.' + this.domain
  }

  getURL() {
    return 'https://' + this.getHost()
  }

}

exports.DNSService = DNSService
