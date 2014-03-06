angular.module('SongVis.directives').directive('playlist', ["$document", "Visualizer", "SocketService", "$timeout", "AudioPlayer", "KeyMap", function($document, Visualizer, SocketService, $timeout, AudioPlayer, KeyMap) {
  return {
    scope: {
      songs: '=',
      array: '='
    },
    restrict: 'E',
    templateUrl: 'templates/playlist.html',
    link: function(scope, element, attrs) {
      scope.audioPlayer = AudioPlayer;
      scope.audio = AudioPlayer.player;
      scope.$watch('songs', function(newSongs, oldSongs) {
        if (!newSongs) return;
        AudioPlayer.songs = newSongs;
      });

      $document.on('keydown', function(ev) {
        // bail if focused on an input
        if($(ev.target).is(":focus")) return;
        KeyMap(ev.keyCode).call(SocketService, AudioPlayer.songIndex(), AudioPlayer.songs);
      });

      scope.sortableOptions = {
        handle: ".song-handle",
        update: function() {
          $timeout(function() {
            SocketService.send(AudioPlayer.songs);
          },0)
        }
      };

      scope.remove = function(index) {
        AudioPlayer.songs.splice(index, 1);
        SocketService.remove(AudioPlayer.songs);
      };

      scope.pause = function() {
        SocketService.pause();
      }

      scope.playing = function(index) {
        return currentSong() === AudioPlayer.songs[index] &&
          AudioPlayer.playing();
      };

      var currentSong = function() {
        return AudioPlayer.currentSong();
      };

      scope.remotePlay = function(index) {
        AudioPlayer.remotePlay(index);
      };

      scope.play = function(index) {
        SocketService.remotePlay(index);
        scope.remotePlay(index);
      };

    }
  };
}]);
