//navigator.getUserMedia = navigator.getUserMedia
//  || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

$(function() {
  var ros = new ROSLIB.Ros({
    url: "ws://" + location.hostname + ":8888"
  });
  
  var audioContext = new AudioContext();
  var src = audioContext.createBufferSource();

  var audio2Listener = new ROSLIB.Topic({
    ros: ros,
    name: '/audio2',
    messageType: 'audio_common_msgs/AudioData'
  });

  audio2Listener.subscribe(function(msg){
    str2ArrayBuffer(msg.data, function(ab){
      audioContext.decodeAudioData(ab, function(buf){
        src.buffer = buf;
        src.connect(audioContext.destination);
        src.noteOn(0);
      });
    });
  });

  var str2ArrayBuffer = function(str, cb){
    var r = new FileReader();
    r.onloadend = function(){
      cb(r.result);
    };
    r.readAsArrayBuffer(new Blob([str]));
  };

});
