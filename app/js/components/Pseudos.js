var React = require('react');

/**
 * Fake component to show usage of pseudo CSS selectors for :empty and :checked
 */
var Pseudos = React.createClass({
    mockOnChange: function(){

    },

    render: function() {
        var message = null,
            list = [];

        return (
            <div>
                <div className="empty-tests">
                    <div className="empty"></div>
                    <span className="emptyMessage">{message}</span>
                    <ul className="emptyList">{list}</ul>
                </div>
                <div className="checked-tests">
                    <input type="checkbox"/>
                    <input type="checkbox" checked="true" onChange={this.mockOnChange}/>
                    <input type="checkbox" checked onChange={this.mockOnChange}/>
                    <input type="checkbox" defaultChecked/>
                    <input type="radio"/>
                    <input type="radio" checked="true" onChange={this.mockOnChange}/>
                    <input type="radio" checked onChange={this.mockOnChange}/>
                    <input type="radio" defaultChecked/>
                </div>
            </div>
        );
    }
});

module.exports = Pseudos;
