angular.module("SongVis.controllers").controller("SongCtrl", ["$scope", "AudioPlayer", function($scope, AudioPlayer) {
  // fun to mess with playbackRate
  // sourceNode.playbackRate.value
  var audioPlayer = new AudioPlayer();
  audioPlayer.setupAudioNodes();
  $scope.context = audioPlayer.audioContext;
  $scope.analyser = audioPlayer.analyser;
  $scope.javascriptNode = audioPlayer.javascriptNode;
  $scope.songs = songs;

  $scope.data = [];
  for (var i = 0; i < 32; $scope.data.push(i++)) {}

  $scope.update = function(d3Selection) {
    return function(array) {
      if (!array) return;
      var wiggle = function(initial) {
        return function(d,i) {
          var amnt = (array[i]*0.2)|0
          amnt = Math.pow(amnt, 2) // whooa!
          if (amnt > 15) {
            return initial + amnt;
          } else {
            return 5;
          }
        };
      };
      d3Selection.transition().duration(0)
      .attr('cx', function(d,i) { return i*30 + 20; })
      .attr('r', wiggle(0))
      // .attr('cy', wiggle(60))
    };
  }

  $scope.loadSound = function(url) {
    // need to remove or stop old element before playing new one
    $scope.audio = new Audio(url);
    var source = $scope.context.createMediaElementSource($scope.audio);
    source.connect($scope.analyser);
    $scope.analyser.connect($scope.context.destination);

    // audio.controls = true;
    $scope.audio.autoplay = true;
    $scope.javascriptNode.onaudioprocess = function() {
      $scope.$apply(function() {
        $scope.array = new Uint8Array($scope.analyser.frequencyBinCount);
        $scope.analyser.getByteFrequencyData($scope.array);
      });
    };

  };

}]);
