angular.module("SongVis.services").factory('KeyMap', function() {
  keyMap = {
    39: function(index, songs) { // Right arrow keycode
      var i = index + 1;
      if (i >= songs.length) return;
      this.remotePlay(i);
    },
    37: function(index) { // Left arrow keycode
      var i = index - 1;
      if (i < 0) return;
      this.remotePlay(i);
    },
    32: function() { // Space keycode
      this.pause();
    }
  };
  return function(keycode) {
    return keyMap[keycode] || function() {};
  }
});
