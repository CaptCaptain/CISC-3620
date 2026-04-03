const windowSize = { width: 800, height: 500 };

const scene = new THREE.Scene();
scene.background = new THREE.Color("lightgreen");

const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
camera.position.y = 10;
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(windowSize.width, windowSize.height);
document.body.appendChild(renderer.domElement);

// -- FUNCTIONS -- //

function buildWorld() {
	const ambientLight = new THREE.AmbientLight("white", 0.5); // soft overall light
	scene.add(ambientLight);

	return {
		ambientLight: ambientLight,
	};
}

function buildRoom() {
	const floor = new THREE.Mesh(
		new THREE.BoxGeometry(100, 100),
		new THREE.MeshStandardMaterial({ color: "pink", side: THREE.DoubleSide }),
	);

	scene.add(floor);

	const wallGeometry = new THREE.BoxGeometry(100, 60);
	const wallMaterial = new THREE.MeshStandardMaterial({ color: "pink" });

	const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
	leftWall.rotation.y = -Math.PI / 2;

	scene.add(leftWall);

	floor.rotation.x = -Math.PI / 2;

	return { floor: floor, leftWall: leftWall };
}

function buildGUI() {
	const gui = new dat.GUI();

	// Position the dat.GUI above the buttons
	gui.domElement.style.position = "absolute";
	gui.domElement.style.top = "10px"; // Position it at the top left corner
	gui.domElement.style.left = "10px"; // Align with left side
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

// -- CODE -- //

const world = buildWorld();
const room = buildRoom();

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

animate();
buildGUI();
