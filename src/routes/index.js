// client
"use strict";

var React = require('react');
var ReactRouter = require('react-router');

var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var NotFoundRoute = ReactRouter.NotFoundRoute;
var Redirect = ReactRouter.Redirect;


var App = require('../components/app');
var LoginPage = require('../components/users/loginPage');
var LinkPage = require('../components/links/linkPage');
var AboutPage = require('../components/about/aboutPage');

var routes = (
  <Route  path={App.path} component={App}>
    <IndexRoute component={LoginPage} onEnter={LoginPage.prototype.onEnter}/>
    <Route path={LinkPage.path} component={LinkPage} />
    <Route path={AboutPage.path} component={AboutPage} />
  </Route>
);

module.exports = routes;