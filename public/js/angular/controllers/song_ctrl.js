angular.module("SongVis.controllers").controller("SongCtrl", ["$scope",
                                                 "$http", "$document",
                                                 "SortService",
                                                 "SocketService",
                                                 "AudioPlayer",
                                                 function($scope, $http,
                                                          $document,
                                                          SortService,
                                                          SocketService,
                                                          AudioPlayer) {
  $document.on('keydown', ".js-search-form", function(ev) {
    if (ev.keyCode === 13) { // Enter keycode
      $scope.searchServers();
    }
  });

  $scope.songs = [];
  $scope.servers = [location.origin];
  $scope.showTab = 'search';
  $scope.audioPlayer = AudioPlayer;

  $scope.queue = function(song) {
    AudioPlayer.songs.push(song)
    SocketService.send(AudioPlayer.songs);
  };

  $scope.toggleTab = function(tab) {
    $scope.showTab = tab;
  };

  $scope.activeTab = function(tab) {
    return $scope.showTab === tab;
  };

  $scope.sortService = new SortService(['+artist', 'album', 'track']);

  $scope.variableWidth = function() {
    var css = {}
    if (AudioPlayer.songs.length) {
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

  $scope.addServer('localhost:4000')
}]);
