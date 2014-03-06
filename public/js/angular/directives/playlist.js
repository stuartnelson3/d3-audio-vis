angular.module('SongVis.directives').directive('playlist', ["$document", "Visualizer", "SocketService", "$timeout", "AudioPlayer", function($document, Visualizer, SocketService, $timeout, AudioPlayer) {
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
        AudioPlayer.songs = newSongs;
      });

      SocketService.playlistScope = scope;
      $document.on('keydown', function(ev) {
        if (ev.keyCode === 32 && !$(ev.target).is(":focus")) { // Space keycode
          scope.audio.paused ? scope.audio.play() : scope.audio.pause();
        }
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
        scope.songs.splice(index, 1);
        SocketService.remove(scope.songs);
      };

      scope.pause = function() {
        SocketService.pause();
        scope.remotePause();
      }

      scope.remotePause = function() {
        scope.audio.pause();
      };

      scope.playing = function(index) {
        var currentSong = AudioPlayer.currentSong();
        return currentSong === scope.songs[index] &&
          !scope.audio.paused;
      };

      var songUrl = function(index) {
        return scope.songs[index].url;
      };

      var setCurrentSong = function(index) {
        AudioPlayer.setCurrentSong(scope.songs[index]);
      };

      scope.remotePlay = function(index) {
        if (scope.activeSong === scope.songs[index]) {
          scope.audio.play();
          return;
        }
        setCurrentSong(index);
        var url = songUrl(index);
        scope.audio.src = url;
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
