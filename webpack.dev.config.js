var webpack = require('webpack')
var webpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');

var port = process.env.PORT || 8080;

var compiler = webpack(webpackConfig);

webpackConfig.entry.index.unshift('webpack-dev-server/client?http://localhost:' + port + '/');

module.exports = function () {
    new webpackDevServer(compiler, {
        publicPath: webpackConfig.output.publicPath,

        // terminal config
        quiet: false,
        noInfo: false,
        stats: {
            colors: true
        }
    }).listen(port, function () {
        console.log('Bundling project, please wait...');
    });
};
