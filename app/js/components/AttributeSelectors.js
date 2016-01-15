//Fake component to show usage of attribute CSS selector functionality
var React = require('react');

var SubComponent = React.createClass({
    render: function(){
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});

var AttributeSelectors = React.createClass({
    render: function() {
        return (
            <div>
                <form className="attribute-selector-operators foo">
                    <input type="text" name="user"/>
                    <input type="checkbox" name="agree"/>
                    <input type="checkbox" name="signup" checked onChange={function(){}}/>
                </form>
                <div className="attribute-comparison-operators">
                    <a href="/foo/bar">Internal Link</a>
                    <a href="http://example.com">Off site link</a>
                    <a href="#foo">Anchor link</a>
                    <a lang="foo bar baz">No href</a>
                </div>
                <div className="sub-component tests">
                    <SubComponent message="foo"/>
                    <SubComponent message="number" numberVal={10}/>
                    <SubComponent message="boolean" trueVal falseVal={false}/>
                    <SubComponent message="null" nullVal={null} />
                    <SubComponent message="withChildren">
                        <div className="asdf">
                            <span className="thisone" name="empty"></span>
                            <span className="thisone">
                                Sub message
                            </span>
                        </div>
                    </SubComponent>
                </div>
            </div>
        );
    }
});

module.exports = AttributeSelectors;