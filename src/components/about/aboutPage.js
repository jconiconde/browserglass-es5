"use strict";

var React = require('react');

var About = React.createClass({
	render: function () {
		return (
			<div>
				<h1>About</h1>
				<p>
					This application uses the following technologies:

				</p>
				<ul>
					<li>React</li>
					<li>React Router</li>
					<li>Flux</li>
					<li>Node</li>
					<li>Gulp</li>
					<li>Browserify</li>
					<li>Uikit</li>
					<li>And more...</li>
				</ul>
			</div>
		);
	}
});
About.title = 'About';
About.path = '/about';
module.exports = About;