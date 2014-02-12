angular.module("SongVis.resources").factory("AudioPlayer", [function() {
  var audioPlayer = function() {
    if (!window.AudioContext) {
      if (!window.webkitAudioContext) {
        alert('no audiocontext found');
      }
      window.AudioContext = window.webkitAudioContext;
    }
    this.audioContext = new AudioContext();
  };

  return audioPlayer;
}]);
