import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// put the camera above the solar system looking down at it
camera.position.set(0, 40, 60);

// lets you drag around with the mouse
const controls = new OrbitControls(camera, renderer.domElement);

// Sun (basic material so it glows without light)
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Lights
const sunLight = new THREE.PointLight(0xffffff, 3, 0, 0); // light comes from the sun
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(sunLight, ambientLight);

// function to make a planet so I don't repeat the same code
function makePlanet(size, color) {
  const geometry = new THREE.SphereGeometry(size, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: color });
  const planet = new THREE.Mesh(geometry, material);
  scene.add(planet);
  return planet;
}

// Planets
const planet1 = makePlanet(1, 0xaaaaaa); // gray
const planet2 = makePlanet(1.5, 0x3a7bd5); // blue
const planet3 = makePlanet(1.2, 0xc1440e); // red
const planet4 = makePlanet(3, 0xd8a47f); // big tan one

// Stars in the background (random little white spheres)
function addStar() {
  const geometry = new THREE.SphereGeometry(0.2, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const x = (Math.random() - 0.5) * 300;
  const y = (Math.random() - 0.5) * 300;
  const z = (Math.random() - 0.5) * 300;
  star.position.set(x, y, z);

  scene.add(star);
}

for (let i = 0; i < 300; i++) {
  addStar();
}

// Time speed stuff
let speed = 1; // how fast time is going
let angle = 0; // how far the planets have moved around

function animate() {
  requestAnimationFrame(animate);

  // speed up a little bit every frame (it keeps getting faster)
  speed = speed * 1.0015;
  angle = angle + 0.005 * speed;

  // move each planet in a circle around the sun
  // cos and sin turn the angle into an x and z position on a circle
  // closer planets go faster
  planet1.position.set(Math.cos(angle * 4) * 10, 0, Math.sin(angle * 4) * 10);
  planet2.position.set(Math.cos(angle * 3) * 16, 0, Math.sin(angle * 3) * 16);
  planet3.position.set(Math.cos(angle * 2) * 22, 0, Math.sin(angle * 2) * 22);
  planet4.position.set(Math.cos(angle) * 32, 0, Math.sin(angle) * 32);

  // spin the sun
  sun.rotation.y += 0.01 * speed;

  // fade the background to white as it gets close to max speed
  // speed / 100 goes from 0 to 1, and the * 4 power keeps it dark until near the end
  const brightness = (speed / 300) ** 4;
  scene.background = new THREE.Color(brightness, brightness, brightness);

  // when it gets too fast, reset everything back to normal
  if (speed > 300) {
    speed = 1;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
