var extend = require('extend');

var KubeObject = require('./KubeObject').KubeObject;

class KubeService extends KubeObject {
  constructor(props) {
    super(props);
  }

  setId(id) {
    extend(true, this, {
      "metadata": {
        "name": id
      },
      "spec": {
        "selector": {
          "deployment": id
        }
      }
    })
  }

  setApplicationId(id) {
    extend(true, this, {
      "metadata": {
        "application": id
      }
    })
  }

}


exports.KubeService = KubeService;
