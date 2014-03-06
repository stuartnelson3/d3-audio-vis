angular.module("SongVis.resources").factory("AudioPlayer", [function() {

  var audioPlayer = {};
  var currentSong = {};

  audioPlayer.player = new Audio();
  audioPlayer.player.autoplay = true;

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

  function jumpSongs(jump) {
    return function() {
      var i = audioPlayer.songs.indexOf(currentSong)+jump;
      currentSong = (audioPlayer.songs[i] || {});
      audioPlayer.player.src = currentSong.url;
    };
  }
  audioPlayer.playNext = jumpSongs(1);
  audioPlayer.playPrevious = jumpSongs(-1);

  return audioPlayer;
}]);
