var
	fs = require('fs'),
	path = require('path'),

	Application = require('./models/Application').Application;

const appDir = path.dirname(require.main.filename);
const filepath = appDir + '/etc/library.json';


class AppLibrary {
	constructor() {
		this.library = null;
		this._loadFiles();
	}

	_loadFiles() {
		this.library = JSON.parse(fs.readFileSync(filepath, 'utf8'));
	}

	getApp(appid) {

	}

	getAll() {
		this._loadFiles();
		return this.library;
	}

	getItem(id) {
		if (this.library[id]) {
			return this.library[id];
		}
		return null;
	}
}


// var AppLibrary = function() {
//
// };
//
// AppLibrary.prototype.get = function(appid) {
// 	var x = JSON.parse(fs.readFileSync('./etc/applications/' + appid + '.js', 'utf8'));
// 	var a = new Application(x);
// 	return a;
// };

exports.AppLibrary = AppLibrary;
