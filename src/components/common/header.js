"use strict";
var store = require('store');
var React = require('react');

var ReactRouter = require('react-router');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconButton = require('material-ui/lib/icon-button');
var MoreVertIcon = require('material-ui/lib/svg-icons/navigation/more-vert');
var Link = ReactRouter.Link;
var uc = require('../../constants/user');
var Header = React.createClass({
	mixins: [
		ReactRouter.History
	],
	getDefaultProps : function() {
		return {
			routes : [],
			isLogin : false
		};
	},
	getInitialState : function() {
		return {
			selectedUserMenu : '1'
		};
	},
	_handleUserMenu : function(e, value) {
		this.setState({
	      selectedUserMenu: value,
	    }, function() {
	    	switch(value) {
	    		case 'SignOut':
	    			store.set(uc.USER_STORAGE, undefined);
	    			this.history.replaceState(null, '/');
	    		break;

	    	}
	    });
	},
	render: function() {

		var hideElStyle = {
			display : this.props.isLogin ? null : 'none'
		};

		return (
		<div>
	        <nav className="uk-navbar uk-margin-large-bottom">
	            <a className="uk-navbar-brand uk-hidden-small" href="layouts_frontpage.html">
	            	<span className="">Browser Glass</span>
	            </a>
	            <ul style={hideElStyle}
	             className="uk-navbar-nav uk-hidden-small">
					{this.props.routes.map(function(item, index) {
						return (
						  <li key={index}>
						    <Link
						      to={item.component.path || ''}>
						      {item.component.title}
						    </Link>
						  </li>
						);
		            }, this)}
	            </ul>
	            <a
	            	href="#offcanvas" 
	            	className="uk-navbar-toggle uk-visible-small" 
	            	data-uk-offcanvas></a>
	            <IconMenu
	            	className="uk-float-right"
	            	iconButtonElement={<IconButton><MoreVertIcon></MoreVertIcon></IconButton>}
	            	onChange={this._handleUserMenu}
	            	style={hideElStyle}
	            	>
					<MenuItem value="1" primaryText="Refresh" />
					<MenuItem value="2" primaryText="Send feedback" />
					<MenuItem value="3" primaryText="Settings" />
					<MenuItem value="4" primaryText="Help" />
					<MenuItem value="SignOut" primaryText="Sign out" />
	            </IconMenu>

	            <div className="uk-navbar-brand uk-navbar-center uk-visible-small" style={{fontSize: '100%'}}>Browser Glass</div>
	        </nav>
	         <div id="offcanvas" className="uk-offcanvas">
	            <div className="uk-offcanvas-bar">
	                <ul className="uk-nav uk-nav-offcanvas">
        				{this.props.routes.map(function(item, index) {
        					return (
        					  <li key={index}>
        					    <Link
        					      to={item.component.path || ''}>
        					      {item.component.title}
        					    </Link>
        					  </li>
        					);
        	            }, this)}
                    </ul>
	            </div>
	        </div>
		</div>
		);
	}
});

module.exports = Header;