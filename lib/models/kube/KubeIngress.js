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


class KubeIngress extends KubeObject {
  constructor(props) {
    super(props);
  }

  setId(id) {
    extend(true, this, {
      "metadata": {
        "name": id,
				"labels": {
          "deployment": id
        }
      }
    })
  }

  addRoute(host, service, port) {
    this.spec.rules.push(re(host, service, port))
  }

}


exports.KubeIngress = KubeIngress;
