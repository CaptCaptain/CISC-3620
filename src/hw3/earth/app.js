//Create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);
const textureLoader = new THREE.TextureLoader();
// Adjust camera position
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.antialias = true; // Smooth out the edges
document.body.appendChild(renderer.domElement);

//WRITE CODE TO CREATE THE EARTH HERE
const earthGeometry = new THREE.SphereGeometry(2, 25, 25);
const earthTexture = textureLoader.load(
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/master/courses/CISC3620/textures/earth%20texture.jpg",
);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

//WRITE CODE TO CREATE THE MOON HERE
const moonGeometry = new THREE.SphereGeometry(0.5, 25, 25);
const moonTexture = textureLoader.load(
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/master/courses/CISC3620/textures/moon%20texture.jpg",
);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

//CREATE AMBIENT LIGHT HERE
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

//CREATE AND POSITION DIRECTIONAL LIGHT HERE
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true; // Enable shadow casting for the light
scene.add(directionalLight);

let moonOrbitAngle = 0; // Angle for the moon's orbit

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
	requestAnimationFrame(animate);

	//WRITE CODE TO ROTATE THE EARTH ON IT'S Y-AXIS BY 0.03 HERE
	earth.rotation.y += 0.03;
	// Update Moon's position (Orbiting the Earth)
	moonOrbitAngle -= 0.005; //counter clockwise
	const moonOrbitalRadius = 1.5; // Distance from the Earth

	//WRITE CODE TO UPDATE MOON'S POSITION ON THE X AND Z-AXIS HERE

	//WRITE CODE TO ROTATE THE MOON ON IT'S Y-AXIS BY 0.01 HERE
	moon.rotation.y += 0.03;
	renderer.render(scene, camera);
}

// Call the animation function
animate();
