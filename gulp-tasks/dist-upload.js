/**
 * Upload ipa/apk to Testfairy
 */
module.exports = function (gulp, plugins, config, args) {
    'use strict';

    var pgBuild = require('phonegap-build-api');
    var fs = require('fs');
    var request = require('request');

    return function (done) {
        var endpoint = '/apps/' + config.phoneGap.appId;
        var env = config.ensure.environment(args.env, args.debugmode);
        var platform = 'android';
        pgBuild.auth({token: config.phoneGap.authToken}, function (e, api) {
            gulp.src(config.dist + '*.zip').pipe(plugins.tap(function (file, t) {
                var options = {
                    form: {
                        data: {
                            debug: config.phoneGap.debug[env],
                            keys: config.phoneGap.keys[env]
                        },
                        file: file.path
                    }
                };
                api.put(endpoint, options, function() {
                    console.log('upload to PhoneGap Build done');
                    api.post(endpoint + '/build', function() {
                        console.log('build at PhoneGap Build done');
                        var download = setInterval(function() {
                            api.get(endpoint, function (ee, data) {
                                var status = !ee && data ? data.status[platform] : null;
                                if (status === 'complete') {
                                    var filePath = config.dist + data.package + '.' +
                                        data.version + config.extension(platform);
                                    var write = api.get(endpoint + '/' + platform).pipe(fs.createWriteStream(filePath));
                                    clearInterval(download);
                                    write.on('finish', function () {
                                        var form = {
                                            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                                            'api_key': '6a5929b229bb38a371c54f079e2fb529d6846d22',
                                            'file': fs.createReadStream(filePath),
                                            'video': 'wifi',
                                            'auto-update': 'on'
                                            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                                        };

                                        endpoint = 'https://app.testfairy.com/api/upload/';
                                        request.post(
                                            {
                                                url: endpoint,
                                                formData: form
                                            },
                                            function (err, httpResponse, body) {
                                                //requestCallBack(err, httpResponse, body);
                                                console.log('testfairy response:' + httpResponse + body);
                                                done();
                                            });
                                    });
                                }
                                else {
                                    console.log('Cannnot download application[' + platform + ']: ' + status);
                                }
                            });
                        }, 5000);
                    });
                });
                return t;
            }));
        });
    };
};
