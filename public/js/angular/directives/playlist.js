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

      scope.audio.onended = function() {
        scope.current++;
        setActiveSong(scope.current);
        if (scope.activeSong) {
          scope.audio.src = scope.activeSong.Url;
        }
      };

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
        scope.activeSong = scope.activeSong || {};
        return scope.activeSong.name === scope.songs[index].name &&
          scope.activeSong.index === index &&
          !scope.audio.paused;
      };

      var songUrl = function(index) {
        return scope.songs[index].url;
      };

      var currentSongUrl = function() {
        return scope.audio.src.replace(location.origin, "")
      };

      var setActiveSong = function(index) {
        scope.activeSong = scope.songs[index];
        (scope.activeSong||{}).index = index;
      };

      scope.remotePlay = function(index) {
        if (scope.activeSong === scope.songs[index]) {
          scope.audio.play();
          return;
        }
        setActiveSong(index);
        var url = songUrl(index);
        scope.audio.src = url;
        scope.current = index;

        scope.audio.autoplay = true;
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
