# Expanded ReactJS Test Utilities

Additional functions beyond the [existing ReactJS test utilities](http://facebook.github.io/react/docs/test-utils.html) to make testing quicker and easier. Adds the following functionality:

+ Fully mock child components yet still provide the ability to verify props passed to children
+ Easily render components that rely on [react-router](https://github.com/rackt/react-router)
+ Find a component via a CSS selector instead of just by class or tag name
+ ...plus others

## Setup

#### Bower Installation

```bash
bower install expanded-react-test-utils --save-dev
```

#### RequireJS Config
In your unit test RequireJS configuration, add the following line

```javascript
ExpandedTestUtils: '/bower_components/expanded-react-test-utils/dist/ExpandedTestUtils.min'
```

## Testing Methods

### mockReactComponent
```javascript
//Mock single component
JasmineSpy mockReactComponent(ReactComponent component, object additionalProps)
//Mock multiple components
JasmineSPy mockReactComponent(object mocks)
```

*Requires global [Jasmine](http://jasmine.github.io/) include for spies*

Fully mocks a component given it's name and replaces it with an empty DIV at render time. Also allows you to append any additional props to the component which will overwrite values passed to child. This method is ideally called once before all component unit tests are run.

##### Example
```javascript
before(function(){
    //Mock out a the 'Item' React component, and add the provided className to all found instances
    mockReactComponent('Item', {className: 'mocked-item-class'});
    //Can also be written as:
    mockReactComponent({
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
        var items = ReactTestUtils.findRenderedDOMComponentWithClass(
            itemList, 
            'mocked-item-class'
        );
        expect(items.length).toEqual(3);
    });
});

```
***

### getRouterComponent
```javascript
ReactComponent getRouterComponent(ReactComponent component, object props, string path)
```

Similar to the existing `renderIntoDocument` method, but wraps component within a mock `Router` so all router mixins and functionality work properly.

##### Example
```javascript
beforeEach(function(){
    itemList = ExpandedTestUtils.getRouterComponent(ItemList, {count: 3}, 'results');
    //Render the <ItemList/> component into the DOM, but wrap it in a 
    //mocked router. The path provided will be the route to be matched.
});
```

***

### scryRenderedDOMComponentsWithSelector
``` javascript
array scryRenderedDOMComponentsWithSelector(ReactComponent tree, string selector)
```

Find all instances of components in the provided tree that match the provided CSS selector. Read the CSS Selector Syntax Support section below for details on what types of selectors are supported.

##### Example
```javascript
it('contains proper icon classes', function(){
    //Get the list of all elements matching the selector
    var icons = ExpandedTestUtils.scryRenderedDOMComponentsWithSelector(
        itemList, 
        'span.user-item .fa-error'
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

Find a single component in the provided tree that matches the provided CSS selector. Will throw an error if zero or more than 1 component is found. Read the CSS Selector Syntax Support section below for details on what types of selectors are supported.

##### Example
```javascript
it('contains proper icon classes', function(){
    //Find the correct submit button via selector and simulate a click event
    var submitButton = ExpandedTestUtils.findRenderedDOMComponentWithSelector(
        itemList, 
        '.submit-section button'
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
    expect(ExpandedTestUtils.findComponentCountWithClassname(
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
    expect(ExpandedTestUtils.findComponentCountWithTag(
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

Used to ensure that the correct number of elements with the provided CSS selector are present in the provided tree. Provides a quick way to ensure that the right number of elements are present. The count defaults to 1 if not provided. Read the CSS Selector Syntax Support section below for details on what types of selectors are supported.

##### Example
```javascript
it('contains proper icon classes', function(){
    //Assert that there are no failure elements in the tree
    expect(ExpandedTestUtils.findComponentCountWithSelector(
        itemList, 
        '.item-list span.failure', 
        0
    )).toEqual(true);
});
```

## CSS Selector Syntax Support

For methods in which a CSS selector is provided, the selector is expected to be fairly basic and just use DOM elements, IDs, and class names, such as `span.userLabel`, `#listContainer`, `.itemlist .itemContent`, or `.actionList tr.odd`. Support for more fancy CSS3 selectors (e.g. pseduo selectors) is not yet present.

## Additional Examples

Check out the `/app` directory for more in-depth examples of each of these methods. Or also read the presentation in `/slides` for more information.

## License

MIT
