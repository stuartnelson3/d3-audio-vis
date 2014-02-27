angular.module("SongVis.controllers").controller("SongCtrl", ["$scope", "$http", "SortService", "SocketService", function($scope, $http, SortService, SocketService) {
  var socket = SocketService;
  socket.scope = $scope;

  $scope.songs = songs;
  $scope.selectedSongs = [];
  $scope.showTab = 'search';
  $scope.data = [];
  for (var i = 0; i < 32; $scope.data.push(i++)) {}

  $scope.update = function(d3Selection) {
    return function(array) {
      if (!array || $scope.showTab !== 'vis') return;
      var wiggle = function(initial) {
        return function(d,i) {
          var amnt = (array[i]*0.2)|0
          return amnt;
          // amnt = Math.pow(amnt, 2) // whooa!
          // if (amnt > 15) {
          //   return initial + amnt;
          // } else {
          //   return 5;
          // }
        };
      };
      d3Selection.transition().duration(50)
      .attr('cx', function(d,i) { return i*30 + 20; })
      .attr('r', wiggle(0))
    };
  }

  $scope.queue = function(song) {
    $scope.selectedSongs.push(song);
    socket.send($scope.selectedSongs);
  };

  $scope.$watch(function() {
    return socket.songs
  }, function(newSongs, oldSongs) {
    if (!newSongs) return;
    $scope.selectedSongs = newSongs;
  });

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
      css = {width: "79%"};
    }
    return css;
  };

  $scope.addServer = function(url) {
    // add check for http://
    url = "http://" + url;
    $http.get(url).then(function(data) {
      var songs = data.data.Songs;
      songs.forEach(function(s) {
        s.Url = url+s.Path;
      });
      $scope.songs.push.apply($scope.songs, songs);
    }, function(failure) {
      console.log("An error occurred, bummer.");
    });
  };

  $scope.addServer('localhost:4000')
}]);
