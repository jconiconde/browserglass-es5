var React = require('react');

var LinkActionBar = React.createClass({
	propTypes : {
		visible : React.PropTypes.bool
	},
	getDefaultProps : function() {
		return {
			className : '',
			visible : true,
		};
	},
	_onClick : function(e) {
		e.stopPropagation();
	},
	render : function() {
		return <div
			ref="actionBar"
			style={{
				'visibility' : this.props.visible ? 'visible' : 'hidden'
			}}
			onClick={this._onClick}
			className={"action-bar " + this.props.className}>

			{this.props.children}
		</div>;
	}
});

module.exports = LinkActionBar;