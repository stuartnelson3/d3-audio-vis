angular.module("SongVis.services").factory('SocketService', function() {
  var host = location.origin.replace(/^http/, 'ws') + '/sock';
  var ws = new WebSocket(host);
  var socketContainer = {};

  ws.onmessage = function(e) {
    var scope = socketContainer.scope;
    if (scope) {
      scope.$apply(function() {
        scope.selectedSongs = JSON.parse(e.data||"[]");
      });
    }
  };

  socketContainer.send = function(songs) {
    ws.send(JSON.stringify(angular.copy(songs)));
  };

  return socketContainer;
});
