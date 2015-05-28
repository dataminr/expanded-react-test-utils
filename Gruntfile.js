'use strict';

module.exports = function(grunt) {

    var configs = require('load-grunt-configs')(grunt, {
        config : {
            src: "grunt/*.js"
        }
    });

    grunt.initConfig(configs);

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-shell-spawn');

    /**
     * Default task to be used by developers. Clean up compiled directories, compile JSX/SASS and
     * start watchers for compile-on-file-change
     */
    grunt.registerTask('default', [
        'shell:cleanCompiledDirectory',
        'compass',
        'requirejs',
        'shell:jsxWatcher',
        'watch'
    ]);

    /**
     * Same as default but also runs init to populate NPM/Bower
     */
    grunt.registerTask('init', [
        'shell:init',
        'default'
    ]);

    /**
     * Runs all tests
     */
    grunt.registerTask('test',[
        'shell:cleanCompiledDirectory',
        'shell:jsxCompile',
        'eslint',
        'jasmine:cov'
    ]);

    /**
     * Run jasmine tests and open browser to run and view results there. Useful to
     * help debug tests by being able to open dev tools and add debugger statements.
     */
    grunt.registerTask('jasmineDebug', [
        'jasmine:debug',
        'open:test',
        'connect'
    ]);

    /**
     * Runs tests and opens users browser to coverage report
     */
    grunt.registerTask('test:cov', [
        'test',
        'open:cov',
        'connect'
    ]);
};
