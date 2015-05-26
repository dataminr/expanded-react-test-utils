define(function(require) {
    'use strict';

    require('highmaps');
    require('highmaps-theme');
    require('montana-map');
    var mapData = require('data/mapData');
    var React = require('react');

    return React.createClass({
        propTypes: {
            ageData: React.PropTypes.object.isRequired,
            selectedAges: React.PropTypes.object.isRequired
        },

        componentDidMount: function() {
            this.chart = new Highcharts.Map({
                chart: {
                    renderTo: 'container',
                    backgroundColor: '#2C2C2D'
                },
                title: {
                    text: 'Montana'
                },
                subtitle: {
                    text: '2010 - Population Under Age 35 by County'
                },
                mapNavigation: {
                    enabled: false
                },
                colorAxis: {
                    min: 0,
                    stops: [
                        [0, '#EFEFFF'],
                        [0.5, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(-0.5).get()]
                    ]
                },
                series: [{
                    data: mapData,
                    mapData: Highcharts.maps['countries/us/us-mt-all'],
                    joinBy: 'hc-key',
                    name: 'Ages',
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }]
            });
        },

        componentDidUpdate: function() {
            var keys = [];

            _.each(_.keys(this.props.selectedAges), function(age) {
                if (this.props.selectedAges[age]) {
                    keys.push(age);
                }
            }, this);

            _.each(mapData, function(county, index) {
                county.value = 0;

                _.each(keys, function(key) {
                    county.value += this.props.ageData[key].percentages[index];
                }, this);
            }, this);

            this.chart.series[0].setData(mapData);
        },

        render: function() {
            return (
                <div className="map">
                    <div id="container" ref="container"></div>
                </div>
            );
        }
    });
});
