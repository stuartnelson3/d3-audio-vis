angular.module('SongVis.directives').directive('playlist', ["$document", "AudioPlayer", function($document, AudioPlayer) {
  return {
    scope: {
      songs: '=',
      array: '='
    },
    restrict: 'E',
    templateUrl: 'templates/playlist.html',
    link: function(scope, element, attrs) {
      $document.keydown(function(ev) {
        if (ev.keyCode === 32) { // Space keycode
          scope.audio.paused ? scope.audio.play() : scope.audio.pause();
        }
      });

      scope.sortableOptions = {
        handle: ".song-handle",
      };

      scope.audio = new Audio();

      scope.audio.onended = function() {
        scope.current++;
        scope.audio.src = scope.songs[scope.current];
      };

      var audioPlayer = new AudioPlayer();
      audioPlayer.setupAudioNodes();
      scope.context = audioPlayer.audioContext;
      scope.analyser = audioPlayer.analyser;
      scope.javascriptNode = audioPlayer.javascriptNode;

      var source = scope.context.createMediaElementSource(scope.audio);
      source.connect(scope.analyser);
      scope.analyser.connect(scope.context.destination);

      scope.remove = function(index) {
        scope.songs.splice(index, 1);
        scope.audio.pause();
      };

      scope.pause = function() {
        scope.audio.pause();
      }

      scope.playing = function(index) {
        return currentSongName() === scope.songs[index] &&
          !scope.audio.paused
      };

      var currentSongName = function() {
        return scope.audio.src.replace(location.origin+"/","")
      };

      scope.play = function(index) {
        var url = scope.songs[index];
        if (url === currentSongName()) {
          scope.audio.play();
          return;
        }
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

    }
  };
}]);
