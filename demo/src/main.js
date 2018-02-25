// @codekit-prepend "device.js"

$( document ).ready(init);

function init(){

    
    var video = new YTVideoPlayer();
    var video2 = new YTVideoPlayer();

    video.callback_progress = function() {
        // video.trace(video.playhead);
    }
    
    video.init('videoPlayer');
    video.startmuted = true;
    video.autoplay = true;
    video.captions = true;
    video.load('NkbP-zzZR2w');

    // video2.destroy();
    video2.init('videoPlayerSmall');
    video2.chromeless = true;
    video2.autoplay = true;
    video2.startmuted = true;
    video2.load('M7lc1UVf-VE');
    // video2.stop();
}

