require('../sass/app.scss');

var React = require('react');
var ReactDOM = require('react-dom');
var Page = require('./components/Page');

var App = React.createClass({
    render: function() {
        return (
            <div className="app-component">
                <Page/>
            </div>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('app'));
