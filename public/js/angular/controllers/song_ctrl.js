angular.module("SongVis.controllers").controller("SongCtrl", ["$scope", function($scope) {
  $scope.songs = songs;

  $scope.data = [];
  for (var i = 0; i < 32; $scope.data.push(i++)) {}

  $scope.update = function(d3Selection) {
    return function(array) {
      if (!array) return;
      var wiggle = function(initial) {
        return function(d,i) {
          var amnt = (array[i]*0.2)|0
          amnt = Math.pow(amnt, 2) // whooa!
          if (amnt > 15) {
            return initial + amnt;
          } else {
            return 5;
          }
        };
      };
      d3Selection.transition().duration(0)
      .attr('cx', function(d,i) { return i*30 + 20; })
      .attr('r', wiggle(0))
      // .attr('cy', wiggle(60))
    };
  }

  $scope.selectedSongs = [];

  $scope.queue = function(song) {
    $scope.selectedSongs.push(song);
  };

}]);
