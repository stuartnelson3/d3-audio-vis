angular.module("SongVis.resources").factory('Soundcloud', ["$http", function($http) {
  var soundcloudUrl = location.protocol + "//api.soundcloud.com/tracks";
  var sc = function(params) {
    if (!params.client_id) {
      throw("Must include client_id!");
    }
    this.client_id = params.client_id;
    this.format = params.format || "json";
    this.status_code_map = params.status_code_map || 200;
  };

  sc.prototype.search = function(query) {
    this.promise = $http.get(soundcloudUrl, {params: {
      q: query,
      client_id: this.client_id,
      format: this.format,
      "_status_code_map[302]": this.status_code_map
    }});
    return this;
  };

  sc.prototype.appendSongs = function(container) {
    this.promise.then(function(payload) {
      var songs = payload.data
      songs.forEach(function(song) {
        song.name = song.title
        song.artist = song.user.username
        song.artist_avatar = song.user.avatar_url
        song.url = song.stream_url + "?client_id=" + this.client_id;
      }.bind(this))
      container.push.apply(container, songs)
    }.bind(this))
    this.promise = null;
  };

  return sc;
}]);
