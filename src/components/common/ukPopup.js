var React = require('react');
var ReactDom = require('react-dom');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var assign = require('object-assign');
var linkActions = require('../../actions/linkActions');

var UkPopup = React.createClass({
	mixins : [PureRenderMixin],
	propTypes : {
		onClickBackGround : React.PropTypes.func.isRequired
	},
	getInitialState : function(){
		return {
			modal : null,
			open : false
		};
	},
	getDefaultProps : function() {
		return {
			open : false,
			options : {
				center : true
			},
			style : {
				'maxWidth' : '600px',
				'width' : '80%',
				'minWidth' : '200px',
				'marginTop' : '15%',
				'marginBottom' : '15%',
				'zIndex' : 9999
			},
			modalType : 'uk-modal-dialog-lightbox'
		};
	},
	componentDidMount : function() {
		var modal = UIkit.modal(this.refs.ukPopup, this.props.options );
		this.setState({
			modal : modal
		});
	},
	componentWillUnmount : function() {
		this.state.modal = null;
	},
	componentDidUpdate : function(prevProps, prevState) {
		if (prevProps.open !== this.props.open) {
			this.props.open 
				? this.state.modal.show() 
				: this.state.modal.hide();
		}
	},
	_onClick : function(e) {
		e.stopPropagation();
		e.preventDefault();
		this.props.onClickBackGround(e);
		
	},
	render : function() {
		return <div ref="ukPopup" onClick={this._onClick} className="uk-modal">
			<div style={this.props.style}
				onClick={function(e) {e.stopPropagation();}}
				className={this.props.modalType}>
				{this.props.children}
			</div>
		</div>;
	}
});

module.exports = UkPopup;