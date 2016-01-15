var _ = require('lodash');

module.exports = {
    /**
     * Given an array, reduces the items based on the provided parsed CSS pseudo selector.
     * @param  {Object} element Element to test
     * @param  {Object} rule    Parsed pseudo CSS selector
     * @return {Array}          Reduced matches based on selector processing
     */
    doesElementMatchSelector: function(element, rule){
        var elementClassName = element.className,
            elementID = element.id,
            elementTagName = element.tagName,
            elementDisplayName = element.constructor.displayName;

        if(rule.tagName && !this.tagName(rule.tagName, elementTagName, elementDisplayName)){
            return false;
        }

        if(rule.id && !this.id(rule.id, elementID)){
            return false;
        }

        if(rule.classNames && !this.className(rule.classNames, elementClassName)){
            return false;
        }
        if(rule.pseudos && !this.pseudoMatcher(rule.pseudos, element, elementTagName)){
            return false;
        }
        if(rule.attrs && !this.attributeMatcher(rule.attrs, element)){
            return false;
        }
        return true;
    },

    /**
     * Routes pseudo selector to proper handler
     * @param  {Object} pseudoRule     Parsed CSS pseudo rule
     * @param  {Object} element        Element to check against pseudo rule
     * @param  {String} elementTagName Tag name of the element
     * @return {Bool}                  Whether element matches pseudo rule
     */
    pseudoMatcher: function(pseudoRule, element, elementTagName){
        if(pseudoRule.name === 'checked'){
            return this.checked(element, elementTagName);
        }
        if(pseudoRule.name === 'empty'){
            return this.empty(element);
        }
    },

    /**
     * Validates if the provided element matches the provided array of
     * attribute CSS selectors.
     * @param  {Array} attributeRules Array of attribute rules to check
     * @param  {Object} element       Element to check
     * @return {Bool}                 Whether element matches all attribute rules
     */
    attributeMatcher: function(attributeRules, element){
        for(var i = 0; i < attributeRules.length; i++){
            var attributeName = attributeRules[i].name,
                objectToCheck = element;
            if(typeof element.context === 'undefined'){
                //Native DOM node
                if(_.startsWith(attributeName, 'data-')){
                    objectToCheck = element.dataset;
                    attributeName = attributeName.split('-')[1];
                }
            }
            else{
                //React component instance
                objectToCheck = element.props;
            }


            var elementProperty = objectToCheck[attributeName],
                operator = attributeRules[i].operator,
                value = attributeRules[i].value;

            //Only checking for existance, don't care about the value
            if(!operator && elementProperty === undefined){
                return false;
            }

            var doesValueMatch = this.compareElementProperty(elementProperty, operator, value);
            if(!doesValueMatch){
                return false;
            }
        }
        return true;
    },

    /**
     * Checks if the element matches the provided tag name (if DOM node) or
     * display name (if React component)
     * @param  {String} ruleTag     Tag name of CSS rule
     * @param  {String} tagName     Tag name of element
     * @param  {String} displayName Display name of element
     * @return {Bool}               Whether element matches tag query
     */
    tagName: function(ruleTag, tagName, displayName){
        ruleTag = ruleTag.toLowerCase();
        if(tagName && ruleTag === tagName.toLowerCase()){
            return true;
        }
        if(displayName && ruleTag === displayName.toLowerCase()){
            return true;
        }
        return false;
    },

    /**
     * Checks if the element matches the provided ID selector
     * @param  {String} ruleID    ID selector to compare against
     * @param  {String} elementID ID attribute of the element to check
     * @return {Bool}             Whether the provided element ID matches the CSS element selector
     */
    id: function(ruleID, elementID){
        return (elementID && ruleID === elementID);
    },

    /**
     * Checks if the element class names match the provided CSS selector names
     * @param  {Array}  ruleClassName    Class name of CSS selector
     * @param  {String} elementClassName Class name of element
     * @return {Bool}                    Whether element class names CSS selectors
     */
    className: function(ruleClassName, elementClassName){
        if(!elementClassName){
            return false;
        }
        for(var i = 0; i < ruleClassName.length; i++){
            if((' ' + elementClassName + ' ').indexOf(' ' + ruleClassName[i] + ' ') === -1){
                return false;
            }
        }
        return true;
    },

    /**
     * Checks if the provided element is "empty" meaning it has no children
     * @param  {Object} element Element to test
     * @return {Bool}           True if the provided element has no children, false otherwise
     */
    empty: function(element){
        return element.childNodes.length == 0;
    },

    /**
     * Checks if the provided element is "checked". Only applies to inputs of type radio
     * and checkbox. Checks for both the checked property and defaultChecked property.
     * @param  {Object} element Element to test
     * @param  {String} tagName Tag name of the element
     * @return {Bool}           Whether element is the correct input type and is checked
     */
    checked: function(element, tagName){
        if(!tagName || tagName.toLowerCase() !== 'input'){
            return false;
        }

        var inputType = element.type.toLowerCase();
        if(inputType !== 'checkbox' && inputType !== 'radio'){
            return false;
        }

        return element.checked !== false;
    },

    /**
     * Function to parse attribute CSS queries for the various types of comparitor functions supported
     * in attribute queries and then performs the specific comparison of property and value
     * @param  {Mixed} property  Value of component prop to compare against
     * @param  {String} operator Comparison operator
     * @param  {String} value    Value to compare
     * @return {Bool}            Whether property matches value with the given operator check
     */
    compareElementProperty: function(property, operator, value){
        if(operator === '='){
            return this.compareElementPropertyEquality(property, value);
        }
        if(operator === '~='){
            return String(property).split(" ").indexOf(value) !== -1;
        }
        if(operator === '^='){
            return _.startsWith(property, value);
        }
        if(operator === '$='){
            return _.endsWith(property, value);
        }
        if(operator === '*='){
            return property && property.indexOf(value) !== -1;
        }
        return true;
    },

    /**
     * Does a equality comparison, handling for the fact that value is always a string. Supports casting
     * of values into numbers, booleans, and null.
     * @param  {Mixed}  property Element prop value to check
     * @param  {String} value    CSS selector value to compare
     * @return {Bool}            Whether property and value match
     */
    compareElementPropertyEquality: function(property, value){
        //When doing direct comparisons, do some conversions between numbers, booleans, null/undefined since
        //the value in the selector always comes through as a string
        if(_.isNumber(property)){
            return property === parseInt(value);
        }
        else if(_.isBoolean(property)){
            return property === (value === 'true' ? true : false);
        }
        else if(value === "null"){
            return property === null;
        }
        return property === value;
    }
};