var React = require('react');
var DropDownMenu = require('material-ui/lib/DropDownMenu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Paper = require('material-ui/lib/paper');
var RaisedButton = require('material-ui/lib/raised-button');
var store = require('store');
var Router = require('react-router');
var loginBoxStyle = {
	height: 200,
	width: 450,
	margin: '20px',
	display: 'inline-block',
};

var userStore = require('../../stores/userStore');
var userActions = require('../../actions/userActions');
var uc = require('../../constants/user');
var createUserRow = function(item, index) {
	return <MenuItem key={index} value={item} primaryText={item.name}/>;
};
var LoginPage = React.createClass({
	mixins: [
		Router.History
	],
	getInitialState : function() {
		return {
			selectedUser : {},
			users : [],
			canLogin : false
		};
	},
	componentWillMount : function () {
		//linkActions.init(this, linkStore);
		userStore.addChangeListener(this._onChange);
		userActions.getUsers();
	},
	_onChange : function () {
		if (this.isMounted()) {
			this.setState({
				users : userStore.getUsers(),
				selectedUser : userStore.getSelectedUser()
			});
		}
	},
	_handleChange : function(e, index, value) {
		this.setState({
			selectedUser : value,
			canLogin : !!(value._id)
		});
	},
	_login : function() {
		store.set(uc.USER_STORAGE, this.state.selectedUser);
		this.history.replaceState(null, '/links');
	},
	render : function() {
		return (
		<div className="uk-text-center">
			<Paper style={loginBoxStyle}>
				<div style={{margin : '20px'}}>
					<h2 
						style={{color: '#00BCD4', 'fontWeight' : '700'}}>At vero eos et accusamus et iusto odio </h2>
					<div style={{marginTop : '35px'}}>
						<div className="uk-float-left uk-width-7-10">
							<DropDownMenu
								labelStyle={{
									'textAlign' : 'left'
								}}
								menuStyle={{
									'width' : '100%'
								}}
								style={{
									'width' : '100%'
								}}
								autoWidth={false}
								value={this.state.selectedUser}
								onChange={this._handleChange}>
								{this.state.users.map(createUserRow, this)}
							</DropDownMenu>
						</div>
						<div className="uk-float-right uk-width-3-10">
							<RaisedButton 
								disabled={!this.state.canLogin}
								style={{
									marginTop : 10,
									width : '100%'
								}}
								label="Proceed" secondary={true}
								onClick={this._login}
								/>
						</div>
					</div>
				</div>
			</Paper>
		</div>
		);
	}
});

LoginPage.prototype.onEnter = function(nextState, replaceState) {
	var user = store.get(uc.USER_STORAGE);
	if (user) {
		replaceState(null, '/links');
	}
};

module.exports = LoginPage;