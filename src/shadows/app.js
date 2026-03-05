const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

renderer.shadowMapEnabled = true;
renderer.antialias = true;
renderer.shadowMap.enabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.setClearColor(0xffffff, 0);

// Enable shadows for directional light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5); // Position the light
light.castShadow = true; // Enable shadow casting for the light
scene.add(light);

const loader = new THREE.TextureLoader();
const texture = loader.load(
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/crate.gif",
);

// Create a cube that casts a shadow
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshStandardMaterial({
	map: texture,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, -1, 0);
cube.castShadow = true;
scene.add(cube);

// Create a floor that receives shadows
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: "gray" });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
floor.receiveShadow = true;

scene.add(floor);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: "blue" });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(5, -1, 0);
sphere.castShadow = true;
scene.add(sphere);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

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
