define(function(require) {
    'use strict';

    require('highmaps');
    require('highmaps-theme');
    require('montana-map');
    var AgeStore = require('stores/AgeStore');
    var React = require('react');
    var _ = require('lodash');

    var StateMap = React.createClass({
        propTypes: {
            ageData: React.PropTypes.object.isRequired,
            selectedAges: React.PropTypes.object.isRequired
        },

        /**
         * Render a new Highcharts map with the data provided via props
         */
        componentDidMount: function() {
            this.chart = new window.Highcharts.Map({
                chart: {
                    renderTo: 'container',
                    backgroundColor: '#2C2C2D'
                },
                title: {
                    text: 'Montana'
                },
                mapNavigation: {
                    enabled: false
                },
                colorAxis: {
                    min: 0,
                    stops: [
                        [0, '#EFEFFF'],
                        [0.5, window.Highcharts.getOptions().colors[0]],
                        [1, window.Highcharts.Color(window.Highcharts.getOptions().colors[0]).brighten(-0.5).get()]
                    ]
                },
                series: [{
                    data: this.calculateData(),
                    mapData: window.Highcharts.maps['countries/us/us-mt-all'],
                    joinBy: 'hc-key',
                    name: 'Ages',
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }]
            });
        },

        /**
         * Update the data in the Map given our new props
         */
        componentDidUpdate: function() {
            this.chart.series[0].setData(this.calculateData());
        },

        /**
         * Figure out the values for each county given the selected age filters
         * @return {Array} Data values for each county
         */
        calculateData: function() {
            var mapData = AgeStore.getMapData(),
                keys = [];

            _.each(this.props.selectedAges, function(enabled, age) {
                if (enabled) {
                    keys.push(age);
                }
            }, this);

            _.each(mapData, function(county, index) {
                county.value = 0;

                _.each(keys, function(key) {
                    county.value += this.props.ageData[key].percentages[index];
                }, this);
            }, this);

            return mapData;
        },

        render: function() {
            return (
                <div className="map">
                    <div id="container" ref="container"></div>
                </div>
            );
        }
    });

    return StateMap;
});
