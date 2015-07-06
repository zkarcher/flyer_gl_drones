console.log("Hello world! Unleash the drones");

const WIDTH = 480;
const HEIGHT = 480;

const COPTER_COUNT = 90;

var Flyer = function(){
	var self = this;

	console.log("Flyer [CTOR]");

	var scene, camera, renderer, stats;
	var prevMS = 0;

	var flyer_canvas = document.getElementById( "flyer_canvas" );

	var copters = [];

	document.onkeydown = function(evt){
		/*
		//console.log("down", evt.keyCode);
		if( (37<=evt.keyCode) && (evt.keyCode<=40) ) {
			isKeyboardDriving = true;

			switch( evt.keyCode ) {
				case 37:	keyDirX = -1; break;	// left
				case 39:	keyDirX = 1; break;	// right
				case 38:	keyDirY = 1; break;	// up
				case 40:	keyDirY = -1; break;	// down
			}
		}
		*/
	}
	document.onkeyup = function(evt){
		/*
		//console.log("up", evt.keyCode);
		switch( evt.keyCode ) {
			case 37:	if( keyDirX === -1) { keyDirX = 0; break; }	// left
			case 39:	if( keyDirX === 1) { keyDirX = 0; break; }	// right
			case 38:	if( keyDirY === 1 ) { keyDirY = 0; break; }	// up
			case 40:	if( keyDirY === -1 ) { keyDirY = 0; break; }	// down
		}
		*/
	}

	function getQueryParams() {
	    qs = document.location.search.replace(/\+/g, " ");
	    var params = {},
	        re = /[?&]?([^=]+)=([^&]*)/g,
	        tokens;

	    while (tokens = re.exec(qs)) {
	        params[decodeURIComponent(tokens[1])]
	            = decodeURIComponent(tokens[2]);
	    }

	    return params;
	}

	function init3D(){
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera();
		//scene.add( camera );

		renderer = new THREE.WebGLRenderer( {canvas:flyer_canvas} );
		renderer.setClearColor( 0xfffff8, 1.0 );

		var qs = getQueryParams();
		if( qs['fps'] ) {
			stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = '0px';
			stats.domElement.style.left = '0px';
			document.body.appendChild( stats.domElement );
		}

		for( var i=0; i<COPTER_COUNT; i++ ) {
			var copter = new Copter( scene );
			copters.push( copter );
		}
	}

	function tweenText(){
		TweenLite.to( document.getElementById('title'), 1.5, {delay:3.5, css:{top:"80px"}, ease:Power2.easeOut} );
		TweenLite.to( document.getElementById('info'), 1.5, {delay:5.0, css:{bottom:"430px"}, ease:Power2.easeOut} );
	}

	var didTweenText = false;
	function perFrame() {
		requestAnimationFrame( perFrame );

		// Frame rate may not be constant 60fps. Time between frames determines how
		// quickly to advance animations.
		var ms = new Date();
		var elapsed = (ms - prevMS) * 0.001;	// ms to seconds
		var timeMult = elapsed * 60.0;			// Animations are cooked at 60fps :P
		timeMult = Math.min( 4.0, timeMult );	// Prevent grievous skipping
		prevMS = ms;

		for( var i=0; i<COPTER_COUNT; i++ ) {
			copters[i].perFrame( timeMult );
		}

		renderer.render( scene, camera );

		if( stats ) stats.update();

		// Make sure DOM is ready before tweening text
		if( !didTweenText ) {
			if( document.getElementById('title') ) {
				didTweenText = true;
				tweenText();
			}
		}
	}

	// Create scene & camera
	init3D();

	// start render loop
	perFrame();
}

var _flyer;
window.addEventListener("DOMContentLoaded", function(){
 	_flyer = new Flyer();
}, false );
