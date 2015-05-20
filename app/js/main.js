define(function(require) {
    'use strict';

    var React = require('react');
    var Router = require('react-router');
    var Placeholder = require('components/Placeholder');
    var Route = Router.Route, DefaultRoute = Router.DefaultRoute, RouteHandler = Router.RouteHandler;

    var App = React.createClass({
        render: function() {
            return (
                <div className="app-component">
                    <h1>Expanded React Test Utils</h1>
                    <RouteHandler {...this.props}/>
                </div>
            );
        }
    });

    var routes =
        <Route name="app" path="/" handler={App}>
            <DefaultRoute name="main" handler={Placeholder}/>
        </Route>;

    Router.run(routes, function(Handler, state) {
        React.render(<Handler params={state.params}/>, document.body);
    });
});