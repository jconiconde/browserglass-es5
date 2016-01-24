var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var Router = require('react-router');
// #region Components
var Tile = require('../common/tile');
var UkPopup = require('../common/ukPopup');
var LinkForm = require('./linkForm');
var LinkActionBar = require('./linkActionBar');
var LinkList = require('./linkList');
var LinkItem = require('./linkItem');
var Dialog = require('material-ui/lib/dialog');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var Snackbar = require('material-ui/lib/snackbar');
// #endregion

var linkStore = require('../../stores/linkStore');
var linkActions = require('../../actions/linkActions');
var linkConstants = require('../../constants/link');
var _ = require('lodash');
var assign = require('object-assign');
var store = require('store');
var uc = require('../../constants/user');
var user = store.get(uc.USER_STORAGE);
var LinkPage = React.createClass({
	//mixins : [PureRenderMixin],
	mixins: [
		Router.History,
		Router.Lifecycle
	],
	getInitialState : function() {
		return {
			links : linkStore.getLinks(),
			selectedLink : {},
			popupLinkState : linkStore.getPopupLinkState(),
			snackbarState : linkStore.getSnackbarState()
		};
	},
	componentWillMount : function () {
		linkActions.init({
			component : this,
			store : linkStore
		});
		linkStore.addChangeListener(this._onChange);
		linkActions.getLinks();
	},
	componentDidMount : function() {
	},
	componentWillUnmount : function() {
		linkActions.dispose();
	},
	routerWillLeave : function(nextLocation) {

	},
	componentWillUpdate : function(prevProps, prevState) {
		//linkStore.hideLink(this.state.links);
	},
	_onChange : function (evtType) {
		if (this.isMounted()) {
			this.setState({
				links : linkStore.getLinks(),
				selectedLink : linkStore.getSelectedLink(),
				popupLinkState : linkStore.getPopupLinkState(),
				snackbarState : linkStore.getSnackbarState()
			});

		}
		// this line below is a bad design, kind of a rush :)
		if (evtType && linkConstants.GET_LINKS === evtType) {
			linkActions.socket.emit('links:get-online-states', {
				owner : user._id
			});
		}
	},
	_onSaveLinkItem : function(e) {
		var  canSave = this._linkFormIsValid('url');
			canSave = this._linkFormIsValid('title');
		if (!canSave) {
			this.setState({
				selectedLink : this.state.selectedLink
			});
			return;
		}

		linkActions[(this.state.popupLinkState.mode === 'add' ? 'create' : 'update') + 'Link']
		(this.state.selectedLink)
		.then(function(res) {
			linkActions.setSelectedLink(assign(linkStore.getDefaultLinkData()));
			linkActions.getLinks();
			linkActions.setLinkPopupState({
				open : false,
				mode : 'view'
			});
		})
		.catch(console.log);
	},
	_linkFormIsValid : function(field) {
		var formIsValid = true;
		if (field === 'description') {
			return true;
		}
		this.state.selectedLink.errors[field] = '';

		if (!this.state.selectedLink[field].trim()) {
			this.state.selectedLink.errors[field] =
				_.capitalize(field) + ' is required';
			this.state.selectedLink[field] = '';
			formIsValid = false;
		}

		if (field === 'url' && this.state.selectedLink[field] &&
		 !validateUrl(this.state.selectedLink[field])) {
			this.state.selectedLink.errors[field] =
				'Please specify a valid url.';
			formIsValid = false;
		}

		return formIsValid;
	},
	_setLinkState : function(e, link) {
		link[e.target.name] = e.target.value;
		this._linkFormIsValid(e.target.name);
		this.setState({
			selectedLink : linkStore.getSelectedLink()
		});
	},
	_closeLinkItemPopup : function() {
		linkActions.setLinkPopupState({
			open : false,
			mode : 'edit'
		});
		linkActions.setSelectedLink(assign(linkStore.getSelectedLink(),{
			active : false,
			visible : true
		}));

		//linkActions.getLinks();
	},
	_closeSnackbar : function() {
		linkActions.showSnackbar({
			message : '',
			open : false
		});
	},
	_onAddLink : function(e) {
		e.preventDefault();

		linkActions.setSelectedLink(assign(linkStore.getDefaultLinkData(), {active : true, errors : {}}));
		linkActions.setLinkPopupState({
			open : true,
			mode : 'add'
		});
	},
	render : function() {
		return (
			<div>
				<div className="add-button">
					<FloatingActionButton
						onClick={this._onAddLink}
						iconClassName="uk-icon-plus"
						secondary={true} />
				</div>
				<LinkList
					links={this.state.links}
					/>

				<Dialog
					modal={true}
					bodyStyle={{
						padding: '0px'
					}}
					contentStyle={{
						marginTop : '-30px'
					}}
					open={this.state.popupLinkState.open}>
						<Tile
							tabIndex={0}
							className={' '}
							>
							<LinkForm
							setLinkState={this._setLinkState}
							link={this.state.selectedLink}
							errors={this.state.selectedLink.errors}
							/>

							<LinkActionBar
								visible={true}>

								<button
									onClick={this._onSaveLinkItem}
									className="uk-float-right">
									SAVE
								</button>
								<button
									onClick={this._closeLinkItemPopup}
									className="uk-float-right">
									CANCEL
								</button>



							</LinkActionBar>
						</Tile>
				</Dialog>
				<Snackbar
		          open={this.state.snackbarState.open}
		          message={this.state.snackbarState.message}
		          autoHideDuration={this.state.snackbarState.duration}
		          onRequestClose={this._closeSnackbar}
		        />

{/*				<UkPopup
					open={this.state.popupLinkState.open}
					onClickBackGround={this._closeLinkItemPopup}
					>
					<Tile
						tabIndex={0}
						>
						<LinkForm
							setLinkState={this._setLinkState}
							link={this.state.selectedLink}
							errors={this.state.selectedLink.errors}
						/>

						<LinkActionBar
							visible={true}>
							<div className="uk-float-left">
								<a href="#" className="uk-icon-small uk-icon-hover uk-icon-twitter"></a>
								<a href="#" className="uk-icon-small uk-icon-hover uk-icon-dribbble"></a>
								<a href="#" className="uk-icon-small uk-icon-hover uk-icon-ellipsis-v"></a>
							</div>

							<button
								onClick={this._onSaveLinkItem}
								className="uk-float-right">
								SAVE
							</button>

						</LinkActionBar>
					</Tile>
				</UkPopup>*/}

			</div>

		);
	}
});

LinkPage.title = 'Links';
LinkPage.path = '/links';
module.exports = LinkPage;


function validateUrl(value){
      return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}