var Controls = require('../Controls');
var AgeStore = require('../../stores/AgeStore');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ExpandedTestUtils = require('../../../../lib/ExpandedTestUtils');

describe('Controls Tests', function() {
    var controlsInstance,
        //Create mock data to use as the props for each test
        ageData = {
            toddlers: {
                label: "Toddlers"
            },
            tweens: {
                label: "Tweens"
            },
            teenagers: {
                label: "Teenagers"
            }
        },
        selectedAges = {
            toddlers: true,
            tweens: false,
            teenagers: true
        };


    beforeEach(function() {
        //Render a fresh Controls component into the document before each test, using the mock data as prop values
        controlsInstance = ReactTestUtils.renderIntoDocument(<Controls ageData={ageData} selectedAges={selectedAges} />);
    });

    describe('toggleAgeHandler function', function(){
        it('calls into store with correct key', function(){
            spyOn(AgeStore, 'toggleAgeSelected');

            controlsInstance.toggleAgeHandler({target: {id: 'toddlers'}});

            expect(AgeStore.toggleAgeSelected).toHaveBeenCalledWith('toddlers');
        });
    });

    describe('getAgeToggleMarkup function, child access', function(){
        it('returns markup for when item is checked', function(){
            var control = controlsInstance.getAgeToggleMarkup('tweens', true);

            var input = control.props.children[0],
                label = control.props.children[1];

            //Verify that the properties of the input element are what we expect
            expect(input.props.checked).toBeTrue();
            expect(input.props.id).toEqual('tweens');

            //Verify that the label value is what we expect
            expect(label.props.children).toEqual('Tweens');
        });

        it('returns markup for when item is unchecked', function(){
            var control = controlsInstance.getAgeToggleMarkup('teenagers', false);

            var input = control.props.children[0],
                label = control.props.children[1];

            //Verify that the properties of the input element are what we expect
            expect(input.props.checked).toBeFalse();
            expect(input.props.id).toEqual('teenagers');

            //Verify that the label value is what we expect
            expect(label.props.children).toEqual('Teenagers');
        });
    });

    describe('getAgeToggleMarkup function, render access', function(){
        it('returns markup for when item is checked', function(){
            var control = controlsInstance.getAgeToggleMarkup('tweens', true);

            var markup = ExpandedTestUtils.renderPartial(control);

            var input = ReactTestUtils.findRenderedDOMComponentWithTag(markup, 'input'),
                label = ReactTestUtils.findRenderedDOMComponentWithTag(markup, 'label');

            //Verify that the properties of the input element are what we expect
            expect(input.checked).toBeTrue();
            expect(input.id).toEqual('tweens');

            //Verify that the label value is what we expect
            expect(label.innerText).toEqual('Tweens');
        });

        it('returns markup for when item is unchecked', function(){
            var control = controlsInstance.getAgeToggleMarkup('teenagers', false);

            var markup = ExpandedTestUtils.renderPartial(control);

            var input = ReactTestUtils.findRenderedDOMComponentWithTag(markup, 'input'),
                label = ReactTestUtils.findRenderedDOMComponentWithTag(markup, 'label');

            //Verify that the properties of the input element are what we expect
            expect(input.checked).toBeFalse();
            expect(input.id).toEqual('teenagers');

            //Verify that the label value is what we expect
            expect(label.innerText).toEqual('Teenagers');
        });
    });

    describe('getAgeControlsMarkup tests', function() {
        it('returns array of child checkbox items', function() {
            var checkboxes = controlsInstance.getAgeControlsMarkup();

            //Verify that the result contains 3 checkboxes (1 for each key in the mock data above)
            expect(checkboxes).toBeArrayOfSize(3);
        });
    });

    describe('render function', function(){
        it('toggles items in store on click of checkboxes', function(){
            spyOn(AgeStore, 'toggleAgeSelected');

            //Find a specific checkbox to toggle so we can verify that the correct store call gets made
            var tweenCheckbox = ExpandedTestUtils.findRenderedDOMComponentWithSelector(controlsInstance, '#tweens');

            //Note that we simulate a 'change' here because the node has an onChange, not an onClick. Also, pass in the
            //actual DOM node to the simulte method
            ReactTestUtils.Simulate.change(tweenCheckbox);
            expect(AgeStore.toggleAgeSelected).toHaveBeenCalledWith('tweens');
        });

        it('should render three checkboxes', function(){
            //Assert that the fully rendered component should have 3 input fields
            expect(ExpandedTestUtils.findComponentCountWithTag(controlsInstance, 'input', 3)).toBeTrue();
        });
    });
});