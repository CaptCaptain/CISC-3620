// Create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// CREATE YOUR CUBE HERE
const geometry = new THREE.BoxGeometry(2, 2, 2);
const cube_materials = [
	new THREE.MeshBasicMaterial({ color: "green" }),
	new THREE.MeshBasicMaterial({ color: "blue" }),
	new THREE.MeshBasicMaterial({ color: "red" }),
	new THREE.MeshBasicMaterial({ color: "yellow" }),
	new THREE.MeshBasicMaterial({ color: "orange" }),
	new THREE.MeshBasicMaterial({ color: "purple" }),
];
const wireframe_material = new THREE.MeshBasicMaterial({ wireframe: true });

const cube = new THREE.Mesh(geometry, cube_materials);
const cube_wireframe = new THREE.Mesh(geometry, wireframe_material);
scene.add(cube);

let wireframe = false;
let angleX = 0; // Rotation around the X-axis
let angleY = 0; // Rotation around the Y-axis

// Handle keyboard inputs
function onKeyDown(event) {
	switch (event.code) {
		case "ArrowUp":
			rotateCube("up");
			break;
		case "ArrowDown":
			rotateCube("down");
			break;
		case "ArrowLeft":
			rotateCube("left");
			break;
		case "ArrowRight":
			rotateCube("right");
			break;
	}
}

window.addEventListener("keydown", onKeyDown);

// Rotate the cube based on button clicks
function rotateCube(direction) {
	switch (direction) {
		case "up":
			cube.rotation.x -= 0.1;
			cube_wireframe.rotation.x -= 0.1;
			break;
		case "down":
			cube.rotation.x += 0.1;
			cube_wireframe.rotation.x += 0.1;
			break;
		case "left":
			cube.rotation.y += 0.1;
			cube_wireframe.rotation.y += 0.1;
			break;
		case "right":
			cube.rotation.y -= 0.1;
			cube_wireframe.rotation.y -= 0.1;
			break;
	}
}

// Function to toggle wireframe
function toggleWireframe() {
	wireframe = !wireframe;

	if (wireframe) {
		scene.add(cube_wireframe);
		scene.remove(cube);
	} else {
		scene.add(cube);
		scene.remove(cube_wireframe);
	}
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

// Event Listeners
document.addEventListener("keydown", onKeyDown);
