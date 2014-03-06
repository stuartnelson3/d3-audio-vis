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

      SocketService.playlistScope = scope;
      $document.on('keydown', function(ev) {
        // bail if focused on an input
        if($(ev.target).is(":focus")) return;
        KeyMap(ev.keyCode).call(AudioPlayer);
      });

      scope.sortableOptions = {
        handle: ".song-handle",
        update: function() {
          $timeout(function() {
            SocketService.send(scope.songs);
          },0)
        }
      };

      var visualizer = new Visualizer();
      visualizer.setupAudioNodes();
      scope.context = visualizer.audioContext;
      scope.analyser = visualizer.analyser;
      scope.javascriptNode = visualizer.javascriptNode;

      var source = scope.context.createMediaElementSource(scope.audio);
      source.connect(scope.analyser);
      scope.analyser.connect(scope.context.destination);

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

      var songUrl = function(index) {
        return AudioPlayer.songs[index].url;
      };

      var setCurrentSong = function(index) {
        AudioPlayer.setCurrentSong(AudioPlayer.songs[index]);
      };

      var currentSong = function() {
        return AudioPlayer.currentSong();
      };

      scope.remotePlay = function(index) {
        if (currentSong() === AudioPlayer.songs[index]) {
          AudioPlayer.player.play();
          return;
        }
        setCurrentSong(index);
        var url = songUrl(index);
        AudioPlayer.player.src = url;
        scope.current = index;

        scope.javascriptNode.onaudioprocess = function() {
          scope.$apply(function() {
            scope.array = new Uint8Array(scope.analyser.frequencyBinCount);
            scope.analyser.getByteFrequencyData(scope.array);
          });
        };
      };

      scope.play = function(index) {
        SocketService.remotePlay(index);
        scope.remotePlay(index);
      };

    }
  };
}]);
