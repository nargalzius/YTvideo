"use strict";

var _YTVideoPlayer$protot;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 *  YOUTUBE VIDEO HELPER
 *
 *  2.3
 *
 *  author: Carlo J. Santos
 *  email: carlosantos@gmail.com
 *  documentation:
 *
 *  Copyright (c) 2015, All Rights Reserved, www.nargalzius.com
 */

function YTVideoPlayer() {
	var _this = this;

	var fslistener = function fslistener(e) {
		if (_this.flag_fs) {
			_this.flag_fs = false;
			_this.track_exitfs();
		} else {
			_this.track_enterfs();
			_this.flag_fs = true;
		}
	};

	document.addEventListener("fullscreenchange", fslistener, false);
	document.addEventListener("mozfullscreenchange", fslistener, false);
	document.addEventListener("webkitfullscreenchange", fslistener, false);
}

YTVideoPlayer.prototype = (_YTVideoPlayer$protot = {
	debug: false,
	dom_debug: null,
	proxy: null,
	duration: null,
	playhead: null,
	percent: null,
	params: {},
	default_params: {
		dom_id: 'video',
		src: '2b36Fo3R8Qk',
		autoplay: 0,
		controls: 1,
		modestbranding: 1,
		disablekb: 1,
		rel: 0,
		showinfo: 0,
		iv_load_policy: 3,
		cc_load_policy: 0,
		playsinline: 1,
		enablejsapi: 1,
		html5: 1,
		color: 'white',
		fs: 1,
		loop: 0
	},
	ismobile: null,
	issafari: null,
	api: false,
	load_int: null,
	init_int: null,
	prog_int: null,
	flag_playing: false,
	flag_paused: false,
	flag_muted: false,
	flag_fs: false,
	flag_finished: false,
	flag_play_nonce: true,
	flag_mute_nonce: true,
	flag_end_nonce: false,

	evaluate: function evaluate(params) {

		this.cInterval();

		this.flag_playing = false;
		this.playhead = null;
		this.duration = null;

		if (Object.keys(this.params).length === 0 && this.params.constructor === Object) {

			Object.assign(this.params, this.default_params);

			if (params && params.constructor === Object) for (var key in params) {
				this.params[key] = params[key];
			}
		}

		this.trace(this.issafari, 'issafari');

		if (params && params.constructor === Object) {
			for (var _key in params) {
				switch (_key) {
					case 'src':
						this.params.src = params[_key];
						break;
					case 'id':
					case 'dom_id':
						this.params.dom_id = params[_key];
						break;
					case 'color':
						this.params.color = params[_key] ? params[_key] : 'white';
						break;
					case 'annotations':
					case 'iv_load_policy':
						this.params.iv_load_policy = params[_key] ? params[_key] : 3;
						break;
					case 'captions':
						this.params.cc_load_policy = params[_key] ? 1 : 0;
						break;
					case 'chromeless':
						this.params.controls = params[_key] ? 0 : 1;
						break;
					case 'allowfullscreen':
						this.params.fs = params[_key] ? 1 : 0;
						break;
					case 'start':
						this.params.start = params[_key];
						break;
					case 'end':
						this.params.end = params[_key];
						break;
					default:
						this.params[_key] = params[_key] ? 1 : 0;
				}
			}
		} else if (params && params.constructor === String) this.params.src = params;else if (params && params.constructor === Boolean) {} else delete this.params['src'];

		// RESOLVE AUTOPLAY
		if (this.params.autoplay) {
			if (this.ismobile) {
				this.params.autoplay = 0;
				this.params.startmuted = 0;
			} else if (this.issafari && !this.params.startmuted) this.params.autoplay = 0;
		}
	},
	init: function init(params) {
		var _this2 = this;

		if (window['YT'] && YT.loaded) {

			clearInterval(this.init_int);

			this.evaluate(params);
			// this.trace(this.params, 'params (init)');

			this.api = true;

			if (this.ismobile === null) {
				this.checkForMobile();
			}
			if (this.issafari === null) {
				this.checkForSafari();
			}
			if (this.params.src) this.load(this.params, true);
		} else {
			this.init_int = setTimeout(function () {
				_this2.init(params);
			}, 500);
		}
	},
	load: function load(params, bool) {
		var _this3 = this;

		if (this.api) {

			clearInterval(this.load_int);

			if (this.proxy) this.destroy();

			if (!bool) {
				delete this.params['start'];
				delete this.params['end'];
			}

			this.evaluate(params);
			this.trace(this.params, 'params (load)');

			if (!this.dom_container) this.dom_container = document.getElementById(this.params.dom_id);

			this.proxy = new YT.Player(this.params.dom_id, {
				height: this.dom_container.offsetHeight,
				width: this.dom_container.offsetWidth,
				videoId: this.params.src,
				events: {
					'onReady': function onReady(e) {
						_this3.dlEventListener(e);
					},
					'onStateChange': function onStateChange(e) {
						_this3.dlEventListener(e);
					},
					'onPlaybackQualityChange': function onPlaybackQualityChange(e) {
						_this3.dlEventListener(e);
					}
				},
				playerVars: this.params
			});

			// this.proxy.loadVideoById(this.params.src);
		} else {
			this.load_int = setTimeout(function () {
				_this3.load(params, bool);
			}, 500);
		}
	},
	callback_ready: function callback_ready() {
		this.trace('------------------ callback_ready');
	},
	callback_stop: function callback_stop() {
		this.trace('------------------ callback_stop');
	},
	callback_play: function callback_play() {
		this.trace('------------------ callback_play');
	},
	callback_pause: function callback_pause() {
		this.trace('------------------ callback_pause');
	},
	callback_volumechange: function callback_volumechange() {
		this.trace('------------------ callback_volumechange');
	},
	callback_loading: function callback_loading() {/* this.trace('------------------ callback_loading');  */},
	callback_progress: function callback_progress() {/* this.trace('------------------ callback_progress'); */},


	// TRACKING
	track: {
		started: false,
		q25: false,
		q50: false,
		q75: false
	},

	resetTracking: function resetTracking() {
		this.track.started = false;
		this.track.q25 = false;
		this.track.q50 = false;
		this.track.q75 = false;
	},
	track_start: function track_start() {
		this.trace('------------------ track_start');
	},
	track_stop: function track_stop() {
		this.trace('------------------ track_stop');
	},
	track_play: function track_play() {
		this.trace('------------------ track_play');
	},
	track_replay: function track_replay() {
		this.trace('------------------ track_replay');
	},
	track_end: function track_end() {
		this.trace('------------------ track_end');
	},
	track_pause: function track_pause() {
		this.trace('------------------ track_pause');
	},
	track_mute: function track_mute() {
		this.trace('------------------ track_mute');
	},
	track_unmute: function track_unmute() {
		this.trace('------------------ track_unmute');
	},
	track_q25: function track_q25() {
		this.trace('------------------ track_q25');
	},
	track_q50: function track_q50() {
		this.trace('------------------ track_q50');
	},
	track_q75: function track_q75() {
		this.trace('------------------ track_q75');
	},
	track_enterfs: function track_enterfs() {
		this.trace('------------------ track_enterfs');
	},
	track_exitfs: function track_exitfs() {
		this.trace('------------------ track_exitfs');
	},
	dlEventListener: function dlEventListener(e) {
		var _this4 = this;

		this.trace(e.data);

		switch (String(e.data)) {
			case 'null':
				// READY
				this.cInterval();
				this.resetTracking();
				this.callback_ready();
				this.playhead = 0;
				this.duration = this.proxy.getDuration();

				this.trace(this.duration, 'duration');

				if (this.proxy && this.params.startmuted) {
					this.proxy.setVolume(0);
				}
				break;
			case '-1':
				// UNSTARTED
				this.cInterval();
				this.resetTracking();
				this.playhead = 0;
				break;
			case '0':
				// ENDED
				this.flag_finished = true;
				this.cInterval();
				this.resetTracking();

				// this.trace(this.flag_end_nonce, 'flag_end_nonce');

				if (!this.params.end && !this.params.start) {
					this.track_end();
					this.callback_stop();
				} else {
					if (this.flag_end_nonce) {
						this.trace(this.percent, 'percent');
						this.track_end();
						this.callback_stop();
					}
					this.flag_end_nonce = false;
				}

				this.playhead = 0;
				break;
			case '1':
				// PLAYING
				if (!this.flag_playing) this.flag_playing = true;

				// FAUX PROGRESS
				this.callback_progress();

				this.prog_int = setInterval(function () {

					_this4.percent = 0;
					_this4.playhead = _this4.proxy.getCurrentTime();

					if (_this4.duration) {
						if (_this4.params.end || _this4.params.start) {

							var _start = _this4.params.start ? _this4.params.start : 0;
							var _end = _this4.params.end ? _this4.params.end : _this4.duration;

							_this4.percent = _this4.rangePercent(_this4.playhead, _start, _end);
						} else {
							_this4.percent = _this4.playhead / _this4.duration * 100;
						}
					}

					if (_this4.withinRange()) {

						// QUARTILES
						if (!_this4.track.q25 && _this4.percent >= 25) {
							_this4.track.q25 = true;

							_this4.track_q25();
						}

						if (!_this4.track.q50 && _this4.percent >= 50) {
							_this4.track.q50 = true;

							_this4.track_q50();
						}

						if (!_this4.track.q75 && _this4.percent >= 75) {
							_this4.track.q75 = true;

							_this4.track_q75();
						}

						// MUTE STATE TRACKER
						if (_this4.flag_muted && !_this4.proxy.isMuted() && !_this4.flag_mute_nonce) {
							_this4.flag_muted = false;
							_this4.track_unmute();
							_this4.callback_volumechange();
						} else if (!_this4.flag_muted && _this4.proxy.isMuted() && !_this4.flag_mute_nonce) {
							_this4.flag_muted = true;
							_this4.track_mute();
							_this4.callback_volumechange();
						} else {
							_this4.flag_muted = _this4.proxy.isMuted();
							_this4.flag_mute_nonce = false;
						}

						_this4.callback_progress();
					}
				}, 250);

				if (this.withinRange()) this.callback_play();

				if (!this.track.started && !this.flag_finished) {
					this.track.started = true;
					this.flag_play_nonce = true;
					this.flag_mute_nonce = true;
					this.track_start();

					if (this.params.end || this.params.play) {
						this.flag_end_nonce = true;
						this.callback_play();
					}
				} else {
					if (this.flag_finished) {
						this.flag_finished = false;
						this.track.started = true;
						this.flag_play_nonce = true;
						this.flag_mute_nonce = true;
						if (this.withinRange()) this.track_replay();
					} else {
						if (this.flag_playing && !this.flag_play_nonce || this.flag_paused) {
							if (!this.params.end && !this.params.start) {
								this.track_play();
							} else {
								if (this.withinRange()) this.track_play();else {
									// if(this.params.start)
									// 	this.seek(this.params.start);
									this.track_replay();
									this.callback_play();
								}
							}
						}

						this.flag_paused = false;
						this.flag_play_nonce = false;
					}
				}

				break;
			case '2':
				// PAUSED
				this.cInterval();

				if (this.duration > this.playhead && !this.flag_paused) {

					this.flag_paused = true;

					if (this.withinRange()) {
						this.callback_pause();
						this.track_pause();
					}
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
	withinRange: function withinRange() {

		var bool = false;

		if (!this.params.end && !this.params.start) {
			return true;
		} else {
			return this.percent > 0 && this.percent < 95;
		}

		if (this.params.end || this.params.start) {

			this.percent = this.rangePercent(this.playhead, start, end);
		}
	},
	play: function play() {
		if (this.proxy && (!this.flag_paused || this.flag_paused)) this.proxy.playVideo();
	},
	pause: function pause() {
		if (this.proxy) this.proxy.pauseVideo();
	},
	stop: function stop() {
		if (this.proxy) {
			this.proxy.stopVideo();
			this.proxy.clearVideo();
		}

		delete this.params['start'];
		delete this.params['end'];
		this.resetTracking();
		this.resetPlayback();

		this.track_stop();
		this.callback_stop();
	},
	seek: function seek(num) {
		if (this.proxy) this.proxy.seekTo(num);
	},
	replay: function replay() {
		if (this.proxy) {
			this.proxy.stopVideo();
			this.proxy.clearVideo();
			this.proxy.playVideo();
		}
	},
	mute: function mute() {
		if (this.proxy) this.proxy.mute();
	},
	unmute: function unmute() {
		if (this.proxy) this.proxy.unMute();
	}
}, _defineProperty(_YTVideoPlayer$protot, "flag_muted", function flag_muted() {
	return this.proxy.isMuted();
}), _defineProperty(_YTVideoPlayer$protot, "isPlaying", function isPlaying() {
	return this.isplaying;
}), _defineProperty(_YTVideoPlayer$protot, "resetVariables", function resetVariables() {
	this.params = {};
	this.load_int = null;
	this.init_int = null;
	this.prog_int = null;
}), _defineProperty(_YTVideoPlayer$protot, "resetPlayback", function resetPlayback() {
	this.playhead = null;
	this.percent = null;
	this.duration = null;
	this.flag_fs = false;
	this.flag_playing = false;
	this.flag_paused = false;
	this.flag_finished = false;
	this.flag_end_nonce = false;
	this.flag_play_nonce = true;
	this.flag_mute_nonce = true;
}), _defineProperty(_YTVideoPlayer$protot, "destroy", function destroy() {

	if (this.proxy) {
		this.cInterval();
		this.stop();
		this.resetVariables();

		this.proxy.destroy();
		this.proxy = null;
	}
}), _defineProperty(_YTVideoPlayer$protot, "reflow", function reflow() {
	if (this.proxy) this.proxy.setSize(this.dom_container.offsetWidth, this.dom_container.offsetHeight);
}), _defineProperty(_YTVideoPlayer$protot, "cInterval", function cInterval() {
	clearInterval(this.prog_int);
}), _defineProperty(_YTVideoPlayer$protot, "checkForSafari", function checkForSafari() {
	this.issafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
}), _defineProperty(_YTVideoPlayer$protot, "checkForMobile", function checkForMobile() {
	var DESKTOP_AGENTS = ['desktop'];

	var mobileFlag = true;

	if (window['device']) {
		// USE DEVICEJS IF AVAILABLE
		for (var i = 0; i < DESKTOP_AGENTS.length; i++) {
			var regex = void 0;
			regex = new RegExp(DESKTOP_AGENTS[i], 'i');

			if (window.document.documentElement.className.match(regex)) {
				mobileFlag = false;
			}
		}
	} else {
		// BACKUP [RUDIMENTARY] DETECTION
		mobileFlag = 'ontouchstart' in window;
	}

	if (mobileFlag) {
		this.ismobile = true;
	} else {
		this.ismobile = false;
	}
}), _defineProperty(_YTVideoPlayer$protot, "rangePercent", function rangePercent(arg, min, max) {
	return (arg - min) * 100 / (max - min);
}), _defineProperty(_YTVideoPlayer$protot, "trace", function trace(str, str2) {
	if (this.debug) {

		if (window.console) {
			window.console.log(str, str2 ? str2 : '');
		}

		if (this.dom_debug) {
			this.dom_debug.innerHTML += (str2 ? str2 + ': ' : '') + str + '<br>';
		}
	}
}), _YTVideoPlayer$protot);

if (!window['YT']) {
	var checkDebug = window['console'] && window['debug'] && debug ? true : false;

	// NO API YET, LOAD MANUALLY
	if (checkDebug) console.log('LOADING YT API');
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";

	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	var onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
		if (checkDebug) console.log('YouTube API loaded');
	};
}
