// Create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// CREATE YOUR CUBE HERE
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

let wireframe = false;
let angleX = 0; // Rotation around the X-axis
let angleY = 0; // Rotation around the Y-axis

// Handle keyboard inputs
function onKeyDown(event) {
	// WRITE YOUR CODE HERE
}

window.addEventListener("keydown", onKeyDown);

// Rotate the cube based on button clicks
function rotateCube(direction) {
	// WRITE YOUR CODE HERE
}

// Function to toggle wireframe
function toggleWireframe() {
	// WRITE YOUR CODE HERE
}

// Setup dat.GUI
const gui = new dat.GUI();
gui.add({ wireframe: false }, "wireframe").onChange(toggleWireframe);

// Position the dat.GUI above the buttons
gui.domElement.style.position = "absolute";
gui.domElement.style.top = "10px"; // Position it at the top left corner
gui.domElement.style.left = "10px"; // Align with left side

// Set up a basic animation loop to render the scene
function animate() {
	requestAnimationFrame(animate);

	// Apply rotation to the cube
	// WRITE YOUR CODE HERE

	// Render the scene
	renderer.render(scene, camera);
}

// Start the animation loop
animate();
