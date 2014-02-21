angular.module("SongVis.controllers").controller("SongCtrl", ["$scope", function($scope) {
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
      // .attr('cy', wiggle(60))
    };
  }

  $scope.queue = function(song) {
    $scope.selectedSongs.push(song);
  };

  $scope.toggleTab = function(tab) {
    $scope.showTab = tab;
  };

}]);
