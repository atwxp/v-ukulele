/**
 * @file   util
 * @author wxp201013@163.com
 */

var toLen = function (s, len) {
    return (new Array(len + 1).join('0') + s).slice(-len);
};

module.exports = {
    toLen: toLen
};
