var
	DataStore = require('./DataStore').DataStore,
	Application = require('./models/Application').Application;

class AppLibrary {

	constructor() {
		this.library = {};
		// this._loadFiles();
	}

	// _loadFiles() {
	// 	var that = this;
	// 	let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));;
	// 	data.forEach((item) => {
	// 		this.library[item.id] = item;
	// 	});
	// }
	//
	// getApp(appid) {
	// }

	getAll() {
		return DataStore.getApplications()
	}

	getItem(id) {
		return DataStore.getApplication(id)
			.then((res) => {
				if (res.length === 0) {
					return null;
				}
				return res[0];
			})
	}
}

exports.AppLibrary = AppLibrary;
