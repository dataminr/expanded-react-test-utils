var Page = require('../Page');
var AgeStore = require('../../stores/AgeStore');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ExpandedTestUtils = require('../../../../lib/ExpandedTestUtils');

describe('Page Tests', function() {
    //Create mock data to use as store return values
    var ageData = {
            toddlers: {
                label: "Toddlers"
            },
            teenagers: {
                label: "Teenagers"
            }
        },
        selectedAges = {
            toddlers: true,
            teenagers: false
        },
        pageInstance;

    beforeAll(function(){
        //Mock out all of our child components. Merge in a className prop for each of them so
        //we can select them later and verify their props
        ExpandedTestUtils.mockReactComponent({
            Controls: {className: 'mock-controls'},
            List: {className: 'mock-list'},
            StateMap: {className: 'mock-state-map'}
        });

        //Mock out the data returned from the stores
        spyOn(AgeStore, 'getAgeData').and.returnValue(ageData);
        spyOn(AgeStore, 'getSelectedAges').and.returnValue(selectedAges);
    });

    beforeEach(function() {
        //Render a fresh Page component into the document before each test
        pageInstance = ReactTestUtils.renderIntoDocument(<Page />);
    });

    describe('componentDidMount function', function(){
        it('subscribes to store change event', function(){
            spyOn(AgeStore, 'subscribeToChange');

            pageInstance.componentDidMount();

            expect(AgeStore.subscribeToChange).toHaveBeenCalledWith(jasmine.any(Function));
        });
    });

    describe('updateSelectedAges function', function(){
        it('test various react component functions', function(){
            expect(pageInstance.state.selectedAges).toEqual(selectedAges);

            AgeStore.getSelectedAges.and.returnValue({
                toddlers: true,
                teenagers: true
            });

            pageInstance.updateSelectedAges();

            expect(pageInstance.state.selectedAges).toEqual({
                toddlers: true,
                teenagers: true
            });

            //Reset the spy to return the expected values
            AgeStore.getSelectedAges.and.returnValue(selectedAges);
        });
    });

    describe('render function', function() {
        it('renders all sub components with expected data', function() {
            //Since all of these have been mocked, we can find each instance via the injected class names we added
            //above.
            var controlInstance = ExpandedTestUtils.findRenderedDOMComponentWithSelector(pageInstance, 'Controls'),
                listInstance = ExpandedTestUtils.findRenderedDOMComponentWithSelector(pageInstance, 'List'),
                mapInstance = ExpandedTestUtils.findRenderedDOMComponentWithSelector(pageInstance, 'StateMap');

            //And can then verify that the props passed to each child component are what we'd expect
            expect(controlInstance.props.ageData).toEqual(ageData);
            expect(controlInstance.props.selectedAges).toEqual(selectedAges);

            expect(listInstance.props.ageData).toEqual(ageData);
            expect(listInstance.props.selectedAges).toEqual(selectedAges);

            expect(mapInstance.props.ageData).toEqual(ageData);
            expect(mapInstance.props.selectedAges).toEqual(selectedAges);
        });
    });
});