const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color("skyblue");

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();
