var Pseudos = require('../Pseudos');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ExpandedTestUtils = require('../../../../lib/ExpandedTestUtils');

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
            var completelyEmpty = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(pseudoInstance, 'div:empty');
            expect(completelyEmpty).toBeArrayOfSize(1);
            expect(completelyEmpty[0].className).toEqual('empty');

            var withEmptyMessage = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(pseudoInstance, 'span:empty');
            expect(withEmptyMessage).toBeArrayOfSize(1);
            expect(withEmptyMessage[0].className).toEqual('emptyMessage');

            var emptyList = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(pseudoInstance, 'ul:empty');
            expect(emptyList).toBeArrayOfSize(1);
            expect(emptyList[0].className).toEqual('emptyList');
        });
    });
});