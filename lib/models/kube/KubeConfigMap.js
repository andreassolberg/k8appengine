var extend = require('extend');
var KubeObject = require('./KubeObject').KubeObject;


var re = function(hostname, service, port) {
	return {
    "host": hostname,
    "http": {
      "paths": [
        {
          "backend": {
            "serviceName": service,
            "servicePort": port
          }
        }
      ]
    }
  }
}


class KubeConfigMap extends KubeObject {
  constructor(props) {
    super(props);
  }

  setId(id) {
    if (!this.metadata.name) {
      throw new Error("The config map template is required to have set a name.")
    }
    this.metadata.name = id + '-' + this.metadata.name
  }

	setDeploymentId(id) {
    extend(true, this, {
      "metadata": {
        "labels": {
          "deployment": id
        }
      }
    })
  }


  getId() {
    return this.metadata.name
  }


}


exports.KubeConfigMap = KubeConfigMap;
