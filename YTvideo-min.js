if("undefined"==typeof window.YTAPILoaded){window.YTAPILoaded=!1;var tag=document.createElement("script");tag.src="https://www.youtube.com/iframe_api";var firstScriptTag=document.getElementsByTagName("script")[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);var onYouTubeIframeAPIReady=function(){window.YTAPILoaded=!0,console.log("YouTube API loaded")},onPlaybackQualityChange=function(t){console.log("quality changed to: "+t)}}var YTVideoPlayer=function(){};YTVideoPlayer.prototype={debug:!0,playerloaded:!1,proxy:null,chromeless:!1,autoplay:!1,allowfullscreen:!1,annotations:!1,startmuted:!1,duration:null,playhead:null,loop:!1,interval:null,vars:{controls:1,autohide:1,modestbranding:1,autoplay:0,rel:0,showinfo:0,iv_load_policy:0,wmode:"transparent",html5:1},ismobile:!1,videostarted:!1,ismuted:!1,userAgent:function(){var t=navigator.userAgent||navigator.vendor||window.opera;/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4))?(this.ismobile=!0,this.trace("mobile browser detected")):(this.ismobile=!1,this.trace("desktop browser detected"))},evaluate:function(){this.cInterval(),this.videostarted=!1,this.playhead=null,this.duration=null,this.chromeless?this.vars.controls=0:this.vars.controls=2,this.autoplay?this.vars.autoplay=1:this.vars.autoplay=0,this.allowfullscreen?this.vars.fs=1:this.vars.fs=0,this.annotations?this.vars.iv_load_policy=1:this.vars.iv_load_policy=0,this.loop?this.vars.loop=1:this.vars.loop=0},init:function(t){null===this.ismobile&&"object"==typeof this.ismobile&&this.userAgent(),this.dom_container=document.getElementById(t)},load:function(t){var e=this;if(e.trackReset(),this.evaluate(),YTAPILoaded)if(this.playerloaded){var a={videoId:t,playerVars:this.vars};this.ismobile||this.proxy.loadVideoById(a)}else this.proxy=new YT.Player(this.dom_container.id,{height:e.dom_container.offsetHeight,width:e.dom_container.offsetWidth,videoId:t,events:{onReady:function(t){e.dlEventListener(t)},onStateChange:function(t){e.dlEventListener(t)},onPlaybackQualityChange:function(t){e.dlEventListener(t)}},playerVars:e.vars}),this.proxy.controls=0,this.playerloaded=!0;else setTimeout(function(){e.load(t)},500)},callback_end:function(){this.trace("Video Ended")},callback_play:function(){this.trace("Video Play")},callback_pause:function(){this.trace("Video Paused")},callback_volumechange:function(){this.trace("Video Volume Change")},callback_loading:function(){},callback_progress:function(){},callback_ready:function(){this.trace("Video Ready")},track:{q25:!1,q50:!1,q75:!1},trackReset:function(){var t=this;t.track.q25=!1,t.track.q50=!1,t.track.q75=!1},track_play:function(){},track_end:function(){},track_pause:function(){},track_mute:function(){},track_unmute:function(){},track_q25:function(){},track_q50:function(){},track_q75:function(){},dlEventListener:function(t){var e=this;switch(String(t.data)){case"null":e.callback_ready(),e.cInterval(),e.playhead=0,e.trackReset();break;case"-1":e.trace("unstarted"),e.cInterval(),e.playhead=0,e.trackReset();break;case"0":e.callback_end(),e.track_end(),e.trackReset(),e.cInterval(),e.playhead=0;break;case"1":e.videostarted||(e.duration=e.proxy.getDuration(),e.startmuted?e.mute():e.unmute(),e.videostarted=!0),e.callback_progress(),e.interval=setInterval(function(){var t=0;e.playhead=e.proxy.getCurrentTime(),e.duration&&(t=e.playhead/e.duration*100),!e.track.q25&&t>=25&&(e.track.q25=!0,e.track_q25()),!e.track.q50&&t>=50&&(e.track.q50=!0,e.track_q50()),!e.track.q75&&t>=75&&(e.track.q75=!0,e.track_q75()),e.ismuted&&!e.proxy.isMuted()&&(e.ismuted=!1,e.track_unmute()),!e.ismuted&&e.proxy.isMuted()&&(e.ismuted=!0,e.track_mute()),e.callback_progress()},250),e.callback_play(),e.track_play();break;case"2":e.cInterval(),e.callback_pause(),e.track_pause();break;case"3":e.cInterval(),e.callback_loading();break;case"tiny":break;case"small":break;case"medium":break;case"large":break;case"hd720":break;case"hd1080":break;case"highres":}},play:function(){this.proxy.playVideo()},pause:function(){this.proxy.pauseVideo()},stop:function(){this.proxy.stopVideo(),this.proxy.clearVideo()},seek:function(t){this.proxy.seekTo(t)},replay:function(){this.proxy.stopVideo(),this.proxy.clearVideo(),this.proxy.playVideo()},mute:function(){this.proxy.mute()},unmute:function(){this.proxy.unMute()},isMuted:function(){return this.proxy.isMuted()},isPlaying:function(){return this.isplaying},destroy:function(){self.trackReset(),this.proxy&&(this.stop(),this.cInterval(),this.playhead=0,this.videostarted=!1,this.playerloaded=!1,this.proxy.destroy(),this.proxy=null)},reflow:function(){this.proxy.setSize(this.dom_container.offsetWidth,this.dom_container.offsetHeight)},cInterval:function(){clearInterval(this.interval)},trace:function(t){this.debug&&console.log(t)}};