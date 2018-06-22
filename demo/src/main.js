// @codekit-prepend "device.js"

$( document ).ready(init);

function init(){

    
    var video = new YTVideoPlayer();
    var video2 = new YTVideoPlayer();

    video.callback_progress = function() {
        // video.trace(video.playhead);
    }
    
    video.init({ 
        id: 'videoPlayer',
        src: 'NkbP-zzZR2w', 
        startmuted: true,
        autoplay: true,
        captions: true
    });

    // video2.destroy();
    video2.init({
        id: 'videoPlayerSmall',
        src: 'M7lc1UVf-VE',
        start: 30,
        end: 300,
        // chromeless: true,
        autoplay: true,
        // startmuted: true
    });
    
    // video2.stop();
}

