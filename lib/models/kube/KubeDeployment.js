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

  setSizeConfig(sizeConfig) {

    // console.log("SIZECONFIG", sizeConfig)
    // console.log(typeof sizeConfig.containers)

    if (sizeConfig.replicas) {
      this.spec.replicas = parseInt(sizeConfig.replicas, 10)
    }
    if (sizeConfig.containers) {

      for(let containerName in sizeConfig.containers ) {

        let c = this.getContainerByName(containerName)
        let x = sizeConfig.containers[containerName]
        if (c) {
          c.resources = {
            "requests": {
              "cpu": x[0],
              "memory": x[2],
            },
            "limites": {
              "cpu": x[1],
              "memory": x[3],
            }
          }
        }

      }

    }

  }

  getContainerByName(containerName) {
    for(let i = 0; i < this.spec.template.spec.containers.length; i++) {
      if (this.spec.template.spec.containers[i].name === containerName) {
        return this.spec.template.spec.containers[i]
      }
    }
    return null
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

    var nv = ''

    console.log("About to update references")
    console.log(JSON.stringify(this, undefined, 2))

    this.spec.template.spec.containers.forEach((container) => {

      if (container.env) {
        container.env.forEach((env) => {
          if (env.valueFrom && env.valueFrom.configMapKeyRef) {
            env.valueFrom.configMapKeyRef.name = id + '-' + env.valueFrom.configMapKeyRef.name
          } else if (env.valueFrom && env.valueFrom.secretKeyRef) {
            nv = env.valueFrom.secretKeyRef.name
            if (nv === '') {
              nv = id
            } else {
              nv = id + '-' + nv
            }
            env.valueFrom.secretKeyRef.name = nv
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
