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

      var audioPlayer = new AudioPlayer();
      audioPlayer.setupAudioNodes();
      scope.context = audioPlayer.audioContext;
      scope.analyser = audioPlayer.analyser;
      scope.javascriptNode = audioPlayer.javascriptNode;

      var source = scope.context.createMediaElementSource(scope.audio);
      source.connect(scope.analyser);
      scope.analyser.connect(scope.context.destination);

      scope.audio.onended = function() {
        scope.current++;
        setActiveSong(scope.current);
        scope.audio.src = scope.activeSong.Url;
      };

      scope.remove = function(index) {
        scope.songs.splice(index, 1);
        scope.audio.pause();
      };

      scope.pause = function() {
        scope.audio.pause();
      }

      scope.playing = function(index) {
        return scope.activeSong === scope.songs[index] &&
          !scope.audio.paused
      };

      var songUrl = function(index) {
        return scope.songs[index].Url;
      };

      var currentSongUrl = function() {
        return scope.audio.src.replace(location.origin, "")
      };

      var setActiveSong = function(index) {
        scope.activeSong = scope.songs[index];
      };

      scope.play = function(index) {
        var url = songUrl(index);
        if (scope.activeSong === scope.songs[index]) {
          scope.audio.play();
          return;
        }
        setActiveSong(index);
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
