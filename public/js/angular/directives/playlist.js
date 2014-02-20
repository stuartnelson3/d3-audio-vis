angular.module('SongVis.directives').directive('playlist', [function() {
  return {
    scope: {
      songs: '='
    },
    restrict: 'E',
    templateUrl: 'templates/playlist.html',
    link: function(scope, element, attrs) {
    }
  };
}]);
