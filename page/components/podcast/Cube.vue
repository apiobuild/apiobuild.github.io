<template>
  <!-- Decorative: every word on the faces is already in the hero or the bands
    below it, so screen readers skip the cube. The box holds its size on the
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
// is re-skinned while it is out of view -- reorder or add stops here freely.
// Colors name podcast.css tokens so the palette stays in one place. Copy
// comes from podcast.json for the same reason.
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
// How long a swipe holds off the automatic turn, so the visitor gets to read
// the face they chose.
const IDLE_MS = 6000;
// Horizontal travel that counts as a swipe rather than a tap or a scroll.
const SWIPE_PX = 40;
const FACE_PX = 1024;
const FONT = 'Archivo, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const stage = ref(null);
let teardown = () => {};
let unmounted = false;

const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const mod = (n, m) => ((n % m) + m) % m;

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

// Wraps to at most maxLines at the largest size that fits, shrinking a step
// at a time until everything does.
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
    // Straight on the face, no backing shape.
    const side = 400;
    ctx.drawImage(image, (FACE_PX - side) / 2, 430 - side / 2, side, side);
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

  // Stop k is shown on side k mod 4, and k runs both ways now that a swipe
  // can turn the cube back. At rest the two neighbouring sides are edge-on to
  // the camera, so resting on a stop is when both take the stops either side
  // of it.
  const skin = (k) => {
    const side = mod(k, SIDES.length);
    drawFace(canvases[side], STORY[mod(k, STORY.length)], color, images);
    textures[side].needsUpdate = true;
  };
  for (let k = -1; k <= 2; k++) skin(k);

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

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The stop at rest, the stop being turned to, and where the turn is now in
  // quarter-turns. from/turnStart restart the easing whenever target moves.
  let shown = 0;
  let target = 0;
  let angle = 0;
  let from = 0;
  let turnStart = 0;
  let restingSince = performance.now();
  let resumeAt = 0;
  let frame = 0;
  let visible = true;

  const render = (now) => {
    cube.rotation.y = -angle * (Math.PI / 2);
    cube.position.y = reducedMotion ? 0 : Math.sin(now / 1400) * 0.04;
    renderer.render(scene, camera);
  };

  const turnTo = (next, now) => {
    from = angle;
    target = next;
    turnStart = now;
  };

  const tick = (now) => {
    if (angle !== target) {
      const progress = reducedMotion ? 1 : Math.min((now - turnStart) / TURN_MS, 1);
      angle = from + (target - from) * easeInOutCubic(progress);
      if (progress === 1) {
        angle = shown = target;
        skin(shown - 1);
        skin(shown + 1);
        restingSince = now;
      }
    } else if (!reducedMotion && now >= resumeAt && now - restingSince >= HOLD_MS) {
      turnTo(target + 1, now);
    }

    render(now);
    // Under reduced motion nothing moves on its own, so the loop only runs
    // while a swipe is being answered.
    const busy = !reducedMotion || angle !== target;
    frame = visible && busy ? requestAnimationFrame(tick) : 0;
  };

  const kick = () => {
    if (!frame && visible) frame = requestAnimationFrame(tick);
  };

  const resize = () => {
    // The smaller side, so the cube stays square in a box that is not.
    const size = Math.min(el.clientWidth, el.clientHeight || el.clientWidth);
    if (!size) return;
    renderer.setSize(size, size);
    render(performance.now());
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(el);
  resize();

  // Stops while scrolled away, and picks up again on the way back.
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) kick();
  });
  intersectionObserver.observe(el);

  // Swipe left for the next face, right for the one before. One stop per
  // swipe, and only from rest: the sides two stops away are not skinned yet.
  // Vertical drags stay the page's (touch-action: pan-y in the styles), which
  // cancels the pointer before it can count as a swipe.
  const listeners = new AbortController();
  let start = null;
  el.addEventListener("pointerdown", (event) => (start = { x: event.clientX, y: event.clientY }), {
    signal: listeners.signal
  });
  el.addEventListener("pointercancel", () => (start = null), { signal: listeners.signal });
  el.addEventListener(
    "pointerup",
    (event) => {
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;

      const now = performance.now();
      resumeAt = now + IDLE_MS;
      if (angle !== target) return;
      turnTo(shown + (dx < 0 ? 1 : -1), now);
      kick();
    },
    { signal: listeners.signal }
  );

  kick();

  teardown = () => {
    cancelAnimationFrame(frame);
    visible = false;
    listeners.abort();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
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
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  /* Horizontal drags turn the cube; vertical ones still scroll the page. */
  touch-action: pan-y;
  user-select: none;
  cursor: grab;
}

.pod-cube:active {
  cursor: grabbing;
}

/* Out of flow, so the canvas follows the box rather than holding it open,
   and centered for when the box is taller or wider than the cube. */
.pod-cube :deep(canvas) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
}
</style>
