var path = require('path');
var webpack = require("webpack");

module.exports = {
    entry: {
        app: ['./app/js/main.js']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: 'http://localhost:8280/',
        filename: 'app.js',
    },
    devtool: 'cheap-module-source-map',
    //Fixes for when using npm link to symlink deps
    resolveLoader: {
        modulesDirectories: ['node_modules'],
        fallback: path.join(__dirname, "../", "node_modules")
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015']
                },
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: 'style!css?sourceMap!sass?sourceMap'
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ]
};