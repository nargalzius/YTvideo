/*!
 *	YOUTUBE VIDEO HELPER
 *
 *	2.9
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
	const SELF = this;

	var fslistener = function(e) {
		if(SELF.isfs) {
			SELF.isfs = false;
			SELF.track_exitfs();
		}
		else {
			SELF.track_enterfs();
			SELF.isfs = true;
		}
	}

	document.addEventListener("fullscreenchange", fslistener, false);
	document.addEventListener("mozfullscreenchange", fslistener, false);
	document.addEventListener("webkitfullscreenchange", fslistener, false);
}

YTVideoPlayer.prototype = {
	debug: true,
	dom_debug: null,
	playerloaded: false,
	proxy: null,
	chromeless: false,
	autoplay: false,
	allowfullscreen: false,
	annotations: false,
	captions: false,
	startmuted: false,
	duration: null,
	playhead: null,
	loop: false,
	interval: null,
	vars: {
		autoplay: 0,
		controls: 1,
		modestbranding: 1,
		disablekb: 1,
		rel: 0,
		showinfo: 0,
		iv_load_policy: 0,
		cc_load_policy: 0,	
		playsinline: 1,
		enablejsapi: 1,
		html5: 1
	},
	ismobile: false,
	videostarted: false,
	iscompleted: false,
	ismuted: false,
	isfs: false,
	checkForMobile() {
		const SELF = this;
		const DESKTOP_AGENTS = [
	        'desktop'
	    ];

	    let mobileFlag = true;

	    if(typeof device !== 'undefined') {
	        // USE DEVICEJS IF AVAILABLE
	        for (let i = 0; i < DESKTOP_AGENTS.length; i++) {
	            let regex;
	                regex = new RegExp(DESKTOP_AGENTS[i], 'i');

	            if( window.document.documentElement.className.match(regex) ) {
	                mobileFlag = false;
	            }
	        }
	    } else {
	        // BACKUP [RUDIMENTARY] DETECTION
	        mobileFlag = 'ontouchstart' in window;
	    }

	    if( mobileFlag ) {
	        SELF.ismobile = true;
	        SELF.trace("mobile browser detected");
	    } else {
	        SELF.ismobile = false;
	        SELF.trace("desktop browser detected");
	    }
	},

	evaluate() {
		const SELF = this;
		
		SELF.cInterval();
		
		SELF.videostarted = false;
		SELF.playhead = null;
		SELF.duration = null;
		
		SELF.vars.iv_load_policy = ( SELF.annotations ) ? 1 : 0;
		SELF.vars.cc_load_policy = ( SELF.captions ) ? 1 : 0;
		SELF.vars.controls = ( SELF.chromeless ) ? 0 : 1;
		SELF.vars.autoplay = ( SELF.autoplay ) ? 1 : 0;
		SELF.vars.fs = ( SELF.allowfullscreen ) ? 1 : 0;
		SELF.vars.loop = ( SELF.loop ) ? 1 : 0;

		// SELF.vars.start
		// SELF.vars.end
		// SELF.vars.origin = window.location.hostname;
		// SELF.vars.widget_referrer

	},
	init(str) {
		const SELF = this;

		if(SELF.ismobile === null) { SELF.checkForMobile(); }

		SELF.dom_container = document.getElementById(str);
	},
	load(str) {
		const SELF = this;

		SELF.trackReset();

		SELF.evaluate();

		if( YTAPILoaded ) {

			if(!SELF.playerloaded) {
				SELF.proxy = new YT.Player(SELF.dom_container.id, {
					height: SELF.dom_container.offsetHeight,
					width: SELF.dom_container.offsetWidth,
					videoId: str,	
					events: {
						'onReady'(e){ 
							SELF.dlEventListener(e);
						},
						'onStateChange'(e){ 
							SELF.dlEventListener(e);
						},
						'onPlaybackQualityChange'(e){ 
							SELF.dlEventListener(e);
						}
					},
					playerVars: SELF.vars
				});

				SELF.proxy.controls = 0;

				SELF.playerloaded = true;
			}
			else
			{
				var tobj = {
					'videoId': str,
					'playerVars': SELF.vars
				};

				if(!SELF.ismobile) {
					SELF.proxy.loadVideoById(tobj);
				}

			}

		} else { 	
			setTimeout(function(){ SELF.load(str); }, 500);
		}
	},
	callback_end() {
		const SELF = this;
			  SELF.trace('------------------ callback_end');
	},
	callback_play() {
		const SELF = this;
			  SELF.trace('------------------ callback_play');
	},
	callback_pause() {
		const SELF = this;
			  SELF.trace('------------------ callback_pause');
	},
	callback_volumechange() {
		const SELF = this;
			  SELF.trace('------------------ callback_volumechange');
	},
	callback_loading() {
		const SELF = this;
			  SELF.trace('------------------ callback_loading');
	},
	callback_progress() {
		const SELF = this;
			  SELF.trace('------------------ callback_progress');
	},
	callback_ready() {
		const SELF = this;
			  SELF.trace('------------------ callback_ready');
	},
	// TRACKING

	track: {
		started: false,
		q25: false,
		q50: false,
		q75: false
	},

	trackReset() {
		const SELF = this;
		
		SELF.track.started = false;
		SELF.track.q25 = false;
		SELF.track.q50 = false;
		SELF.track.q75 = false;
	},
	
	track_start() {
		const SELF = this;
			  SELF.trace('------------------ track_start');
	},

	track_play() {
		const SELF = this;
			  SELF.trace('------------------ track_play');
	},

	track_replay() {
		const SELF = this;
			  SELF.trace('------------------ track_replay');
	},

	track_end() {
		const SELF = this;
			  SELF.trace('------------------ track_end');
	},

	track_pause() {
		const SELF = this;
			  SELF.trace('------------------ track_pause');
	},

	track_mute() {
		const SELF = this;
			  SELF.trace('------------------ track_mute');
	},

	track_unmute() {
		const SELF = this;
			  SELF.trace('------------------ track_unmute');
	},

	track_q25() {
		const SELF = this;
			  SELF.trace('------------------ track_q25');
	},

	track_q50() {
		const SELF = this;
			  SELF.trace('------------------ track_q50');
	},

	track_q75() {
		const SELF = this;
			  SELF.trace('------------------ track_q75');
	},

	track_enterfs() {
		const SELF = this;
			  SELF.trace('------------------ track_enterfs');
	},

	track_exitfs() {
		const SELF = this;
			  SELF.trace('------------------ track_exitfs');
	},
	dlEventListener(e) {
		const SELF = this;

		switch( String(e.data) )
		{
			case 'null':
				// READY
				SELF.callback_ready();
				SELF.cInterval();
				SELF.playhead = 0;
				SELF.trackReset();
			break;
			case '-1':
				// UNSTARTED
				SELF.trace('unstarted');
				SELF.cInterval();
				SELF.playhead = 0;
				SELF.trackReset();
			break;
			case '0':
				// ENDED
				SELF.iscompleted = true;
				SELF.callback_end();
				SELF.track_end();
				SELF.trackReset();
				SELF.cInterval();
				SELF.playhead = 0;
			break;
			case '1':
				// PLAYING
				if(!SELF.videostarted)
				{
					SELF.duration = SELF.proxy.getDuration();

					if(SELF.startmuted) {
						SELF.mute();
					} else {
						SELF.unmute();
					}

					SELF.videostarted = true;
				}

				// FAUX PROGRESS
				SELF.callback_progress();
				SELF.interval = setInterval(function(){
					var phpercentage = 0;

					SELF.playhead = SELF.proxy.getCurrentTime();

					if(SELF.duration)
						phpercentage = ( SELF.playhead / SELF.duration ) * 100;

					// QUARTILES
					if(!SELF.track.q25 && phpercentage >= 25) {
					    SELF.track.q25 = true;
					    
						SELF.track_q25();
					    
					}
					
					if(!SELF.track.q50 && phpercentage >= 50) {
					    SELF.track.q50 = true;
					    
					    SELF.track_q50();
					    
					}
					
					if(!SELF.track.q75 && phpercentage >= 75) {
					    SELF.track.q75 = true;
					    
					    SELF.track_q75();
					    
					}

					// MUTE STATE TRACKER
					if(SELF.ismuted && !SELF.proxy.isMuted()) {
						SELF.ismuted = false;
						SELF.track_unmute();
					}

					if(!SELF.ismuted && SELF.proxy.isMuted()) {
						SELF.ismuted = true;
						SELF.track_mute();
					}


					SELF.callback_progress();

				}, 250);

				SELF.callback_play();
				
				if(!SELF.track.started && !SELF.iscompleted) {
					SELF.track.started = true;
					SELF.track_start();
				}
				else {
					if(SELF.iscompleted) {
						SELF.iscompleted = false;
						SELF.track.started = true;
						SELF.track_replay();
					} else {
						SELF.track_play();
					}
				}

			break;
			case '2':
				// PAUSED
				SELF.cInterval();
				
				if( SELF.duration > SELF.playhead ) {
					SELF.callback_pause();
					SELF.track_pause();
				}
			break;
			case '3':
				// BUFFERING
				SELF.cInterval();
				SELF.callback_loading();
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
	play() {
		const SELF = this;
		SELF.proxy.playVideo();
	},
	pause() {
		const SELF = this;
		SELF.proxy.pauseVideo();
	},
	stop() {
		const SELF = this;
		SELF.proxy.stopVideo();
		SELF.proxy.clearVideo();
		SELF.trackReset();
		SELF.iscompleted = false;
	},
	seek(num) {
		const SELF = this;
		SELF.proxy.seekTo(num);
	},
	replay() {
		const SELF = this;
		SELF.proxy.stopVideo();
		SELF.proxy.clearVideo();
		SELF.proxy.playVideo();
	},
	mute() {
		const SELF = this;
		SELF.proxy.mute();
	},
	unmute() {
		const SELF = this;
		SELF.proxy.unMute();
	},
	isMuted() {
		const SELF = this;
		return SELF.proxy.isMuted();
	},
	isPlaying() {
		const SELF = this;
		return SELF.isplaying;
	},
	destroy() {
		const SELF = this;

		SELF.trackReset();

		if(SELF.proxy)
		{
			SELF.stop();

			SELF.cInterval();
			SELF.playhead = 0;

			SELF.videostarted = false;
			SELF.playerloaded = false;
		
			SELF.proxy.destroy();
			SELF.proxy = null;

			SELF.isfs = false;
		}

	},
	reflow() {
		const SELF = this;
		SELF.proxy.setSize(SELF.dom_container.offsetWidth, SELF.dom_container.offsetHeight);
	},
	cInterval() {
		const SELF = this;
		clearInterval(SELF.interval);
	},
	trace(str) { 
		const SELF = this;

		if(SELF.debug) {

			if(window.console) {
				window.console.log(str);
			}

			if( SELF.dom_debug ) {
				SELF.dom_debug.innerHTML += str + '<br>';
			}
		}
	}
};