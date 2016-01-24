var React = require('react');


var Tile = React.createClass({
	propTypes : {
		onClick : React.PropTypes.func,
		onFocus : React.PropTypes.func,
		onBlur : React.PropTypes.func,
		tabIndex : React.PropTypes.number,
		active : React.PropTypes.bool,
		className : React.PropTypes.string,
		tileStyles : React.PropTypes.object 
	},
	getDefaultProps : function() {
		return {
			tileStyles : null 
		};
	},
	render : function() {
		return (
			<div
				onClick={this.props.onClick}
				onFocus={this.props.onFocus}
				onBlur={this.props.onBlur}
				tabIndex={this.props.tabIndex}
				className={this.props.className || "uk-margin-top"}>
				<div  className="uk-panel uk-panel-box" style={this.props.tileStyles}>
					{this.props.children}
				</div>
				
			</div>
		);
	}
});


module.exports = Tile;