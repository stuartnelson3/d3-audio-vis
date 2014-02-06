// fun to mess with playbackRate
// sourceNode.playbackRate.value
var audioBuffer;
var sourceNode;
var analyser;
var javascriptNode;
function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {

    context.decodeAudioData(request.response, function(buffer) {
      playSound(buffer);
    }, onError);
  }
  request.send();
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
  var wiggle = function(start) {
    return function(d,i) { return start + (array[i]*0.08)|0; };
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
  .attr('cy', 60)
  .attr('cx', function(d,i) { return i*30 + 20; })
  .attr('r', function(d,i) { return 5; })
  .style('fill', function(d,i) { return color(i); })


  setupAudioNodes();

  function setupAudioNodes() {

    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    javascriptNode.connect(context.destination);


    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 32;

    sourceNode = context.createBufferSource();
    sourceNode.connect(analyser);
    analyser.connect(javascriptNode);

    sourceNode.connect(context.destination);
  }

  javascriptNode.onaudioprocess = function() {

    var array =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    drawSpectrum(array);
  };

});
