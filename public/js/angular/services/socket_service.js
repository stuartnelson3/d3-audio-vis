angular.module("SongVis.services").factory('SocketService', function() {
  return function(scope, songs) {
    var host = location.origin.replace(/^http/, 'ws') + '/sock';
    var ws = new WebSocket(host);
    var obj = {};

    ws.onmessage = function(e) {
      scope.$apply(function() {
        scope.selectedSongs = JSON.parse(e.data)
      });
    };

    obj.songs = songs;

    obj.send = function(songs) {
      ws.send(JSON.stringify(angular.copy(songs)));
    };

    return obj;
  };
});
