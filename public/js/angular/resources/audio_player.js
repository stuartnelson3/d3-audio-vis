angular.module("SongVis.resources").factory("AudioPlayer", [function() {

  var audioPlayer = {};
  var currentSong;

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

  audioPlayer.setCurrentSong = function(song) {
    currentSong = song;
  };

  audioPlayer.currentSong = function() {
    return currentSong;
  };

  audioPlayer.playNext = function() {
    var i = audioPlayer.songs.indexOf(currentSong)+1;
    currentSong = audioPlayer.songs[i];
    audioPlayer.player.src = currentSong.url;
  };

  audioPlayer.playPrevious = function() {
    var i = audioPlayer.songs.indexOf(currentSong)-1;
    currentSong = audioPlayer.songs[i];
    audioPlayer.player.src = currentSong.url;
  };

  return audioPlayer;
}]);
