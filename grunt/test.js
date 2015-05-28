var port = '9001';
var connect = require('../node_modules/grunt-contrib-connect/tasks/connect');

module.exports = function(grunt, options) {
    return { tasks: {
        /**
         * Jasmine client side JS test tasks.
         */
        jasmine: {
            src: ['app/compiled/**/*.js', '!app/compiled/lib/*',
                '!app/compiled/main.js', '!app/compiled/**/tests/*.js'],
            options: {
                specs: ['app/compiled/**/*.test.js'],
                summary: true,
                keepRunner: true,
                helpers: [
                    'app/compiled/tests/bind-polyfill.js',
                    //'app/compiled/tests/mock-ajax.js',
                    //Expanded Jasmine assertions - https://github.com/JamieMason/Jasmine-Matchers
                    'bower_components/jasmine-expect/dist/jasmine-matchers.js'
                ],
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    replace: false,
                    coverage: 'bin/coverage/app/coverage.json',
                    report: 'bin/coverage/app',
                    thresholds: {
                        lines: 90,
                        statements: 90,
                        branches: 50,
                        functions: 75
                    },
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: 'app/require.config.js',
                        requireConfig: {
                            baseUrl: '.grunt/grunt-contrib-jasmine/app/compiled',
                            paths: {
                                jquery: '../../../../bower_components/jquery/dist/jquery',
                                lodash: '../../../../bower_components/lodash/lodash.min',
                                react: '../../../../bower_components/react/react-with-addons',
                                highmaps: '../../../../bower_components/highmaps/highmaps',
                                'highmaps-theme': '../../../../bower_components/highmaps/themes/dark-unica',
                                'react-router': '../../../../bower_components/react-router/build/umd/ReactRouter.min',
                                ExpandedTestUtils: '../../../../dist/ExpandedTestUtils.min'
                            }
                        }
                    }
                }
            }
        },

        /**
         * ESLint configuration. See http://eslint.org and the .eslintrc file for details.
         */
        eslint:{
            target: [
                'app/**/*.js',
                '!app/compiled/**/*.js',
                '!app/js/stores/data/*.js',
                '!app/js/tests/*.js',
                '!app/**/*.test.js'
            ]
        },

        /**
         * Static web server used to server code coverage result files.
         */
        connect: {
            all: {
                options: {
                    port: port,
                    hostname: "0.0.0.0",
                    keepalive: true
                }
            }
        },

        /**
         * Opens users browser to a specific URL.
         * @type {Object}
         */
        open: {
            test: {
                path: 'http://localhost:<%= connect.all.options.port%>/_SpecRunner.html'
            },
            cov: {
                // Gets the port from the connect configuration
                path: 'http://localhost:<%= connect.all.options.port%>/bin/'
            }
        }
    }};
};
