var extend = require('extend');

var KubeObject = require('./KubeObject').KubeObject;

class KubeDeployment extends KubeObject {
  constructor(props) {
    super(props);
  }

  setId(id) {
    extend(true, this, {
      "metadata": {
        "name": id
      },
      "spec": {
        "template": {
          "metadata": {
            "labels": {
              "deployment": id
            }
          }
        }
      }
    })
  }

  setApplicationId(id) {
    extend(true, this, {
      "spec": {
        "template": {
          "metadata": {
            "labels": {
              "application": id
            }
          }
        }
      }
    })
  }

  addEnv(key, value) {
    // console.log("---- Tempalte ----- ");
    // console.log(this.spec.template);
    // console.log("---- ---- ---- ---- ")
    var containers = this.spec.template.spec.containers;
  	for(let i = 0; i < containers.length; i++) {
  		if (!containers[i].env) {
  			containers[i].env = [];
  		}
  		containers[i].env.push({
  			"name": key,
  			"value": value
  		});
  	}
  }
}


exports.KubeDeployment = KubeDeployment;
