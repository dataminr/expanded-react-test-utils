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
     * Compiles all unit test code into ES5 using babel and moves to dist directory
     */
    grunt.registerTask('build', [
        'shell:build',
    ]);
};
