/*global _FILTER_REGEX_*/
var context = require.context('./app/js', true, _FILTER_REGEX_);
context.keys().forEach(context);