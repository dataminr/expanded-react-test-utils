/*global spyOn*/
var React = require('react');
var _ = require('lodash');
var ReactTestUtils = require('react-addons-test-utils');
var CssSelectorParser = require('./CssSelectorParser');
var SelectorMatchers = require('./SelectorMatchers');
var TestLocation = require('./TestLocation');

var originalCreateElement = React.createElement;

var supportedPsuedoSelectors = [
    'empty',
    'checked',
];

/* eslint-disable */
/**
 * NOT CURRENTLY USED: I wrote this originally thinking it would be useful, but then found
 * another solution, but I didn't want to remove this code in case it becomes useful in the future
 *
 * Recursive method to take a root React node and build up an easy to traverse tree of children. Top level object will be an object
 * with an element and children array. Children will be composed of these same sub-objects.
 * @param  {ReactElement} root Root react node in tree
 * @return {Object}            React tree
 */
function buildReactTree(root){
    if (!root) {
        return [];
    }
    var ret = {element: root, children:[]};
    if (ReactTestUtils.isDOMComponent(root)) {
        var renderedChildren = root._renderedChildren;
        var key;
        for (key in renderedChildren) {
            if (!renderedChildren.hasOwnProperty(key)) {
                continue;
            }
            ret.children = ret.children.concat([buildReactTree(renderedChildren[key])]);
        }
    }
    else if (ReactTestUtils.isCompositeComponent(root)) {
        ret.children = ret.children.concat([buildReactTree(root._renderedComponent)]);
    }
    return ret;
}
/* eslint-enable */

/**
 * Convert a CSS selector into an AST.
 * @param  {String} selector Selector to parse
 * @return {Object}          Parsed selector rule
 * @throws Exception         If selector cannot be parsed
 */
function parseCssSelector(selector){
    var parser = new CssSelectorParser();
    parser.registerAttrEqualityMods('^', '$', '*', '~');
    var ruleSet = parser.parse(selector);
    if(ruleSet.type !== 'ruleSet'){
        throw new Error('Cannot currently parse multiple rules. You must only provide a single CSS selector.');
    }
    return ruleSet;
}

/**
 * Validate that rules are simple and don't include parsing we don't yet support
 * @param  {Object} rule Rule definition to parse
 * @throws {Error}       If rule contains unsupported syntax
 */
function validateParsedCssRule(rule){
    if(rule.pseudos){
        if(rule.pseudos.length > 1){
            throw new Error("Only a single pseudo selector at a time is supported.");
        }
        rule.pseudos = rule.pseudos[0];
        if(supportedPsuedoSelectors.indexOf(rule.pseudos.name) === -1 ){
            throw new Error("The '" + rule.pseudos.name + "' pseudo selector is currently not supported.");
        }
    }
    if(rule.nestingOperator){
        throw new Error("Nesting operators are currently not supported.");
    }
}

/**
 * Recursive function to find all nodes that match the provided rule.
 * @param  {ReactElement} root         The root node to search within
 * @param  {Object}       rule         Parsed CSS rule to match
 * @param  {Bool}         omitRootNode Whether we should ignore the root element from rule matching. If set to true only children will be matched
 * @return {Array}                     Array of matching results
 */
function findAllElementsWithSelector(root, rule, omitRootNode){
    var matches = ReactTestUtils.findAllInRenderedTree(root, elementRuleMatcher(root, rule, omitRootNode)),
        subRule = rule.rule;
    if(subRule){
        var subMatches = [];
        validateParsedCssRule(subRule);
        for(var i = 0; i < matches.length; i++){
            subMatches = subMatches.concat(findAllElementsWithSelector(matches[i], subRule, true));
        }
        return subMatches;
    }
    return matches;
}

