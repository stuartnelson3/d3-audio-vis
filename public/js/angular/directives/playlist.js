angular.module('SongVis.directives').directive('playlist', ["AudioPlayer", function(AudioPlayer) {
  return {
    scope: {
      songs: '=',
      array: '='
    },
    restrict: 'E',
    templateUrl: 'templates/playlist.html',
    link: function(scope, element, attrs) {
      var audioPlayer = new AudioPlayer();
      audioPlayer.setupAudioNodes();
      scope.context = audioPlayer.audioContext;
      scope.analyser = audioPlayer.analyser;
      scope.javascriptNode = audioPlayer.javascriptNode;

      scope.remove = function(index) {
        scope.songs.splice(index, 1);
      };

      scope.play = function(url) {
        // need to remove or stop old element before playing new one
        scope.audio = new Audio(url);
        var source = scope.context.createMediaElementSource(scope.audio);
        source.connect(scope.analyser);
        scope.analyser.connect(scope.context.destination);

        // audio.controls = true;
        scope.audio.autoplay = true;
        scope.javascriptNode.onaudioprocess = function() {
          $scope.$apply(function() {
            scope.array = new Uint8Array(scope.analyser.frequencyBinCount);
            scope.analyser.getByteFrequencyData(scope.array);
          });
        };

      };

    }
  };
}]);
