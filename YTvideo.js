/*!
 *  YOUTUBE VIDEO HELPER
 *
 *  2.4
 *
 *  author: Carlo J. Santos
 *  email: carlosantos@gmail.com
 *  documentation: https://github.com/nargalzius/YTvideo
 *  demo: https://codepen.io/nargalzius/full/gpjoEr
 *  Copyright (c) 2015, All Rights Reserved, www.nargalzius.com
 */

/* eslint-disable no-console */
/* global YT */
/* global debug */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "onYouTubeIframeAPIReady" }] */

function YTVideoPlayer() {
    let fslistener = () => {
        if(this.flag_fs) {
            this.flag_fs = false;
            this.track_exitfs();
        }
        else {
            this.track_enterfs();
            this.flag_fs = true;
        }
    }

    document.addEventListener("fullscreenchange", fslistener, false);
    document.addEventListener("mozfullscreenchange", fslistener, false);
    document.addEventListener("webkitfullscreenchange", fslistener, false);
}

YTVideoPlayer.prototype = {
    debug: false,
    dom_debug: null,
    proxy: null,
    duration: null,
    playhead: null,
    volume: -1,
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
        loop: 0,
        startmuted: false,
        replaywithsound: true
    },
    ismobile: null,
    issafari: null,
    api: false,
    load_int: null,
    init_int: null,
    prog_int: null,
    flag_ready: false,
    flag_playing: false,
    flag_paused: false,
    flag_muted: false,
    flag_fs: false,
    flag_finished: false,
    flag_play_nonce: true,
    flag_mute_nonce: true,
    flag_end_nonce: false,
    flag_vol_nonce: true,

    evaluate(params) {

        this.cInterval();

        this.flag_playing = false;
        this.playhead = null;
        this.duration = null;

        if( Object.keys(this.params).length === 0 )
            for( let key in this.default_params )
                this.params[key] = this.default_params[key];

        if( params && params.constructor === Object ) {
            for( let key in params ) {
                switch(key) {
                    case 'src':
                        this.params.src = params[key];
                    break;
                    case 'id':
                    case 'dom_id':
                        this.params.dom_id = params[key];
                    break;
                    case 'color':
                        this.params.color = params[key] ? params[key] : 'white';
                    break;
                    case 'annotations':
                    case 'iv_load_policy':
                        this.params.iv_load_policy = params[key] ? params[key] : 3;
                    break;
                    case 'captions':
                        this.params.cc_load_policy = params[key] ? 1 : 0;
                    break;
                    case 'chromeless':
                        this.params.controls = params[key] ? 0 : 1;
                    break;
                    case 'allowfullscreen':
                        this.params.fs = params[key] ? 1 : 0;
                    break;
                    case 'start':
                        this.params.start = params[key];
                    break;
                    case 'end':
                        this.params.end = params[key];
                    break;
                    default:
                        this.params[key] = params[key] ? 1 : 0;
                }
            }
        } else
        if( params && params.constructor === String )
            this.params.src = params;
        else
        if( params && params.constructor === Boolean ) {
            // INTENTIONALLY BLANK
        } else
            delete this.params['src'];


        // RESOLVE AUTOPLAY
        if( this.params.autoplay ) {
            if( this.ismobile ) {
                this.params.autoplay = 0;
                this.params.startmuted = 0;
            } else 
            if ( this.issafari && !this.params.startmuted )
                this.params.autoplay = 0;
        }

        // RESOLVE INITIAL MUTE
        if( this.params.startmuted )
            this.flag_muted = true;
    },

    init(params) {

        if( window['YT'] && YT.loaded ) {

            clearInterval(this.init_int);

            this.evaluate(params);

            this.api = true;

            if( this.ismobile === null ) { this.checkForMobile(); }
            if( this.issafari === null ) { this.checkForSafari(); }
            if( this.params.src ) 
                this.load(this.params, true);
            else
                this.trace(this.params, 'params (init)');
            
        } else {
            this.init_int = setTimeout(() => { this.init(params); }, 500);
        }
    },

    load(params, bool) {
        this.flag_ready = false;

        if(this.api) {

            clearInterval(this.load_int);

            if(this.proxy) this.destroy();

            if(!bool) {
                delete this.params['start'];
                delete this.params['end'];
            }

            this.evaluate(params);
            this.trace(this.params, 'params (load)');

            if(!this.dom_container) this.dom_container = document.getElementById(this.params.dom_id);

            this.proxy = new YT.Player(this.params.dom_id, {
                height: this.dom_container.offsetHeight,
                width: this.dom_container.offsetWidth,
                videoId: this.params.src,
                events: {
                    'onReady': (e) => {
                        this.eventHandler(e);
                    },
                    'onStateChange': (e) => {
                        this.eventHandler(e);
                    },
                    'onPlaybackQualityChange': (e) => {
                        this.eventHandler(e);
                    }
                },
                playerVars: this.params
            });

            // this.proxy.loadVideoById(this.params.src);

        } else {
            this.load_int = setTimeout(() => { this.load(params, bool); }, 500);
        }
    },

    callback_ready()        { this.trace('------------------ callback_ready');              },
    callback_stop()         { this.trace('------------------ callback_stop');               },
    callback_play()         { this.trace('------------------ callback_play');               },
    callback_start()        { this.trace('------------------ callback_start');              },
    callback_pause()        { this.trace('------------------ callback_pause');              },
    callback_volumechange() { this.trace('------------------ callback_volumechange');       },
    callback_loading()      { /* this.trace('------------------ callback_loading');  */     },
    callback_progress()     { /* this.trace('------------------ callback_progress'); */     },

    // TRACKING
    track: {
        started: false,
        q25: false,
        q50: false,
        q75: false
    },

    resetTracking() {
        this.track.started = false;
        this.track.q25 = false;
        this.track.q50 = false;
        this.track.q75 = false;
    },

    track_start()   { this.trace('------------------ track_start'); },
    track_stop()    { this.trace('------------------ track_stop'); },
    track_play()    { this.trace('------------------ track_play'); },
    track_replay()  { this.trace('------------------ track_replay'); },
    track_end()     { this.trace('------------------ track_end'); },
    track_pause()   { this.trace('------------------ track_pause'); },
    track_mute()    { this.trace('------------------ track_mute'); },
    track_unmute()  { this.trace('------------------ track_unmute'); },
    track_q25()     { this.trace('------------------ track_q25'); },
    track_q50()     { this.trace('------------------ track_q50'); },
    track_q75()     { this.trace('------------------ track_q75'); },
    track_enterfs() { this.trace('------------------ track_enterfs'); },
    track_exitfs()  { this.trace('------------------ track_exitfs'); },

    eventHandler(e) {

        // this.trace(e.data, 'YTEvent');

        switch( String(e.data) )
        {
            case 'null':
                // READY
                this.flag_ready = true;
                this.cInterval();
                this.resetTracking();
                this.callback_ready();
                this.playhead = 0;
                this.duration = this.proxy.getDuration();

                this.trace(this.duration, 'duration')

                if( this.proxy ) {
                    if(this.params.startmuted) {
                        this.mute();
                    } else {
                        this.unmute();
                    }
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
                this.cInterval();
                this.resetTracking();

                if(this.flag_end_nonce) {
                    this.track_end();
                    this.callback_stop();
                    
                    this.playhead = 0;
                    this.flag_finished = true;
                    this.flag_playing = false;
                    this.flag_paused = false;

                    if(this.params.replaywithsound)
                        this.unmute();
                }
                this.flag_end_nonce = false;
                this.flag_play_nonce = true;
            break;
            case '1':
                // FAUX PROGRESS
                this.callback_progress();

                this.prog_int = setInterval( () => {

                    this.percent = 0;
                    this.playhead = this.proxy.getCurrentTime();

                    if(this.duration) 
                        this.getPercent();

                    if( this.withinRange() ) {

                        // QUARTILES
                        if(!this.track.q25 && this.percent >= 25) {
                            this.track.q25 = true;

                            this.track_q25();

                        }

                        if(!this.track.q50 && this.percent >= 50) {
                            this.track.q50 = true;

                            this.track_q50();

                        }

                        if(!this.track.q75 && this.percent >= 75) {
                            this.track.q75 = true;

                            this.track_q75();

                        }

                        let proxy = this.proxy;
                        let vol = proxy.getVolume();
                        let muted = proxy.isMuted();

                        if( vol != this.volume || this.flag_muted != muted ) {

                            if( this.flag_muted != muted ) {
                                if(muted) {
                                    this.track_mute();
                                } else {
                                    this.track_unmute();
                                }
                            }

                            if(!this.flag_vol_nonce)
                                this.callback_volumechange();

                            this.flag_vol_nonce = false;
                            this.flag_muted = muted;
                            this.volume = proxy.getVolume();

                        } 

                        this.callback_progress();
                    }

                }, 250);

                if(!this.track.started && !this.flag_finished) {
                    this.track.started = true;
                    this.flag_playing = true;
                    this.flag_paused = false;
                    this.flag_end_nonce = true;

                    this.flag_mute_nonce = true;
                    
                    this.track_start();
                    this.callback_start();
                    this.callback_play();

                    this.flag_play_nonce = true;
                }
                else
                if(this.flag_finished) {
                    if(!this.flag_play_nonce) {

                        if(!this.track.started) {
                            this.track.started = true;
                            this.flag_playing = true;
                            this.flag_paused = false;
                            this.flag_end_nonce = true;

                            this.track_replay();
                            this.callback_start();
                            this.callback_play();
                            if(this.params.start)
                                this.seek(this.params.start);
                        } else {
                            if(this.withinRange()){
                                this.flag_paused = false;
                                this.track_play();
                                this.callback_play();
                            }
                        }
                    }
                    // SKIP EXTRANEOUS EVENT (REGULAR)
                    this.flag_play_nonce = false;
                } else {
                    if(this.withinRange()){
                        this.flag_paused = false;
                        this.track_play();
                        this.callback_play();
                    }
                }
            break;
            case '2':
                // PAUSED
                this.cInterval();

                if( this.duration > this.playhead && !this.flag_paused) {

                    this.flag_paused = true;

                    if( this.withinRange() ) {
                        this.track_pause();
                        this.callback_pause();
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
            default:
                this.trace(e.data);
        }
    },

    getPercent() {
        let start = this.params.start ? this.params.start : 0;
        let end = this.params.end ? this.params.end : this.duration;

        this.percent = this.rangePercent(this.playhead, start, end);
    },

    isRanged() {
        return this.params.start || this.params.end;
    },

    withinRange() {
        this.getPercent();
        return this.percent > 0 && this.percent < 99;
    },

    play() {
        if(this.proxy && ( !this.flag_paused || this.flag_paused) ) this.proxy.playVideo();
    },
    
    pause() {
        if(this.proxy) this.proxy.pauseVideo();
    },
    
    stop() {

        this.flag_playing = false;

        if(this.proxy && this.flag_ready) {
            this.proxy.stopVideo();
            this.proxy.clearVideo();
        }

        this.resetTracking();
        this.resetPlayback();

        this.track_stop();
        this.callback_stop();
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

    resetVariables() {
        this.params = {};
        this.load_int = null;
        this.init_int = null;
        this.prog_int = null;
    },

    resetPlayback() {
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
    },

    destroy() {

        if(this.proxy)
        {
            this.cInterval();
            this.stop();
            this.resetVariables();

            this.proxy.destroy();
            this.proxy = null;

        }

    },
    reflow() {
        if(this.proxy) this.proxy.setSize(this.dom_container.offsetWidth, this.dom_container.offsetHeight);
    },
    cInterval() {
        clearInterval(this.prog_int);
    },

    checkForSafari() {
        this.issafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    },

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
        } else {
            this.ismobile = false;
        }
    },

    rangePercent(arg, min, max) {
        return ((arg - min) * 100) / (max - min)
    },

    trace(str, str2) {
        if(this.debug) {
            if(window['console']) console.log(str, str2 ? str2 : '');

            if( this.dom_debug ) {
                this.dom_debug.innerHTML += ( str2 ? str2 + ': ' : '' ) + str + '<br>';
            }
        }
    }
};

if( !window['YT'] ) {
    let checkDebug = window['console'] && window['debug'] && debug ? true : false;

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