angular.module('SongVis.directives').directive('circles', [function() {
  return {
    scope: {
      data: '=',
      height: '@',
      width: '@',
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
        .attr('cy', 260)
        .attr('cx', function(d,i) { return i*30 + 20; })
        .attr('r', function(d,i) { return 5; })
        .style('fill', function(d,i) { return scope.color(i); })

      scope.$watch('frequencyData', function(array) {
        // do the d3 here
        if (!array) return;
        var wiggle = function(initial) {
          return function(d,i) {
            var amnt = (array[i]*0.2)|0
            amnt = Math.pow(amnt, 2) // whooa!
            if (amnt > 15) {
              return initial + amnt;
            } else {
              return 1;
            }
          };
        };
        scope.circles.transition().duration(0)
          .attr('cx', function(d,i) { return i*30 + 20; })
          .attr('r', function(d,i) { return 5; })
          .style('fill', function(d,i) { return scope.color(array[i]); })
          .attr('r', wiggle(0))
          // .attr('cy', wiggle(60))
      });
    }
  };
}]);
