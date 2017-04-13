/**
 * Build everything in config.build directory
 */
module.exports = function (gulp, plugins, config) {
    'use strict';

    var log = require('./util/log');

    return function() {
        log('Building everything');

        var buildPaths = [].concat(
            config.app + '**/*',
            config.css + '**/*',
            config.img + '**/*',
            config.bower.directory + '**/*',
            config.cache + '**/*',
            config.mocks + '**/*',
            config.index
        );

        gulp.src(buildPaths, {base: './src/client'})
            .pipe(gulp.dest(config.build));

        var msg = {
            title: 'gulp build',
            subtitle: 'Deployed to the build folder',
            message: 'Running `ionic serve`, `ionic emulate` ...'
        };

        log(msg);
    };
};
