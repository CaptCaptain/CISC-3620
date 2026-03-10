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
const earthTexture = textureLoader.load(
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/master/courses/CISC3620/textures/earth%20texture.jpg",
);

//WRITE CODE TO CREATE THE MOON HERE
const moonTexture = textureLoader.load(
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/master/courses/CISC3620/textures/moon%20texture.jpg",
);

//CREATE AMBIENT LIGHT HERE

//CREATE AND POSITION DIRECTIONAL LIGHT HERE

let moonOrbitAngle = 0; // Angle for the moon's orbit

function animate() {
	requestAnimationFrame(animate);

	//WRITE CODE TO ROTATE THE EARTH ON IT'S Y-AXIS BY 0.03 HERE

	// Update Moon's position (Orbiting the Earth)
	moonOrbitAngle -= 0.005; //counter clockwise
	const moonOrbitalRadius = 1.5; // Distance from the Earth

	//WRITE CODE TO UPDATE MOON'S POSITION ON THE X AND Z-AXIS HERE

	//WRITE CODE TO ROTATE THE MOON ON IT'S Y-AXIS BY 0.01 HERE

	renderer.render(scene, camera);
}

// Call the animation function
animate();
