var React = require('react');
var ReactDOM = require('react-dom');

$ = jQuery = require('jquery');
var uc = require('../constants/user');
var Header = require('./common/header');
var injectTapEventPlugin = require('react-tap-event-plugin');
var store = require('store');
// #region GLOBALS
require('uikit');
require('uikit/dist/js/components/tooltip');
//require('../blocks/clientInfra');
//bsInfra = require('../blocks/browserSync.client');
//bgEmitter = new (require('events').EventEmitter)();

// #endregion
//bsSocket = require('../infra/browser-sync.socket');
injectTapEventPlugin();

var App = React.createClass({
	componentWillReceiveProps : function() {
		var user = store.get(uc.USER_STORAGE);

	},
	render: function() {
		var user = store.get(uc.USER_STORAGE);

		// just incase the USER_STORAGE has been deleted
		if (this.props.location.pathname !== '/' && !user) {
			this.props.history.replaceState(null, '/');
		}

		return (
			<div>
				<Header
					isLogin={!!user}
					routes={this.props.route.childRoutes} />
				<div className="uk-container uk-container-center uk-margin-top uk-margin-large-bottom">
					{this.props.children}
				</div>
			</div>
		);
	}
});

App.title = 'App';
App.path = '/';

module.exports = App;
