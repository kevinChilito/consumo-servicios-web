/**
 * Generate cucumber-protractor html report
 */
module.exports = function (gulp) {
    'use strict';

    var reporter = require('gulp-protractor-cucumber-html-report');

    return function() {
        gulp.src('./reports/e2e/cucumber-test-results.json')
            .pipe(reporter({
                dest: 'reports/e2e'
            })
        );
    };
};
