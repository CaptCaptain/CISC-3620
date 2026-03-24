const scene = new THREE.Scene(); //Creates a new instance of the Scene class.
const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color("skyblue");

const starShape = new THREE.Shape();
starShape.moveTo(0, 0.5);
starShape.lineTo(0.15, 0.15);
starShape.lineTo(0.5, 0.15);
starShape.lineTo(0.2, -0.15);
starShape.lineTo(0.3, -0.5);
starShape.lineTo(0, -0.25);
starShape.lineTo(-0.3, -0.5);
starShape.lineTo(-0.2, -0.15);
starShape.lineTo(-0.5, 0.15);
starShape.lineTo(-0.15, 0.15);
starShape.lineTo(0, 0.5);

const extrudeSettings = {
	steps: 2,
	depth: 0.1,
	bevelEnabled: true,
	curveSegments: 10, // Number of points on the curves
	bevelSegments: 10, // Number of segments for the bevel
	bevelThickness: 0.25, // Thickness of the bevel
	bevelSize: 0.5, // Size of the bevel
};

const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
const starMaterial = new THREE.MeshStandardMaterial({ color: "yellow" });
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
starMesh.scale.set(4, 4, 4);
scene.add(starMesh);

const ambientLight = new THREE.AmbientLight("white", 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight("white", 1); //color, intensity
pointLight.position.set(5, 5, 5); //x, y, z
scene.add(pointLight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();
