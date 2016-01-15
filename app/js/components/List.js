var React = require('react');
var AgeStore = require('../stores/AgeStore');
var _ = require('lodash');

var List = React.createClass({
    propTypes: {
        ageData: React.PropTypes.object.isRequired,
        selectedAges: React.PropTypes.object.isRequired
    },

    /**
     * Given county information, returns an object which holds the county name,
     * current filtered population, and percentage of state/county population that
     * the filtered data represents
     * @param  {String} county Name of the county
     * @param  {int}    value  Filtered population amount
     * @param  {int}    index  Index of the current county
     * @return {Object}        Population object for county
     */
    getPopulationStats: function(county, value, index){
        var totalPopulationData = AgeStore.getTotalPopulationData();
        return {
            name: county,
            value: value,
            statePercent: value / AgeStore.getTotalStatePopulation() * 100,
            countyPercent: value / totalPopulationData[index] * 100
        };
    },

    /**
     * Sorts a list of county population objects by filtered population
     * @param  {Array} populationData Array of population objects
     * @return {Array}                The sorted array
     */
    sortPopulationData: function(populationData){
        return populationData.sort(function compare(a, b) {
            if (a.value < b.value){
                return 1;
            }
            if (a.value > b.value){
                return -1;
            }
            return 0;
        });
    },

    /**
     * Iterates over the list of counties and adds up the total population for each for the currently
     * selected filters. Returns sorted array of results.
     * @return {Array} Array sorted by population value
     */
    getPopulationData: function() {
        var keys = [],
            list = [],
            countyList = AgeStore.getCountyList(),
            value;

        _.each(this.props.selectedAges, function(enabled, age) {
            if (enabled) {
                keys.push(age);
            }
        }, this);

        _.each(countyList, function(county, index) {
            value = 0;

            _.each(keys, function(key) {
                value += this.props.ageData[key].percentages[index];
            }, this);
            list.push(this.getPopulationStats(county, value, index));
        }, this);

        return this.sortPopulationData(list);
    },

    /**
     * Returns a list of county markup with name, filtered population, and percentage values.
     * @param  {Array} data Array of population data
     * @return {Array}      List of ReactElement markup for each county
     */
    getListMarkup: function(data) {
        var markup = [];
        _.each(data, function(county){
            markup.push(
                <div key={county.name}>
                    <span>{county.name}</span>
                    <span>{county.value}</span>
                    <span className="percentage">{'County Population: ' + county.countyPercent.toFixed(3) + '%'}</span>
                    <span className="percentage">{'State Population: ' + county.statePercent.toFixed(3) + '%'}</span>
                </div>
            );
        });
        return markup;
    },

    render: function() {
        var populationData = this.getPopulationData();

        return (
            <div className="list">
                {this.getListMarkup(populationData)}
            </div>
        );
    }
});

module.exports = List;
