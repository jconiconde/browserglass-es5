var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/link');
var conf = require('../conf');
var store = require('store');
var _ = require('lodash');
var ds = {
	browse : browse,
	notify : notify,
	activateOnline : activateOnline
};

// check if link is not exist then
// add to online list
// open browser
// get the expiry date
// 

function browse(link) {
	var items = store.get('onlineLinks');
	if (!items.length || _.find(items, {_id : link._id})) {
		items.push({
			_id : link
		});
		store.set('onlineLinks', items);
		activateOnline(link);
		return;
	}
	bsInfra.emit('links:browse', link);
}

function activateOnline(link) {
	bsInfra.emit('links:activate-online', link);
}

function notify(link) {
	bsInfra.emit('links:notify', link);
}

function reloadBrowser() {

}

module.exports = ds;