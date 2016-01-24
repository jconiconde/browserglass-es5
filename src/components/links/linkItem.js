var React = require('react');
var classnames = require('classnames');
var linkActions = require('../../actions/linkActions');
var assign = require('object-assign');
var platform = require('../../blocks/platform-service');
var LinkItem = React.createClass({
	propTypes : {
		onBlur   : React.PropTypes.func,
		onChange : React.PropTypes.func,
		onClick  : React.PropTypes.func,
		onFocus  : React.PropTypes.func,
		onMouseEnter  : React.PropTypes.func,
		onMouseLeave : React.PropTypes.func,
		link : React.PropTypes.object.isRequired,
		visible : React.PropTypes.any,
		active : React.PropTypes.any
	},
	getDefaultProps : function() {
		return {
			visible : true,
			active : false,
			onBlur : function() {}
		};
	},
	getInitialState : function () {
		return {
			link : {}
		};
	},

	_onBlur : function(e) {
		this.props.onBlur(e, this.props.link);
	},
	_onClick : function(e) {
		// this.props.onChange(e, this.props.link);
		// this.props.onClick(e, this.props.link);
		linkActions.setLinkPopupState({
			open : true,
			mode : 'edit'
		});
		linkActions.setSelectedLink(
			assign(this.props.link, {
				active : true,
				visible : false,
				errors : {}
			})
		);
	},
	_onFocus : function(e) {
		//this.props.onFocus(e, this.props.link);
	},
	_onMouseEnter : function(e) {
		if (!platform.isMobile) {
			linkActions.updateActionBarVisibility(assign({},
				this.props.link, {visibleActionBar : true}	
			));
		}

	},
	_onMouseLeave : function(e) {
		if (!platform.isMobile) {
			linkActions.updateActionBarVisibility(assign({},
				this.props.link, {visibleActionBar : false}	
			));
		}
	},
	render : function() {
		var linkItem = 	<div 
				onBlur   = {this._onBlur}
				onClick  = {this._onClick}
				onFocus  = {this._onFocus}
				onMouseEnter = {this._onMouseEnter}
				onMouseLeave={this._onMouseLeave}
				data-link-item>
				{this.props.children}
			</div>;
		return this.props.link.visible
		 ? linkItem : null;
	}
});

module.exports = LinkItem;