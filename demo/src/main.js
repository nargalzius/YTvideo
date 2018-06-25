var vid = new YTVideoPlayer();
    vid.dom_debug = document.getElementById('debug');
var nonce = true;

// vid.callback_progress = function() {
//     // vid.trace(vid.playhead);
// }

// vid.callback_end = function() {
//     if(nonce) {
//         nonce = false;
//         vid.load({
//             src: 'IrZmf7q8SN4',
//             startmuted: true,
//             autoplay: true,
//             allowfullscreen: false,
//             chromeless: true
//         });
//     }
// }

// vid.callback_play = function() {
//     console.log(vid.params);
// }

// vid.init({src: '2b36Fo3R8Qk', autoplay: true, startmuted: true, start: 60, end: 70});
vid.init({src: '2b36Fo3R8Qk', autoplay: true, startmuted: true});


document.getElementById('stop').onclick = function() {
    vid.stop();
}