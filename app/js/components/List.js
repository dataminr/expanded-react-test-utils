define(function(require) {
    'use strict';

    var countyList = require('data/countyList');
    var React = require('react');
    var totalPopulationData = require('data/totalPopulationData');

    return React.createClass({
        propTypes: {
            ageData: React.PropTypes.object.isRequired,
            selectedAges: React.PropTypes.object.isRequired
        },

        render: function() {
            return (
                <div className="list">
                    {this.getListMarkup()}
                </div>
            );
        },

        getListMarkup: function() {
            var keys = [];
            var list = [];
            var value;

            _.each(_.keys(this.props.selectedAges), function(age) {
                if (this.props.selectedAges[age]) {
                    keys.push(age);
                }
            }, this);

            _.each(countyList, function(county, index) {
                value = 0;

                _.each(keys, function(key) {
                    value += this.props.ageData[key].percentages[index];
                }, this);

                list.push(this.getListItemMarkup(county, value, index));
            }, this);

            return list.sort(function compare(a, b) {
                a = a.props.children[1].props.children;
                b = b.props.children[1].props.children;
                if (a < b)
                    return 1;
                if (a > b)
                    return -1;
                return 0;
            });
        },

        getListItemMarkup: function(county, value, index) {
            var countyPercentage = value / totalPopulationData[index] * 100;
            var statePercentage = value / 989415 * 100;
            return (
                <div key={index}>
                    <span>{county}</span>
                    <span>{value}</span>
                    <span className="percentage">{'County Population: ' + countyPercentage.toString().slice(0, 5) + '%'}</span>
                    <span className="percentage">{'State Population: ' + statePercentage.toString().slice(0, 5) + '%'}</span>
                </div>
            );
        }
    });
});
