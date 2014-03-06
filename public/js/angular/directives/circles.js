angular.module('SongVis.directives').directive('circles', ["Visualizer", function(Visualizer) {
  return {
    scope: {
      showTab: '=',
      height: '@',
      width: '@'
    },
    restrict: 'E',
    link: function(scope, element, attrs) {
      scope.frequencyData = Visualizer.getData;
      scope.color = d3.scale.category10();
      scope.svg = d3.select(element[0]).append('svg').attr('height', scope.height).attr('width', scope.width);
      scope.circles = scope.svg.selectAll('circle').data(Visualizer.nodes);
      scope.circles.enter().append('circle')
        .attr('cy', function(d,i) { return (Math.random()*420)+1})
        .attr('cx', 0)
        .style('fill', 'steelblue')
        .transition()
        .delay(function(d,i) { return 150*i})
        .duration(1500)
        .attr('cy', function(d,i) { return (Math.random()*scope.height)+1})
        .attr('cx', function(d,i) { return i*60 + 80; })
        .attr('r', function(d,i) { return 5; })
        .style('fill', function(d,i) { return scope.color(i); })

      function update(d3Selection, array) {
        if (!array || scope.showTab !== 'vis') return;
        var wiggle = function(initial) {
          return function(d,i) {
            var amnt = (array[i]*0.4)|0
            var evener = 1;
            if (i > 2) evener = i*0.6;
            return amnt * evener;
          };
        };
        d3Selection//.transition().duration(100)
        // .attr('cx', function(d,i) { return i*30 + 20; })
        .attr('r', wiggle(0))
      };

      scope.$watch('frequencyData()', function(newData) {
        update(scope.circles, newData);
      });
    }
  };
}]);
