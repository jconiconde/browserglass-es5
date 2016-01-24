
// AS LONG AS THEY ARE SEPARATED IN EACH LAYER.
// THE LAYERING IS BIT MESSY, STILL LEARNING HOW TO INCORPORATE TO FLUX PATTERN :)

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var io = require('socket.io-client');

function BaseEvt(params) {
	var opts = assign({}, params);
	EventEmitter.call(this);
	this.socketEvts = {};
	// emitter evts
	this.evts = {};

	if (opts.socket) {
		this.socket = io(opts.socket.host + opts.socket.namespace);
	}
}
util.inherits(BaseEvt, EventEmitter);
BaseEvt.prototype.init = function(prms) {
	var opts = assign({
		component : {},
		store : {}
	}, prms);
	register.bind(this, this.socketEvts, this.socket)(opts);
	register.bind(this, this.evts, this)(opts);
	return this;
};

BaseEvt.prototype.dispose  = function() {
	unregister.bind(this, this.socketEvts, this.socket)();
	unregister.bind(this, this.evts, this)();
};

function register(evts, emitter, opts) {
	for(var k in evts) {
		if (evts.hasOwnProperty(k)) {
			emitter.on(k, evts[k].bind(this, opts.component, opts.store, emitter));
		}
	}
}

function unregister(evts, emitter) {
	for(var k in evts) {
		if (evts.hasOwnProperty(k)) {
			emitter.removeListener(k, evts[k]);
		}
	}
}


module.exports =  BaseEvt;