

class Model {
  constructor(props) {
    for(let key in props) {
      this[key] = props[key];
    }
  }

  toDB() {
    return this;
  }
}

exports.Model = Model;
