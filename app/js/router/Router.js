define(function(require) {
    'use strict';

    var Routes = require('router/Routes');
    var Router = require('react-router');

    return Router.create({
        routes: Routes,
        location: Router.HistoryLocation
    });
});
