import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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

renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
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

const vertexShader = `
uniform float u_time;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y + sin(u_time), position.z, 1.0);
}
`;

const fragmentShader = `
void main() {
    gl_FragColor = vec4(0.0, 0.58, 0.86, 1.0);
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

	uniforms.u_time.value = clock.getElapsedTime();

	renderer.render(scene, camera);
}

animate();
