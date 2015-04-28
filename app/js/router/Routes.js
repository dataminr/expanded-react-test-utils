define(function(require) {
    'use strict';

    var App = require('components/App');
    var React = require('react');
    var Router = require('react-router');

    return <Router.Route name="app" path="/expanded-react-test-utils/app/index.html" handler={App} />;
});
