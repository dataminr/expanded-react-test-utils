# Expanded ReactJS Test Utilities

Additional functions beyond the [existing ReactJS test utilities](http://facebook.github.io/react/docs/test-utils.html) to make testing quicker and easier. Adds the following functionality:

+ Find a component based on [CSS selector][CssSelectorSupport] instead of just tag name or class. Supports classes, IDs, tag names, pseudo selectors, and attribute selectors.
+ Fully mock child components yet still provide the ability to verify props passed to children
+ Easily render components that rely on [react-router](https://github.com/rackt/react-router)
+ ...plus others

## Setup

```bash
npm install --save-dev expanded-react-test-utils
```

From within your unit test files:
```javascript
var ExpandedReactTestUtils = require('expanded-react-test-utils');
```

## Testing Methods

### mockReactComponent
```javascript
//Mock single component
JasmineSpy mockReactComponent(ReactComponent component, object additionalProps)
//Mock multiple components
JasmineSpy mockReactComponent(object mocks)
```

*Requires global [Jasmine](http://jasmine.github.io/) include for spies*

Fully mocks a component given it's name and replaces it with an empty component at render time. Also allows you to append any additional props to the component which will overwrite values passed to child. This method is ideally called once before all component unit tests are run.

##### Example
```javascript
before(function(){
    //Mock out a the 'Item' React component, and add the provided className to all found instances
    ExpandedReactTestUtils.mockReactComponent('Item');
    //Can also be written as:
    ExpandedReactTestUtils.mockReactComponent({
        Item: {className: 'mocked-item-class'}
    });
});

beforeEach(function(){
    itemList = ReactTestUtils.renderIntoDocument(<ItemList />);
    //All instances of <Item/> within the <ItemList /> component 
    //will now be replaced by empty <div> elements, but will continue 
    //to keep the same props 
});

describe('item tests', function(){
    it('renders correct number of Item components', function(){
        var items = ExpandedReactTestUtils.findRenderedDOMComponentWithSelector(
            itemList, 
            'ItemList'
        );
        expect(items.length).toEqual(3);
    });
});

```
***

### getRouterComponent
```javascript
ReactComponent getRouterComponent(Router, ReactComponent component, object props, string path)
```

Similar to the existing `renderIntoDocument` method, but wraps component within a mock `Router` so all router mixins and functionality work properly. Must provide instance of `react-router` Router component to mock.

##### Example
```javascript
beforeEach(function(){
    itemList = ExpandedReactTestUtils.getRouterComponent(ItemList, {count: 3}, 'results');
    //Render the <ItemList/> component into the DOM, but wrap it in a 
    //mocked router. The path provided will be the route to be matched.
});
```

***

### renderPartial
```javascript
ReactComponent renderPartial(ReactElement partial)
```

With the changes introduced in React 0.14, you can no longer pass in a ReactElement into TestUtils.renderIntoDocument. Instead a React Component must be passed. This method wraps your ReactElement in a mock component and returns the rendered result.

##### Example
```javascript
it('renders proper markup', function(){
    var result = ExpandedReactTestUtils.renderPartial(<div className="test"></div>);
    expect(ExpandedReactTestUtils.findComponentCountWithClassname(result, 'test')).toBeTrue();
});
```

***

### scryRenderedDOMComponentsWithSelector
``` javascript
array scryRenderedDOMComponentsWithSelector(ReactComponent tree, string selector)
```

Find all instances of components in the provided tree that match the provided CSS selector. Read the [CSS Selector Syntax Support][CssSelectorSupport] page  for details on what types of selectors are supported.

##### Example
```javascript
it('contains proper icon classes', function(){
    //Get the list of all elements matching the selector
    var icons = ExpandedReactTestUtils.scryRenderedDOMComponentsWithSelector(
        itemList, 
        'span.user-item'
    );

    expect(icons.length).toEqual(3);
    expect(icons[0].props.title).toEqual('Failed request');
});
```

***

### findRenderedDOMComponentWithSelector
```javascript
ReactComponent findRenderedDOMComponentWithSelector(ReactComponent tree, string selector)
```

Find a single component in the provided tree that matches the provided CSS selector. Will throw an error if zero or more than 1 component is found. Read the [CSS Selector Syntax Support][CssSelectorSupport] page for details on what types of selectors are supported.

##### Example
```javascript
it('contains proper icon classes', function(){
    //Find the correct submit button via selector and simulate a click event
    var submitButton = ExpandedReactTestUtils.findRenderedDOMComponentWithSelector(
        itemList, 
        '.submit-button'
    );

    ReactTestUtils.Simulate.click(submitButton);
});
```

***

### findComponentCountWithClassname
```javascript
bool findComponentCountWithClassname(ReactComponent tree, string className, int count=1)
```

Used to ensure that the correct number of elements with the provided class name are present in the provided tree. Provides a quick way to ensure that the right number of elements are present. The count defaults to 1 if not provided.

##### Example
```javascript
it('contains proper icon classes', function(){
    //Ensure that this tree contains 3 elements with fa-user class
    expect(ExpandedReactTestUtils.findComponentCountWithClassname(
        itemList, 
        'fa-user', 
        3
    )).toEqual(true);
});
```

***

### findComponentCountWithTag
```javascript
bool findComponentCountWithTag(ReactComponent tree, string tagName, int count=1)
```

Used to ensure that the correct number of elements with the provided tag name are present in the provided tree. Provides a quick way to ensure that the right number of elements with a tag are present. The count defaults to 1 if not provided.

#### Example
```javascript
it('contains correct number of span tags', function(){
    //Assert that there are no failure elements in the tree
    expect(ExpandedReactTestUtils.findComponentCountWithTag(
        itemList, 
        'span', 
        3
    )).toEqual(true);
});
```

### findComponentCountWithSelector
```javascript
bool findComponentCountWithSelector(ReactComponent tree, string selector, int count=1)
```

Used to ensure that the correct number of elements with the provided CSS selector are present in the provided tree. Provides a quick way to ensure that the right number of elements are present. The count defaults to 1 if not provided. Read the [CSS Selector Syntax Support][CssSelectorSupport] page for details on what types of selectors are supported.

##### Example
```javascript
it('contains proper icon classes', function(){
    //Assert that there are no failure elements in the tree
    expect(ExpandedReactTestUtils.findComponentCountWithSelector(
        itemList, 
        'span.failure', 
        0
    )).toEqual(true);
});
```

## Additional Examples

Check out the `/app` directory for more in-depth examples of each of these methods. Or also read the presentation in `/slides` for more information.

## License

MIT

[CssSelectorSupport]: CssSelectorSupport.md
