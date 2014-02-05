// song url:
var url = "its_alright.mp3"

// angular guide url:
// http://blog.jetboystudio.com/articles/angular-music-player/

// visualizing:
// http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound

// create the audio player
var audio = new Audio()
audio.src = url
// start the tunes
// audio.play()

// create the webkit context
var context = new webkitAudioContext()
// var medsrc = context.createMediaElementSource(audio)
// medsrc.mediaElement.play();
var sourceNode = context.createBufferSource();
// destination are your speakers
sourceNode.connect(context.destination)
var analyser = context.createAnalyser()

// called every 2048 frames
// at 44.1k, that is 21 times/sec
var javascriptNode = context.createScriptProcessor(2048, 1, 1);

// when the javascript node is called
// we use information from the analyzer node
// to draw the volume
javascriptNode.onaudioprocess = function() {

  // get the average, bincount is fftsize / 2
  var array =  new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(array);
  var average = getAverageVolume(array)

  // clear the current state
  // ctx.clearRect(0, 0, 60, 130);

  // set the fill style
  // ctx.fillStyle=gradient;

  // create the meters
  // ctx.fillRect(0,130-average,25,130);
  console.log(array)
}

function getAverageVolume(array) {
  var values = 0;
  var average;

  var length = array.length;

  // get all the frequency amplitudes
  for (var i = 0; i < length; i++) {
    values += array[i];
  }

  average = values / length;
  return average;
}
