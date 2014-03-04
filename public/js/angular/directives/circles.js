angular.module('SongVis.directives').directive('circles', [function() {
  return {
    scope: {
      data: '=',
      height: '@',
      width: '@',
      update: '&',
      frequencyData: '='
    },
    restrict: 'E',
    link: function(scope, element, attrs) {
      scope.color = d3.scale.category10();
      scope.svg = d3.select(element[0]).append('svg').attr('height', scope.height).attr('width', scope.width);
      scope.circles = scope.svg.selectAll('circle').data(scope.data);
      scope.circles.enter().append('circle')
        .attr('cy', function(d,i) { return (Math.random()*420)+1})
        .attr('cx', 0)
        .style('fill', 'steelblue')
        .transition()
        .delay(function(d,i) { return 150*i})
        .duration(1500)
        // .attr('cy', 260)
        .attr('cy', function(d,i) { return (Math.random()*scope.height)+1})
        .attr('cx', function(d,i) { return i*60 + 80; })
        .attr('r', function(d,i) { return 5; })
        .style('fill', function(d,i) { return scope.color(i); })

      var updateFn = scope.update();
      scope.$watch('frequencyData', updateFn(scope.circles));
    }
  };
}]);
