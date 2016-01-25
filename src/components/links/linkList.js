var React = require('react');
var assign = require('object-assign');

// #region Components
var Tile = require('../common/tile');
var LinkItem = require('./linkItem');
var LinkForm = require('./linkForm');
var LinkActionBar = require('./linkActionBar');
// #endregion

// #region MUI
var Toggle = require('material-ui/lib/toggle');
var Popover = require('material-ui/lib/popover/popover');
var IconButton = require('material-ui/lib/icon-button');
var FontIcon = require('material-ui/lib/font-icon');
var RaisedButton = require('material-ui/lib/raised-button');
// #endregion

//var bsActions = require('../../actions/browserSync');
var linkActions = require('../../actions/linkActions');

var createLinkRow = function(item, index) {
	// TODO: IM NOT SURE IF LINK ITEM SHOULD BE SEPARATED FROM LIST (THIS LIST COMP) :)
	// WHICH IS THE OLD IMPLEMENTATION
	return (
		<LinkItem
			key={index}
			link={item}
			visible={item.visible}
			>
			<Tile
				tabIndex={index + 1}
				tileStyles={{
					backgroundColor : item.online ? '#CCFF90' : '#FAFAFA'
				}}
				>
				<LinkForm
					adding={false}
					link={item} />
				<LinkActionBar
					visible={item.visibleActionBar}
					>
					<div 
						className="uk-float-left">
						<a
							onClick={this._onBrowse.bind(this, item, 'pop')}
							href="#"
							data-uk-tooltip title="Browse"
							className="uk-icon-small uk-icon-hover uk-icon-globe"></a>
						<a
							onClick={this._reload.bind(this, item)}
							href="#"
							className="uk-icon-small uk-icon-hover uk-icon-refresh"
							data-uk-tooltip title="Reload all pages"
							></a>
						<a href="#" 
							onClick={this._exit.bind(this, item)}
							className="uk-icon-small uk-icon-hover uk-icon-unlink"
							data-uk-tooltip title="Unlink / Offline"
							></a>
						<a href="#" 
							onClick={this._showPopover.bind(this, 'pop', item)}
							className="uk-icon-small uk-icon-hover uk-icon-trash-o"
							data-uk-tooltip title="Delete link"
							></a>
					</div>

				</LinkActionBar>
			</Tile>
			<Popover open={this.state.activePopover === 'pop'}
			  anchorEl={this.state.anchorEl}
			  autoCloseWhenOffScreen={true}
			  onRequestClose={this._closePopover.bind(this, 'pop')} >
			  <div style={{padding:20}}>
			    <h2>Your about to remove this link.</h2>
			    <p>
			    	Sed ut perspiciatis unde omnis iste natus error sit voluptatem
			    </p>
			    <RaisedButton onClick={this._remove} primary={true} label="Got it"/>
			  </div>
			</Popover>
		</LinkItem>

	);
};

var LinkList = React.createClass({
	getInitialState : function() {
		return {
			activePopover : 'none',
			anchorEl : <a></a>,
			link : {}
		};
	},
	_showPopover : function(key, data, e) {
		this.setState({
			activePopover: key,
			anchorEl: e.currentTarget,
			link : data
		});
	},
	_closePopover(key) {
		if (this.state.activePopover !== key) {
			return;
		}
		this.setState({
			activePopover:'none',
			link : {}
		});
	},
	propTypes : {
		links : React.PropTypes.array.isRequired,
		removeLink : React.PropTypes.func
	},
	_onBrowse : function(link, popoverKey, e) {
		e.preventDefault();
		linkActions.socket.emit('links:browse', link);
	},
	_reload : function(link) {
		linkActions.socket.emit('links:reload', link);
	},
	_remove : function() {
		linkActions.removeLink(this.state.link)
		.then(function() {
			linkActions.socket.emit('links:exit', this.state.link);
			linkActions.getLinks();
			this.setState({
				activePopover:'none',
				link : {}
			});
		}.bind(this))
		.catch(console.log);
	},
	_exit : function(link) {
		linkActions.socket.emit('links:exit', link);
	},
	render : function() {
		return (
			<div className="uk-grid uk-grid-small uk-grid-width-small-1-2 uk-grid-width-medium-1-3 uk-grid-width-large-1-4"
				data-uk-margin>
				{this.props.links.map(createLinkRow, this)}
			</div>
		);
	}
});


module.exports = LinkList;