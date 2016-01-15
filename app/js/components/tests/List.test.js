var List = require('../List');
var AgeStore = require('../../stores/AgeStore');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ExpandedTestUtils = require('../../../../lib/ExpandedTestUtils');

describe('List Tests', function() {
    var listInstance,
        //Create mock data to use as the props for each test
        ageData = {
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
        };

    beforeEach(function() {
        //Mock out all store calls to make expecations consistent
        spyOn(AgeStore, 'getTotalPopulationData').and.returnValue([
            40000,
            50000
        ]);
        spyOn(AgeStore, 'getTotalStatePopulation').and.returnValue(100000);
        spyOn(AgeStore, 'getCountyList').and.returnValue([
            'Gallatin',
            'Missoula'
        ]);

        //Render a fresh List component into the document before each test
        listInstance = ReactTestUtils.renderIntoDocument(<List ageData={ageData} selectedAges={selectedAges}/>);
    });

    describe('getPopulationStats function', function(){
        it('returns object with expected values', function(){
            var stats = listInstance.getPopulationStats('Gallatin', 1234, 0);

            expect(stats.name).toEqual('Gallatin');
            expect(stats.value).toEqual(1234);
            expect(stats.statePercent).toEqual(1.234);
            expect(stats.countyPercent).toEqual(3.085);
        });
    });

    describe('sortPopulationData function', function(){
        it('returns sorted values as expected', function(){
            var sortedEntries = listInstance.sortPopulationData([
                {
                    value: 8
                },
                {
                    value: 7
                },
                {
                    value: 9
                },
                {
                    value: 8
                }
            ]);

            expect(sortedEntries).toEqual([{value: 9}, {value: 8}, {value: 8}, {value: 7}]);
        });
    });

    describe('getPopulationData function', function() {
        it('returns expected data', function() {
            var data = listInstance.getPopulationData();

            expect(data).toEqual([
                {
                    name: 'Gallatin',
                    value: 12500,
                    statePercent: 12.5,
                    countyPercent: 31.25
                },
                {
                    name: 'Missoula',
                    value: 12000,
                    statePercent: 12,
                    countyPercent: 24
                }
            ]);
        });
    });

    describe('getListMarkup function', function() {
        it('returns an empty object with no data', function() {
            expect(listInstance.getListMarkup([])).toEqual([]);
        });

        it('returns expected markup for items', function(){
            var listItems = listInstance.getListMarkup([
                {
                    name: 'Gallatin',
                    value: 12500,
                    statePercent: 12.58393939,
                    countyPercent: 31.25
                },
                {
                    name: 'Missoula',
                    value: 12000,
                    statePercent: 12,
                    countyPercent: 24
                }
            ]);

            //Should have two list items from the data provided
            expect(listItems).toBeArrayOfSize(2);

            //Render these items into another detatched node. We have to wrap this in a
            //surrounding DIV because it's an array of markup, so it needs a container.
            var listMarkup = ExpandedTestUtils.renderPartial(<div>{listItems}</div>);
            //Find all percentage spans so we can ensure the percent truncatino is occuring
            var percentages = ReactTestUtils.scryRenderedDOMComponentsWithClass(listMarkup, 'percentage');
            expect(percentages[1].innerText).toEqual('State Population: 12.584%');
        });
    });
});