/**
 * Copia imagenes al directorio de empaquetado
 */
module.exports = function (gulp, plugins, config) {
    'use strict';

    var log = require('./util/log');

    return function() {
        log('Packaging fonts');

        return gulp.src(config.fonts + '**/*', {base: './src/client'})
            .pipe(gulp.dest(config.build));
    };
};
