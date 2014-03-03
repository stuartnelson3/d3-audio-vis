angular.module("SongVis.directives").directive("progressBar", [function() {
  return {
    scope: {
      audio: '='
    },
    restrict: 'E',
    templateUrl: 'templates/progress_bar.html',
    link: function(scope, element, attrs) {
      scope.elapsedTime = function() {
        var currentTime = scope.audio.currentTime;
        var minutes = ""+parseInt(currentTime/60, 10);
        var seconds = ""+(currentTime % 60).toFixed(0);
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        seconds = ":" + seconds;

        return minutes + seconds;
      };


      //
      // audio.duration gives total length in seconds
      // scope.audio.buffered.start(0) for beginning point of buffer
      // position for start of buffered line. this/duration = percentage of line to start
      // scope.audio.buffered.end(0) for current end of buffer
      // render the grey "buffered" line with this guy
      // this/duration = percentage of line where it is up to
      //
      // audio.currentTime gives current position in seconds

    }
  }
}]);
