angular.module("SongVis.services").factory('SocketService', ["$rootScope", "$http", "$interval", "AudioPlayer", function($rootScope, $http, $interval, AudioPlayer) {
  var host = location.origin.replace(/^http/, 'ws') + '/sock';
  var ws = new WebSocket(host);

  // var ws = {
  //   send: function(data) {
  //     $http.post("/update_stream", data);
  //   }
  // };
  // var es = new EventSource(location.origin + "/stream");
  var socketContainer = {};

  // es.onopen = function() {
  //   $http.get("/current-playlist").then(function(data) {
  //     if (!data.data.songs || AudioPlayer.songs.length) {
  //       return;
  //     }
  //     AudioPlayer.songs = data.data.songs;
  //   });
  // };

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

  // ping every 10 seconds to keep connection alive
  $interval(function() {
    ws.send("{}");
  }, 1000*10);

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
