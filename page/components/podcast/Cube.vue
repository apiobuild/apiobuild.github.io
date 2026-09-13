<template>
  <!-- Decorative: every word on the faces is already in the hero or the bands
    below it, so screen readers skip the cube. The box holds its square on the
    server render, so the canvas arriving on the client moves nothing. -->
  <div ref="stage" class="pod-cube" aria-hidden="true"></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import content from "~/assets/podcast.json";

const props = defineProps({
  // The hosts as pages/podcast.vue resolves them, brand marks already turned
  // into built URLs. Globbing the marks again here moved them into a shared
  // chunk whose URLs come out absolute on the client, which broke hydration
  // of every image on the page.
  hosts: { type: Array, default: () => [] }
});

const band = (id) => content.bands.find((entry) => entry.id === id);

// The loop, in order. There are more stops than a cube has sides, so a side
// is re-skinned while it faces away from the camera -- reorder or add stops
// here freely. Colors name podcast.css tokens so the palette stays in one
// place. Copy comes from podcast.json for the same reason.
const STORY = [
  // The show's name as a periodic-table tile: Tê is tea in Taiwanese.
  { bg: "--pod-lime", fg: "--pod-text", tile: { number: "1", symbol: "Tê", name: "tea" } },
  ...props.hosts.map((person, index) => {
    const brand = person.links.find((link) => link.image);
    return {
      // Never --pod-bg or --pod-bg-raised: the cube sits on the page ground,
      // and a face in either color melts into it.
      bg: index % 2 === 0 ? "--pod-text" : "--pod-text-muted",
      fg: index % 2 === 0 ? "--pod-lime" : "--pod-bg",
      eyebrow: `Hosted by ${person.name}`,
      title: brand?.name ?? person.role,
      mark: brand?.image ?? null
    };
  }),
  { bg: "--pod-accent", fg: "--pod-bg", eyebrow: band("the-conversation").eyebrow, title: band("the-conversation").title },
  { bg: "--pod-lime", fg: "--pod-text", eyebrow: band("community").eyebrow, title: band("community").title }
];

// BoxGeometry's material slots in the order a Y-axis turn brings them to the
// camera: +z, +x, -z, -x.
const SIDES = [4, 0, 5, 1];

const HOLD_MS = 2600;
const TURN_MS = 900;
const FACE_PX = 1024;
const FONT = 'Archivo, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const stage = ref(null);
let teardown = () => {};
let unmounted = false;

const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

// Wraps to at most maxLines at the largest size that fits, shrinking a step
// at a time -- the hero title is one long word until the show has a name.
function fitText(ctx, text, weight, maxWidth, maxLines, startSize) {
  for (let size = startSize; size > 24; size -= 6) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    const lines = [];
    for (const word of text.split(/\s+/)) {
      const candidate = lines.length ? `${lines[lines.length - 1]} ${word}` : word;
      if (lines.length && ctx.measureText(candidate).width <= maxWidth) lines[lines.length - 1] = candidate;
      else lines.push(word);
    }
    if (lines.length <= maxLines && lines.every((line) => ctx.measureText(line).width <= maxWidth)) {
      return { size, lines };
    }
  }
  return { size: 24, lines: [text] };
}

// A periodic-table tile: a ruled square with the number in its corner, the
// symbol filling the middle and the name under it.
function drawTile(ctx, tile, ink) {
  const inset = 72;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 14;
  ctx.strokeRect(inset, inset, FACE_PX - inset * 2, FACE_PX - inset * 2);

  ctx.fillStyle = ink;
  ctx.textAlign = "left";
  ctx.font = `600 96px ${FONT}`;
  ctx.fillText(tile.number, inset + 64, inset + 150);

  ctx.textAlign = "center";
  const { size } = fitText(ctx, tile.symbol, 800, FACE_PX - inset * 2 - 160, 1, 460);
  ctx.font = `800 ${size}px ${FONT}`;
  ctx.fillText(tile.symbol, FACE_PX / 2, 690);

  ctx.font = `600 120px ${FONT}`;
  ctx.fillText(tile.name, FACE_PX / 2, 850);
  ctx.textAlign = "left";
}

