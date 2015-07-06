var torusGeom = null;
var material = null;

const COPTER_Z = -40;

function Copter( scene ){
	var self = this;

	var spr;

	function initGeom(){
		// Shared geometry, reusable by each Copter
		if( !torusGeom ) {
			// radius, tube diam, radial segments, tubular segments
			torusGeom = new THREE.TorusGeometry( 10, 3, 16, 100 );
			material = new THREE.MeshBasicMaterial({ color:0x008888, wireframe:true });
		}

		spr = new THREE.Group;
		spr.position.z = COPTER_Z;
		scene.add( spr );

		var torus = new THREE.Mesh( torusGeom, material );
		spr.add( torus );
	}
	initGeom();

	self.perFrame = function( timeMult ) {
		spr.rotation.x += 0.01 * timeMult;
		spr.rotation.y += 0.02 * timeMult;
	}
}
