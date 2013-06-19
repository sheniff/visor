var Visor = function() {

  var videoFallback, videoSuccess;

  // Private methods

  videoFallback = function(e) {
    if(e)
      console.log('Reeeejected!', e);
    else
      console.log('getUserMedia() is not supported in your browser');
  };

  videoSuccess = function(localMediaStream) {
    this.videoPlaceholder.src = this.windowURL.createObjectURL(localMediaStream);
    this.localMediaStream = localMediaStream;
  };

  // Public methods

  return {

    windowURL: window.URL || window.webkitURL,
    videoPlaceholder: null,
    localMediaStream: null,

    init: function(selector) {
      var self = this;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

      if (navigator.getUserMedia) {
        this.videoPlaceholder = selector;
        navigator.getUserMedia({ video: true }, function(lms) { videoSuccess.call(self, lms) }, videoFallback);
      } else {
        videoFallback();
      }
    },

    takeSnapshot: function(selector, canvas) {
      if (this.localMediaStream) {
        canvas = canvas || document.querySelector('canvas');

        canvas.getContext('2d').drawImage(this.videoPlaceholder, 0, 0);
        // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
        selector.src = canvas.toDataURL('image/webp');
      }
    }

  };

};

// Run visor
(function() {

  var visor = new Visor(),
      video = document.querySelector('video'),
      snap = document.querySelector('img');

  visor.init(video);

  // Taking pictures
  video.addEventListener('click', function() {
    visor.takeSnapshot(snap, document.querySelector('canvas'));
  }, false);

})();
