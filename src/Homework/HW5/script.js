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

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);

scene.add(directionalLight);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const modelLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const controls = new OrbitControls(camera, renderer.domElement);

class Stage {
	floor;
	wall;

	createFloor() {
		// Load a texture for the floor
		const floorTexture = textureLoader.load(
			"https://raw.githubusercontent.com/amaraauguste/amaraauguste.github.io/refs/heads/master/courses/CISC3620/textures/checkered_pattern.jpg",
		);
		floorTexture.wrapS = THREE.RepeatWrapping; // Repeat the texture in the x-direction
		floorTexture.wrapT = THREE.RepeatWrapping; // Repeat the texture in the y-direction
		floorTexture.repeat.set(2, 2);

		// Plane material
		const floorMaterial = new THREE.MeshStandardMaterial({
			map: floorTexture,
			roughness: 1,
			metalness: 0,
		});

		// Create the floor
		const floorGeometry = new THREE.PlaneGeometry(20, 20);
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = 0; // Position it on the ground
		floor.receiveShadow = true;

		this.floor = floor;
	}

	createWall() {
		if (!this.floor) {
			console.warn("Floor does not exist");
			return null;
		}

		const floorBox = new THREE.Box3().setFromObject(this.floor);
		const floorWidth = floorBox.max.x - floorBox.min.x;
		const floorLength = floorBox.max.z - floorBox.min.z;

		const wall = this.floor.clone();
		const wallBox = new THREE.Box3().setFromObject(wall);
		const wallHeight = wallBox.max.z;

		wall.rotation.x = 0;
		wall.position.set(0, wallHeight, -floorWidth / 2);

		this.wall = wall;
	}

	constructor() {
		this.createFloor();
		this.createWall();

		scene.add(this.floor);
		scene.add(this.wall);
	}
}

class Snowman {
	static create(gltf, position) {
		const snowman = gltf.scene;

		snowman.scale.set(10, 10, 10);
		snowman.position.x -= 15;
		snowman.castShadows = true;
		snowman.receiveShadows = true;

		snowman.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		snowman.scale.set(1, 1, 1);
		snowman.position.x = position.x;
		snowman.position.y = position.y;
		snowman.position.z = position.z;

		scene.add(snowman);
	}

	constructor(x, y, z) {
		modelLoader.load("/src/Homework/HW5/Models/snowman.glb", function (gtlf) {
			Snowman.create(gtlf, new THREE.Vector3(x, y, z));
		});
	}
}

class House {
	static create(gltf, position) {
		const house = gltf.scene;

		house.scale.set(10, 10, 10);
		house.position.x -= 15;
		house.castShadows = true;
		house.receiveShadows = true;

		house.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		house.scale.set(1, 1, 1);
		house.position.x = position.x;
		house.position.y = position.y;
		house.position.z = position.z;

		scene.add(house);
	}

	constructor(x, y, z) {
		modelLoader.load(
			"/src/Homework/HW5/Models/cabin-roof-dormer.glb",
			function (gtlf) {
				Tree.create(gtlf, new THREE.Vector3(x, y, z));
			},
		);
	}
}

class Tree {
	static create(gltf, position) {
		const tree = gltf.scene;

		tree.scale.set(10, 10, 10);
		tree.position.x -= 15;
		tree.castShadows = true;
		tree.receiveShadows = true;

		tree.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		tree.scale.set(1, 1, 1);
		tree.position.x = position.x;
		tree.position.y = position.y;
		tree.position.z = position.z;

		scene.add(tree);
	}

	constructor(x, y, z) {
		modelLoader.load(
			"/src/Homework/HW5/Models/tree-snow-a.glb",
			function (gtlf) {
				Tree.create(gtlf, new THREE.Vector3(x, y, z));
			},
		);
	}
}

class SnowGlobe {
	glass;
	trees = [];
	snowman;
	base;
	house;
	snow;
	cubeRenderTarget;
	cubeCamera;

	update() {
		// Update the CubeCamera position to match the sphere's position
		this.cubeCamera.position.copy(this.glass.position);
		// Update the CubeCamera to capture the environment
		this.cubeCamera.update(renderer, scene);
	}

	createTrees() {
		this.trees[0] = new Tree(-1.5, 3, 0);
		this.trees[1] = new Tree(1.5, 3, -1.25);
	}

