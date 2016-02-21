/**
 * @file Filter
* @author wxp201013@gmail.com
 */

var util = require('../util/util');

module.exports = function (Vue) {

    /**
     * 格式化时长为自定义格式
     *
     * @param {number} time 时长
     * @param {string} fmt  格式化信息
     *
     * @test
     *      timeFormat(80, 'mm:ss') => 01:20
     *      timeFormat(80, 'm:s')   => 1:20
     *      timeFormat(180, 'm:s')  => 3:0
     */
    Vue.filter('timeFormat', function (time, fmt) {
        var o = {
            'h+': Math.floor(time / 3600),
            'm+': Math.floor(time % 3600 / 60),
            's+': Math.floor(time % 60)
        };

        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                fmt = fmt.replace(new RegExp('' + k), function (match) {

                    if (match.length == 1) {
                        return o[k];
                    }

                    return util.toLen(o[k], match.length);
                });
            }
        }

        return fmt;
    });

    Vue.filter('keyCount', function (obj) {
        return Object.keys(obj).length;
    });
};