function drawFace(canvas, stop, color, images) {
  const ctx = canvas.getContext("2d");
  const pad = 96;
  const width = FACE_PX - pad * 2;

  ctx.fillStyle = color(stop.bg);
  ctx.fillRect(0, 0, FACE_PX, FACE_PX);
  ctx.fillStyle = color(stop.fg);
  ctx.textBaseline = "alphabetic";

  if (stop.tile) {
    drawTile(ctx, stop.tile, color(stop.fg));
    return;
  }

  ctx.font = `600 34px ${FONT}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "4px";
  ctx.fillText(stop.eyebrow.toUpperCase(), pad, pad + 34, width);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  ctx.fillRect(pad, pad + 64, 96, 6);

  const image = stop.mark && images.get(stop.mark);
  if (image) {
    // The marks are small squares with their own colors, so they sit on a
    // light disc rather than straight on a dark face.
    const radius = 210;
    const cx = FACE_PX / 2;
    const cy = 430;
    ctx.fillStyle = color("--pod-bg-raised");
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    const side = radius * 1.3;
    ctx.drawImage(image, cx - side / 2, cy - side / 2, side, side);
    ctx.fillStyle = color(stop.fg);
  }

  const { size, lines } = fitText(ctx, stop.title, 800, width, image ? 2 : 4, image ? 120 : 150);
  const leading = size * 1.02;
  lines.forEach((line, index) => {
    ctx.fillText(line, pad, FACE_PX - pad - (lines.length - 1 - index) * leading, width);
  });
}

onMounted(async () => {
  const el = stage.value;

  // Faces are drawn once, so the type has to be there first. load() is what
  // actually fetches a face nothing on the page has used yet; ready alone
  // resolves without it.
  try {
    await Promise.all([document.fonts.load(`800 100px ${FONT}`), document.fonts.load(`600 34px ${FONT}`)]);
    await document.fonts.ready;
  } catch {
    // Falls back to the system sans in the stack.
  }

  // Imported here rather than at the top: three touches window at import, and
  // the page is prerendered.
  const [THREE, images] = await Promise.all([
    import("three"),
    Promise.all(STORY.filter((stop) => stop.mark).map(async (stop) => [stop.mark, await loadImage(stop.mark)])).then(
      (entries) => new Map(entries)
    )
  ]);
  if (unmounted || !el) return;

  const styles = getComputedStyle(el);
  const color = (token) => styles.getPropertyValue(token).trim() || "#282b0d";

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  // Close enough that the cube fills its square with room for the tilt and
  // the corners swinging out mid-turn.
  camera.position.set(0, 0, 5.6);

  const canvases = SIDES.map(() => Object.assign(document.createElement("canvas"), { width: FACE_PX, height: FACE_PX }));
  const textures = canvases.map((canvas) => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  });

  // Stop k is shown on side k % 4. Arriving at stop k, the side two turns
  // ahead is facing directly away, so that is when it takes its next stop.
  const skin = (k) => {
    const side = k % SIDES.length;
    drawFace(canvases[side], STORY[k % STORY.length], color, images);
    textures[side].needsUpdate = true;
  };
  for (let k = 0; k < SIDES.length; k++) skin(k);

  // Top and bottom only show as a sliver under the tilt.
  const edge = new THREE.MeshBasicMaterial({ color: color("--pod-accent-strong") });
  const materials = Array.from({ length: 6 }, () => edge);
  SIDES.forEach((slot, side) => {
    materials[slot] = new THREE.MeshBasicMaterial({ map: textures[side] });
  });

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube = new THREE.Mesh(geometry, materials);
  cube.rotation.x = 0.22;
  scene.add(cube);

  const resize = () => {
    const size = el.clientWidth;
    if (!size) return;
    renderer.setSize(size, size);
    renderer.render(scene, camera);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(el);
  resize();

  let frame = 0;
  let visible = true;
  let elapsed = 0;
  let last = 0;
  let shown = 0;

  const tick = (now) => {
    // Clamped, so coming back from a hidden tab or off-screen resumes the
    // loop where it left off instead of skipping stops.
    elapsed += Math.min(now - (last || now), 100);
    last = now;

    const period = HOLD_MS + TURN_MS;
    const k = Math.floor(elapsed / period);
    const local = elapsed - k * period;
    const turn = local < HOLD_MS ? 0 : easeInOutCubic((local - HOLD_MS) / TURN_MS);

    if (k > shown) {
      shown = k;
      skin(k + 2);
    }

    cube.rotation.y = -(k + turn) * (Math.PI / 2);
    cube.position.y = Math.sin(elapsed / 1400) * 0.04;
    renderer.render(scene, camera);
    frame = visible ? requestAnimationFrame(tick) : 0;
  };

  // Held on the first face, drawn once.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let intersectionObserver = null;
  if (!reducedMotion) {
    intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    });
    intersectionObserver.observe(el);
  }

  teardown = () => {
    cancelAnimationFrame(frame);
    visible = false;
    resizeObserver.disconnect();
    intersectionObserver?.disconnect();
    geometry.dispose();
    textures.forEach((texture) => texture.dispose());
    new Set(materials).forEach((material) => material.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
});

onBeforeUnmount(() => {
  unmounted = true;
  teardown();
});
</script>

<script>
export default {
  name: "PodcastCube"
};
</script>

<style scoped>
.pod-cube {
  width: 100%;
  aspect-ratio: 1;
}

.pod-cube :deep(canvas) {
  display: block;
}
</style>
