angular.module("SongVis.services").factory('SocketService', function() {
  var host = location.origin.replace(/^http/, 'ws') + '/sock';
  var ws = new WebSocket(host);
  var socketContainer = {};

  ws.onmessage = function(e) {
    var scope = socketContainer.scope;
    if (scope) {
      scope.$apply(function() {
        var data = JSON.parse(e.data||JSON.stringify({songs:[]}));
        if (data.songs) {
          scope.selectedSongs = data.songs;
        } else if (data.index > -1) {
          socketContainer.playlistScope.remotePlay(data.index);
        } else if (data.pause) {
          socketContainer.playlistScope.remotePause();
        }
      });
    }
  };

  socketContainer.send = function(songs) {
    ws.send(JSON.stringify({songs: angular.copy(songs)}));
  };

  socketContainer.remotePlay = function(index) {
    ws.send(JSON.stringify({index: index}));
  };

  socketContainer.pause = function() {
    ws.send(JSON.stringify({pause: true}));
  };

  return socketContainer;
});
