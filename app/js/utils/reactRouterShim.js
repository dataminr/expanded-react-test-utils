define(['react'], function(React) {
    'use strict';

    // For the react-router to work, React has to be exposed to the window object.
    // The developers of the react-router only support cjs and globals.
    // https://github.com/rackt/react-router/issues/265
    // This is set up as a dependency of the react-router in require.config.js.
    window.React = React;
});
