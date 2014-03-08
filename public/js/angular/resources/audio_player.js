angular.module("SongVis.resources").factory("AudioPlayer", [function() {

  var audioPlayer = {};
  var currentSong = {};

  audioPlayer.player = new Audio();
  var player = audioPlayer.player;
  audioPlayer.songs = [];

  audioPlayer.setSrc = function(src) {
    player.src = src;
  };

  audioPlayer.playing = function() {
    return !player.paused;
  };

  audioPlayer.songIndex = function() {
    return audioPlayer.songs.indexOf(audioPlayer.currentSong());
  };

  audioPlayer.play = function() {
    player.play();
  };

  audioPlayer.remotePlay = function(i) {
    var song = audioPlayer.songs[i];
    player.autoplay = true;
    if (currentSong === song) {
      player.play();
      return;
    }
    audioPlayer.setCurrentSong(song);
    player.src = song.url;
  };

  audioPlayer.pause = function() {
    player.pause();
  };

  audioPlayer.setCurrentSong = function(song) {
    currentSong = song;
  };

  audioPlayer.currentSong = function() {
    return currentSong;
  };

  player.onended = function() {
    // add check to see if out of bounds of songs array
    // this is the third place this logic lives
    // centralize it in one place.
    var i = audioPlayer.songIndex() + 1;
    if (i < audioPlayer.songs.length) {
      audioPlayer.remotePlay(i);
    }
  };

  return audioPlayer;
}]);
