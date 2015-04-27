require.config({
    baseUrl: 'compiled',
    paths: {
        main: 'main',

        // Third Party
        flux: '../../bower_components/flux/dist/Flux',
        jquery: '../../bower_components/jquery/dist/jquery',
        lodash: '../../bower_components/lodash/dist/lodash',
        react: '../../bower_components/react/react-with-addons',
        'react-router': '../../bower_components/react-router/build/global/ReactRouter.min',
        reactRouterShim: 'utils/reactRouterShim'
    },
    shim: {
        'reactRouterShim': {
            exports: 'React'
        },
        'react-router': {
            deps:    ['reactRouterShim'],
            exports: 'ReactRouter'
        }
    }
});
