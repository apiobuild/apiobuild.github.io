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
  // Then the name itself, spelled out -- the tile teases it, this lands it.
  { bg: "--pod-accent", fg: "--pod-bg", eyebrow: content.hero.eyebrow, title: content.hero.title },
  ...props.hosts.map((person, index) => {
    const brand = person.links.find((link) => link.image);
    return {
      // Never --pod-bg or --pod-bg-raised: the cube sits on the page ground,
      // and a face in either color melts into it.
      bg: index % 2 === 0 ? "--pod-text" : "--pod-text-muted",
      fg: index % 2 === 0 ? "--pod-lime" : "--pod-bg",
      eyebrow: person.name,
      title: brand?.name ?? person.role,
      mark: brand?.image ?? null
    };
  }),
  { bg: "--pod-accent-strong", fg: "--pod-lime", eyebrow: band("the-conversation").eyebrow, title: band("the-conversation").title },
  { bg: "--pod-lime", fg: "--pod-text", eyebrow: band("community").eyebrow, title: band("community").title }
];

// BoxGeometry's material slots in the order a Y-axis turn brings them to the
// camera: +z, +x, -z, -x.
const SIDES = [4, 0, 5, 1];

const HOLD_MS = 2600;
const TURN_MS = 900;
// The shortest a turn gets, for a drag released most of the way round.
const SETTLE_MS = 260;
// How long a swipe holds off the automatic turn, so the visitor gets to read
// the face they chose.
const IDLE_MS = 6000;
// Horizontal travel that counts as a flick to the next face rather than a
// nudge that springs back.
const SWIPE_PX = 40;
// Trackpad scroll that counts as one swipe, and the quiet gap that ends a
// gesture -- a trackpad keeps sending momentum for a while after the fingers
// lift, and all of it belongs to the one swipe.
const WHEEL_PX = 50;
const WHEEL_GAP_MS = 250;
const FACE_PX = 1024;
const FONT = 'Archivo, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const stage = ref(null);
let teardown = () => {};
let unmounted = false;

