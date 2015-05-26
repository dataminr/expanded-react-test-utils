define(function(require) {
    'use strict';

    var React = require('react');
    var Router = require('react-router');
    var Page = require('components/Page');
    var Route = Router.Route, DefaultRoute = Router.DefaultRoute, RouteHandler = Router.RouteHandler;

    var App = React.createClass({
        render: function() {
            return (
                <div className="app-component">
                    <RouteHandler {...this.props} />
                </div>
            );
        }
    });

    var routes =
        <Route name="app" path="/" handler={App}>
            <DefaultRoute name="main" handler={Page} />
        </Route>;

    Router.run(routes, function(Handler, state) {
        React.render(<Handler params={state.params} />, document.body);
    });
});
