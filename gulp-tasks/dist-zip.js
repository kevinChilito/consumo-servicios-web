/**
 * Comprime el paquete de la aplicación en dist
 */
module.exports = function (gulp, plugins, config, args) {
    'use strict';

    var moment = require('moment');

    return function() {
        var packagePaths = [].concat(
            config.build + '/**/*',
            './config.xml',
            './plugins/**/*',
            './hooks/**/*'
        );

        var env = config.ensure.environment(args.env, args.debugmode);
        var timestamp = moment().format('YYYYMMDDhhmmss');
        var archiveName = config.cordova[env].appNamespace + '_' + timestamp + '.zip';

        return gulp.src(packagePaths, {base: './'})
            .pipe(plugins.zip(archiveName))
            .pipe(gulp.dest(config.dist));
    };
};
