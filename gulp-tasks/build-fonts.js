/**
 * Copy fonts
 */
module.exports = function (gulp, plugins, config) {
    'use strict';

    var log = require('./util/log');

    return function() {
        log('Copying fonts');

        return gulp
            .src(config.fontsFromBower)
            .pipe(gulp.dest(config.fonts));
    };
};
