angular.module("SongVis.directives").directive("progressBar", ["AudioPlayer", "SocketService", function(AudioPlayer, SocketService) {
  return {
    scope: {},
    restrict: 'E',
    templateUrl: 'templates/progress_bar.html',
    link: function(scope, element, attrs) {
      scope.audioPlayer = AudioPlayer;
      scope.playing = AudioPlayer.playing;
      scope.play = function(index) {
        SocketService.remotePlay(index);
        AudioPlayer.remotePlay(index);
      };

      scope.pause = AudioPlayer.pause;

      scope.index = function() {
        return AudioPlayer.songs.indexOf(AudioPlayer.currentSong());
      }

      scope.playPrevious = function() {
        AudioPlayer.playPrevious();
      };
      scope.playNext = function() {
        AudioPlayer.playNext();
      };

      scope.updateProgress = function(ev) {
        if (!AudioPlayer.player.src) return;
        var songPercent = ev.offsetX / ev.currentTarget.clientWidth;
        AudioPlayer.player.currentTime = songPercent * AudioPlayer.player.duration;
      };

      scope.elapsedTime = function() {
        var currentTime = AudioPlayer.player.currentTime;
        var minutes = ""+parseInt(currentTime/60, 10);
        var seconds = ""+(currentTime % 60).toFixed(0);
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        seconds = ":" + seconds;

        return minutes + seconds;
      };

      scope.progress = function() {
        var progress = (AudioPlayer.player.currentTime / AudioPlayer.player.duration * 100).toFixed(1);
        return {width: progress.toString() + "%"};
      };

      scope.buffered = function() {
        try { // bail if audio.buffered.start(0) throws index less than obj's length
          if (!AudioPlayer.player.src) return;
          var css = {};
          css.width = bufferedWidth();
          css.left = bufferedLeftOffset();
          return css;
        } catch (e) {
          return;
        }
      };

      function bufferedWidth() {
        var bufferedSeconds = AudioPlayer.player.buffered.end(0) - AudioPlayer.player.buffered.start(0);
        return toCSSPercent(bufferedSeconds / AudioPlayer.player.duration);
      }

      function bufferedLeftOffset() {
        return toCSSPercent(AudioPlayer.player.buffered.start(0)/AudioPlayer.player.duration);
      }

      function toCSSPercent(fraction) {
        return (100*fraction).toString() + "%";
      }
    }
  }
}]);
