'use strict';

module.exports = function(grunt) {

    var configs = require('load-grunt-configs')(grunt, {
        config : {
            src: "grunt/*.js"
        }
    });

    grunt.initConfig(configs);
    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    /**
     * Default task to be used by developers. Clean up compiled directories, compile JSX/SASS and
     * start watchers for compile-on-file-change
     */
    grunt.registerTask('default', [
        'webpack-dev-server:start'
    ]);

    /**
     * Same as default but also runs init to populate NPM/Bower
     */
    grunt.registerTask('init', [
        'shell:init',
        'default'
    ]);

    /**
     * Runs all tests with static analysis and coverage.
     */
    grunt.registerTask('test',[
        'eslint',
        'karma'
    ]);

    /**
     * Runs tests and opens users browser to coverage report
     */
    grunt.registerTask('test:cov', [
        'test',
        'open:cov',
        'connect'
    ]);

    /**
     * Compiles all unit test code into ES5 using babel and moves to dist directory
     */
    grunt.registerTask('build', [
        'shell:build',
    ]);
};
