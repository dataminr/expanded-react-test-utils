module.exports.tasks = {
    /**
     * Shell command for compiling JS and SCSS and moving to dist directory. Also removes all unit test files.
     */
    shell:{
        build: {
            command: [
                //'grunt test',
                'rm -rf dist',
                'mkdir dist',
                'chmod 777 dist',
                'node_modules/babel-cli/bin/babel.js --presets="react,es2015" lib --out-dir dist',
            ].join('&&'),
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

