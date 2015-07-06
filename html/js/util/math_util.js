// Interpolates between fromVal (progress==0) up to toVal (progress==1.0).
function lerp( fromVal, toVal, progress ) {
	return fromVal + (toVal-fromVal)*progress;
}

// ThreeJS: Vector interpolation is a destructive operation, and/or some functions (.lerpVectors) are buggy!
function lerpVector3( v0, v1, progress ) {
	return new THREE.Vector3( v0.x+(v1.x-v0.x)*progress, v0.y+(v1.y-v0.y)*progress, v0.z+(v1.z-v0.z)*progress );
}

// Convenient randomness functions
function maybe() {
	return Math.random() < 0.5;
}

// Returns a random number between 0..maxValue
function rand( maxValue ) {
	return Math.random() * (maxValue || 1.0);
}

// Returns a random number between fromValue..toValue
function randRange( fromValue, toValue ) {
	return Math.random() * (toValue-fromValue) + fromValue;
}

// Returns a random number between -value..value ("bi" == bipolar)
function randBi( value ) {
	return Math.random() * (2*(value||1.0)) - (value||1.0);
}

function randRangeBi( v0, v1 ) {
	return (Math.random() * (v1-v0)+v0) * ((Math.random()<0.5) ? 1 : -1);
}

function randInt( maxValue ) {
	return Math.floor( Math.random()*maxValue );
}

function randFromArray( ar ) {
	return ar[ randInt(ar.length) ];
}

// Constrains (clips) the value between min..max
function clamp( value, min, max ) {
	return Math.min( max, Math.max( min, value ));
}

// Wrap-around functions. Similar to modulus (%) but smarter handling of negative values.
function wrap( value, height ) {
	return value - (Math.floor( value / height ) * height);
}

// Wraps value as close to target as possible.
function wrapCloseToTarget( value, height, target ) {
	var diff = target - value;
	return value + (Math.round(diff/height) * height);
}

function hex2rgb8( hex ) {
	return {
		r:	((hex&0xff0000)>>16),
		g:	((hex&0x00ff00)>> 8),
		b:	((hex&0x0000ff)    )
	};
}

function hex2rgb_f( hex ) {
	return {
		r:	((hex&0xff0000)>>16) * (1.0/0xff),
		g:	((hex&0x00ff00)>> 8) * (1.0/0xff),
		b:	((hex&0x0000ff)    ) * (1.0/0xff)
	};
}

function getTouchX( event ) {
	if( event.hasOwnProperty('clientX') ) return event['clientX'];
	if( event.hasOwnProperty('touches') ) return event['touches'][0]['clientX'];
	if( event.hasOwnProperty('originalEvent') ) return event['originalEvent']['touches'][0]['clientX'];
	console.log("** getTouchX: error", event);
}
function getTouchY( event ) {
	if( event.hasOwnProperty('clientY') ) return event['clientY'];
	if( event.hasOwnProperty('touches') ) return event['touches'][0]['clientY'];
	if( event.hasOwnProperty('originalEvent') ) return event['originalEvent']['touches'][0]['clientY'];
	console.log("** getTouchY: error", event);
}

// Fixes problems with dat.GUI, '#123456' is converted to int.
// Known problems: Does not assert anything about the incoming argument.
function colorToInt( thing ) {
	var str = String(thing);
	if( str.substr(0,1) == '#' ) {
		return parseInt( '0x' + substr(1) );	// Drop '#', assume the rest is hex
	}
	return parseInt(thing);
}

function rotateVec2( v2, addAngle ){
	var len = v2.length();
	var angle = Math.atan2( v2.y, v2.x );
	v2.set( len * Math.cos(angle+addAngle), len * Math.sin(angle+addAngle) );
}

function hsv2rgb( h, s, v ) {
  // Expand H by 6 times for the 6 color regions. Wrap the remainder to 0..1
  var hWrap = (h*6.0);
  hWrap = hWrap - Math.floor(hWrap);  // floating point remainder. 0..1 for each of the 6 color regions

  //float v = vF;  // top (max) value
  var p = v * (1.0-s);  // bottom (min) value
  var q = v * (1.0-(hWrap*s));  // falling (yellow->green: the red channel falls)
  var t = v * (1.0 - ((1.0-hWrap)*s));  // rising (red->yellow: the green channel rises)

  // Need to find the correct color region that the hue belongs to.
  // Hue can have a negative value, so need to step it to positive space, so the modulus % operator behaves as expected.
  var hF_pos = h;
  if( hF_pos < 0.0 ) {
    hF_pos += Math.ceil(-hF_pos);
  }
  var hue_i = Math.floor( hF_pos * 6.0 ) % 6;

  switch( hue_i ) {
    case 0:  return [v,t,p];  // red -> yellow
    case 1:  return [q,v,p];  // yellow -> green
    case 2:  return [p,v,t];  // green -> cyan
    case 3:  return [p,q,v];  // cyan -> blue
    case 4:  return [t,p,v];  // blue -> magenta
    case 5:  return [v,p,q];  // magenta -> red
  }

  return [0,0,0];  // sanity escape
}

function rgb2hex( rgb ) {
	return (Math.floor(rgb[0]*0xff)<<16) | (Math.floor(rgb[1]*0xff)<<8) | Math.floor(rgb[2]*0xff);
}

function hsv2hex( h, s, v ) {
	return rgb2hex( hsv2rgb( h, s, v ) );
}
