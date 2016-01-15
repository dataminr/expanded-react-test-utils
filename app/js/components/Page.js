var Controls = require('./Controls');
var AgeStore = require('../stores/AgeStore');
var List = require('./List');
var StateMap = require('./StateMap');
var React = require('react');
var _ = require('lodash');

var Page = React.createClass({
    getInitialState: function() {
        this.ageData = AgeStore.getAgeData();
        return {
            selectedAges: AgeStore.getSelectedAges()
        };
    },

    /**
     * Subscribe to AgeStore change event to update the list of selected ages in state
     */
    componentDidMount: function(){
        AgeStore.subscribeToChange(_.bind(this.updateSelectedAges, this));
    },

    /**
     * Handler for store change event. Updates state with the current list of selected ages which
     * will then be passed down to child components
     */
    updateSelectedAges: function(){
        this.setState({
            selectedAges: AgeStore.getSelectedAges()
        });
    },

    render: function() {
        return (
            <div className="page">
                <div className="header-title">
                    <h1>County Population by Age Range</h1>
                </div>
                <Controls ageData={this.ageData} selectedAges={this.state.selectedAges} />
                <List ageData={this.ageData} selectedAges={this.state.selectedAges} />
                <StateMap ageData={this.ageData} selectedAges={this.state.selectedAges} />
            </div>
        );
    }
});

module.exports = Page;
