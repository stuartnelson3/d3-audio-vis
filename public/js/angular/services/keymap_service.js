angular.module("SongVis.services").factory('KeyMap', ["SocketService", function(SocketService) {
  var keyMap = {
    39: function() { // Right arrow keycode
      SocketService.playNext();
    },
    37: function() { // Left arrow keycode
      SocketService.playPrevious();
    },
    32: function() { // Space keycode
      SocketService.pause();
    }
  };
  return function(keycode) {
    return keyMap[keycode] || function() {};
  }
}]);
