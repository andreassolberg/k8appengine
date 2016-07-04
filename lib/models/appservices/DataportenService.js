var AppService = require('./AppService').AppService;

class DataportenService extends AppService {
  constructor(props) {
    super(props);
  }

  encrichDeployment(deployment) {
    // console.log("Encirch deployment with DNS service", this)
    deployment.getDeployment().addEnv("DATAPORTEN", "true")
  }
}

exports.DataportenService = DataportenService;
