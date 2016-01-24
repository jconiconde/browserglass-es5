
// AS LONG AS THEY ARE SEPARATED IN EACH LAYER.
// THE LAYERING IS BIT MESSY, STILL LEARNING HOW TO INCORPORATE TO FLUX PATTERN :)

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var BaseEvt = require('./baseEvents');
var conf = require('../conf');
var assign = require('object-assign');
// SINGLETON

var LinkEvt = (function() {
	util.inherits(LinkEvt, BaseEvt);
	function LinkEvt() {
		BaseEvt.call(this, {
			socket : {
				host : conf.socketHost,
				namespace : 'bs-infra'
			}
		});
		this.socketEvts = {
			'connect' : connect,
			'links:browse' : onBrowse,
			'links:active-online' : onActivateOnline,
			'links:exit' : onExit,
			'links:get-online-states' : getOnlineLinks
		};
	}

	return LinkEvt;
}());



function connect() {
	console.log('socket:client:connected');
}

function onDisconnect() {

}

function onBrowse(comp, store, emitter, data) {
	data.tunnel ? window.open(data.tunnel) : window.open(data.url);
	emitter.emit('links:get-online-states', data.data);
}

function onActivateOnline(comp, store ,emitter,  data) {
	console.log('activated');
}

function onExit(comp, store, emitter, data) {
	emitter.emit('links:get-online-states', data.data);
}

function notify(comp, store, emitter, data) {

}

function getOnlineLinks(comp, store, emitter, data) {
	var links = store.getLinks(),
		onlineLinks = [];
	links.forEach(function(item){
		item.online = false;
		if (data.indexOf(item._id) !== -1) {
			item.online = true;
			onlineLinks.push(item.title);
		}
	});

	if (onlineLinks.length) {
		//onlineLinks.unshift('Online links: ');

		this.showSnackbar({
			open : true,
			message : 'Online links: ' + onlineLinks.join(', ')
		});
	}

	store.emitChange();
}

module.exports =  new LinkEvt();