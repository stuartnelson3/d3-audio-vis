angular.module("SongVis.controllers").controller("SongCtrl", ["$scope", function($scope) {
  // fun to mess with playbackRate
  // sourceNode.playbackRate.value
  var audioBuffer;
  var sourceNode;
  var analyser;
  var javascriptNode;
  function loadSound(url) {
    // need to remove or stop old element before playing new one
    audio = new Audio();
    audio.src = url;
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    // audio.controls = true;
    audio.autoplay = true;
  }


  function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
  }

  function onError(e) {
    console.log(e);
  }

  function drawSpectrum(array) {
    // do the d3 here
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
    circles.transition().duration(0)
    .style('fill', function(d,i) { return color(array[i]); })
    .attr('r', wiggle(0))
    // .attr('cy', wiggle(60))
  }

  $(function() {
    if (! window.AudioContext) {
      if (! window.webkitAudioContext) {
        alert('no audiocontext found');
      }
      window.AudioContext = window.webkitAudioContext;
    }
    context = new AudioContext();

    svg = d3.select('.container').append('svg').attr('height', 420).attr('width', 960);
    var data = new Array();
    for (var i = 0; i < 32; data.push(i++)) {}
    color = d3.scale.category10();
    circles = svg.selectAll('circle').data(data);
    circles.enter().append('circle')
    .style('fill', 'steelblue')
    .transition()
    .duration(750)
    .attr('cy', 260)
    .attr('cx', function(d,i) { return i*50 + 40; })
    .attr('r', function(d,i) { return 5; })
    .style('fill', function(d,i) { return color(i); })


    setupAudioNodes();

    function setupAudioNodes() {
      context = new webkitAudioContext();
      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 32;

      javascriptNode = context.createScriptProcessor(2048, 1, 1);
      javascriptNode.connect(context.destination);
      analyser.connect(javascriptNode);
      javascriptNode.onaudioprocess = function() {

        var array =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        drawSpectrum(array);
      };

    }

  });

  $scope.loadSound = loadSound;
}]);
