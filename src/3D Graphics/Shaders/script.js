const scene = new THREE.Scene();

scene.background = new THREE.Color("black");

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	100,
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
	antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

// CLOCK

const clock = new THREE.Clock();

// UNIFORMS

const uniforms = {
	// value passed from JS -> GPU

	u_time: {
		value: 0,
	},
};

/// VERTEX SHADER

const vertexShader = `

// main() runs once PER VERTEX

// uniform = shared value (sent from JavaScript)

//uniform float u_time;

// varying passes data
// vertex shader -> fragment shader

varying vec2 vUv;


void main() {

 // position = current vertex position

 // vec4(position, 1.0)
 // converts vec3 -> vec4
 // required for matrix math

 // projectionMatrix
 // handles camera projection

 // modelViewMatrix
 // handles object/camera transforms

 // gl_Position
 // final screen position

 //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

 // position.x
 // original X coordinate

 // sin(position.x)
 // creates wave-like movement (oscillates between -1 and 1)

 // Create NEW coordinates

 /*vec3 newPosition = vec3(

   // NEW X POSITION

   sin(position.x),

   // KEEP ORIGINAL Y

   position.y,

   // KEEP ORIGINAL Z

   position.z

 );*/

 // Render distorted position
 //gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
 
 //vec3 pos = position;

 // pos.x * 4.0
 // increases wave frequency

 // + u_time
 // animates the sine wave

 // * 0.3
 // controls wave height

 //pos.y += sin(pos.x * 4.0 + u_time) * 0.3;

 //gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

 // store UV coordinates

 vUv = uv;

 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);




}

`;

// FRAGMENT SHADER

const fragmentShader = `

// main() runs once PER PIXEL

//uniform float u_time;

// receive UV coordinates

varying vec2 vUv;


void main() {

 // gl_FragColor
 // final RGBA color

 // vec4(
 //   red,
 //   green,
 //   blue,
 //   alpha
 // )

 // all 1.0 = white

 //gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
 
  // Animate green channel

 // sin(u_time)
 // oscillates between:
 // -1 and 1

 // * 0.5 + 0.5
 // remaps to:
 // 0 and 1

 /*gl_FragColor = vec4(

   0.2,

   sin(u_time) * 0.5 + 0.5,

   1.0,

   1.0

 );*/
 
 // vUv.x
 // controls RED

 // vUv.y
 // controls GREEN

 // blue stays constant

 gl_FragColor = vec4(

   vUv.x,

   vUv.y,

   1.0,

   1.0

 );



}
`;

// GEOMETRY

const geometry = new THREE.PlaneGeometry(
	3,
	3,

	// MANY subdivisions needed
	// for smooth distortion

	100,
	100,
);

// MATERIAL
const material = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	uniforms,
	side: THREE.DoubleSide,
	//wireframe: true
});

const plane = new THREE.Mesh(geometry, material);

scene.add(plane);

function animate() {
	requestAnimationFrame(animate);

	// update time every frame

	//uniforms.u_time.value = clock.getElapsedTime();

	renderer.render(scene, camera);
}

animate();
