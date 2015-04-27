define(function(require) {
    'use strict';

    var React = require('react');
    var Router = require('router/Router');

    Router.run(function(Handler, state) {
        React.render(<Handler {...state}/>, document.body);
    });
});
