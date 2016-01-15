var StateMap = require('../StateMap');
var AgeStore = require('../../stores/AgeStore');
var React = require('react');
var Highcharts = require('highcharts/highmaps');
var ReactTestUtils = require('react-addons-test-utils');
var ExpandedTestUtils = require('../../../../lib/ExpandedTestUtils');

describe('Map Tests', function() {
    //Create mock data to use as store return values
    var ageData = {
            toddlers: {
                label: "Toddlers",
                percentages: [5000, 6000]
            },
            tweens: {
                label: "Tweens",
                percentages: [3500, 3000]
            },
            teenagers: {
                label: "Teenagers",
                percentages: [7500, 6000]
            }
        },
        selectedAges = {
            toddlers: true,
            tweens: false,
            teenagers: true
        },
        stateMapInstance;

    beforeAll(function(){
        //Since rendering the StateMap puts it in a detached DOM node, Highcharts can't render properly, so we
        //need to spy and mock it out so it doesn't actually try to render the map
        spyOn(Highcharts, 'Map').and.returnValue({
            Map: function(){}
        });
    });

    beforeEach(function() {
        stateMapInstance = ReactTestUtils.renderIntoDocument(<StateMap ageData={ageData} selectedAges={selectedAges}/>);
    });

    describe('calculateData function', function(){
        it('returns proper data based on props', function(){
            spyOn(AgeStore, 'getMapData').and.returnValue([
                {
                    "hc-key": "us-mt-001",
                    "value": 0
                },
                {
                    "hc-key": "us-mt-003",
                    "value": 0
                }
            ]);

            var mapData = stateMapInstance.calculateData();
            expect(mapData).toEqual([
                {
                    'hc-key': 'us-mt-001',
                    value: 12500
                },
                {
                    'hc-key': 'us-mt-003',
                    value: 12000
                }
            ]);
        });
    });
});