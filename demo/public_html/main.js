function init(){var n=new YTVideoPlayer;n.callback_progress=function(){},n.init("videoPlayer"),n.startmuted=!0,n.autoplay=!0,n.captions=!0,n.load("NkbP-zzZR2w"),setTimeout(function(){},8e3)}(function(){var n,e,o,t,i,r,a,d,c,l;e=window.device,n={},window.device=n,t=window.document.documentElement,l=window.navigator.userAgent.toLowerCase(),n.ios=function(){return n.iphone()||n.ipod()||n.ipad()},n.iphone=function(){return!n.windows()&&i("iphone")},n.ipod=function(){return i("ipod")},n.ipad=function(){return i("ipad")},n.android=function(){return!n.windows()&&i("android")},n.androidPhone=function(){return n.android()&&i("mobile")},n.androidTablet=function(){return n.android()&&!i("mobile")},n.blackberry=function(){return i("blackberry")||i("bb10")||i("rim")},n.blackberryPhone=function(){return n.blackberry()&&!i("tablet")},n.blackberryTablet=function(){return n.blackberry()&&i("tablet")},n.windows=function(){return i("windows")},n.windowsPhone=function(){return n.windows()&&i("phone")},n.windowsTablet=function(){return n.windows()&&i("touch")&&!n.windowsPhone()},n.fxos=function(){return(i("(mobile;")||i("(tablet;"))&&i("; rv:")},n.fxosPhone=function(){return n.fxos()&&i("mobile")},n.fxosTablet=function(){return n.fxos()&&i("tablet")},n.meego=function(){return i("meego")},n.cordova=function(){return window.cordova&&"file:"===location.protocol},n.nodeWebkit=function(){return"object"==typeof window.process},n.mobile=function(){return n.androidPhone()||n.iphone()||n.ipod()||n.windowsPhone()||n.blackberryPhone()||n.fxosPhone()||n.meego()},n.tablet=function(){return n.ipad()||n.androidTablet()||n.blackberryTablet()||n.windowsTablet()||n.fxosTablet()},n.desktop=function(){return!n.tablet()&&!n.mobile()},n.television=function(){var n,e=["googletv","viera","smarttv","internet.tv","netcast","nettv","appletv","boxee","kylo","roku","dlnadoc","roku","pov_tv","hbbtv","ce-html"];for(n=0;n<e.length;){if(i(e[n]))return!0;n++}return!1},n.portrait=function(){return window.innerHeight/window.innerWidth>1},n.landscape=function(){return window.innerHeight/window.innerWidth<1},n.noConflict=function(){return window.device=e,this},i=function(n){return-1!==l.indexOf(n)},a=function(n){var e;return e=new RegExp(n,"i"),t.className.match(e)},o=function(n){var e=null;a(n)||(e=t.className.replace(/^\s+|\s+$/g,""),t.className=e+" "+n)},c=function(n){a(n)&&(t.className=t.className.replace(" "+n,""))},n.ios()?n.ipad()?o("ios ipad tablet"):n.iphone()?o("ios iphone mobile"):n.ipod()&&o("ios ipod mobile"):n.android()?o(n.androidTablet()?"android tablet":"android mobile"):n.blackberry()?o(n.blackberryTablet()?"blackberry tablet":"blackberry mobile"):n.windows()?o(n.windowsTablet()?"windows tablet":n.windowsPhone()?"windows mobile":"desktop"):n.fxos()?o(n.fxosTablet()?"fxos tablet":"fxos mobile"):n.meego()?o("meego mobile"):n.nodeWebkit()?o("node-webkit"):n.television()?o("television"):n.desktop()&&o("desktop"),n.cordova()&&o("cordova"),r=function(){n.landscape()?(c("portrait"),o("landscape")):(c("landscape"),o("portrait"))},d=Object.prototype.hasOwnProperty.call(window,"onorientationchange")?"orientationchange":"resize",window.addEventListener?window.addEventListener(d,r,!1):window.attachEvent?window.attachEvent(d,r):window[d]=r,r(),"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return n}):"undefined"!=typeof module&&module.exports?module.exports=n:window.device=n}).call(this),$(document).ready(init);