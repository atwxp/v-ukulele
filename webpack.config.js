/**
 * @file webpack config file
 * @author wxp201013@163.com
 */

'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var abs = function (p) {
    return path.join(__dirname, p);
};

var src = abs('src');
var output = abs('output');

module.exports = {
    context: src,

    entry: './app.js',

    output: {
        path: output,

        filename: 'app.js'
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!less')
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                loader: 'url',
                query: {
                    // limit for base64 inlining in bytes, < 10K
                    limit: 10000,
                    // custom naming format if file larger than limit
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg)([a-z0-9\?#]+)?$/,
                // loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
                loader: 'file-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            }
        ],
        noParse: /\.min\.js/
    },

    // @see: http://vuejs.github.io/vue-loader/configurations/extract-css.html
    vue: {
        loaders: {
            css: ExtractTextPlugin.extract('css'),
            less: ExtractTextPlugin.extract('css!less')
        }
    },

    plugins: [
        new ExtractTextPlugin('app.css'),

        // 生产环境下，警告在代码压缩中会被删除
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],

    resolve: {
        extensions: ['', '.js', '.vue']
    }
};
