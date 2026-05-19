import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);

// Model and Texture Loader
const modelLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;

scene.add(directionalLight);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Skybox
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubemap = cubeTextureLoader.load([
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/Daylight%20Box_Pieces/Daylight%20Box_PosX.bmp",
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/Daylight%20Box_Pieces/Daylight%20Box_NegX.bmp",
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/Daylight%20Box_Pieces/Daylight%20Box_PosY.bmp",
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/Daylight%20Box_Pieces/Daylight%20Box_NegY.bmp",
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/Daylight%20Box_Pieces/Daylight%20Box_PosZ.bmp",
	"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/Daylight%20Box_Pieces/Daylight%20Box_NegZ.bmp",
]);

scene.background = cubemap;
scene.environment = cubemap;

// Settings
const modelPaths = {
	Cube: null,
	"Soda Can": "/src/Homework/HW6/Models/soda-can.glb",
	"Soy Sauce": "/src/Homework/HW6/Models/soy.glb",
	Apple: "/src/Homework/HW6/Models/apple.glb",
};
const modelScales = {
	Cube: 1,
	"Soda Can": 5,
	"Soy Sauce": 5,
	Apple: 5,
};
const waveSettings = {
	waveSpeed: 2,
	waveHeight: 1.5,
	phaseOffset: 0.5,
	cubeCount: 20,
	reflective: false,
	rotate: false,
	meshType: "Cube",
};

const modelTemplates = {};

function loadModelTemplate(type) {
	const path = modelPaths[type];
	if (!path) return Promise.resolve(null);
	if (modelTemplates[type]) return Promise.resolve(modelTemplates[type]);

	return new Promise((resolve, reject) => {
		modelLoader.load(
			path,
			(gltf) => {
				const template = gltf.scene;
				template.traverse((child) => {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				});
				modelTemplates[type] = template;
				resolve(template);
			},
			undefined,
			reject,
		);
	});
}

function cloneModelTemplate(type) {
	const template = modelTemplates[type];
	if (!template) return null;

	const clone = template.clone(true);
	clone.traverse((child) => {
		if (child.isMesh) {
			child.castShadow = true;
			child.receiveShadow = true;
			if (child.material) {
				child.material = Array.isArray(child.material)
					? child.material.map((mat) => mat.clone())
					: child.material.clone();
			}
		}
	});

	return clone;
}

// Sine wave cubes
const cubes = [];
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
	format: THREE.RGBFormat,
	generateMipmaps: true,
	minFilter: THREE.LinearMipmapLinearFilter,
});

cubeRenderTarget.texture.mapping = THREE.CubeRefractionMapping;

const near = 0.1;
const far = 100;
const cubeCamera = new THREE.CubeCamera(near, far, cubeRenderTarget);

scene.add(cubeCamera);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
	color: 0x00aaff,
	metalness: 0.3,
	roughness: 0.4,
});

const cubeReflectiveMaterial = new THREE.MeshPhysicalMaterial({
	metalness: 1,
	envMap: cubeRenderTarget.texture,
	roughness: 0,
});

const cubeSpacing = 1;

async function updateCubes() {
	cubes.forEach((object) => scene.remove(object));
	cubes.length = 0;

	const isCube = waveSettings.meshType === "Cube";
	let modelTemplate = null;
	if (!isCube) {
		modelTemplate = await loadModelTemplate(waveSettings.meshType);
		if (!modelTemplate) {
			return;
		}
	}

	for (let i = 0; i < waveSettings.cubeCount; i++) {
		const x = (i - (waveSettings.cubeCount - 1) / 2) * cubeSpacing;

		if (isCube) {
			const cube = new THREE.Mesh(
				cubeGeometry,
				waveSettings.reflective ? cubeReflectiveMaterial : cubeMaterial,
			);
			cube.castShadow = true;
			cube.position.set(x, 1, 0);
			cubes.push(cube);
			scene.add(cube);
		} else {
			const clone = cloneModelTemplate(waveSettings.meshType);
			if (!clone) continue;
			clone.position.set(x, 1, 0);
			clone.scale.setScalar(modelScales[waveSettings.meshType] || 1);
			clone.traverse((child) => {
				if (child.isMesh && waveSettings.reflective) {
					child.material = cubeReflectiveMaterial;
				}
			});
			cubes.push(clone);
			scene.add(clone);
		}
	}
}

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 15);
controls.enableDamping = true;
controls.keyPanSpeed = 50;

function toggleLight(light, enabled) {
	if (enabled) scene.add(light);
	else scene.remove(light);
}

// GUI
const gui = new dat.GUI();

gui.domElement.style.position = "absolute";
gui.domElement.style.top = "10px";
gui.domElement.style.left = "10px";

const waveFolder = gui.addFolder("Wave Controls");
waveFolder.add(waveSettings, "waveSpeed", 0.1, 10, 0.1).name("Wave Speed");
waveFolder.add(waveSettings, "waveHeight", 0.1, 10, 0.1).name("Wave Height");
waveFolder
	.add(waveSettings, "phaseOffset", 0.0, 2.0, 0.05)
	.name("Phase Offset");
waveFolder
	.add(waveSettings, "cubeCount", 0.1, 100, 1)
	.name("Cube Count")
	.onChange((enabled) => {
		updateCubes();
	});
waveFolder.open();

const meshFolder = gui.addFolder("Mesh");

meshFolder
	.add(waveSettings, "meshType", Object.keys(modelPaths))
	.name("Mesh Type")
	.onChange(() => {
		updateCubes();
	});
meshFolder
	.add(waveSettings, "reflective", false)
	.name("Reflective")
	.onChange((enabled) => {
		updateCubes();
	});
meshFolder
	.add(waveSettings, "rotate", false)
	.name("Rotate")
	.onChange((enabled) => {
		updateCubes();
	});
meshFolder.open();

updateCubes();

// Animation loop
function animate() {
	requestAnimationFrame(animate);

	const time = performance.now() * 0.001;
	const waveSpeed = waveSettings.waveSpeed;
	const waveHeight = waveSettings.waveHeight;
	const phaseOffset = waveSettings.phaseOffset;

	cubes.forEach((cube, index) => {
		const phase = index * phaseOffset;
		cube.position.y = 1 + Math.sin(time * waveSpeed + phase) * waveHeight;

		if (waveSettings.rotate) {
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.015;
		}
	});

	cubeCamera.update(renderer, scene);

	controls.update();

	// Render the scene
	renderer.render(scene, camera);
}

animate();
