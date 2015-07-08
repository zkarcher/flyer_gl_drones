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

		renderer = new THREE.WebGLRenderer( {canvas:flyer_canvas, antialias:true} );
		renderer.setClearColor( 0xfffff8, 1.0 );
		renderer.sortObjects = false;	// render first-added objects first

		var qs = getQueryParams();
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

	const TITLE_TOP = 60;
	const PUNK_TOP = 114;
	const INFO_TOP = 280;

	function tweenText(){
		TweenLite.to( document.getElementById('title'), 1.5, {delay:3.5, css:{top:TITLE_TOP+"px"}, ease:Power2.easeOut} );
		TweenLite.to( document.getElementById('punk'), 1.5, {delay:4.5, css:{top:PUNK_TOP+"px"}, ease:Power2.easeOut} );
		TweenLite.to( document.getElementById('info'), 1.5, {delay:5.0, css:{top:INFO_TOP+"px"}, ease:Power2.easeOut, onComplete:forceRepaintCSS} );
	}

	function forceRepaintCSS(){
		document.getElementById('title').style.top = TITLE_TOP+'px';
		document.getElementById('punk').style.top = PUNK_TOP+'px';
		document.getElementById('info').style.top = INFO_TOP+'px';
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
window.onload = function(){
 	_flyer = new Flyer();
}
