angular.module("SongVis.controllers", []);
angular.module("SongVis.directives", []);
angular.module("SongVis.resources", []);
angular.module("SongVis.services", []);

angular.module("SongVis",
  ["SongVis.controllers", "SongVis.directives", "SongVis.resources", "SongVis.services"])
.run(['$rootScope', function($rootScope) {
 // adds some basic utilities to the $rootScope for debugging purposes
 $rootScope.log = function(thing) {
   console.log(thing);
 };

 $rootScope.alert = function(thing) {
   alert(thing);
 };
}]);
