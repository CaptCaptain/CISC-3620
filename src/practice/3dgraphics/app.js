const scene = new THREE.Scene(); //Creates a new instance of the Scene class.
const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 2, 2);

const material = [
	new THREE.MeshBasicMaterial({ color: "green" }),
	new THREE.MeshBasicMaterial({ color: "blue" }),
	new THREE.MeshBasicMaterial({ color: "red" }),
	new THREE.MeshBasicMaterial({ color: "yellow" }),
	new THREE.MeshBasicMaterial({ color: "orange" }),
	new THREE.MeshBasicMaterial({ color: "purple" }),
];
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}

animate();
