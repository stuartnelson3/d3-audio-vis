angular.module("SongVis.services").factory('SocketService', ["$rootScope", "AudioPlayer", function($rootScope, AudioPlayer) {
  var host = location.origin.replace(/^http/, 'ws') + '/sock';
  var ws = new WebSocket(host);
  var socketContainer = {};

  ws.onmessage = function(e) {
    $rootScope.$apply(function() {
      var data = JSON.parse(e.data||JSON.stringify({songs:[]}));
      if (data.songs) {
        AudioPlayer.songs = data.songs;
      } else if (data.index > -1) {
        AudioPlayer.remotePlay(data.index);
      } else if (data.pause) {
        AudioPlayer.playing() ? AudioPlayer.pause() : AudioPlayer.play();
      }
    });
  };

  socketContainer.send = function(songs) {
    ws.send(JSON.stringify({songs: angular.copy(songs)}));
  };

  socketContainer.remove = function(songs) {
    this.send(songs);
    this.pause();
  };

  socketContainer.playNext = function() {
    var i = AudioPlayer.songIndex() + 1;
    if (i < AudioPlayer.songs.length) {
      this.remotePlay(i);
    }
  };

  socketContainer.playPrevious = function() {
    var i = AudioPlayer.songIndex() - 1;
    if (i > -1) {
      this.remotePlay(i);
    }
  };

  socketContainer.remotePlay = function(index) {
    ws.send(JSON.stringify({index: index}));
  };

  socketContainer.pause = function() {
    ws.send(JSON.stringify({pause: true}));
  };

  return socketContainer;
}]);
