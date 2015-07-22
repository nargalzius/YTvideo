/*!
 *	YOUTUBE VIDEO HELPER
 *
 *	2.0
 *
 *	author: Carlo J. Santos
 *	email: carlosantos@gmail.com
 *	documentation: 
 *
 *	Copyright (c) 2015, All Rights Reserved, www.nargalzius.com
 */

//var console, YTAPILoaded, YT; // FOR DEBUGGING

if(typeof window.YTAPILoaded === 'undefined')
{
	window.YTAPILoaded = false;

	var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";

	var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	var onYouTubeIframeAPIReady = function() {
	 	window.YTAPILoaded = true;
	 	console.log('YouTube API loaded');
	};

	var onPlaybackQualityChange = function(e) {
		console.log('quality changed to: '+e);
	};
}

var YTVideoPlayer = function(){};

YTVideoPlayer.prototype = {
	debug: true,
	//apiloaded: false,
	playerloaded: false,
	proxy: null,
	chromeless: false,
	autoplay: false,
	allowfullscreen: false,
	annotations: false,
	startmuted: false,
	duration: null,
	playhead: null,
	loop: false,
	interval: null,
	vars: {
		controls: 1,
		autohide: 1,
		modestbranding: 1,
		autoplay: 0,
		rel: 0,
		showinfo: 0,
		iv_load_policy: 0
	},
	ismobile: false,
	videostarted: false,
	userAgent: function() {

		var ua = navigator.userAgent || navigator.vendor || window.opera;

			if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4))) {
				this.ismobile = true;
				this.trace('mobile browser detected');
			} else {
				this.ismobile = false;
				this.trace('desktop browser detected');
			}
	},
	evaluate: function() {

		this.cInterval();
		
		this.videostarted = false;
		this.playhead = null;
		this.duration = null;
		
		if(this.chromeless) {this.vars.controls = 0;} else {this.vars.controls = 2;}
		if(this.autoplay) {this.vars.autoplay = 1;} else {this.vars.autoplay = 0;}
		if(this.allowfullscreen) {this.vars.fs = 1;} else {this.vars.fs = 0;}
		if(this.annotations) {this.vars.iv_load_policy = 1;} else {this.vars.iv_load_policy = 0;}
		if(this.loop) {this.vars.loop = 1;} else {this.vars.loop = 0;}
	},
	init: function(str)
	{
		if(this.ismobile === null && typeof this.ismobile === "object") {
			this.userAgent();
		}

		this.dom_container = document.getElementById(str);
	},
	load: function(str)
	{
		var self = this;

		this.evaluate();

		if( YTAPILoaded ) {

			if(!this.playerloaded) {
				this.proxy = new YT.Player(this.dom_container.id, {
					height: self.dom_container.offsetHeight,
					width: self.dom_container.offsetWidth,
					videoId: str,	
					events: {
						'onReady': function(e){ 
							self.dlEventListener(e);
						},
						'onStateChange': function(e){ 
							self.dlEventListener(e);
						},
						'onPlaybackQualityChange': function(e){ 
							self.dlEventListener(e);
						}
					},
					playerVars: self.vars
				});

				this.proxy.controls = 0;

				this.playerloaded = true;
			}
			else
			{
				var tobj = {
					'videoId': str,
					'playerVars': this.vars
				};

				if(!this.ismobile) {
					this.proxy.loadVideoById(tobj);
				}

			}

		} else { 	
			setTimeout(function(){ self.load(str); }, 500);
		}
	},
	callback_end: function() {
		this.trace('Video Ended');
	},
	callback_play: function() {
		this.trace('Video Play');
	},
	callback_pause: function() {
		this.trace('Video Paused');
	},
	callback_volumechange: function() {
		this.trace('Video Volume Change');
	},
	callback_loading: function() {
		//this.trace('Video data downloading');
	},
	callback_progress: function() {
		//this.trace('Video Time Update');
	},
	callback_ready: function() {
		this.trace('Video Ready');
	},
	dlEventListener: function(e) {
			
		var self = this;

		switch( String(e.data) )
		{
			case 'null':
				// READY
				self.callback_ready();
				self.cInterval();
				self.playhead = 0;
			break;
			case '-1':
				// UNSTARTED
				self.trace('unstarted');
				self.cInterval();
				self.playhead = 0;
			break;
			case '0':
				// ENDED
				self.callback_end();
				self.cInterval();
				self.playhead = 0;
			break;
			case '1':
				// PLAYING
				if(!self.videostarted)
				{
					self.duration = self.proxy.getDuration();

					if(self.startmuted) {
						self.mute();
					} else {
						self.unmute();
					}

					self.videostarted = true;
				}

				// FAUX PROGRESS
				self.callback_progress();
				self.interval = setInterval(function(){
					self.playhead = self.proxy.getCurrentTime();
					self.callback_progress();
				}, 250);

				self.callback_play();
			break;
			case '2':
				// PAUSED
				self.cInterval();
				self.callback_pause();
			break;
			case '3':
				// BUFFERING
				self.cInterval();
				self.callback_loading();
			break;
			case 'tiny':

			break;
			case 'small':

			break;
			case 'medium':

			break;
			case 'large':

			break;
			case 'hd720':

			break;
			case 'hd1080':

			break;
			case 'highres':

			break;
		}
	},
	play: function() {
		this.proxy.playVideo();
	},
	pause: function() {
		this.proxy.pauseVideo();
	},
	stop: function() {
		this.proxy.stopVideo();
		this.proxy.clearVideo();
	},
	replay: function() {
		this.proxy.stopVideo();
		this.proxy.clearVideo();
		this.proxy.playVideo();
	},
	mute: function() {
		this.proxy.mute();
	},
	unmute: function() {
		this.proxy.unMute();
	},
	isMuted: function() {
		return this.proxy.isMuted();
	},
	isPlaying: function() {
		return this.isplaying;
	},
	destroy: function() {
		
		if(this.proxy)
		{
			this.stop();

			this.cInterval();
			this.playhead = 0;

			this.videostarted = false;
			this.playerloaded = false;
		
			this.proxy.destroy();
			this.proxy = null;
		}

	},
	reflow: function() {
		this.proxy.setSize(this.dom_container.offsetWidth, this.dom_container.offsetHeight);
	},
	cInterval: function() {
		clearInterval(this.interval);
	},
	trace: function(str) { if(this.debug) {console.log(str);} }
};