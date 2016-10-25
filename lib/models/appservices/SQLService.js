var
  AppService = require('./AppService').AppService,
  KubeSecret = require('../kube/KubeSecret').KubeSecret



class SQLService extends AppService {
  constructor(props) {
    super(props);
  }

  enrichDeployment(deployment) {
    // console.log("Encirch deployment with DNS service", this)
    deployment.getDeployment().addEnv("SQL_HOST", this.host)
    deployment.getDeployment().addEnv("SQL_USER", this.username)
    // deployment.getDeployment().addEnv("SQL_PASS", this.password)
    deployment.getDeployment().addEnv("SQL_DB", this.database)

    var s = new KubeSecret()
    s.setId(deployment.getId())
    s.setData("sqlpassword", this.password)
    s.setData("sqlhost", this.host)
    s.setData("sqldb", this.database)
    s.setData("sqluser", this.username)

    deployment.addKubeSecret(s)

    // deployment.annotate("dataportenClientId", this.id)
  }
}

exports.SQLService = SQLService;
