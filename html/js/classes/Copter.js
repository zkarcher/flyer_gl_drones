var copterGeom = null;
var material = null;

const TORUS_RADIUS = 10.0;
const TUBE_THICKNESS = 0.4;
const TUBE_SEGMENTS = 6;
const COPTER_Z = -40;

function Copter( scene ){
	var self = this;

	var spr;

	function initGeom(){
		// Shared geometry, reusable by each Copter
		if( !copterGeom ) {
			// radius, tube diam, radial segments, tubular segments
			var copterGeom = new THREE.TorusGeometry( TORUS_RADIUS, TUBE_THICKNESS, TUBE_SEGMENTS, 100 );

			var peaceArmTopBottomGeom = new THREE.CylinderGeometry( TUBE_THICKNESS, TUBE_THICKNESS, TORUS_RADIUS*2, TUBE_SEGMENTS, 1, false );
			copterGeom.merge( peaceArmTopBottomGeom );

			// 2 more peace arms: left, right
			for( var i=-1; i<=1; i+=2 ) {
				var armGeom = new THREE.CylinderGeometry( TUBE_THICKNESS, TUBE_THICKNESS, TORUS_RADIUS, TUBE_SEGMENTS, 1, false );

				var matrix = new THREE.Matrix4();
				matrix.makeTranslation( 0, TORUS_RADIUS/2, 0 );

				var rotMatrix = new THREE.Matrix4().makeRotationZ( (1.0+i*0.333)*Math.PI );
				rotMatrix.multiply( matrix );

				copterGeom.merge( armGeom, rotMatrix );
			}

			material = new THREE.MeshBasicMaterial({ color:0x008888, wireframe:true });
		}

		spr = new THREE.Group;
		spr.position.z = COPTER_Z;
		scene.add( spr );

		var copter = new THREE.Mesh( copterGeom, material );
		spr.add( copter );
	}
	initGeom();

	self.perFrame = function( timeMult ) {
		spr.rotation.x += 0.01 * timeMult;
		spr.rotation.y += 0.02 * timeMult;
	}
}
