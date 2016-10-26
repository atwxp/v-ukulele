/**
 * @file webpack config file
 * @author wxp201013@163.com
 */

'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var abs = function () {
    var p = [__dirname].concat([].slice.call(arguments));

    return path.resolve.apply(null, p);
};

var srcPath = abs('src');

var outputPath = abs('output');

var assetsPath = isProduction ? '/' : '/';

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    context: srcPath,

    entry: {
        index: ['./index.js']
    },

    output: {
        path: outputPath,

        filename: '[name].js',

        publicPath: assetsPath,

        sourceMapFilename: '[file].map'
    },

    devtool: isProduction ? null : 'source-map',

    module: {
        preLoaders: [
            // {
            //     test: /\.js$/,
            //     loader: 'fecs-loader',
            //     exclude: /node_modules/
            // }
        ],

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

    // https://github.com/vuejs-templates/webpack/tree/master/template/build
    vue: {
        loaders: {
            css: ExtractTextPlugin.extract('vue-style', 'css'),
            less: ExtractTextPlugin.extract('vue-style', 'css!less')
        }
    },


    plugins: (function () {
        return (isProduction
            ? [
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }),

                new webpack.BannerPlugin('(c) ' + new Date().getFullYear() + ' wxp. All Rights Reserved')
            ]
            : []
            )
            .concat([
                new ExtractTextPlugin('[name].css'),

                new HtmlWebpackPlugin({
                    template: 'index.html'
                }),

                new CopyWebpackPlugin([{
                    from: 'assets',
                    to: 'assets'
                }])
            ]);
    })(),

    resolve: {
        root: srcPath,

        extensions: ['', '.vue', '.js']
    }
};
