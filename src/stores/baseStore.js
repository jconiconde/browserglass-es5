var EventEmitter = require('events').EventEmitter,
	assign = require('object-assign'),
	CHANGE_EVENT = 'change';


module.exports = assign({}, EventEmitter.prototype, {
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	emitChange: function(params) {
		this.emit(CHANGE_EVENT, params);
	}
});
