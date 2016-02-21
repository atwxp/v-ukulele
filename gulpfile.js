/**
 * @file gulp
 * @author wxp201013@163.com
 */

'use strict';
var del = require('del');
var gulp = require('gulp');
var path = require('path');
var webpack = require('gulp-webpack-build');
var browserSync = require('browser-sync').create();

var WEBPACK_CONFIG_FILE = webpack.config.CONFIG_FILENAME;

var onError = function (err) {
    console.log('error:', err.message || err);
};

var args = {};
process.argv.forEach(function (arg, i) {
    if (arg.indexOf('-') === 0) {
        var name = arg.match(/^-(.*)$/)[1];

        if (name) {
            var val = process.argv[i + 1];
            args[name] = (val && val.indexOf('-') !== 0) ? val : '';
        }
    }
});

var isDev = 'e' in args;
var webpackOptions = {};
if (isDev) {
    webpackOptions.devtool = '#source-map';
}

// task 'clean'
gulp.task('clean', function () {
    del('./output');
});

// task 'build'
gulp.task('build', ['clean'], function () {
    return gulp.src(WEBPACK_CONFIG_FILE)
        .pipe(webpack.init({useMemoryFs: true}))
        .pipe(webpack.props(webpackOptions))
        .pipe(webpack.run())
        .pipe(webpack.format({
            version: false,
            timings: true
        }))
        .pipe(webpack.failAfter({
            errors: true,
            warnings: true
        }))
        .pipe(gulp.dest('.'))
});

// tast 'watch'
gulp.task('watch', ['build'], function () {
    browserSync.init({
        server: './'
    });

    gulp.src(WEBPACK_CONFIG_FILE)
        .pipe(webpack.init({useMemoryFs: true}))
        .pipe(webpack.props(webpackOptions))
        .pipe(webpack.watch(function (err, stats) {

            var jsonStats = stats.toJson();

            if (err) {
                return onError(err);
            }

            if (jsonStats.errors.length > 0) {
                jsonStats.errors.forEach(onError);
            }

            gulp.src(this.path, {base: this.base})
                .pipe(webpack.proxy(err, stats))
                .pipe(gulp.dest('.'));

            browserSync.reload();
        }));
});
