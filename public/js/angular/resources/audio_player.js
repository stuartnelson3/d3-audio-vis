angular.module("SongVis.resources").factory("AudioPlayer", [function() {

  var audioPlayer = {};

  audioPlayer.player = new Audio();

  audioPlayer.setSrc = function(src) {
    audioPlayer.player.src = src;
  };

  audioPlayer.playing = function() {
    return !audioPlayer.player.paused;
  };

  audioPlayer.play = function() {
    audioPlayer.player.play();
  };

  audioPlayer.pause = function() {
    audioPlayer.player.pause();
  };

  return audioPlayer;
}]);
