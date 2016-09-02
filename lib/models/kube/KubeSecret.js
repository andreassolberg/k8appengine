var extend = require('extend');

var KubeObject = require('./KubeObject').KubeObject;

class KubeSecret extends KubeObject {
  constructor(props) {



    super(props)

    extend(true, this, {
    	"apiVersion": "v1",
    	"kind": "Secret",
    	"metadata": {},
    	"type": "Opaque",
    	"data": {}
    })
  }

  setId(id) {
    extend(true, this, {
      "metadata": {
        "name": id
      }
    })
  }

  setData(key, value) {
    var encodedValue = Buffer.from(value).toString('base64')
    var obj = {
      "data": {}
    }
    obj.data[key] = encodedValue
    extend(true, this, obj)
  }

  getId() {
    return this.metadata.name
  }

}


exports.KubeSecret = KubeSecret;
