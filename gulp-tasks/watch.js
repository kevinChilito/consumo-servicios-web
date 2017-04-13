/**
 * Realiza un build y pasa a observar cambios para re-build
 */
module.exports = function (gulp, plugins, config, args) {
    'use strict';

    var vinylPaths = require('vinyl-paths');
    var del = require('del');
    var templateCache = require('./build-templatecache');
    var injectJsAppDep = require('./inject-jsAppDep');

    return function() {
        // Si se incluye --build=false no se contruye la aplicación en www
        if (args.build === undefined || args.build === 'true') {
            gulp.start('build');
        }

        // Se crea un filtro para incluir todos los ficheros que son añadidos o modificados
        // Es decir, todos menos aquellos que son borrados ('unlink')
        var notDeletedFilter = plugins.filter(
          function(file) {
              return file.event !== 'unlink' && file.event !== 'unlinkDir';
          },
          {restore: true}
        );

        // El método restore obtiene los ficheros que no cumplen el filtro, es decir, los que
        // han sido borrados ('unlink') del origen, se pasan al pipe destino y se borran
        notDeletedFilter.restore
            .pipe(gulp.dest('www'))
            .pipe(vinylPaths(function(file, cb) {
                del(file, cb);
            }));

        // Si se modifica el fichero sass se generan de nuevos los css
        gulp.watch([config.sass], ['build-styles']);

        // Si se modifica, crea o borran templates se genera de nuevo la cache de templates
        plugins.watch('src/client/app/**/*.html', {events: ['add', 'change', 'unlink', 'unlinkDir']}, templateCache);

        // Si se modifican, crean o borran js se realiza de nuevo la inyección en index.html
        var source = [].concat('src/client/app/**/*.js', 'src/client/mocks/**/*.js');
        plugins.watch(source, {events: ['add', 'change', 'unlink', 'unlinkDir']}, injectJsAppDep);

        // Se observan todos los ficheros de src/client y se copian a la carpeta build aquellos que
        // son modificados o añadidos para mantenerla sincronizada
        plugins.watch('src/client/**/*', {events: ['add', 'change', 'unlink', 'unlinkDir']})
            .pipe(notDeletedFilter)
            .pipe(gulp.dest(config.build));
    };
};
