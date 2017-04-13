/**
 * Wire-up the js app dependencies
 */
module.exports = function (gulp, plugins, config, args) {
    'use strict';

    var log = require('./util/log');
    var inject = require('./util/inject')(gulp, plugins);

    return function () {
        log('Wiring the js app dependencies into the html');

        // Only include stubs if flag is enabled
        var js = args.mocks ? [].concat(config.js, config.mocksjs) : config.js;

        return gulp
            .src(config.index)
            .pipe(inject(js, '', config.jsOrder))
            .pipe(gulp.dest(config.client));
    };
};
