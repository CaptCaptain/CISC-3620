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

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
light.castShadow = true;
scene.add(light);

const cubeGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "brown" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.set(0, -1, 0);

const sphereGeometry = new THREE.SphereGeometry(1, 4, 1);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: "green" });
const spheres = [
	new THREE.Mesh(sphereGeometry, sphereMaterial),
	new THREE.Mesh(sphereGeometry, sphereMaterial),
];

spheres[1].position.set(0, -0.5, 0);

const group = new THREE.Group();

for (let index = 0; index < spheres.length; index++) {
	const element = spheres[index];
	element.castShadow = true;
	group.add(element);
}

group.add(cube);

scene.add(group);

const floorTexture = new THREE.TextureLoader().load(
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/concrete%20floor.jpg",
);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: "white" });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
floor.receiveShadow = true;

scene.add(floor);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

let orbitAngle = 0;

function animate() {
	requestAnimationFrame(animate);

	group.rotation.y += 0.01;
	group.position.x = Math.sin(orbitAngle);
	group.position.z = Math.cos(orbitAngle);

	orbitAngle += 0.01;
	renderer.render(scene, camera);
}

animate();

document.addEventListener("keydown", onKeyDown);
