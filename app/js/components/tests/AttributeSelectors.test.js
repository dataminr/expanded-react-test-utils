var AttributeSelectors = require('../AttributeSelectors');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ExpandedTestUtils = require('../../../../lib/ExpandedTestUtils');

describe('AttributeSelectors Tests', function() {
    var attributeInstance;

    beforeEach(function() {
        attributeInstance = ReactTestUtils.renderIntoDocument(<AttributeSelectors/>);
    });

    describe('native HTML attribute tests', function(){
        it('finds all checkboxes', function(){
            expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, '.attribute-selector-operators.foo')).toBeTrue();

            var checkboxList = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(attributeInstance, 'input[type=checkbox]');
            expect(checkboxList).toBeArrayOfSize(2);
        });

        it('finds all elements with a checked attribute', function(){
            var checkboxList = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(attributeInstance, 'input[checked=true]');
            expect(checkboxList).toBeArrayOfSize(1);
        });

        it('finds all internal links', function(){
            var internalLink = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(attributeInstance, 'a[href^=http://]');
            expect(internalLink).toBeArrayOfSize(3);

            var externalLink = ExpandedTestUtils.findRenderedDOMComponentWithSelector(attributeInstance, 'a[href*=example]');
            expect(externalLink.innerText).toEqual('Off site link');

            externalLink = ExpandedTestUtils.findRenderedDOMComponentWithSelector(attributeInstance, 'a[href$=com/]');
            expect(externalLink.innerText).toEqual('Off site link');

            var noHrefLink = ExpandedTestUtils.findRenderedDOMComponentWithSelector(attributeInstance, 'a[lang~=bar]');
            expect(noHrefLink.innerText).toEqual('No href');
        });
    });

    describe('custom component attribute tests', function(){
        it('finds all instances of sub components with props', function(){
            expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message=foo]')).toBeTrue();
            expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[numberVal=10]')).toBeTrue();
            expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[trueVal=true]')).toBeTrue();
            expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[falseVal=false]')).toBeTrue();
            expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[nullVal=null]')).toBeTrue();
            expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message=withChildren]')).toBeTrue();
        });

        it('finds instances with multiple attributes', function(){
            expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message=boolean][trueVal=true]')).toBeTrue();
            expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message][numberVal=10]')).toBeTrue();
            expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message][nullVal]')).toBeTrue();
        });
    });
});