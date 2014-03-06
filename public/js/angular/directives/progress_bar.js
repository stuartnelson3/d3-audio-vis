angular.module("SongVis.directives").directive("progressBar", ["AudioPlayer", function(AudioPlayer) {
  return {
    scope: {},
    restrict: 'E',
    templateUrl: 'templates/progress_bar.html',
    link: function(scope, element, attrs) {
      scope.playing = AudioPlayer.playing;
      scope.play = AudioPlayer.play;
      scope.pause = AudioPlayer.pause;
      scope.audio = AudioPlayer.player;

      scope.updateProgress = function(ev) {
        if (!scope.audio.src) return;
        var songPercent = ev.offsetX / ev.currentTarget.clientWidth;
        scope.audio.currentTime = songPercent * scope.audio.duration;
      };

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
        var progress = (scope.audio.currentTime / scope.audio.duration * 100).toFixed(1);
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
