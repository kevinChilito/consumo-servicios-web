/**
 * Compress images
 */
module.exports = function (gulp, plugins, config) {
    'use strict';

    var log = require('./util/log');

    return function() {
        log('Compressing and copying images');

        return gulp
            .src(config.img + '**/*')
            .pipe(plugins.imagemin({optimizationLevel: 4}))
            .pipe(gulp.dest(config.build + 'img'));
    };
};
