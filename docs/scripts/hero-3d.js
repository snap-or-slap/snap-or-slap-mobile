const HERO_CONFIG = {
  glbPath: 'assets/mockups/mockup-3d.glb',
  fallbackImage: 'assets/images/fall-back-image.png',
  mobileBreakpoint: 900,
  reducedMotionBreakpoint: 768,
  pointerReturnEase: 0.08,
  stageEase: 0.11,
  floatAmplitude: 0.018,
  floatSpeed: 0.4,
  fadeStart: 0.965,
  camera: { fov: 34, near: 0.1, far: 100, posZ: 5 },
  lights: {
    ambient: { color: 0xfff7f2, intensity: 0.92 },
    key: { color: 0xffffff, intensity: 1.15, pos: [3.2, 4.8, 5.5] },
    rim: { color: 0xdfe8f5, intensity: 0.55, pos: [-4.5, 2.8, 2.8] },
  },
  poses: {
    // Stage 1: phone on the right, viewed more from the left edge of the device,
    // turning inward toward the narrative.
    start: { x: 1.38, y: -0.08, scale: 1.7, rotX: 0.02, rotY: Math.PI + 0.50, rotZ: -0.04 },
    // Stage 2: transition through the center, slightly larger and more engaged.
    mid: { x: 0.02, y: 0.02, scale: 1.2, rotX: -0.03, rotY: Math.PI - 0.06, rotZ: 0.02 },
    // Stage 3: phone on the left, viewed more from the right edge of the device,
    // still turning inward and feeling closer to the viewer.
    end: { x: -1.18, y: 0.1, scale: 2, rotX: -0.11, rotY: Math.PI - 0.54, rotZ: 0.08 },
  },
  scenes: {
    first: { start: 0.00, fadeStart: 0.34, end: 0.52, fromY: 0, toY: -126 },
    second: { start: 0.56, fadeStart: 0.8, end: 0.881, fromY: 34, toY: -98 },
    third: { start: 0.90, fadeStart: 1.3, end: 2.6, fromY: 24, toY: -64 },
  }
};

