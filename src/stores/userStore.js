var baseStore = require('./baseStore');
var assign = require('object-assign');
var ActionTypes = require('../constants/user');
var Dispatcher = require('../dispatcher/appDispatcher');

var _users = [
		{
			_id : null,
			name : 'Select...'
		}
	],
	_selectedUser = _users[0],
	setSelectedUser = function(user) {
		_selectedUser = user;
	};

var userStore = assign({}, baseStore, {
	getUsers : function() {
		return _users;
	},
	getSelectedUser : function() {
		return _selectedUser;
	}
});

Dispatcher.register(function(action) {
	switch (action.actionType) {
		case ActionTypes.GET_USERS:
			_users.splice(1, _users.length);
			action.data.forEach(function(item){
				_users.push(item);
			});
		break;
		case ActionTypes.LOGIN:
			setSelectedUser(action.data);
		break;
		default :
			return true;
	}
	userStore.emitChange();

	return true;
});

module.exports = userStore;