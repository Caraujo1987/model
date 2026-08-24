import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const root = document.querySelector('#scene-root');
const loadingStatus = document.querySelector('#loading-status');
const vrStatus = document.querySelector('#vr-status');
const resetButton = document.querySelector('#reset-view');
const rotateButton = document.querySelector('#toggle-rotate');

let model;
let autoRotate = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070a10);
scene.fog = new THREE.Fog(0x070a10, 12, 32);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.05, 100);
camera.position.set(0, 1.55, 5.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
root.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.1, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.48;
controls.minDistance = 1.8;
controls.maxDistance = 10;

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(9, 96),
  new THREE.MeshStandardMaterial({
    color: 0x111923,
    roughness: 0.78,
    metalness: 0.05
  })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(18, 36, 0x2fd19a, 0x1f2d3a);
grid.position.y = 0.01;
scene.add(grid);

scene.add(new THREE.HemisphereLight(0xeaf3ff, 0x15202c, 2.2));

const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(4, 6, 5);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x41d6a3, 6, 12);
rimLight.position.set(-3.5, 2.4, -3.2);
scene.add(rimLight);

const loader = new GLTFLoader();
loader.load(
  './SERVER_BLENDER.glb',
  (gltf) => {
    model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    normalizeModel(model);
    scene.add(model);
    loadingStatus.textContent = 'Modelo cargado';
  },
  (event) => {
    if (!event.total) return;
    const progress = Math.round((event.loaded / event.total) * 100);
    loadingStatus.textContent = `Cargando modelo... ${progress}%`;
  },
  () => {
    loadingStatus.textContent = 'No se pudo cargar el modelo';
  }
);

resetButton.addEventListener('click', resetView);

rotateButton.addEventListener('click', () => {
  autoRotate = !autoRotate;
  rotateButton.setAttribute('aria-pressed', String(autoRotate));
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.xr.addEventListener('sessionstart', () => {
  vrStatus.textContent = 'Sesion VR activa';
});

renderer.xr.addEventListener('sessionend', () => {
  vrStatus.textContent = 'VR listo en visores compatibles';
  resetView();
});

renderer.setAnimationLoop(() => {
  if (model && autoRotate && !renderer.xr.isPresenting) {
    model.rotation.y += 0.0025;
  }

  controls.update();
  renderer.render(scene, camera);
});

function normalizeModel(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  box.getSize(size);
  box.getCenter(center);

  object.position.sub(center);

  const maxDimension = Math.max(size.x, size.y, size.z);
  if (maxDimension > 0) {
    object.scale.setScalar(3.2 / maxDimension);
  }

  const normalizedBox = new THREE.Box3().setFromObject(object);
  object.position.y -= normalizedBox.min.y;
}

function resetView() {
  camera.position.set(0, 1.55, 5.2);
  controls.target.set(0, 1.1, 0);
  controls.update();
}
