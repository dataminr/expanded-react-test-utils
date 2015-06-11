var port = '9001';
var connect = require('../node_modules/grunt-contrib-connect/tasks/connect');
var jasmineConfig = {
    src: ['app/compiled/**/*.js', '!app/compiled/lib/*',
          '!app/compiled/main.js', '!app/compiled/**/tests/*.js'],
    specs: ['app/compiled/**/*.test.js'],
    helpers: [
        'app/compiled/tests/bind-polyfill.js',
        // Expanded Jasmine assertions - https://github.com/JamieMason/Jasmine-Matchers
        'bower_components/jasmine-expect/dist/jasmine-matchers.js'
    ],
    requireConfigFile: 'app/require.config.js',
    compiledDir: 'app/compiled',
    paths: {
        ExpandedTestUtils: '../../dist/ExpandedTestUtils.min'
    }
};

module.exports = function(grunt, options) {
    return { tasks: {
        /**
         * Jasmine client side JS test tasks.
         */
        jasmine: {
            debug: {
                src: jasmineConfig.src,
                options: {
                    specs: jasmineConfig.specs,
                    keepRunner: true,
                    helpers: jasmineConfig.helpers,
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: jasmineConfig.requireConfigFile,
                        requireConfig: {
                            baseUrl: jasmineConfig.compiledDir,
                            paths: jasmineConfig.paths
                        }
                    }
                }
            },

            cov: {
                src: jasmineConfig.src,
                options: {
                    specs: jasmineConfig.specs,
                    summary: true,
                    helpers: jasmineConfig.helpers,
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        replace: false,
                        coverage: 'bin/coverage/app/coverage.json',
                        report: 'bin/coverage/app',
                        thresholds: grunt.cli.tasks[0] === "test" ? {
                            lines: 90,
                            statements: 90,
                            branches: 50,
                            functions: 75
                        } : {},
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            requireConfigFile: jasmineConfig.requireConfigFile,
                            requireConfig: {
                                baseUrl: '.grunt/grunt-contrib-jasmine/' + jasmineConfig.compiledDir,
                                paths: jasmineConfig.paths,
                                callback: function () {
                                    // path modification for bower dependencies
                                    define('instrumented', ['module'], function (module) {
                                        return module.config().src;
                                    });
                                    require(['instrumented'], function () {
                                        var oldLoad = requirejs.load;
                                        requirejs.load = function (context, moduleName, url) {
                                            if (url.indexOf('bower_components') !== -1 || url.indexOf('dist') !== -1) {
                                                url = url.substring(48);
                                            }
                                            return oldLoad.apply(this, [context, moduleName, url]);
                                        };
                                    });
                                }
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
