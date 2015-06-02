'use strict';

module.exports.tasks = {
    /**
     * Compass compile task. Compiles everything under the app/sass
     * directory into a single file in app/dist
     */
    compass: {
        dist: {
            options: {
                cssDir: 'app/dist',
                sassDir: 'app/sass',
                environment: 'production'
            }
        }
    },

    /**
     * RequireJS build task. Compiles test utility file and dependency
     * files (except 3rd party code) into a single file under dist
     */
    requirejs: {
        compile: {
            options: {
                baseUrl: "lib",
                paths: {
                    CssSelectorParser: "CssSelectorParser",
                    TestLocation: "TestLocation",
                    react: "empty:",
                    "react-router": "empty:",
                    "lodash": "empty:"
                },
                name: "ExpandedTestUtils",
                out: "dist/ExpandedTestUtils.min.js",
                optimize: 'none'
            }
        }
    },

    /**
     * File watcher for Sass and RequireJS compile steps. Automatically
     * rebuilds sass and test utility file on change.
     */
    watch: {
        sass: {
            files: ['app/sass/**/*.scss'],
            tasks: ['compass']
        },
        compile: {
            files: ['lib/*.js'],
            tasks: ['requirejs']
        }
    },

    shell: {
        cleanCompiledDirectory: {
            command: 'rm -rf app/compiled'
        },
        init: {
            command: './init.sh'
        },
        jsxCompile: {
            command: 'jsx app/js/ app/compiled/'
        },
        jsxWatcher: {
            command: 'jsx --watch app/js/ app/compiled/ &',
            options: {
                async: true
            }
        }
    }
};
