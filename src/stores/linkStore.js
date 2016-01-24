var baseStore = require('./baseStore');
var assign = require('object-assign');
var platform = require('../blocks/platform-service');
var ActionTypes = require('../constants/link');
var Dispatcher = require('../dispatcher/appDispatcher');
var _ = require('lodash');

var _links = [],
	defaultLinkUiState = {
		visible : true,
		active  : false,
		hover   : false,
		visibleActionBar : platform.isMobile,
		errors : {} 
	},
	_defaultLinkData = {
		title : '',
		description : '',
		browser : [
			'google chrome',
			'firefox'
		],
		url : '',
		expiry : 15
	},
	_selectedLink = _defaultLinkData,

	_popupLinkState = {
		open : false,
		mode : 'view'
	},

	_snackbarState = {
		open : false,
		message : '',
		duration : 7000
	},

	updateActionBarVisibility = function(item) {
		// created this for SOC if there's a sudden changes with ux
		if (!item || !item._id) {return;}
		_.find(_links, {_id : item._id})
		.visibleActionBar = item.visibleActionBar;
	},
	setSelectedLink = function(link) {
		_selectedLink = link;
	},
	setLinkPopupState = function(val) {
		_popupLinkState = val;
	},

	setSnackbarState = function(val) {
		assign(_snackbarState, val);
	};

var LinkStore = assign({}, baseStore, {
	getLinks : function() {
		return _links;
	},
	getSelectedLink : function() {
		return _selectedLink;
	},
	getPopupLinkState : function() {
		return _popupLinkState;
	},
	getDefaultLinkData : function() {
		return assign({}, _defaultLinkData, defaultLinkUiState);
	},
	getSnackbarState : function() {
		return _snackbarState;
	},
});

Dispatcher.register(function(action) {
	switch (action.actionType) {
		case ActionTypes.GET_LINKS:
			_links.splice(0, _links.length);
			action.data.forEach(function(item){
				_links.push(assign({}, defaultLinkUiState, item));
			});
		break;
		case ActionTypes.UPDATE_ACTION_BAR_VISIBLITY:
			updateActionBarVisibility(action.data);
		break;
		case ActionTypes.SET_SELECTED_LINK:
			setSelectedLink(action.data);
		break;
		case ActionTypes.SET_LINK_POPUP:
			setLinkPopupState(action.data);
		break;
		case ActionTypes.SHOW_SNACKBAR:
			setSnackbarState(action.data);
		break;
		default :
			return true;
	}

	LinkStore.emitChange(action.actionType);

	return true;
});


module.exports = LinkStore;