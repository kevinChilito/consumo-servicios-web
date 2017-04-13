'use strict';
module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var clientApp = client + 'app/';
    var report = './reports/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];
    var bower = {
        json: require('./bower.json'),
        directory: './src/client/lib/',
        ignorePath: '../..'
    };
    var nodeModules = 'node_modules';

    var config = {
        /**
         * File paths
         */
        // all javascript that we want to vet
        alljs: [
            './src/client/app/**/*.js',
            './src/client/test/**/*.js',
            './src/client/mocks/**/*.js',
            './*.js',
        ],
        build: './www/',
        dist: './dist/',
        client: client,
        app: clientApp,
        css: client + 'css/',
        fonts: client + 'css/fonts/',
        fontsFromBower: bower.directory + 'ionic/fonts/**/*.*',
        html: client + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        img: client + 'img/',
        mocks: client + 'mocks/',
        index: client + 'index.html',
        // app js, with no specs
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js',
        ],
        jsOrder: [
            '**/app.module.js',
            '**/app.mocks.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        sass: client + 'scss/styles.scss',
        cache: client + 'cache/',
        report: report,
        root: root,
        server: server,
        source: 'src/',
        mocksjs: [
            bower.directory + 'angular-mocks/angular-mocks.js',
            client + 'mocks/**/*.js'
        ],
        temp: temp,

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /**
         * plato
         */
        plato: {js: clientApp + '**/*.js'},

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app',
                root: 'app/',
                standalone: false
            }
        },

        /**
         * Bower and NPM files
         */
        bower: bower,
        packages: [
            './package.json',
            './bower.json'
        ],

        /**
         * specs.html, our HTML spec runner
         */
        specRunner: client + specRunnerFile,
        specRunnerFile: specRunnerFile,

        /**
         * The sequence of the injections into specs.html:
         *  1 testlibraries
         *      jasmine setup
         *  2 bower
         *  3 js
         *  4 spechelpers
         *  5 specs
         *  6 templates
         */
        testlibraries: [
            nodeModules + '/jasmine/lib/sinon.js',
            nodeModules + ''
        ],
        specHelpers: [client + 'test/helper/*.js'],
        specs: [clientApp + '**/*.spec.js'],

        /**
         * Node settings
         */
        nodeServer: server + 'app.js',
        defaultPort: '8001',
    };

    // PhoneGap build configuration
    config.phoneGap = {
        appId: '1615333',
        authToken: 'qFoeMP4gaLuFcn3W5wSj',
        debug: {
            dev: true,
            stage: true,
            prod: false
        },
        keys: {
            dev: {ios: 1, android: 1},
            stage: {ios: 2, android: 2},
            prod: {ios: 3, android: 3}
        },
        unlockData: {
            ios: {form: {data: {password: 'aPassword'}}},
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            android: {form: {data: {key_pw: 'aPassword', keystore_pw: 'anotherPassword'}}}
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        }
    };

    config.cordova = {
        dev: {appNamespace: 'dev.app-ionic'},
        stage: {appNamespace: 'stage.app-ionic'},
        prod: {appNamespace: 'prod.app-ionic'}
    };

    config.ensure = {
        environment: function (env, debugmode) {
            if (debugmode) {return 'dev';}

            if (env !== null && env !== undefined) {
                return env.toLowerCase();
            } else {
                return 'dev';
            }
        },
        platform: function (platform) {
            if (platform !== undefined && platform !== null) {
                platform = platform.toLowerCase();
            } else {
                throw 'a platform must be supplied with --platform=ios/android';
            }

            return platform;
        },
        services: function(svc, env) {
            var servicesEnvironment = env;
            if (svc) {
                servicesEnvironment = svc.toLowerCase();
            }

            return servicesEnvironment;
        }
    };

    config.extension = function (platform) {
        var extension = '.zip';
        if (platform === 'android') {
            extension = '.apk';
        } else if (platform === 'ios') {
            extension = '.ipa';
        }

        return extension;
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    /**
     * karma settings
     */
    config.karma = getKarmaOptions();

    return config;

    ////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                config.specHelpers,
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                config.cache + config.templateCache.file
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
        return options;
    }
};
