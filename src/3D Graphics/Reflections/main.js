// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Set background color
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);

// Create a WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Create texture loader
const textureLoader = new THREE.TextureLoader();

// Create a CubeCamera for reflections
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
	//128 is the size of the cube map
	format: THREE.RGBFormat, //the color format of the cube map
	generateMipmaps: true, //generate mipmaps for better quality
	//mipmaps are precomputed textures that are used to improve the quality of the texture when viewed at a distance
	minFilter: THREE.LinearMipmapLinearFilter, //filter used to sample the texture when viewed at a distance
});

const near = 0.1;
const far = 100;
const cubeCamera = new THREE.CubeCamera(near, far, cubeRenderTarget);
scene.add(cubeCamera);

// Load a texture for the plane
const planeTexture = textureLoader.load(
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/checkered_pattern.jpg",
);
planeTexture.wrapS = THREE.RepeatWrapping; // Repeat the texture in the x-direction
planeTexture.wrapT = THREE.RepeatWrapping; // Repeat the texture in the y-direction
planeTexture.repeat.set(2, 2);

// Plane material
const planeMaterial = new THREE.MeshStandardMaterial({
	map: planeTexture,
	roughness: 1,
	metalness: 0,
});

// Create the plane
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0; // Position it on the ground
plane.receiveShadow = true;
scene.add(plane);

// Sphere material
const sphereMaterial = new THREE.MeshStandardMaterial({
	metalness: 1,
	roughness: 0,
	envMap: cubeRenderTarget.texture,
});

// Create the reflective sphere
const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = 4; // Position it above the plane
sphere.castShadow = true;
scene.add(sphere);

// Position the camera
camera.position.set(0, 5, 10);
controls.update(); // Update controls

// Animation loop
function animate() {
	requestAnimationFrame(animate);

	// Update the CubeCamera position to match the sphere's position
	cubeCamera.position.copy(sphere.position);
	// Update the CubeCamera to capture the environment
	cubeCamera.update(renderer, scene);

	// Render the scene
	renderer.render(scene, camera);
}

animate();
