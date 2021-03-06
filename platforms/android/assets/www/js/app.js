angular.module('starter', ['ionic', 'starter.controllers',])

  .constant('ApiEndpoint', {
    url: 'http://localhost:8100/api'
  })
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.posicionesMapa', {
        url: '/posicionesMapa',
        views: {
          'menuContent': {
            templateUrl: 'templates/posicionesMapa.html',
            controller: 'MapCtrl'
          }
        }
      })
      .state('app.lista', {
        url: '/lista',
        views: {
          'menuContent': {
            templateUrl: 'templates/lista.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

    $urlRouterProvider.otherwise('/app/posicionesMapa');
  });
