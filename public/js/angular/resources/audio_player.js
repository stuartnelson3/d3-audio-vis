angular.module("SongVis.resources").factory("AudioPlayer", [function() {

  var audioPlayer = {};
  var currentSong = {};

  audioPlayer.player = new Audio();
  var player = audioPlayer.player;
  audioPlayer.player.autoplay = true;
  audioPlayer.songs = [];

  audioPlayer.setSrc = function(src) {
    player.src = src;
  };

  audioPlayer.playing = function() {
    return !player.paused;
  };

  audioPlayer.play = function() {
    player.play();
  };

  audioPlayer.remotePlay = function(i) {
    var song = audioPlayer.songs[i];
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
    audioPlayer.playNext();
  };

  function jumpSongs(jump) {
    return function() {
      var i = audioPlayer.songs.indexOf(currentSong)+jump;
      currentSong = (audioPlayer.songs[i] || {});
      player.src = currentSong.url;
    };
  }
  audioPlayer.playNext = jumpSongs(1);
  audioPlayer.playPrevious = jumpSongs(-1);

  return audioPlayer;
}]);
