angular.module("SongVis.directives").directive("progressBar", ["SocketService", function(SocketService) {
  return {
    scope: {
      audio: '='
    },
    restrict: 'E',
    templateUrl: 'templates/progress_bar.html',
    link: function(scope, element, attrs) {
      var progress = 0;

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

      scope.progress = function() {
        if (scope.audio.src && !scope.audio.paused) {
          progress = (scope.audio.currentTime / scope.audio.duration * 100).toFixed(1);
        }
        return {width: progress.toString() + "%"};
      };

      scope.buffered = function() {
        try { // bail if audio.buffered.start(0) throws index less than obj's length
          if (!scope.audio.src) return;
          var css = {};
          css.width = bufferedWidth();
          css.left = bufferedLeftOffset();
          return css;
        } catch (e) {
          return;
        }
      };

      function bufferedWidth() {
        var bufferedSeconds = scope.audio.buffered.end(0) - scope.audio.buffered.start(0);
        return toCSSPercent(bufferedSeconds / scope.audio.duration);
      }

      function bufferedLeftOffset() {
        return toCSSPercent(scope.audio.buffered.start(0)/scope.audio.duration);
      }

      function toCSSPercent(fraction) {
        return (100*fraction).toString() + "%";
      }
    }
  }
}]);
