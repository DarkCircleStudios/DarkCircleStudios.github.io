// 1. Set up the scene, camera, and renderer
const container = document.getElementById('planet-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// 2. Add a sphere (planet) geometry
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);
camera.position.z = 5;

// 3. Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
// Store project spots on the planet
const projectSpots = [
  /* Add the coordinates of the 10 project spots on the planet as objects with {x, y, z} properties */
{x: 1, y: 0, z: 0},
{x: -1, y: 0, z: 0},
// ...add more coordinates for each project
];

let currentProjectIndex = 0;

function rotateAndZoomToProject(index) {
// Set the new camera position
camera.position.set(
projectSpots[index].x * 3, // Multiply by a factor to zoom out from the planet
projectSpots[index].y * 3,
projectSpots[index].z * 3
);
camera.lookAt(planet.position);
}

// Rotate the planet based on mouse movement
container.addEventListener('mousemove', (event) => {
const mouseX = event.clientX / window.innerWidth - 0.5;
const mouseY = event.clientY / window.innerHeight - 0.5;
planet.rotation.y = mouseX * 2;
planet.rotation.x = mouseY * 2;
});

// Listen for arrow button clicks
document.getElementById('arrow-left').addEventListener('click', () => {
currentProjectIndex = (currentProjectIndex - 1 + projectSpots.length) % projectSpots.length;
rotateAndZoomToProject(currentProjectIndex);
});

document.getElementById('arrow-right').addEventListener('click', () => {
currentProjectIndex = (currentProjectIndex + 1) % projectSpots.length;
rotateAndZoomToProject(currentProjectIndex);
});

// Initialize the view
rotateAndZoomToProject(currentProjectIndex);

// Add an Earth texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load('https://raw.githubusercontent.com/DarkCircleStudios/DarkCircleStudios.github.io/main/docs/assets/images/earthTexture.png', (texture) => {
  // Update the planet material with the loaded texture
  material.map = texture;
  material.needsUpdate = true;
});

// ...

// Modify the rotateAndZoomToProject function to create a Google Earth-like zoom effect
function rotateAndZoomToProject(index) {
  const newPosition = new THREE.Vector3(
    projectSpots[index].x * 3,
    projectSpots[index].y * 3,
    projectSpots[index].z * 3
  );

  const tweenDuration = 2000; // Duration in milliseconds

  // Animate the camera position
  const positionTween = new TWEEN.Tween(camera.position)
    .to(newPosition, tweenDuration)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      camera.lookAt(planet.position);
    })
    .start();

  // Rotate the planet while moving the camera
  const rotationTween = new TWEEN.Tween(planet.rotation)
    .to({ y: planet.rotation.y + (Math.PI / 5) }, tweenDuration)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();
}

// ...

// Update the animate function to include TWEEN animations
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  renderer.render(scene, camera);
}

// Load the TWEEN library in your index.html
