angular.module("SongVis.services").factory('SocketService', ["AudioPlayer", function(AudioPlayer) {
  var host = location.origin.replace(/^http/, 'ws') + '/sock';
  var ws = new WebSocket(host);
  var socketContainer = {};

  ws.onmessage = function(e) {
    var scope = socketContainer.scope;
    if (scope) {
      scope.$apply(function() {
        var data = JSON.parse(e.data||JSON.stringify({songs:[]}));
        if (data.songs) {
          AudioPlayer.songs = data.songs;
        } else if (data.index > -1) {
          socketContainer.playlistScope.remotePlay(data.index);
        } else if (data.pause) {
          AudioPlayer.pause();
        }
      });
    }
  };

  socketContainer.send = function(songs) {
    ws.send(JSON.stringify({songs: angular.copy(songs)}));
  };

  socketContainer.remove = function(songs) {
    this.send(songs);
    this.pause();
  };

  socketContainer.remotePlay = function(index) {
    ws.send(JSON.stringify({index: index}));
  };

  socketContainer.pause = function() {
    ws.send(JSON.stringify({pause: true}));
  };

  return socketContainer;
}]);
