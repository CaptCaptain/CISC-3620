import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import particleFire from "https://esm.sh/three-particle-fire"; // Import the particle fire library

particleFire.install({ THREE: THREE });

const width = 500;
const height = 400;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// Position the camera
camera.position.set(0, 0, 2);

const clock = new THREE.Clock();

// Add Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

const fireRadius = 0.5; // Radius of the fire
const fireHeight = 3; // Height of the fire
const particleCount = 800; // Number of particles in the fire

const geometry = new particleFire.Geometry(
	fireRadius,
	fireHeight,
	particleCount,
); // radius, height, number of particles
const material = new particleFire.Material({ color: 0xff2200 }); // scarlet color
material.setPerspective(camera.fov, height); // Set the perspective of the material
const particleFireMesh = new THREE.Points(geometry, material); // Create the particle fire mesh
particleFireMesh.position.y = -0.9;
scene.add(particleFireMesh);

// Animation loop
function animate() {
	requestAnimationFrame(animate);

	const delta = clock.getDelta();

	particleFireMesh.material.update(delta / 4);

	// Render the scene from the perspective of the camera
	renderer.render(scene, camera);
}

animate();
