angular.module("SongVis.controllers").controller("SongCtrl", ["$scope", "$http", "$document", "SortService", "SocketService", function($scope, $http, $document, SortService, SocketService) {
  $document.on('keydown', ".js-search-form", function(ev) {
    if (ev.keyCode === 13) { // Enter keycode
      $scope.searchServers();
    }
  });

  $scope.audio = new Audio();
  SocketService.scope = $scope;
  $scope.songs = [];
  $scope.selectedSongs = [];
  $scope.servers = [location.origin];
  $scope.showTab = 'search';
  $scope.data = [];
  for (var i = 0; i < 16; $scope.data.push(i++)) {}

  $scope.update = function(d3Selection) {
    return function(array) {
      if (!array || $scope.showTab !== 'vis') return;
      var wiggle = function(initial) {
        return function(d,i) {
          var amnt = (array[i]*0.4)|0
          var evener = 1;
          if (i > 2) evener = i;
          return amnt * evener;
        };
      };
      d3Selection//.transition().duration(100)
      // .attr('cx', function(d,i) { return i*30 + 20; })
      .attr('r', wiggle(0))
    };
  }

  $scope.queue = function(song) {
    $scope.selectedSongs.push(song)
    SocketService.send($scope.selectedSongs);
  };

  $scope.toggleTab = function(tab) {
    $scope.showTab = tab;
  };

  $scope.activeTab = function(tab) {
    return $scope.showTab === tab;
  };

  $scope.sortService = new SortService(['+Artist', 'Album', 'Track']);

  $scope.variableWidth = function() {
    var css = {}
    if ($scope.selectedSongs.length) {
      css = {width: "75%"};
    }
    return css;
  };

  $scope.addServer = function(url) {
    // add check for http://
    $scope.servers.push("http://" + url);
  };

  $scope.removeServer = function(index) {
    $scope.servers.splice(index, 1);
  };

  $scope.searchServers = function() {
    $scope.songs = [];
    $scope.servers.forEach(function(server) {
      $http.get(server + "/search", {params: {search: $scope.searchText}})
      .then(processServerResponse)
    })
  };

  function processServerResponse(payload) {
    var songs = payload.data;
    $scope.songs.push.apply($scope.songs, songs);
  }

  $scope.addServer('stuart.local:4000')
}]);
