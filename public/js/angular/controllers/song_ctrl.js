angular.module("SongVis.controllers").controller("SongCtrl", ["$scope", "AudioPlayer", function($scope, AudioPlayer) {
  // fun to mess with playbackRate
  // sourceNode.playbackRate.value
  var audioPlayer = new AudioPlayer();
  audioPlayer.setupAudioNodes();
  $scope.context = audioPlayer.audioContext;
  $scope.analyser = audioPlayer.analyser;
  $scope.javascriptNode = audioPlayer.javascriptNode;

  $scope.data = [];
  for (var i = 0; i < 32; $scope.data.push(i++)) {}

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
