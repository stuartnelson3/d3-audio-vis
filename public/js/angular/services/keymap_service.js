angular.module("SongVis.services").factory('KeyMap', function() {
  keyMap = {
    39: function() { // Right arrow keycode
      this.playNext();
    },
    37: function() { // Left arrow keycode
      this.playPrevious();
    },
    32: function() { // Space keycode
      this.player.paused ? this.player.play() : this.player.pause();
    }
  };
  return keyMap;
});
