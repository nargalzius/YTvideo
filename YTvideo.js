/*!
 *	YOUTUBE VIDEO HELPER
 *
 *	2.2
 *
 *	author: Carlo J. Santos
 *	email: carlosantos@gmail.com
 *	documentation: 
 *
 *	Copyright (c) 2015, All Rights Reserved, www.nargalzius.com
 */

function YTVideoPlayer() {
	let fslistener = (e) => {
		if(this.isfs) {
			this.isfs = false;
			this.track_exitfs();
		}
		else {
			this.track_enterfs();
			this.isfs = true;
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
	allowfullscreen: false,
	duration: null,
	playhead: null,
	interval: null,
	params: {},
	default_params: {
		id: 'video',
		src: 'NkbP-zzZR2w',
		annotations: false,
		captions: false,
		chromeless: false,
		autoplay: false,
		allowfullscreen: false, 
		loop: false,
		startmuted: false,
	},
	vars: {},
	default_vars: {
		autoplay: 0,
		controls: 1,
		modestbranding: 1,
		disablekb: 1,
		rel: 0,
		showinfo: 0,
		// iv_load_policy: 0,
		iv_load_policy: 3,
		cc_load_policy: 0,	
		playsinline: 1,
		enablejsapi: 1,
		html5: 1,
		color: 'white',
		fs: 1,
		loop: 0,

	},
	ismobile: false,
	videostarted: false,
	iscompleted: false,
	ismuted: false,
	isfs: false,
	api: false,
	checkForMobile() {
		const DESKTOP_AGENTS = [
	        'desktop'
	    ];

	    let mobileFlag = true;

	    if( window['device'] ) {
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
	        this.ismobile = true;
	        this.trace("mobile browser detected");
	    } else {
	        this.ismobile = false;
	        this.trace("desktop browser detected");
	    }
	},

	evaluate(params) {
		
		this.cInterval();
		
		this.videostarted = false;
		this.playhead = null;
		this.duration = null;

		this.params = {};
		Object.assign(this.params, this.default_params);
		if(params) for( let key in params ) this.params[key] = params[key];

		this.vars = {};
		Object.assign(this.vars, this.default_vars);
		
		this.vars.iv_load_policy = ( this.params.annotations ) ? 1 : 0;
		this.vars.cc_load_policy = ( this.params.captions ) ? 1 : 0;
		this.vars.controls = ( this.params.chromeless ) ? 0 : 1;
		this.vars.autoplay = ( this.params.autoplay ) ? 1 : 0;
		this.vars.fs = ( this.params.allowfullscreen ) ? 1 : 0;
		this.vars.loop = ( this.params.loop ) ? 1 : 0;

		if( this.params.start )
			this.vars.start = this.params.start;

		if( this.params.end )
			this.vars.end = this.params.end;

		// this.vars.origin = window.location.hostname;
		// this.vars.widget_referrer

	},
	init(params) {

		if( window['YT'] && YT.loaded ) {

			this.evaluate(params);

			if(this.ismobile === null) { this.checkForMobile(); }

			this.dom_container = document.getElementById(params.id);

			this.load(this.params)

		} else {
			setTimeout(() => {
				this.init(params);
			}, 1000);
		}
	},
	load(params) {

		this.trackReset();

		this.evaluate(params);

		if(!this.playerloaded) {
			this.proxy = new YT.Player(this.dom_container.id, {
				height: this.dom_container.offsetHeight,
				width: this.dom_container.offsetWidth,
				videoId: this.params.src,	
				events: {
					'onReady': (e) => { 
						this.dlEventListener(e);
					},
					'onStateChange': (e) => { 
						this.dlEventListener(e);
					},
					'onPlaybackQualityChange': (e) => { 
						this.dlEventListener(e);
					}
				},
				playerVars: this.vars
			});

			this.proxy.controls = 0;

			this.playerloaded = true;
		}
		else
		{
			let tobj = {
				'videoId': this.params.src,
				'playerVars': this.vars
			};

			if(!this.ismobile) {
				this.proxy.loadVideoById(tobj);
			}

		}
	},
	callback_ready() 		{ this.trace('------------------ callback_ready'); },
	callback_end() 			{ this.trace('------------------ callback_end'); },
	callback_play() 		{ this.trace('------------------ callback_play'); },
	callback_pause() 		{ this.trace('------------------ callback_pause'); },
	callback_volumechange() { this.trace('------------------ callback_volumechange'); },
	callback_loading() 		{ /* this.trace('------------------ callback_loading');  */ },
	callback_progress() 	{ /* this.trace('------------------ callback_progress'); */ },
	
	// TRACKING
	track: {
		started: false,
		q25: false,
		q50: false,
		q75: false
	},

	trackReset() {
		
		this.track.started = false;
		this.track.q25 = false;
		this.track.q50 = false;
		this.track.q75 = false;
	},
	
	track_start() 	{ this.trace('------------------ track_start'); },
	track_play() 	{ this.trace('------------------ track_play'); },
	track_replay() 	{ this.trace('------------------ track_replay'); },
	track_end() 	{ this.trace('------------------ track_end'); },
	track_pause() 	{ this.trace('------------------ track_pause'); },
	track_mute() 	{ this.trace('------------------ track_mute'); },
	track_unmute() 	{ this.trace('------------------ track_unmute'); },
	track_q25() 	{ this.trace('------------------ track_q25'); },
	track_q50() 	{ this.trace('------------------ track_q50'); },
	track_q75() 	{ this.trace('------------------ track_q75'); },
	track_enterfs() { this.trace('------------------ track_enterfs'); },
	track_exitfs() 	{ this.trace('------------------ track_exitfs'); },

	dlEventListener(e) {

		switch( String(e.data) )
		{
			case 'null':
				// READY
				this.callback_ready();
				this.cInterval();
				this.playhead = 0;
				this.trackReset();
			break;
			case '-1':
				// UNSTARTED
				this.trace('unstarted');
				this.cInterval();
				this.playhead = 0;
				this.trackReset();
			break;
			case '0':
				// ENDED
				this.iscompleted = true;
				this.callback_end();
				this.track_end();
				this.trackReset();
				this.cInterval();
				this.playhead = 0;
			break;
			case '1':
				// PLAYING
				if(!this.videostarted)
				{
					this.duration = this.proxy.getDuration();

					if( this.params.startmuted ) {
						this.mute();
					} else {
						this.unmute();
					}

					this.videostarted = true;
				}

				// FAUX PROGRESS
				this.callback_progress();
				this.interval = setInterval( () => {
					let phpercentage = 0;

					this.playhead = this.proxy.getCurrentTime();

					if(this.duration)
						phpercentage = ( this.playhead / this.duration ) * 100;

					// QUARTILES
					if(!this.track.q25 && phpercentage >= 25) {
					    this.track.q25 = true;
					    
						this.track_q25();
					    
					}
					
					if(!this.track.q50 && phpercentage >= 50) {
					    this.track.q50 = true;
					    
					    this.track_q50();
					    
					}
					
					if(!this.track.q75 && phpercentage >= 75) {
					    this.track.q75 = true;
					    
					    this.track_q75();
					    
					}

					// MUTE STATE TRACKER
					if(this.ismuted && !this.proxy.isMuted()) {
						this.ismuted = false;
						this.track_unmute();
					}

					if(!this.ismuted && this.proxy.isMuted()) {
						this.ismuted = true;
						this.track_mute();
					}


					this.callback_progress();

				}, 250);

				this.callback_play();
				
				if(!this.track.started && !this.iscompleted) {
					this.track.started = true;
					this.track_start();
				}
				else {
					if(this.iscompleted) {
						this.iscompleted = false;
						this.track.started = true;
						this.track_replay();
					} else {
						this.track_play();
					}
				}

			break;
			case '2':
				// PAUSED
				this.cInterval();
				
				if( this.duration > this.playhead ) {
					this.callback_pause();
					this.track_pause();
				}
			break;
			case '3':
				// BUFFERING
				this.cInterval();
				this.callback_loading();
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
		if(this.proxy) this.proxy.playVideo();
	},
	pause() {
		if(this.proxy) this.proxy.pauseVideo();
	},
	stop() {
		if(this.proxy) {
			this.proxy.stopVideo();
			this.proxy.clearVideo();
		}
		this.trackReset();
		this.iscompleted = false;
	},
	seek(num) {
		if(this.proxy) this.proxy.seekTo(num);
	},
	replay() {
		if(this.proxy) {
			this.proxy.stopVideo();
			this.proxy.clearVideo();
			this.proxy.playVideo();
		}
	},
	mute() {
		if(this.proxy) this.proxy.mute();
	},
	unmute() {
		if(this.proxy) this.proxy.unMute();
	},
	isMuted() {
		return this.proxy.isMuted();
	},
	isPlaying() {
		return this.isplaying;
	},
	destroy() {

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
	reflow() {
		if(this.proxy) this.proxy.setSize(this.dom_container.offsetWidth, this.dom_container.offsetHeight);
	},
	cInterval() {
		clearInterval(this.interval);
	},
	trace(str) { 

		if(this.debug) {

			if(window.console) {
				window.console.log(str);
			}

			if( this.dom_debug ) {
				this.dom_debug.innerHTML += str + '<br>';
			}
		}
	}
};

if( !window['YT'] ) {
	let checkDebug = ( window['console'] && window['debug'] && debug ) ? true : false;

	// NO API YET, LOAD MANUALLY
	if(checkDebug) console.log('LOADING YT API');
	let tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";

	let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	let onYouTubeIframeAPIReady = () => {
	 	if(checkDebug) console.log('YouTube API loaded');
	};
}