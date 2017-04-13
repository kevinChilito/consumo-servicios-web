angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {


    $scope.loginData = {};

  })

  .controller('PlaylistsCtrl', function ($scope, $http) {
    $scope.playlists = [];
    $http({
      method: 'GET',
      dataType: 'json',
      url: 'http://www.encicla.gov.co/status/',
      headers: 'Authorization'
    }).then(function (response) {
      var records = response.data.stations
      console.log(records)
      for (var i = 0; i < records.length; i++) {
        var items = records[i].items
        for (var j = 0; j < items.length; j++) {
          var opciones = {
            title: records[i].desc,
            id: records[i].id,
            desc: items[j].description,
            direc: items[j].address
          }
          $scope.playlists.push(opciones);
        }
      }
    }, function (response) {
      console.log(response)
    });


  })
  .controller('MapCtrl', function ($scope, $ionicLoading, $compile, $http) {
    var locations = [];
    function data() {
      $http({
        method: 'GET',
        dataType: 'json',
        url: 'http://www.encicla.gov.co/status/',
        headers: 'Authorization'
      }).then(function (response) {
        var records = response.data.stations
        console.log(records)
        for (var i = 0; i < records.length; i++) {
          var items = records[i].items
          for (var j = 0; j < items.length; j++) {
            var latLng = {
              lat: items[j].lat,
              lng: items[j].lon,
              desc: items[j].description
            }
            locations.push(latLng);
          }
        }
        initialize()
        console.log(locations)
      }, function (response) {
        console.log(response)
      });
    }
    function initialize() {
      var myLatlng = new google.maps.LatLng(locations[0].lat, locations[0].lng);
      var mapOptions = {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      let bound = google.maps.LatLngBounds = new google.maps.LatLngBounds();
      let point = []
      for (var b = 0; b < locations.length; b++) {
        bound.extend(new google.maps.LatLng(locations[b].lat, locations[b].lng))
      }
      var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
      map.fitBounds(bound);
      var marker;
      for (var m = 0; m < locations.length; m++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[m].lat, locations[m].lng),
          title: locations[m].desc,
          map: map
        });
      }
      $scope.map = map;
    }
    google.maps.event.addDomListener(window, 'load', data);
    $scope.centerOnMe = function () {
      if (!$scope.map) {
        return;
      }
      var puntosLinea = []
      for (var l = 0; l < locations.length; l++) {
        puntosLinea.push(new google.maps.LatLng(locations[l].lat, locations[l].lng))
      }
      var iconArrowPol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
      };
      var flightPath = new google.maps.Polyline({
        path: puntosLinea,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [{
          icon: iconArrowPol,
          repeat: '35px',
          offset: '100%'
        }]
      });
      flightPath.setMap($scope.map);
    };

    $scope.clickTest = function () {
      alert('')
    };
  })
  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  });
