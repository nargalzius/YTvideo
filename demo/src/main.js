$( document ).ready(init);

function init(){

    
    var video = new YTVideoPlayer();

    video.callback_progress = function() {
        video.trace(video.playhead);
    }
    
    video.init('videoPlayer');
    video.startmuted = true;
    video.autoplay = true;
    video.load('NkbP-zzZR2w');

    
    setTimeout(function(){
    //     video.destroy();
    //     video.init('videoPlayerSmall');
    //     video.chromeless = true;
    //     video.autoplay = true;
    //     video.startmuted = false;
    //     video.load('M7lc1UVf-VE');
        video.stop();
    }, 8000)
    
}

