var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/link');
var conf = require('../conf');
var rp = require('request-promise');
var apiLinkUrl = conf.dataUrl + 'api/links/';
var linkEvts = require('../events/linkEvents');
var assign = require('object-assign');
var uc = require('../constants/user');
var store = require('store');
function handleError(err, res) {
	if (err) {
		console.log('ERROR in ACTIONS:  \n' + err);
		throw new Error(err);
	}
}

var LinkActions = assign(linkEvts, {
	Dispatcher : Dispatcher,
	getLinks : function() {
		var user = store.get(uc.USER_STORAGE);
		return rp(apiLinkUrl + (user && user._id) || '')
		.then(function(res) {
			Dispatcher.dispatch({
				actionType : ActionTypes.GET_LINKS,
				data : JSON.parse(res)
			});
		});
	},
	getLinkById : function(id) {
		rp(apiLinkUrl + id, function(err, res, body) {
			if (err) { return handleError(err, res); }
			Dispatcher.dispatch({
				actionType : ActionTypes.GET_LINK_BY_ID,
				data : JSON.parse(body)
			});
		});
	},
	createLink : function(link) {
		var user = store.get(uc.USER_STORAGE);
		return rp.post(apiLinkUrl, {json : assign({}, link, {owner : user._id})},
			function(err, res, body) {
				if (err) { return handleError(err, res); }
				Dispatcher.dispatch({
					actionType : ActionTypes.CREATE_LINK,
					data : body
				});
			});
	},
	updateLink : function(link) {
		return rp.put(apiLinkUrl + link._id, {json : link})
		.then(function(res) {
			Dispatcher.dispatch({
				actionType : ActionTypes.UPDATE_LINK,
				data : res
			});

			return res;
		});
	},
	removeLink : function(link) {
		return rp.del(apiLinkUrl + link._id + '/' + link.owner,
			function(err, res, body) {
				Dispatcher.dispatch({
					actionType : ActionTypes.REMOVE_LINK,
					data : JSON.parse(body)
				});
			});
	},
	updateActionBarVisibility : function(data) {
		Dispatcher.dispatch({
			actionType : ActionTypes.UPDATE_ACTION_BAR_VISIBLITY,
			data : data
		});
	},
	setSelectedLink : function(data) {
		Dispatcher.dispatch({
			actionType : ActionTypes.SET_SELECTED_LINK,
			data : data
		});
	},
	setLinkPopupState : function(data) {
		Dispatcher.dispatch({
			actionType : ActionTypes.SET_LINK_POPUP,
			data : data
		});
	},
	showSnackbar : function(data) {
		Dispatcher.dispatch({
			actionType : ActionTypes.SHOW_SNACKBAR,
			data : data
		});
	}
});


module.exports = LinkActions;