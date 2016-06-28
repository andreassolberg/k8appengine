var
	fs = require('fs'),
	Application = require('./models/Application').Application;

var AppLibrary = function() {

};

AppLibrary.prototype.get = function(appid) {
	var x = JSON.parse(fs.readFileSync('./etc/applications/' + appid + '.js', 'utf8'));
	var a = new Application(x);
	return a;
};

exports.AppLibrary = AppLibrary;