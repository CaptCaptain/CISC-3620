let width = 500;
let height = 400;

// Create the scene
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

// Create a WebGLRenderer and enable shadows
const renderer = new THREE.WebGLRenderer();
renderer.shadowMapEnabled = true;
renderer.shadowMap.enabled = true;
renderer.antialias = true;
renderer.setSize(width, height);
renderer.antialias = true; // Smooth out the edges
document.body.appendChild(renderer.domElement);

// Position the camera
camera.position.set(0, 2.5, 8);

//WRITE CODE TO CREATE FLOOR HERE
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeTexture = textureLoader.load(
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/wood%20floor.jpg",
);
const planeMaterial = new THREE.MeshStandardMaterial({ map: planeTexture });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
plane.receiveShadow = true; // Allow the plane to receive shadows
scene.add(plane);

//WRITE CODE TO CREATE BASKETBALL HERE
const ballGeometry = new THREE.SphereGeometry(1, 50, 50);
const ballTexture = textureLoader.load(
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/basketball.png",
);
const ballMaterial = new THREE.MeshStandardMaterial({ map: ballTexture });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);
ball.castShadow = true;
ball.recieveShadow = true;
ball.position.y += 1;
ball.rotation.x = Math.PI / 2;

//WRITE CODE TO CREATE AMBIENT LIGHT HERE
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

//WRITE CODE TO CREATE AND POSITION DIRECTIONAL LIGHT HERE
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.position.set(0, 2, 0);
scene.add(directionalLight);

//WRITE CODE TO ADD ORBIT CONTROLS HERE
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

// Animation loop
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();
