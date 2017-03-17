/*!
 *	YOUTUBE VIDEO HELPER
 *
 *	2.7
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
	 	if(window.console && typeof debug !== 'undefined') console.log('YouTube API loaded');
	};

	var onPlaybackQualityChange = function(e) {
		console.log('quality changed to: '+e);
	};
}

// var YTVideoPlayer = function(){
function YTVideoPlayer() {

	var self = this;

	var fslistener = function(e) {
		if(self.isfs) {
			self.isfs = false;
			self.track_exitfs();
		}
		else {
			self.track_enterfs();
			self.isfs = true;
		}
	}

	document.addEventListener("fullscreenchange", fslistener, false);
	document.addEventListener("mozfullscreenchange", fslistener, false);
	document.addEventListener("webkitfullscreenchange", fslistener, false);
}

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
		iv_load_policy: 0,
		wmode: 'transparent',
		html5: 1
	},
	ismobile: false,
	videostarted: false,
	iscompleted: false,
	ismuted: false,
	isfs: false,

	desktopAgents: [
		'desktop'
	],

	checkForMobile: function() {

		var mobileFlag = true;

		for (var i = 0; i < this.desktopAgents.length; i++) {
			var regex;
				regex = new RegExp(this.desktopAgents[i], "i");

			if( window.document.documentElement.className.match(regex) ) {
				mobileFlag = false;
			}
		}

		if( mobileFlag ) {
			this.ismobile = true;
			this.trace("mobile browser detected");
		} else {
			this.ismobile = false;
			this.trace("desktop browser detected");
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

		var self = this;

		if(this.ismobile === null) { this.checkForMobile(); }

		this.dom_container = document.getElementById(str);
	},
	load: function(str)
	{
		var self = this;

		self.trackReset();

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
	// TRACKING

	track: {
		started: false,
		q25: false,
		q50: false,
		q75: false
	},

	trackReset: function() {
		
		var self = this;
		
		self.track.started = false;
		self.track.q25 = false;
		self.track.q50 = false;
		self.track.q75 = false;
	},
	
	track_start: function() {
		// console.log('track start');
	},

	track_play: function() {
		// console.log('track play');
	},

	track_replay: function() {
		// console.log('track replay');
	},

	track_end: function() {
		// console.log('track end');
	},

	track_pause: function() {
		// console.log('track pause');
	},

	track_mute: function() {
		// console.log('track mute');
	},

	track_unmute: function() {
		// console.log('track unmute');
	},

	track_q25: function() {
		// console.log('track first quartile');
	},

	track_q50: function() {
		// console.log('track midpoint');
	},

	track_q75: function() {
		// console.log('track third quartile');
	},

	track_enterfs: function() {
		
	},

	track_exitfs: function() {
		
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
				self.trackReset();
			break;
			case '-1':
				// UNSTARTED
				self.trace('unstarted');
				self.cInterval();
				self.playhead = 0;
				self.trackReset();
			break;
			case '0':
				// ENDED
				this.iscompleted = true;
				self.callback_end();
				self.track_end();
				self.trackReset();
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
					var phpercentage = 0;

					self.playhead = self.proxy.getCurrentTime();

					if(self.duration)
						phpercentage = ( self.playhead / self.duration ) * 100;

					// QUARTILES
					if(!self.track.q25 && phpercentage >= 25) {
					    self.track.q25 = true;
					    
						self.track_q25();
					    
					}
					
					if(!self.track.q50 && phpercentage >= 50) {
					    self.track.q50 = true;
					    
					    self.track_q50();
					    
					}
					
					if(!self.track.q75 && phpercentage >= 75) {
					    self.track.q75 = true;
					    
					    self.track_q75();
					    
					}

					// MUTE STATE TRACKER
					if(self.ismuted && !self.proxy.isMuted()) {
						self.ismuted = false;
						self.track_unmute();
					}

					if(!self.ismuted && self.proxy.isMuted()) {
						self.ismuted = true;
						self.track_mute();
					}


					self.callback_progress();

				}, 250);

				self.callback_play();
				
				if(!self.track.started && !self.iscompleted) {
					self.track.started = true;
					self.track_start();
				}
				else {
					if(self.iscompleted) {
						self.iscompleted = false;
						self.track.started = true;
						self.track_replay();
					} else {
						self.track_play();
					}
				}

			break;
			case '2':
				// PAUSED
				self.cInterval();
				
				if( self.duration > self.playhead ) {
					self.callback_pause();
					self.track_pause();
				}
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
		this.trackReset();
		this.iscompleted = false;
	},
	seek: function(num) {
		this.proxy.seekTo(num);
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
		
		this.trackReset();

		if(this.proxy)
		{
			this.stop();

			this.cInterval();
			this.playhead = 0;

			this.videostarted = false;
			this.playerloaded = false;
		
			this.proxy.destroy();
			this.proxy = null;

			this.isfs = false;
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