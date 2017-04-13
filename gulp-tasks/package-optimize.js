/**
 * Optimize all files, move to a build folder, and inject them into the new index.html
 */
module.exports = function (gulp, plugins, config) {
    'use strict';

    var log = require('./util/log');
    var inject = require('./util/inject')(gulp, plugins);

    return function() {
        log('Optimizing the js, css, and html');

        var assets = plugins.useref.assets({searchPath: './src/client'});
        // Filters are named for the gulp-useref path
        var cssFilter = plugins.filter('**/*.css', {restore: true});
        var jsAppFilter = plugins.filter('**/' + config.optimized.app, {restore: true});
        var jslibFilter = plugins.filter('**/' + config.optimized.lib, {restore: true});

        var templateCache = config.cache + config.templateCache.file;

        return gulp
            .src(config.index)
            .pipe(plugins.plumber())
            .pipe(inject(templateCache, 'templates'))
            .pipe(assets) // Gather all assets from the html with useref
            // Get the css
            .pipe(cssFilter)
            .pipe(plugins.cleanCss())
            .pipe(cssFilter.restore)
            // Get the custom javascript
            .pipe(jsAppFilter)
            .pipe(plugins.ngAnnotate({add: true}))
            .pipe(plugins.uglify())
            .pipe(jsAppFilter.restore)
            // Get the vendor javascript
            .pipe(jslibFilter)
            .pipe(plugins.uglify()) // another option is to override wiredep to use min files
            .pipe(jslibFilter.restore)
            // Take inventory of the file names for future rev numbers
            .pipe(plugins.rev())
            // Apply the concat and file replacement with useref
            .pipe(assets.restore())
            .pipe(plugins.useref())
            // Replace the file names in the html with rev numbers
            .pipe(plugins.revReplace())
            .pipe(gulp.dest(config.build));
    };
};
