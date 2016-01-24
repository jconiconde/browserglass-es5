var React = require('react');
var DropDownMenu = require('material-ui/lib/DropDownMenu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Checkbox = require('material-ui/lib/checkbox');
var Input = require('../common/textInput');
var assign = require('object-assign');

var addingForm = (
	<div>


	</div>
);

var LinkForm = React.createClass({
	propTypes: {
		setLinkState : React.PropTypes.func,
		link : React.PropTypes.object.isRequired,
		mode : React.PropTypes.string,
		errors: React.PropTypes.object
	},
	getDefaultProps : function() {
		return {
			onBlur : function(e) {
				e.stopPropagation();
			},
			errors : {}
		};
	},
	getInitialState : function(){
		return {
			expiry : 15,
			tunnel : false // mins
		};
	},
	_onExpiryChange : function(e, index, value) {
		this.props.link.expiry = value;
		this.setState({
			expiry : value
		});
	},
	_onTunnelChange : function(e, value) {
		this.props.link.tunnel = value;
		this.setState({
			tunnel : value
		});
	},
	_onChange : function(e) {
		this.props.setLinkState(e, this.props.link);
	},
	componentWillMount : function() {
		this.setState({
			expiry : this.props.link.expiry,
			tunnel : this.props.link.tunnel
		});
	},
	// componentWillReceiveProps : function(nextProps) {
	// 	this.setState({
	// 		expiry : this.props.link.expiry
	// 	});
	// },
	render : function() {

		var savingContent = <div>

			<div className="uk-clearfix">
				<div className="uk-float-left">
					<label>Expiry:</label>
					<DropDownMenu value={this.state.expiry} onChange={this._onExpiryChange}>
						<MenuItem value={15} primaryText="15 minutes"/>
						<MenuItem value={30} primaryText="30 minutes"/>
					</DropDownMenu>
				</div>
				<div className="uk-float-left uk-margin-small-left uk-margin-top">
					<Checkbox
					  name="tunnel"
					  onCheck={this._onTunnelChange}
					  defaultChecked={this.state.tunnel}
					  label="Tunnel"/>
				</div>

			</div>
			
		</div>,
			isViewMode = this.props.link.active || this.props.mode === 'add';

		return (
			<div>
				<Input
					name="title"
					label=""
					value={this.props.link.title}
					placeholder="Title"
					onChange={this._onChange}
					onBlur={this.props.onBlur}
					styles={{
						inputStyle : {
							fontSize : '17px'
						}
					}}
					disabled={!this.props.link.active}
					error={this.props.errors.title}/>
				{
					isViewMode
					? <Input
						name="url"
						label=""
						value={this.props.link.url}
						placeholder="URL"
						onChange={this._onChange}
						onBlur={this.props.onBlur}
						error={this.props.errors.url}/>
					: ''
				}
				
				<Input
					name="description"
					label=""
					placeholder="Description"
					value={this.props.link.description}
					onBlur={this.props.onBlur}
					onChange={this._onChange}
					disabled={!this.props.link.active}
					error={this.props.errors.description}/>
				{this.props.children}


				{
					isViewMode ? savingContent : ''
				}
			</div>
		);
	}
});

module.exports = LinkForm;