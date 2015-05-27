require.config({
    baseUrl: 'compiled',
    paths: {
        main: 'main',

        // Third Party
        highmaps: '../../bower_components/highmaps/highmaps',
        'highmaps-theme': '../../bower_components/highmaps/themes/dark-unica',
        jquery: '../../bower_components/jquery/dist/jquery.min',
        lodash: '../../bower_components/lodash/lodash.min',
        'montana-map': 'http://code.highcharts.com/mapdata/countries/us/us-mt-all',
        react: '../../bower_components/react/react-with-addons',
        'react-router': '../../bower_components/react-router/build/umd/ReactRouter.min'
    },

    shim: {
        highmaps: {
            deps: ['jquery']
        },
        'highmaps-theme': {
            deps: ['highmaps']
        },
        jquery: {
            exports: '$'
        },
        'montana-map': {
            deps: ['highmaps']
        }
    }
});
