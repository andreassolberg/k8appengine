var AppService = require('./AppService').AppService

class DNSService extends AppService {
  constructor(props) {
    super(props)
  }

  enrichDeployment(deployment) {
    deployment.getDeployment().addEnv("HOST", this.getHost())
    deployment.addRoute(this.getHost())
  }

  getHost() {
    return this.hostname + '.' + this.domain
  }

  getURL() {
    return 'https://' + this.getHost()
  }

}

exports.DNSService = DNSService
