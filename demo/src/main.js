var vid = new YTVideoPlayer();
	vid.debug = true;
    vid.dom_debug = document.getElementById('debug');
	vid.init();

function debugReset() {
	vid.dom_debug.innerHTML = '';
}

$('#debug').click(debugReset);

$('.btn').click(function() {
    switch( $(this).attr('id') ) {
    	case 'video1':
    		vid.load({
    			src: '2b36Fo3R8Qk'
    		});
    	break;
    	case 'video2':
    		vid.load({
    			src: '2b36Fo3R8Qk', 
    			autoplay: true, 
    			startmuted: true
    		});
    	break;
    	case 'video3':
    		vid.load({
    			src: '2b36Fo3R8Qk', 
    			autoplay: true, 
    			startmuted: true, 
    			start: 60, 
    			end: 70
    		});
    	break;
    	case 'video4':
    		vid.load({
    			src: '2b36Fo3R8Qk', 
    			autoplay: true, 
    			startmuted: false, 
    			chromeless: true
    		});
    	break;
    }

    debugReset();
});