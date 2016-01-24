var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/user');
var rp = require('request-promise');
var conf = require('../conf');
var assign = require('object-assign');
var apiLinkUrl = conf.dataUrl + 'api/users/';

var UserActions = assign({
	getUsers : function() {
		return rp(apiLinkUrl)
		.then(function(res) {
			Dispatcher.dispatch({
				actionType : ActionTypes.GET_USERS,
				data : JSON.parse(res)
			});
		});
	},
	getUser : function(user) {
		return rp(apiLinkUrl + user.username, function(err, res, body) {
			if (err) { return handleError(err, res); }
			Dispatcher.dispatch({
				actionType : ActionTypes.LOGIN,
				data : JSON.parse(body)
			});
		});
	}
});

module.exports = UserActions;