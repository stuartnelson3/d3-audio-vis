angular.module("SongVis.resources").factory("Visualizer", ["$rootScope", "AudioPlayer", function($rootScope, AudioPlayer) {

  var visualizer = function() {
    if (!window.AudioContext) {
      if (!window.webkitAudioContext) {
        alert('no audiocontext found');
      }
      window.AudioContext = window.webkitAudioContext;
    }
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 32;

    this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);
    this.javascriptNode.connect(this.audioContext.destination);
    this.analyser.connect(this.javascriptNode);
  };

  var nodes = [];
  var array;
  for (var i = 0; i < 16; nodes.push(i++)) {}

  // why does this need to be global...
  vis = new visualizer();
  var context = vis.audioContext;
  var analyser = vis.analyser;
  var javascriptNode = vis.javascriptNode;

  var source = context.createMediaElementSource(AudioPlayer.player);
  source.connect(analyser);
  analyser.connect(context.destination);

  javascriptNode.onaudioprocess = function() {
    $rootScope.$apply(function() {
      array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
    });
  };

  return {
    nodes: nodes,
    getData: function() {
      return array;
    }
  };
}]);
