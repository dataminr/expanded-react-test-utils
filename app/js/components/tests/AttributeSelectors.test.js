define(function(require) {
    var AttributeSelectors = require('components/AttributeSelectors');
    var React = require('react');
    var ReactTestUtils = React.addons.TestUtils;
    var ExpandedTestUtils = require('ExpandedTestUtils');

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
                var checkboxList = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(attributeInstance, 'input[checked]');
                expect(checkboxList).toBeArrayOfSize(1);
            });

            it('finds all internal links', function(){
                var internalLink = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(attributeInstance, 'a[href^=/]');
                expect(internalLink).toBeArrayOfSize(1);
                expect(internalLink[0].props.children).toEqual('Internal Link');

                var externalLink = ExpandedTestUtils.findRenderedDOMComponentWithSelector(attributeInstance, 'a[href*=example]');
                expect(externalLink.props.children).toEqual('Off site link');

                externalLink = ExpandedTestUtils.findRenderedDOMComponentWithSelector(attributeInstance, 'a[href$=com]');
                expect(externalLink.props.children).toEqual('Off site link');

                var noHrefLink = ExpandedTestUtils.findRenderedDOMComponentWithSelector(attributeInstance, 'a[lang~=bar]');
                expect(noHrefLink.props.children).toEqual('No href');
            });
        });

        describe('custom component attribute tests', function(){
            it('finds all instances of sub components with props', function(){
                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message=foo]')).toBeTrue();
                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[numberVal=10]')).toBeTrue();
                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[trueVal=true]')).toBeTrue();
                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[falseVal=false]')).toBeTrue();
                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[nullVal=null]')).toBeTrue();
            });

            it('finds instances with multiple attributes', function(){
                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message=boolean][trueVal=true]')).toBeTrue();
                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message][numberVal=10]')).toBeTrue();
                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message][nullVal]')).toBeTrue();
            });

            it('finds complex subchildren underneath component', function(){
                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message=withChildren] div span', 2)).toBeTrue();
                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message=withChildren] span', 2)).toBeTrue();

                expect(ExpandedTestUtils.findComponentCountWithSelector(attributeInstance, 'SubComponent[message=withChildren] span:empty')).toBeTrue();
            });
        });
    });
});