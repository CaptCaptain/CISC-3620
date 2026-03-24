const scene = new THREE.Scene(); //Creates a new instance of the Scene class.
const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 2, 2);

const material = new THREE.MeshPhongMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const wireframe = new THREE.WireframeGeometry(geometry);
const line = new THREE.LineSegments(wireframe);
line.material.depthTest = true;
line.material.opacity = 1;
line.material.transparent = true;
scene.add(line);

const pointLight = new THREE.PointLight("white", 1); //color, intensity
pointLight.position.set(5, 5, 5); //x, y, z
scene.add(pointLight);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	line.rotation.x += 0.01;
	line.rotation.y += 0.01;
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}

animate();