/**
 * Generates matcher function to pass into the React TestUtils findAllInRenderedTree given the
 * rule to match
 * @param  {ReactElement} root     The root node to search within
 * @param  {Object}       rule     Parsed CSS rule to match
 * @param  {Bool}         omitRoot Whether we should ignore the root element from rule matching. If set to true only children will be matched
 * @return {Function}              Matcher function which checks against tag names and class names
 */
function elementRuleMatcher(root, rule, omitRoot){
    return function(element){
        if(omitRoot && element === root){
            return false;
        }
        return SelectorMatchers.doesElementMatchSelector(element, rule);
    };
}

/**
 * Simple React component to render a JSX partial. Necessary with the React 0.14 upgrade which
 * requires a component to be passed to renderIntoDocument.
 */
var RenderWrapper = React.createClass({
    render: function(){
        return this.props.children;
    }
});

module.exports = {
    /**
     * Replaces a specific React component with an empty React div during the React render cycle.
     * It's useful to be able to test a component without having it's child components execute and render.
     *
     * @param {String|Object} componentName - Name of the component to replace or object of components to replace.
     *                                        If object, each key should be the name of the component to replace
     *                                        and the values are the optional options to augment.
     * @param {Object=} additionalOptions - Object of div tag attributes to pass to mocked replacement div (className, id, etc).
     * @return {Object} - The newly created Jasmine spy.
     */
    mockReactComponent: function(componentName, additionalOptions){
        if(typeof componentName === 'string'){
            var tempComponentName = {};
            tempComponentName[componentName] = additionalOptions || {};
            componentName = tempComponentName;
        }

        var componentList = _.keys(componentName);

        return spyOn(React, 'createElement').and.callFake(function(){
            var args = Array.prototype.slice.call(arguments),
                type = args[0];
            //If createElement is called with the component requested, replace it with
            //an empty div and overwrite it's options with what was provided or an empty object
            var displayName;
            if(type){
                displayName = type.displayName || type.name;
            }
            if(displayName && componentList.indexOf(displayName) > -1){
                var mock = React.createClass({
                    displayName: displayName,
                    render: () => null
                });
                args[0] = mock;
                //Merge options if present. Allow calls to add/overwrite values
                args[1] = args[1] ?
                    _.assign(args[1], componentName[displayName]) :
                    componentName[displayName];
            }
            return originalCreateElement.apply(React, args);
        });
    },

    /**
     * Returns a rendered React component that requires the react-router.
     * @param  {Object} Router         Instance of react-router Router class.
     * @param  {Object} reactComponent React component instance to render
     * @param  {Object} props          Properties to add to rendered component
     * @param  {String} path           Path necessary to render. If component uses a <Router.Link> component, it's 'to'
     *                                 attribute must exist as a path, so pass in the same name here.
     * @return {Object}                Rendered instance of the reactComponent
     */
    getRouterComponent: function(Router, reactComponent, props, path) {
        var component;
        var div = document.createElement('div');
        var routes = <Router.Route name={path} handler={reactComponent}/>;
        var loc = new TestLocation(['/' + path], Router);
        props = props || {};

        Router.run(routes, loc, function (Handler) {
            var mainComponent = React.render(<Handler {...props}/>, div);
            component = ReactTestUtils.findRenderedComponentWithType(mainComponent, reactComponent);
        });

        return component;
    },

    /**
     * Render a test component using renderIntoDocument using a mock wrapper to get around renderIntoDocument restrictions. Used
     * to render a JSX partial.
     * @param  {ReactElement} partial JSX partial to render
     * @return {HTMLNode}             Resulting HTML markup
     */
    renderPartial(partial){
        return ReactTestUtils.renderIntoDocument(<RenderWrapper>{partial}</RenderWrapper>);
    },

    /**
     * Finds a list of React elements that match the given CSS selector. CSS selector is expected to on contain a
     * single simple rule which uses only class names and element types. Examples:
     *
     *      div.main-content
     *      .section-title.home
     *      ul.item-list li.last span
     *
     * @param  {ReactElement} root     Root node to search within
     * @param  {String}       selector Simple CSS selector to query
     * @return {Array}                 List of results
     */
    scryRenderedDOMComponentsWithSelector: function(root, selector){
        if(typeof selector !== 'string'){
            throw new Error("You must provide a string selector to scryRenderedDOMComponentsWithSelector.");
        }
        var parsedRule = parseCssSelector(selector);
        var rule = parsedRule.rule;
        validateParsedCssRule(rule);

        //Some selectors end up causing multiple of the same elements to get selected so
        //run a unique on the results to make sure we don't get duplicates.
        return _.uniq(findAllElementsWithSelector(root, rule));
    },

    /**
     * Similar to scryRenderedDOMComponentsWithSelector but expects to only find a single
     * result. Will throw an exception if 0 or 2+ elements are found.
     * @param  {ReactElement} root     Root node to search within
     * @param  {String}       selector Simple CSS selector to query
     * @return {ReactElement}          Single found element
     * @throws Exception               If no items were found or more than 1 were found
     */
    findRenderedDOMComponentWithSelector: function(root, selector){
        if(typeof selector !== 'string'){
            throw new Error("You must provide a string selector to scryRenderedDOMComponentsWithSelector.");
        }

        var matches = this.scryRenderedDOMComponentsWithSelector(root, selector);
        if(matches.length !== 1){
            throw new Error("Did not find exactly one match (found: " + matches.length + ") for selector: " + selector);
        }
        return matches[0];
    },

    /**
     * Determines if the number of elements found with the provided class name in the tree is equal to the
     * expected size provided.
     * @param  {ReactElement} root      Rendered React element to check
     * @param  {String}       className Classname to look for
     * @param  {number}       [count=1] Number of times it should appear, defaults to 1 if not provided
     * @return {Bool}                   True if component with class name was found the correct number of times
     * @throws Exception                If element was not found the expected number of times
     */
    findComponentCountWithClassname: function(root, className, count){
        if(!count && count !== 0){
            count = 1;
        }
        var matches = ReactTestUtils.scryRenderedDOMComponentsWithClass(root, className);
        if(matches.length === count){
            return true;
        }
        throw new Error('Expected to find ' + count + ' elements with class "' + className + '", but instead found ' + matches.length);
    },

    /**
     * Determines if the number of elements found with the provided tag name in the tree is equal to the
     * expected size provided.
     * @param  {ReactElement} root      Rendered React element to check
     * @param  {String}       tagName   DOM tag name to look for
     * @param  {number}       [count=1] Number of times it should appear, defaults to 1 if not provided
     * @return {Bool}                   True if component with class name was found the correct number of times
     * @throws Exception                If element was not found the expected number of times
     */
    findComponentCountWithTag: function(root, tagName, count){
        if(!count && count !== 0){
            count = 1;
        }
        var matches = ReactTestUtils.scryRenderedDOMComponentsWithTag(root, tagName);
        if(matches.length === count){
            return true;
        }
        throw new Error('Expected to find ' + count + ' elements with tag "' + tagName + '", but instead found ' + matches.length);
    },

    /**
     * Determines if the number of elements found with the provided selector is equal to the
     * expected size provided.
     * @param  {ReactElement} root      Rendered React element to check
     * @param  {String}       selector  Simple CSS selector to find
     * @param  {number}       [count=1] Number of times it should appear, defaults to 1 if not provided
     * @return {Bool}                   True if components matching selector were found the expected number of times
     * @throws Exception                If element was not found the expected number of times
     */
    findComponentCountWithSelector: function(root, selector, count){
        if(!count && count !== 0){
            count = 1;
        }
        var matches = this.scryRenderedDOMComponentsWithSelector(root, selector);
        if(matches.length === count){
            return true;
        }
        throw new Error('Expected to find ' + count + ' elements with selector "' + selector + '", but instead found ' + matches.length);
    }
};
