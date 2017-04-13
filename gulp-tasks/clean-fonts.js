/**
 * Remove all fonts from the client folder
 */
module.exports = function (gulp, plugins, config) {
    'use strict';

    var del = require('del');

    return function(done) {
        del(config.fonts + '**/*', done);
    };
};
