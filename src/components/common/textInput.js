"use strict";

var React = require('react');
var classnames = require('classnames');


var defaultStyles = {
	inputStyle : {
		display : 'inline-block',
		visibility : 'visible'
	}
};

var Input = React.createClass({
	propTypes: {
		name: React.PropTypes.string.isRequired,
		label: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		placeholder: React.PropTypes.string,
		value: React.PropTypes.string,
		error: React.PropTypes.string,
		styles : React.PropTypes.object,
		onBlur : React.PropTypes.func,
		disabled : React.PropTypes.bool
	},
	getDefaultProps : function() {
		return {
			styles : defaultStyles,
			disabled : false
		};
	},
	render : function() {
		var wrapperClass = 'form-group';
		if (this.props.error && this.props.error.length > 0) {
		  wrapperClass += ' has-error';
		}

		return (
			<div className={wrapperClass}>
			  <label htmlFor={this.props.name}>{this.props.label}</label>
			  <div className="field">
			    <input type="text"
			    name={this.props.name}
			    className="form-control"
			    placeholder={this.props.placeholder}
			    ref={this.props.name}
			    style={ this.props.styles.inputStyle }
			    value={this.props.value}
			    disabled={this.props.disabled}
			    onBlur={this.props.onBlur}
			    onChange={this.props.onChange} />
			    <div className="uk-text-danger">{this.props.error}</div>
			  </div>
			</div>
		);
	}
});


module.exports = Input;