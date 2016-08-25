var extend = require('extend');

var KubeObject = require('./KubeObject').KubeObject;

class KubeDeployment extends KubeObject {
  constructor(props) {
    super(props);
  }

  getId() {
    return this.metadata.name
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
  getAnnotation(key) {
      if (!this.metadata) {
        return null
      }
      if (!this.metadata.annotations) {
        return null
      }
      if (!this.metadata.annotations[key]) {
        return null
      }
      return this.metadata.annotations[key]
  }

  addAnnotations(annotations) {
    var a = {
      "metadata": {
        "annotations": annotations
      }
    }
    extend(true, this, a)
  }

  updateReferences(id) {

    this.spec.template.spec.containers.forEach((container) => {

      if (container.env) {
        container.env.forEach((env) => {
          if (env.valueFrom && env.valueFrom.configMapKeyRef) {
            env.valueFrom.configMapKeyRef.name = id + '-' + env.valueFrom.configMapKeyRef.name
          }
        })
      }

    })

    if (this.spec.template.spec.volumes) {
      this.spec.template.spec.volumes.forEach((volume) => {
        if (volume.configMap) {
          volume.configMap.name = id + '-' + volume.configMap.name
        }
      })
    }


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
