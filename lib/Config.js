var
	nconf      = require('nconf');



nconf.use('memory');
nconf.argv()
	.env()
	.file({ file: 'etc/config.json' })
	.defaults({
		"database": "blah"
	});

exports.Config = nconf;
