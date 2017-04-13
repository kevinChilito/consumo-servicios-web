(function() {
    'use strict';

    var args = require('yargs').argv;
    var config = require('./gulp.config')();
    var gulp = require('gulp');
    var plugins = require('gulp-load-plugins')({lazy: true});
    var gulpsync = require('gulp-sync')(gulp);

    function getTask(task) {
        return require('./gulp-tasks/' + task)(gulp, plugins, config, args);
    }

    gulp
        .task('default', ['help'])
        .task('help', plugins.taskListing)
        .task('vet', getTask('vet'))
        .task('jscs-fix', getTask('jscs-fix'))
        .task('plato', getTask('plato'))
        .task('test', ['vet', 'build-templatecache'], getTask('test'))
        .task('autotest', ['build-templatecache'], getTask('autotest'))
        .task('build', gulpsync.sync(['test', 'clean', 'build-inject', 'build-fonts']), getTask('build'))
        .task('build-styles', ['clean-styles'], getTask('build-styles'))
        .task('build-fonts', ['clean-fonts'], getTask('build-fonts'))
        .task('build-templatecache', getTask('build-templatecache'))
        .task('build-inject', gulpsync.sync(['inject-wiredep', 'inject-jsAppDep', 'inject-styles']))
        .task('inject-wiredep', getTask('inject-wiredep'))
        .task('inject-jsAppDep', getTask('inject-jsAppDep'))
        .task('inject-styles', ['build-styles'], getTask('inject-styles'))
        .task('package', ['package-optimize'], getTask('package'))
        .task('package-fonts', getTask('package-fonts'))
        .task('package-images', getTask('package-images'))
        .task('package-optimize',
            gulpsync.sync(['test', 'clean', 'build-inject', 'build-fonts', 'package-fonts', 'package-images']),
            getTask('package-optimize'))
        .task('dist', gulpsync.sync(['package', 'dist-zip', 'dist-upload']))
        .task('dist-zip', getTask('dist-zip'))
        .task('dist-upload', getTask('dist-upload'))
        .task('watch', getTask('watch'))
        .task('clean', getTask('clean'))
        .task('clean-fonts', getTask('clean-fonts'))
        .task('clean-styles', getTask('clean-styles'))
        .task('e2e', args.standalone ? ['package'] : null, getTask('e2e'));
})();
