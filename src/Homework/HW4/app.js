const windowSize = { width: 800, height: 500 };

const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
camera.position.y = 100;
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(windowSize.width, windowSize.height);
renderer.antialias = true;
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMa;
document.body.appendChild(renderer.domElement);

const modelLoader = new THREE.GLTFLoader();

// -- FUNCTIONS -- //

function buildWorld() {
	const ambientLight = new THREE.AmbientLight("white", 0.25); // soft overall light
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight("white", 0.25); // soft overall light
	directionalLight.castShadow = true;
	scene.add(directionalLight);

	const spotLight = new THREE.SpotLight(0xffffff, 0.5); // soft overall light
	spotLight.position.set(0, 81, 0);
	spotLight.castShadow = true;
	scene.add(spotLight);

	return {
		ambientLight: ambientLight,
	};
}

function buildRoom() {
	const roomMaterial = new THREE.MeshStandardMaterial({ color: "pink" });

	const floor = new THREE.Mesh(new THREE.BoxGeometry(100, 100), roomMaterial);
	floor.rotation.x = -Math.PI / 2;
	scene.add(floor);

	const wallGeometry = new THREE.BoxGeometry(100, 60);

	const leftWall = new THREE.Mesh(wallGeometry, roomMaterial);
	leftWall.rotation.y = -Math.PI / 2;
	leftWall.receiveShadows = true;
	leftWall.castShadows = true;
	scene.add(leftWall);

	const rightWall = leftWall.clone();
	scene.add(rightWall);

	const backWall = leftWall.clone();
	backWall.rotation.y = 0;
	scene.add(backWall);

	const ceiling = floor.clone();
	scene.add(ceiling);

	floor.castShadows = true;
	floor.receiveShadows = true;

	return {
		floor: floor,
		ceiling: ceiling,
		leftWall: leftWall,
		rightWall: rightWall,
		backWall: backWall,
	};
}

function updateRoom(room) {
	const wallBox = new THREE.Box3().setFromObject(room.leftWall);
	const wallHeight = wallBox.max.y;

	const floorBox = new THREE.Box3().setFromObject(room.floor);
	const floorWidth = floorBox.max.x - floorBox.min.x;
	const floorLength = floorBox.max.z - floorBox.min.z;

	room.leftWall.position.set(-floorLength / 2, wallHeight, 0);
	room.rightWall.position.set(floorLength / 2, wallHeight, 0);
	room.backWall.position.set(0, wallHeight, -floorWidth / 2);
	room.ceiling.position.set(0, wallHeight * 2, 0);
}

function buildModels() {
	modelLoader.load("/src/Homework/HW4/Models/desk.glb", function (gltf) {
		const table = gltf.scene;
		table.scale.set(50, 50, 50);
		table.castShadows = true;
		table.receiveShadows = true;
		scene.add(table);
	});
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
updateRoom(room);
buildModels();
