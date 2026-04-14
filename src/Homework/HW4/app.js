const windowSize = { width: 800, height: 500 };

const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
camera.position.y = 100;
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(windowSize.width, windowSize.height);
renderer.antialias = true;
renderer.shadowMap.enabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMa;
document.body.appendChild(renderer.domElement);

const modelLoader = new THREE.GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// -- FUNCTIONS -- //

function placeOnTop(object, surface) {
	if (!object || !surface) console.warn("No object or surface");

	//bounding boxes for object and surface
	const objectBox = new THREE.Box3().setFromObject(object);
	const surfaceBox = new THREE.Box3().setFromObject(surface);

	//top of surface - bottom of obj = how high to lift obj to position atop surface
	const offset = surfaceBox.max.y - objectBox.min.y;

	object.position.y += offset;
}

function buildWorld() {
	const ambientLight = new THREE.AmbientLight("white", 0.25);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight("white", 0.25);
	directionalLight.castShadow = true;
	directionalLight.position.set(20, 50, 50);
	directionalLight.castShadow = true;

	directionalLight.shadow.camera.left = -100;
	directionalLight.shadow.camera.right = 100;
	directionalLight.shadow.camera.top = 100;
	directionalLight.shadow.camera.bottom = -100;

	scene.add(directionalLight);
	scene.add(new THREE.DirectionalLightHelper(directionalLight));

	const spotLight = new THREE.SpotLight(0xffffff, 0.25);
	spotLight.position.set(0, 50, 0);
	spotLight.castShadow = true;
	scene.add(spotLight);

	return {
		ambientLight: ambientLight,
		directionalLight: directionalLight,
		spotLight: spotLight,
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

async function buildModels() {
	let table;
	let tv;
	const furniture = new THREE.Group();

	await modelLoader.load("/src/Homework/HW4/Models/desk.glb", function (gltf) {
		table = gltf.scene;
		table.scale.set(50, 50, 50);
		table.position.x -= 15;
		table.castShadows = true;
		table.receiveShadows = true;

		table.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		scene.add(table);
		furniture.add(table);
		placeOnTop(table, room.floor);
	});

	await modelLoader.load(
		"/src/Homework/HW4/Models/televisionVintage.glb",
		function (gltf) {
			tv = gltf.scene;
			tv.scale.set(50, 50, 50);
			tv.position.x = table.position.x / 2;
			tv.castShadows = true;
			tv.receiveShadows = true;

			tv.traverse((child) => {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
			scene.add(tv);
			furniture.add(tv);
			placeOnTop(tv, table);
		},
	);

	scene.add(furniture);

	const woodTexture = textureLoader.load(
		"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/wood%20floor.jpg",
	);
	const woodFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(50, 50),
		new THREE.MeshStandardMaterial({ map: woodTexture }),
	);
	woodFloor.rotation.x = -Math.PI / 2;
	placeOnTop(woodFloor, room.floor);
	woodFloor.position.y += 0.05;
	scene.add(woodFloor);

	const length = 14,
		width = 8;

	const shape = new THREE.Shape();
	shape.moveTo(0, 0);
	shape.lineTo(0, width);
	shape.lineTo(length, width);
	shape.lineTo(length, 0);
	shape.lineTo(0, 0);

	const extrudeSettings = {
		steps: 2,
		amount: 16,
		bevelEnabled: true,
		bevelThickness: 1,
		bevelSize: 1,
		bevelSegments: 1,
	};

	const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	const material = new THREE.MeshBasicMaterial({ color: "0xffffff" });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.x -= length / 2;
	mesh.position.z -= width / 2;
	mesh.position.y = 60;
	scene.add(mesh);
}

function buildGUI() {
	const gui = new dat.GUI();

	// Position the dat.GUI above the buttons
	gui.domElement.style.position = "absolute";
	gui.domElement.style.top = "10px"; // Position it at the top left corner
	gui.domElement.style.left = "10px"; // Align with left side

	return gui;
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

function toggleLight(light, enabled) {
	if (enabled) scene.add(light);
	else scene.remove(light);
}

// -- CODE -- //

const world = buildWorld();
const models = buildModels();
const room = buildRoom();
const gui = buildGUI();

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

animate();
gui.add({ "Ambient Light": true }, "Ambient Light").onChange((enabled) => {
	toggleLight(world.ambientLight, enabled);
});
gui
	.add({ "Directional Light": true }, "Directional Light")
	.onChange((enabled) => {
		toggleLight(world.directionalLight, enabled);
	});
gui.add({ "Spot Light": true }, "Spot Light").onChange((enabled) => {
	toggleLight(world.spotLight, enabled);
});
updateRoom(room);