const state = {
  isMobile: false,
  isReducedMotion: false,
  hasWebGL: false,
  scrollProgress: 0,
  pointer: { targetX: 0, targetY: 0, currentX: 0, currentY: 0 },
  scene: null,
  camera: null,
  renderer: null,
  model: null,
  clock: null,
  animFrameId: null,
  canvasContainer: null,
  fallbackImg: null,
  scrollSpacer: null,
  sticky: null,
  stages: [],
  currentPose: { x: 0, y: 0, scale: 1, rotX: 0, rotY: 0, rotZ: 0 }
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function detectCapabilities() {
  state.isMobile = window.innerWidth < HERO_CONFIG.mobileBreakpoint;
  state.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try {
    const c = document.createElement('canvas');
    state.hasWebGL = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    state.hasWebGL = false;
  }
}

function showFallback() {
  state.canvasContainer?.classList.add('is-hidden');
  state.fallbackImg?.classList.add('hero__fallback--visible');
}

function updateScrollProgress() {
  if (!state.scrollSpacer) return;
  const rect = state.scrollSpacer.getBoundingClientRect();
  const total = state.scrollSpacer.offsetHeight - window.innerHeight;
  const progress = clamp((-rect.top) / Math.max(total, 1), 0, 1);
  state.scrollProgress = progress;
}

async function initThreeScene() {
  const THREE = await import('three');
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
  state.scene = new THREE.Scene();
  state.camera = new THREE.PerspectiveCamera(HERO_CONFIG.camera.fov, window.innerWidth / window.innerHeight, HERO_CONFIG.camera.near, HERO_CONFIG.camera.far);
  state.camera.position.set(0, 0, HERO_CONFIG.camera.posZ);

  state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  state.renderer.setSize(window.innerWidth, window.innerHeight);
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  state.renderer.outputColorSpace = THREE.SRGBColorSpace;
  state.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  state.renderer.toneMappingExposure = 1.0;
  state.canvasContainer.appendChild(state.renderer.domElement);

  const ambient = new THREE.AmbientLight(HERO_CONFIG.lights.ambient.color, HERO_CONFIG.lights.ambient.intensity);
  const key = new THREE.DirectionalLight(HERO_CONFIG.lights.key.color, HERO_CONFIG.lights.key.intensity);
  key.position.set(...HERO_CONFIG.lights.key.pos);
  const rim = new THREE.DirectionalLight(HERO_CONFIG.lights.rim.color, HERO_CONFIG.lights.rim.intensity);
  rim.position.set(...HERO_CONFIG.lights.rim.pos);
  state.scene.add(ambient, key, rim);

  state.clock = new THREE.Clock();
  const gltfLoader = new GLTFLoader();
  const gltf = await new Promise((resolve, reject) => gltfLoader.load(HERO_CONFIG.glbPath, resolve, undefined, reject));
  state.model = gltf.scene;
  state.scene.add(state.model);

  const box = new THREE.Box3().setFromObject(state.model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2.55 / maxDim;
  state.model.scale.setScalar(scale);
  state.model.position.sub(center.multiplyScalar(scale));

  const start = HERO_CONFIG.poses.start;
  state.currentPose = { ...start };
  state.model.position.x += start.x;
  state.model.position.y += start.y;
  state.model.rotation.set(start.rotX, start.rotY, start.rotZ);

  animate();
}

function getPose(progress) {
  const { start, mid, end } = HERO_CONFIG.poses;
  const p = clamp(progress, 0, 1);
  if (p < 0.54) {
    const t = easeInOut(p / 0.54);
    return {
      x: lerp(start.x, mid.x, t),
      y: lerp(start.y, mid.y, t),
      scale: lerp(start.scale, mid.scale, t),
      rotX: lerp(start.rotX, mid.rotX, t),
      rotY: lerp(start.rotY, mid.rotY, t),
      rotZ: lerp(start.rotZ, mid.rotZ, t),
    };
  }
  const t = easeInOut((p - 0.54) / 0.46);
  return {
    x: lerp(mid.x, end.x, t),
    y: lerp(mid.y, end.y, t),
    scale: lerp(mid.scale, end.scale, t),
    rotX: lerp(mid.rotX, end.rotX, t),
    rotY: lerp(mid.rotY, end.rotY, t),
    rotZ: lerp(mid.rotZ, end.rotZ, t),
  };
}

function updateScenes(progress) {
  const sceneDefs = [
    { el: state.stages[0], ...HERO_CONFIG.scenes.first },
    { el: state.stages[1], ...HERO_CONFIG.scenes.second },
    { el: state.stages[2], ...HERO_CONFIG.scenes.third },
  ];

  sceneDefs.forEach(({ el, start, fadeStart, end, fromY, toY }) => {
    if (!el) return;

    let opacity = 0;
    let y = fromY;

    // Keep scene 1 fully present before meaningful scroll begins.
    if (start === 0 && progress <= fadeStart) {
      opacity = 1;
      const holdT = clamp(progress / Math.max(fadeStart, 0.0001), 0, 1);
      y = lerp(fromY, fromY - 28, holdT);
    } else if (progress <= start) {
      opacity = 0;
      y = fromY;
    } else if (progress >= end) {
      opacity = 0;
      y = toY;
    } else {
      const local = clamp((progress - start) / Math.max(end - start, 0.0001), 0, 1);
      y = lerp(fromY, toY, local);

      if (progress < fadeStart) {
        const fadeInDuration = start === 0 ? 0.01 : 0.12;
        const fadeInT = clamp((progress - start) / Math.max(fadeInDuration, 0.0001), 0, 1);
        opacity = start === 0 ? 1 : easeInOut(fadeInT);
      } else {
        const fadeT = clamp((progress - fadeStart) / Math.max(end - fadeStart, 0.0001), 0, 1);
        opacity = 1 - easeInOut(fadeT);
      }
    }

    el.style.opacity = opacity.toFixed(3);
    el.style.transform = `translate3d(0, ${y}px, 0)`;
    el.classList.toggle('is-active', opacity > 0.08);
  });
}

function animate() {
  state.animFrameId = requestAnimationFrame(animate);
  if (!state.model || !state.renderer || !state.camera) return;
  updateScrollProgress();

  const t = state.clock.getElapsedTime();
  const pose = getPose(state.scrollProgress);

  // pointer target returns to zero when not interacting
  state.pointer.currentX = lerp(state.pointer.currentX, state.pointer.targetX, HERO_CONFIG.pointerReturnEase);
  state.pointer.currentY = lerp(state.pointer.currentY, state.pointer.targetY, HERO_CONFIG.pointerReturnEase);
  const floatY = state.isReducedMotion ? 0 : Math.sin(t * HERO_CONFIG.floatSpeed * 2.0) * HERO_CONFIG.floatAmplitude;

  state.currentPose.x = lerp(state.currentPose.x, pose.x, HERO_CONFIG.stageEase);
  state.currentPose.y = lerp(state.currentPose.y, pose.y + floatY, HERO_CONFIG.stageEase);
  state.currentPose.scale = lerp(state.currentPose.scale, pose.scale, HERO_CONFIG.stageEase);
  state.currentPose.rotX = lerp(state.currentPose.rotX, pose.rotX - state.pointer.currentY * 0.075, HERO_CONFIG.stageEase);
  state.currentPose.rotY = lerp(state.currentPose.rotY, pose.rotY + state.pointer.currentX * 0.10, HERO_CONFIG.stageEase);
  state.currentPose.rotZ = lerp(state.currentPose.rotZ, pose.rotZ, HERO_CONFIG.stageEase);

  state.model.position.x = state.currentPose.x;
  state.model.position.y = state.currentPose.y;
  state.model.rotation.set(state.currentPose.rotX, state.currentPose.rotY, state.currentPose.rotZ);
  state.model.scale.setScalar(state.currentPose.scale);

  const fadeProgress = clamp((state.scrollProgress - HERO_CONFIG.fadeStart) / (1 - HERO_CONFIG.fadeStart), 0, 1);
  const opacity = 1 - fadeProgress;
  state.renderer.domElement.style.opacity = opacity.toFixed(3);
  state.model.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.transparent = true;
      child.material.opacity = opacity;
    }
  });

  updateScenes(state.scrollProgress);
  state.renderer.render(state.scene, state.camera);
}

function onPointerMove(e) {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = (e.clientY / window.innerHeight) * 2 - 1;
  state.pointer.targetX = clamp(x, -1, 1);
  state.pointer.targetY = clamp(y, -1, 1);
}
function onPointerLeave() {
  state.pointer.targetX = 0;
  state.pointer.targetY = 0;
}
function onResize() {
  detectCapabilities();
  if (!state.renderer || !state.camera) return;
  state.camera.aspect = window.innerWidth / window.innerHeight;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(window.innerWidth, window.innerHeight);
}

async function init() {
  state.canvasContainer = document.getElementById('hero-canvas');
  state.fallbackImg = document.querySelector('.hero__fallback');
  state.scrollSpacer = document.querySelector('.hero__scroll-spacer');
  state.sticky = document.querySelector('.hero__sticky');
  state.stages = Array.from(document.querySelectorAll('.hero__stage'));
  if (!state.canvasContainer || !state.scrollSpacer) return;
  detectCapabilities();
  if (state.isMobile || state.isReducedMotion || !state.hasWebGL) {
    showFallback();
    return;
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();
  try {
    await initThreeScene();
  } catch (err) {
    console.warn('[SOS Hero] GLB failed, falling back to image.', err);
    showFallback();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
