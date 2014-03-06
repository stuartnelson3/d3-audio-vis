angular.module("SongVis.resources").factory("Visualizer", [function() {

  var visualizer = function() {
    if (!window.AudioContext) {
      if (!window.webkitAudioContext) {
        alert('no audiocontext found');
      }
      window.AudioContext = window.webkitAudioContext;
    }
    this.audioContext = new AudioContext();
  };

  visualizer.prototype.setupAudioNodes = function() {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 32;

    this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);
    this.javascriptNode.connect(this.audioContext.destination);
    this.analyser.connect(this.javascriptNode);
  }


  return visualizer;
}]);