	createHouse() {
		this.house = new House(0, 3, -1);
	}

	createSnowman() {
		this.snowman = new Snowman(1.25, 3, 1.25);
	}

	createBase() {
		const woodTexture = textureLoader.load(
			"https://cdn.architextures.org/textures/20/11/dark-stained-timber-5fc4cb107f98c-1200.jpg",
		);
		const geometry = new THREE.CylinderGeometry(2, 3, 2, 32);
		const material = new THREE.ShaderMaterial({
			uniforms: {
				color1: {
					value: new THREE.Color("#4B2E2B"),
				},
				color2: {
					value: new THREE.Color("#8C5A3C"),
				},
			},
			vertexShader: `
				varying vec2 vUv;

				void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 color1;
				uniform vec3 color2;
			
				varying vec2 vUv;
				
				void main() {
				
				gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
				}
			`,
			wireframe: false,
		});
		const cylinder = new THREE.Mesh(geometry, material);
		cylinder.position.y += 1;
		scene.add(cylinder);
	}

	createSnow() {
		const geometry = new THREE.CylinderGeometry(2.5, 1.5, 2, 32);
		const material = new THREE.ShaderMaterial({
			uniforms: {
				color1: {
					value: new THREE.Color("#ffffff"),
				},
				color2: {
					value: new THREE.Color("#c0c0c0"),
				},
			},
			vertexShader: `
				varying vec2 vUv;

				void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 color1;
				uniform vec3 color2;
			
				varying vec2 vUv;
				
				void main() {
				
				gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
				}
			`,
			wireframe: false,
		});
		const cylinder = new THREE.Mesh(geometry, material);
		cylinder.position.y += 2;
		scene.add(cylinder);
	}

	createGlass() {
		// Create a CubeCamera for reflections
		// CubeCamera target
		const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
			format: THREE.RGBFormat,
			generateMipmaps: true,
			minFilter: THREE.LinearMipmapLinearFilter,
		});

		cubeRenderTarget.texture.mapping = THREE.CubeRefractionMapping;

		const near = 0.1;
		const far = 100;
		const cubeCamera = new THREE.CubeCamera(near, far, cubeRenderTarget);

		this.cubeCamera = cubeCamera;

		scene.add(cubeCamera);

		// Sphere material
		const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
		const sphereMaterial = new THREE.MeshStandardMaterial({
			metalness: 1,
			roughness: 0,
			envMap: cubeRenderTarget.texture,
			opacity: 0.5,
			transparent: true,
			side: THREE.BackSide,
		});
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.y = 4; // Slightly above the plane

		const refractiveMaterial = new THREE.MeshStandardMaterial({
			color: "white",
			metalness: 1,
			roughness: 0,
			envMap: cubeRenderTarget.texture,
			side: THREE.BackSide,
			opacity: 0.5,
			transparent: true,
		});

		const reflectiveMaterial = new THREE.MeshPhongMaterial({
			color: "white",
			opacity: 0.25,
			transparent: true,
		});

		const reflectiveSphere = new THREE.Mesh(sphereGeometry, reflectiveMaterial);
		reflectiveSphere.position.y = 4; // Slightly above the plane

		const refractiveSphere = new THREE.Mesh(sphereGeometry, refractiveMaterial);
		refractiveSphere.position.y = 4; // Slightly above the plane

		this.glass = sphere;
		// scene.add(reflectiveSphere);
		scene.add(refractiveSphere);
	}

	constructor() {
		this.createGlass();
		this.createTrees();
		this.createBase();
		this.createSnow();
		this.createSnowman();
		this.createHouse();
	}
}

// Position the camera
camera.position.set(0, 5, 10);
controls.keys = {
	LEFT: "KeyA", //left arrow
	UP: "KeyW", // up arrow
	RIGHT: "KeyD", // right arrow
	BOTTOM: "KeyS", // down arrow
};
controls.enableDamping = true;
controls.keyPanSpeed = 50;
controls.listenToKeyEvents(window);

const stage = new Stage();
const snowGlobe = new SnowGlobe();

// Animation loop
function animate() {
	requestAnimationFrame(animate);

	snowGlobe.update();
	controls.update();

	// Render the scene
	renderer.render(scene, camera);
}

animate();
