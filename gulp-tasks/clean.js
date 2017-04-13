/**
 * Remove all files from the build, reports and dist folders
 */
module.exports = function (gulp, plugins, config) {
    'use strict';

    var del = require('del');
    var log = require('./util/log');

    return function(done) {
        var delconfig = [].concat(config.build + '**/*', config.dist, config.report, './screenlog.*');
        log('Cleaning: ' + plugins.util.colors.blue(delconfig));
        del(delconfig, done);
    };
};
