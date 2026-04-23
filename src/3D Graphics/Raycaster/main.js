const width = 500;
const height = 400;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// Position the camera
camera.position.set(0, 0, 10);

// Lights
const hemisphere = new THREE.HemisphereLight("white", "gray", 1);
scene.add(hemisphere);
const directional = new THREE.DirectionalLight("white", 0.5);
directional.position.set(5, 5, 5);
scene.add(directional);

// Objects array for raycasting
const objects = [];

// Geometry
const geometry = new THREE.SphereGeometry(3, 64, 64);
// Material
const material = new THREE.MeshStandardMaterial({
	color: "red",
	metalness: 0.5,
	roughness: 1,
});
// Mesh
const circle = new THREE.Mesh(geometry, material);
scene.add(circle);
objects.push(circle); // Store the circle in the objects array

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
	color: "blue",
	side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
plane.position.y = -2.75; // Position the plane below the sphere
scene.add(plane);
objects.push(plane); // Store the plane in the objects array

// Mouse event for color change
document.addEventListener("mousedown", onMouseDown);

function onMouseDown(event) {
	event.preventDefault();
	const mouse = new THREE.Vector2();
	mouse.set((event.clientX / width) * 2 - 1, -(event.clientY / height) * 2 + 1);
	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(objects);
	if (intersects.length > 0) {
		// Check if there is an intersection
		// Change the color of the intersected object
		intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
	}
}

// Animation loop
function animate() {
	requestAnimationFrame(animate);

	// Render the scene from the perspective of the camera
	renderer.render(scene, camera);
}

animate();
