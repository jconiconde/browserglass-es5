"use strict";
var React = require('react');
var ReactDom = require('react-dom');
var Router = require('react-router').Router;
var routes = require('./routes');

//var InitializeActions = require('./actions/initializeActions');

//InitializeActions.initApp();

ReactDom.render(<Router>{routes}</Router>, document.getElementById('app'));

