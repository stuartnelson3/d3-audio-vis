angular.module("SongVis.services").factory('SortService', function() {

  var sortService = function(attr) {
    this.predicateAttr = attr;
    this.reverseAttr = false;
  };

  sortService.prototype.setPredicate = function(attr) {
    if (JSON.stringify(this.predicateAttr) === JSON.stringify(attr)) {
      this.reverseAttr = !this.reverseAttr;
    }
    this.predicateAttr = attr;
  };

  sortService.prototype.predicate = function() {
    return this.predicateAttr;
  };

  sortService.prototype.reverse = function() {
    return this.reverseAttr;
  };

  return sortService;

});
