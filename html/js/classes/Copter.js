var copterGeom = null;
var rotorGeom = null;

const TORUS_RADIUS = 10.0;
const TUBE_THICKNESS = 0.4;
const TUBE_SEGMENTS = 6;
const COPTER_Z = -20;
const ROTOR_RADIUS = 4.0;
const ROTOR_PARTIAL_ALPHA = 0.3;

const SCALE = 0.25;

function Copter( scene, distanceRatio ){
	var self = this;

	var rotors = [];
	var rotorSpeeds = new Float32Array( 4 );
	for( var i=0; i<4; i++ ) {
		rotorSpeeds[i] = randRange( 0.5, 1.0 );
	}

	const LOC_SPREAD = 15.0;
	var spread = LOC_SPREAD * (1.0+distanceRatio*0.7);
	var targetLoc = new THREE.Vector3( randBi(spread), randBi(spread), COPTER_Z - distanceRatio*30.0 );
	var loc = new THREE.Vector3( targetLoc.x, randRange(-100.0,-10000.0), targetLoc.z + randBi(40.0) );
	var warblePhase = rand(999);

	var spr = new THREE.Group();

	var hue = 0.5;// + (0.1667/2) * distanceRatio;
	var saturation = lerp( 1.0, 0.5, distanceRatio );
	var value = (1.0-distanceRatio*0.8);
	var color0 = hsv2hex( hue, saturation, value );
	var color1 = hsv2hex( rand(), saturation, 1.0-value );

	function tweenToNewTargetLoc(){
		TweenLite.to( targetLoc, randRange(3.0,5.0), {x:randBi(spread), y:randBi(spread), ease:Power2.easeInOut} );
	}

	function initGeom(){
		spr.position.z = COPTER_Z;
		spr.scale.set( SCALE, SCALE, SCALE );
		scene.add( spr );

		var material = new THREE.MeshBasicMaterial({ color:color0, depthTest:true, depthWrite:true });
		var materialAlpha = new THREE.MeshBasicMaterial({ color:color1, opacity:ROTOR_PARTIAL_ALPHA, transparent:true, depthTest:true, depthWrite:true });

		// Shared geometry, reusable by each Copter
		if( !copterGeom ) {
			// radius, tube diam, radial segments, tubular segments
			var copterGeom = new THREE.TorusGeometry( TORUS_RADIUS, TUBE_THICKNESS, TUBE_SEGMENTS, 25 );

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

			// Central box (battery compartment)
			var boxGeom = new THREE.BoxGeometry( 5, 3, 2 );
			var boxMatrix = new THREE.Matrix4().makeTranslation( 0, 0, 1 );
			copterGeom.merge( boxGeom, boxMatrix );

			// Four spheres where the rotors will be
			for( var i=0; i<4; i++ ) {
				var SPHERE_RADIUS = 1.2;
				var sphereGeom = new THREE.SphereGeometry( SPHERE_RADIUS, 4, 4 );
				var angle = ((i+0.5)/2.0) * Math.PI;
				var loc = new THREE.Vector3(
					Math.cos(angle)*TORUS_RADIUS*1.07,
					Math.sin(angle)*TORUS_RADIUS,
					-0.5
				);
				var sphereMatrix = new THREE.Matrix4().makeTranslation( loc.x, loc.y, loc.z );

				copterGeom.merge( sphereGeom, sphereMatrix );

				// Create a rotor at this location
				var rotor = new THREE.Group();
				rotor.position.set( loc.x, loc.y, loc.z - 1.5 );
				spr.add( rotor );
				rotors.push( rotor );

				if( !rotorGeom ) {
					const ROTOR_BLADE_TRIS = 4;
					rotorGeom = new THREE.CircleGeometry( ROTOR_RADIUS, ROTOR_BLADE_TRIS, 0, Math.PI*0.5 );
					rotorGeom.merge( new THREE.CircleGeometry( ROTOR_RADIUS, ROTOR_BLADE_TRIS, Math.PI, Math.PI*0.5 ) );
				}

				var blades0 = new THREE.Mesh( rotorGeom, material );
				var blades1 = new THREE.Mesh( rotorGeom, materialAlpha );
				blades1.rotation.z = Math.PI*0.5;

				rotor.add( blades0 );
				rotor.add( blades1 );

				blades0.renderOrder = blades1.renderOrder = loc.z;
			}

		}

		var copter = new THREE.Mesh( copterGeom, material );
		spr.add( copter );
		copter.renderOrder = loc.z;
	}
	initGeom();

	self.perFrame = function( timeMult ) {
		for( var i=0; i<4; i++ ) {
			rotors[i].rotation.z += rotorSpeeds[i]*timeMult;
		}

		warblePhase += rand()*0.02*timeMult;
		var warbleVector = new THREE.Vector3( Math.cos(warblePhase*2.0), Math.sin(warblePhase*3.0), 0 ).multiplyScalar(3.0);
		var warbleLoc = targetLoc.clone().add( warbleVector );
		loc.lerp( targetLoc, 0.02 ).lerp( warbleLoc, 0.02 );

		spr.rotation.x = 0.5 + Math.cos(warblePhase*1.3)*0.3;
		spr.rotation.z = Math.sin(warblePhase*0.2)*0.1;

		spr.position.copy( loc );

		if( rand()<0.002 ) {
			tweenToNewTargetLoc();
		}
	}
}
