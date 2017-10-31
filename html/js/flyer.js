console.log("Hello world! Unleash the drones");

const WIDTH = 1920;
const HEIGHT = 1080;

const COPTER_COUNT = 160;

var Flyer = function(){
	var self = this;

	console.log("Flyer [CTOR]");

	var scene, camera, renderer, stats;
	var prevMS = 0;

	var flyer_canvas = document.getElementById( "flyer_canvas" );

	var copters = [];

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
		camera = new THREE.PerspectiveCamera(50, 1920.0 / 1080.0);
		//scene.add( camera );

		var qs = getQueryParams();

		// Prefer WebGLRenderer, fallback to CanvasRenderer if not available
		//if( qs['canvas'] ) Detector.webgl = false;	// u mad?
		console.log("Detector.webgl:", Detector.webgl);

		var params = {canvas:flyer_canvas, antialias:true};
		renderer = Detector.webgl ? new THREE.WebGLRenderer( params ) : new THREE.CanvasRenderer( params );
		renderer.setClearColor( 0xfffff8, 1.0 );
		renderer.sortObjects = false;	// render first-added objects first
		renderer.setPixelRatio( window.devicePixelRatio );
		if( !Detector.webgl ) renderer.setSize( 1920, 1080 );

		if( qs['fps'] ) {
			stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = '0px';
			stats.domElement.style.left = '0px';
			document.body.appendChild( stats.domElement );
		}

		// Optimization: painter's algorithm. Render Copters back to front
		var ratios = [];
		for( var i=0; i<COPTER_COUNT; i++ ) {
			ratios.push( rand() );
		}
		//ratios.sort();

		for( var i=0; i<COPTER_COUNT; i++ ) {
			var copter = new Copter( scene, ratios[COPTER_COUNT-i-1] );
			copters.push( copter );
		}
	}

	const TITLE_TOP = 320;
	const PUNK_TOP = 114;
	const INFO_TOP = 280;

	function tweenText(){
		TweenLite.to( document.getElementById('title'), 1.5, {delay:2.5, css:{top:TITLE_TOP+"px"}, ease:Power2.easeOut} );
		/*
		TweenLite.to( document.getElementById('punk'), 1.5, {delay:4.5, css:{top:PUNK_TOP+"px"}, ease:Power2.easeOut} );
		TweenLite.to( document.getElementById('info'), 1.5, {delay:5.0, css:{top:INFO_TOP+"px"}, ease:Power2.easeOut, onComplete:forceRepaintCSS} );
		*/
	}

	function forceRepaintCSS(){
		document.getElementById('title').style.top = TITLE_TOP+'px';
		document.getElementById('punk').style.top = PUNK_TOP+'px';
		document.getElementById('info').style.top = INFO_TOP+'px';
	}

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame    ||
						function( callback ){
							window.setTimeout(callback, 1000 / 60);
						};
	})();

	var didTweenText = false;
	function perFrame() {
		requestAnimFrame( perFrame );

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
window.onload = function(){
	 _flyer = new Flyer();
}
