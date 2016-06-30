var AppService = require('./AppService').AppService

class DNSService extends AppService {
  constructor(props) {
    super(props)
  }

  encrichDeployment(deployment) {
    console.log("Encirch deployment with DNS service", this)
    deployment.getDeployment().addEnv("HOST", this.getHost())
  }

  getHost() {
    return this.hostname + '.' + this.domain
  }

}

exports.DNSService = DNSService
