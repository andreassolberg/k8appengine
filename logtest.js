var
  bunyan = require('bunyan')

var log = bunyan.createLogger({
	name: "KubernetesClient",
	level: "debug"
});


var obj = {
  "foo": "bar",
  "yes": true
}

log.info(obj, "MESSAGE")
log.info("MESSAGE2")
