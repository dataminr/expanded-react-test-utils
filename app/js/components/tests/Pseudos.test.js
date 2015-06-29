define(function(require) {
    var Pseudos = require('components/Pseudos');
    var React = require('react');
    var ReactTestUtils = React.addons.TestUtils;
    var ExpandedTestUtils = require('ExpandedTestUtils');

    describe('Pseudos Tests', function() {
        var pseudoInstance;

        beforeEach(function() {
            pseudoInstance = ReactTestUtils.renderIntoDocument(<Pseudos/>);
        });

        describe('checked tests', function(){
            it('finds all the various input types that are checked', function(){
                var checkedItems = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(pseudoInstance, ':checked');
                expect(checkedItems).toBeArrayOfSize(6);
            });
        });

        describe('empty tests', function(){
            it('finds empty items even if children are null', function(){
                var completelyEmpty = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(pseudoInstance, '.empty-tests div:empty');
                expect(completelyEmpty).toBeArrayOfSize(1);
                expect(completelyEmpty[0].props.className).toEqual('empty');

                var withEmptyMessage = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(pseudoInstance, '.empty-tests span:empty');
                expect(withEmptyMessage).toBeArrayOfSize(1);
                expect(withEmptyMessage[0].props.className).toEqual('emptyMessage');

                var emptyList = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(pseudoInstance, '.empty-tests ul:empty');
                expect(emptyList).toBeArrayOfSize(1);
                expect(emptyList[0].props.className).toEqual('emptyList');
            });
        });
    });
});