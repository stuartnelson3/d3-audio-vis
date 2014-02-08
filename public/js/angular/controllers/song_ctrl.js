angular.module("SongVis.controllers").controller("SongCtrl", ["$scope", function($scope) {
  // fun to mess with playbackRate
  // sourceNode.playbackRate.value
  var audioBuffer;
  var sourceNode;
  var analyser;
  var javascriptNode;

  if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
      alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
  }
  context = new AudioContext();

  $scope.data = new Array();
  for (var i = 0; i < 32; $scope.data.push(i++)) {}

  setupAudioNodes();

  function setupAudioNodes() {
    context = new webkitAudioContext();
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 32;

    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    javascriptNode.connect(context.destination);
    analyser.connect(javascriptNode);
  }

  $scope.loadSound = function(url) {
    // need to remove or stop old element before playing new one
    audio = new Audio();
    audio.src = url;
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    // audio.controls = true;
    audio.autoplay = true;
    javascriptNode.onaudioprocess = function() {
      $scope.$apply(function() {
        $scope.array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData($scope.array);
      });
    };

  };

}]);
