'use strict';

module.exports.tasks = {
    compass: {
        dist: {
            options: {
                cssDir: 'app/dist',
                sassDir: 'app/sass',
                environment: 'production'
            }
        }
    },

    watch: {
        scripts: {
            files: ['app/sass/**/*.scss'],
            tasks: ['compass']
        }
    },

    shell: {
        cleanCompiledDirectory: {
            command: 'rm -rf app/compiled',
            options: {
                async: true
            }
        },
        compassWatcher: {
            command: 'grunt compass && grunt watch',
            options: {
                async: true
            }
        },
        init: {
            command: './init.sh',
            options: {
                async: false
            }
        },
        jsxCompile: {
            command: 'jsx app/js/ app/compiled/',
            options: {
                async: false
            }
        },
        jsxWatcher: {
            command: 'jsx --watch app/js/ app/compiled/',
            options: {
                async: false
            }
        },
        options: {
            execOptions: {
                detached: true
            }
        }
    }
};
