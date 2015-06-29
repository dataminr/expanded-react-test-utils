# CSS Selector Syntax Support

For test methods which take a CSS selector string, the following different types of CSS selectors are supported. These types can be used in combination in a single string, just like in normal CSS.

### Element name
Elements can be queried based on their tag name for DOM nodes, or by their `displayName` for React elements.

### ID
Elements which have an ID prop can be queried directly using the CSS ID selector, `#{id}`.

### Class Name
Elements which have a `className` prop can be queried via CSS class name selectors using `.{className}`. You can select elements which have multiple class names just as you can in CSS using `.{className1}.{className2}`.

### Pseudo Selectors
Two different pseudo selectors are supported, `:checked` and `:empty`. 

##### `:checked`
The `:checked` pseudo selector will find all input elements of type radio or checkbox that have the `checked` or `defaultChecked` prop present. The prop merely needs to exist, even if the value is false, the element will be returned (as is the behavior with CSS).

##### `:empty`
The `:empty` pseudo selector will find all elements which have no children. This is true of both purely empty elements (e.g. `<span></span>`) or those whose children evaluate to null (e.g. `<span>{message}</span>` where message is null, empty array, etc).

### Attribute Selectors 
You can also query elements by their attributes/props directly. CSS queries that you commonly find such as `input[type=text]` also work in this library. Attribute queries support nearly the full library of selector operators available in CSS:

+ `span[lang]` - Finds all spans which have a lang attribute, regardless of value.
+ 'input[type=button]' - Finds all input elements whose `type` attribute is equal to 'button'.
+ `span[lang~=en-US]` - Finds all span tags with a lang attribute whose value is a whitespace-separated list of words, one of which is exactly "en-US".
+ `a[href^=http]` - Finds all anchor tags where the href starts with "http".
+ `a[href$=gov]` - Finds all anchor tags where the href attribute ends with "gov".
+ `form[action*=get]` - Finds all form tags where the action attribute contains the text 'get'.

Attribute selectors also work as you'd expect when using React elements instead of DOM tag names. This allows you to query for sub-components you're rendering that have specific attributes.

+`UserDetails[name=John]`
+`PageMessage[type=error]`
+`UserItem[id=39]`

#### Data Type Conversion
When querying attribute values, attempts will be made to convert the value passed in to the type of the attribute being checked. If the attribute is a number, for example, we will convert the query value to a number for comparison. This is true for boolean and null values as well.

+ `SubComponent[count=10]` - Will match `<SubComponent count={10} />`
+ `SubComponent[hide=true]` - Will match `<SubComponent hide={true} />`
+ `SubComponent[initialData=null]` - Will match '<SubComponent initialData={null}/>'

#### Examples
Check out the unit tests under the `/app/js/components/tests` directory to see examples of these in usage.