const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const mod = (n, m) => ((n % m) + m) % m;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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
  // Far enough back that a corner swinging toward the camera mid-turn stays
  // in frame -- the tilt drops the near bottom corner lowest of all, which at
  // 5.6 ran off the bottom of the canvas. LIFT, below, spends the spare room
  // above the cube on that corner.
  camera.position.set(0, 0, 5.9);

  const canvases = SIDES.map(() => Object.assign(document.createElement("canvas"), { width: FACE_PX, height: FACE_PX }));
  const textures = canvases.map((canvas) => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  });

  // Stop k is shown on side k mod 4, and k runs both ways now that the cube
  // can be turned back by hand.
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

  // angle is where the cube is, in quarter-turns; target is the stop it is
  // easing toward from `from`. shown is the last stop it came to rest on.
  let shown = 0;
  let target = 0;
  let angle = 0;
  let from = 0;
  let turnStart = 0;
  let turnMs = TURN_MS;
  let ease = easeInOutCubic;
  let restingSince = performance.now();
  let resumeAt = 0;
  let frame = 0;
  let visible = true;
  let drag = null;

  // Only the two sides either side of `angle` can be seen, so any other side
  // is safe to re-skin. Keeping every input within two stops of the cube is
  // what guarantees the side about to come round is one of those.
  const inView = (k) => mod(k, 4) === mod(Math.floor(angle), 4) || mod(k, 4) === mod(Math.ceil(angle), 4);
  const prepare = (k) => {
    if (!inView(k)) skin(k);
  };

  // The tilt shows the top face and hides the bottom, so the cube sits a
  // little above centre to look centred -- and to give its lowest corner room.
  const LIFT = 0.2;

  const render = (now) => {
    cube.rotation.y = -angle * (Math.PI / 2);
    cube.position.y = LIFT + (reducedMotion ? 0 : Math.sin(now / 1400) * 0.04);
    renderer.render(scene, camera);
  };

  // By hand the cube is already moving, so it eases out from where it is;
  // a turn it starts itself eases in as well. Short distances go quicker.
  const turnTo = (next, now, byHand) => {
    prepare(next);
    prepare(next + Math.sign(next - angle));
    from = angle;
    target = next;
    turnStart = now;
    ease = byHand ? easeOutCubic : easeInOutCubic;
    turnMs = Math.max(TURN_MS * Math.abs(target - angle), byHand ? SETTLE_MS : TURN_MS);
    if (byHand) resumeAt = now + IDLE_MS;
    kick();
  };

  const tick = (now) => {
    if (!drag && angle !== target) {
      const progress = reducedMotion ? 1 : Math.min((now - turnStart) / turnMs, 1);
      angle = from + (target - from) * ease(progress);
      if (progress === 1) {
        angle = shown = target;
        prepare(shown - 1);
        prepare(shown + 1);
        restingSince = now;
      }
    } else if (!drag && !reducedMotion && now >= resumeAt && now - restingSince >= HOLD_MS) {
      turnTo(target + 1, now, false);
    }

    render(now);
    // Under reduced motion nothing moves on its own, so the loop only runs
    // while the cube is being turned by hand or settling from it.
    const busy = !reducedMotion || drag || angle !== target;
    frame = visible && busy ? requestAnimationFrame(tick) : 0;
  };

  function kick() {
    if (!frame && visible) frame = requestAnimationFrame(tick);
  }

  const cubeSize = () => Math.min(el.clientWidth, el.clientHeight || el.clientWidth) || 1;

  const resize = () => {
    // The smaller side, so the cube stays square in a box that is not.
    renderer.setSize(cubeSize(), cubeSize());
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

  const listeners = new AbortController();
  const { signal } = listeners;

  // Dragging turns the cube under the pointer -- a drag the width of the cube
  // is one face -- and letting go settles it: on the next face for a flick,
  // back where it was for a nudge. Captured, so a drag that leaves the cube
  // still ends. Vertical drags stay the page's on touch (touch-action: pan-y
  // in the styles), which cancels the pointer instead.
  el.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0) return;
      el.setPointerCapture(event.pointerId);
      const near = Math.round(angle);
      prepare(near - 1);
      prepare(near + 1);
      drag = { x: event.clientX, base: angle, near };
      resumeAt = performance.now() + IDLE_MS;
      kick();
    },
    { signal }
  );

  el.addEventListener(
    "pointermove",
    (event) => {
      if (!drag) return;
      const turned = drag.base - (event.clientX - drag.x) / cubeSize();
      angle = clamp(turned, drag.near - 1, drag.near + 1);
    },
    { signal }
  );

  const release = (event, cancelled) => {
    if (!drag) return;
    const dx = cancelled ? 0 : event.clientX - drag.x;
    let next = Math.round(angle);
    if (dx <= -SWIPE_PX) next = Math.floor(angle) + 1;
    if (dx >= SWIPE_PX) next = Math.ceil(angle) - 1;
    next = clamp(next, drag.near - 1, drag.near + 1);
    drag = null;
    turnTo(next, performance.now(), true);
  };
  el.addEventListener("pointerup", (event) => release(event, false), { signal });
  el.addEventListener("pointercancel", (event) => release(event, true), { signal });

  // A two-finger swipe on a trackpad arrives as horizontal scrolling, never as
  // a pointer. One face per gesture, chaining onto a turn already under way.
  // preventDefault keeps the browser from reading it as back/forward.
  let wheelTravel = 0;
  let wheelLast = 0;
  let wheelSpent = false;
  el.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const now = performance.now();
      if (now - wheelLast > WHEEL_GAP_MS) {
        wheelTravel = 0;
        wheelSpent = false;
      }
      wheelLast = now;
      if (wheelSpent || drag) return;

      wheelTravel += event.deltaX;
      if (Math.abs(wheelTravel) < WHEEL_PX) return;
      const next = target + Math.sign(wheelTravel);
      wheelSpent = true;
      if (Math.abs(next - angle) < 2) turnTo(next, now, true);
    },
    { passive: false, signal }
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
