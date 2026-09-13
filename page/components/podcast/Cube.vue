<template>
  <!-- Decorative: every word on the faces is already in the hero or the bands
    below it, so screen readers skip the cube. The box holds its size on the
    server render, so the canvas arriving on the client moves nothing. -->
  <div class="pod-cube-wrap" aria-hidden="true">
    <div ref="stage" class="pod-cube"></div>
    <!-- Nothing about a cube says it can be turned by hand, so say it --
      until someone does. Its line is always there, invisible until the cube
      has drawn and after it has been handled, so nothing moves either time. -->
    <p class="pod-cube-hint" :class="{ 'is-shown': ready && !handled }">
      <span class="pod-cube-hint-thumb"><i class="fas fa-hand-pointer"></i></span>
    </p>
  </div>
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
  {
    bg: "--pod-accent",
    fg: "--pod-bg",
    layout: "feature",
    eyebrow: content.hero.eyebrow,
    title: content.hero.title
  },
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
  { bg: "--pod-lime", fg: "--pod-text", eyebrow: band("community").eyebrow, title: band("community").title }
];

// BoxGeometry's material slots in the order a Y-axis turn brings them to the
// camera: +z, +x, -z, -x.
const SIDES = [4, 0, 5, 1];

const HOLD_MS = 1800;
const TURN_MS = 750;
// The shortest a turn gets, for a drag released most of the way round.
const SETTLE_MS = 260;
// How long handling the cube holds off the automatic turn, so the visitor gets
// to read the face they landed on.
const IDLE_MS = 6000;
// The spin. Speeds are in quarter-turns per millisecond. A release faster
// than FLICK_SPEED, measured over the last FLICK_WINDOW_MS of the drag, keeps
// spinning; COAST_MS is how fast that spin dies away -- short, so it whips
// round and slows quickly -- and below SETTLE_SPEED it eases onto a face,
// leading by SETTLE_LEAD_MS of its remaining speed so it does not swing back.
const FLICK_SPEED = 0.002;
const FLICK_WINDOW_MS = 80;
const MAX_SPEED = 0.04;
const COAST_MS = 260;
const SETTLE_SPEED = 0.0025;
const SETTLE_LEAD_MS = 120;
// No frame or pointer event may move the cube a whole quarter-turn, or a side
// could come round before it is re-skinned.
const MAX_STEP = 0.9;
// The quiet gap that ends a trackpad swipe -- a trackpad keeps sending
// momentum for a while after the fingers lift, and all of it belongs to it.
const WHEEL_GAP_MS = 150;
const FACE_PX = 1024;
const FONT = 'Archivo, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const stage = ref(null);
// The hint shows once the cube has drawn, and goes for good once it is handled.
const ready = ref(false);
const handled = ref(false);
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

// Breaks text into lines no wider than maxWidth at the context's current font.
// A single word wider than that still gets a line of its own.
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  for (const word of text.split(/\s+/)) {
    const candidate = lines.length ? `${lines[lines.length - 1]} ${word}` : word;
    if (lines.length && ctx.measureText(candidate).width <= maxWidth) lines[lines.length - 1] = candidate;
    else lines.push(word);
  }
  return lines;
}

// Wraps to at most maxLines at the largest size that fits, shrinking a step
// at a time until everything does.
function fitText(ctx, text, weight, maxWidth, maxLines, startSize) {
  for (let size = startSize; size > 24; size -= 6) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    const lines = wrapText(ctx, text, maxWidth);
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

// Big enough to read once the cube is phone-sized, where a face is drawn at
// about a third of these pixels. A long eyebrow wraps rather than shrinks,
// breaking at a " | " first so each part keeps its own line. Leaves the
// eyebrow's font and letter-spacing set for drawing.
function setEyebrow(ctx, text, maxWidth) {
  if ("letterSpacing" in ctx) ctx.letterSpacing = "5px";
  let size = 44;
  let lines;
  do {
    ctx.font = `600 ${size}px ${FONT}`;
    lines = text
      .toUpperCase()
      .split(" | ")
      .flatMap((part) => wrapText(ctx, part, maxWidth));
  } while (lines.length > 3 && (size -= 2) > 28);
  return { size, lines, leading: size * 1.25 };
}

// The name as the face's centrepiece: the title left-aligned across the
// middle, the eyebrow right-aligned along the bottom edge with its rule above.
function drawFeature(ctx, stop, width, pad) {
  const right = FACE_PX - pad;

  // Right-aligned, so the letter-spacing the last character carries would
  // push the line in from the edge; start that far out to make up for it.
  ctx.textAlign = "right";
  const eyebrow = setEyebrow(ctx, stop.eyebrow, width);
  const tracking = "letterSpacing" in ctx ? parseFloat(ctx.letterSpacing) || 0 : 0;
  const firstBaseline = FACE_PX - pad - (eyebrow.lines.length - 1) * eyebrow.leading;
  eyebrow.lines.forEach((line, index) => {
    ctx.fillText(line, right + tracking, firstBaseline + index * eyebrow.leading, width);
  });
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  ctx.fillRect(right - 96, firstBaseline - eyebrow.size - 38, 96, 6);

  // Centred on the face vertically as a block, a little high to leave the
  // eyebrow its own room: cap height is about 0.72 of the size.
  ctx.textAlign = "left";
  const { size, lines } = fitText(ctx, stop.title, 800, width, 3, 170);
  const leading = size * 1.02;
  const blockHeight = (lines.length - 1) * leading + size * 0.72;
  const top = FACE_PX / 2 - blockHeight / 2 - 60;
  lines.forEach((line, index) => {
    ctx.fillText(line, pad, top + size * 0.72 + index * leading, width);
  });
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

  if (stop.layout === "feature") {
    drawFeature(ctx, stop, width, pad);
    return;
  }

  const eyebrow = setEyebrow(ctx, stop.eyebrow, width);
  eyebrow.lines.forEach((line, index) => {
    ctx.fillText(line, pad, pad + eyebrow.size + index * eyebrow.leading, width);
  });
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  ctx.fillRect(pad, pad + eyebrow.size + (eyebrow.lines.length - 1) * eyebrow.leading + 32, 96, 6);

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
  ready.value = true;

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
  // can be spun back by hand. Each side remembers which stop it holds, so a
  // spin redraws a side only when it has to show something new -- drawing a
  // 1024px face every frame would stutter.
  const sideStop = SIDES.map(() => null);
  const skin = (k) => {
    const side = mod(k, SIDES.length);
    const stop = mod(k, STORY.length);
    if (sideStop[side] === stop) return;
    sideStop[side] = stop;
    drawFace(canvases[side], STORY[stop], color, images);
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

  // angle is where the cube is, in quarter-turns. It moves one of three ways:
  // easing from `from` to `target` (a turn), following a hand (a drag or a
  // trackpad swipe), or coasting on the speed a flick left it with.
  let target = 0;
  let angle = 0;
  let from = 0;
  let turnStart = 0;
  let turnMs = TURN_MS;
  let ease = easeInOutCubic;
  let velocity = 0;
  let hand = null;
  let wheelTimer = 0;
  let restingSince = performance.now();
  let resumeAt = 0;
  let lastTick = 0;
  let frame = 0;
  let visible = true;

  // Only the two sides either side of `angle` can be seen. Every frame, the
  // side about to come round in either direction is re-skinned for the stop
  // it will show -- while it still faces away, which holds at any speed as
  // long as no frame moves the cube a whole quarter-turn (moveBy caps it).
  const inView = (k) => mod(k, 4) === mod(Math.floor(angle), 4) || mod(k, 4) === mod(Math.ceil(angle), 4);
  const prepareAround = () => {
    for (const k of [Math.floor(angle) - 1, Math.ceil(angle) + 1]) {
      if (!inView(k)) skin(k);
    }
  };

  const moveBy = (delta) => {
    angle += clamp(delta, -MAX_STEP, MAX_STEP);
    prepareAround();
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
    velocity = 0;
    from = angle;
    target = next;
    turnStart = now;
    ease = byHand ? easeOutCubic : easeInOutCubic;
    turnMs = Math.max(TURN_MS * Math.abs(target - angle), byHand ? SETTLE_MS : TURN_MS);
    if (byHand) resumeAt = now + IDLE_MS;
    kick();
  };

  // Lands on the nearest face, nudged the way the cube was already going so
  // a spin that is nearly over does not swing back.
  const settle = (now, speed) => turnTo(Math.round(angle + speed * SETTLE_LEAD_MS), now, true);

  // A hand takes the cube wherever it is, mid-turn or mid-coast.
  const grab = (now) => {
    handled.value = true;
    velocity = 0;
    target = angle;
    resumeAt = now + IDLE_MS;
    kick();
  };

  const tick = (now) => {
    const dt = lastTick ? Math.min(now - lastTick, 50) : 16;
    lastTick = now;

    if (hand || wheelTimer) {
      // Steered by pointermove / wheel; nothing to advance here.
    } else if (velocity) {
      moveBy(velocity * dt);
      velocity *= Math.exp(-dt / COAST_MS);
      if (Math.abs(velocity) < SETTLE_SPEED) settle(now, velocity);
    } else if (angle !== target) {
      const progress = reducedMotion ? 1 : Math.min((now - turnStart) / turnMs, 1);
      angle = from + (target - from) * ease(progress);
      if (progress === 1) {
        angle = target;
        restingSince = now;
      }
    } else if (!reducedMotion && now >= resumeAt && now - restingSince >= HOLD_MS) {
      turnTo(target + 1, now, false);
    }

    prepareAround();
    render(now);
    // Under reduced motion nothing moves on its own, so the loop only runs
    // while the cube is being handled or settling from it.
    const busy = !reducedMotion || hand || wheelTimer || velocity || angle !== target;
    frame = visible && busy ? requestAnimationFrame(tick) : 0;
    if (!frame) lastTick = 0;
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

  // Spin it like a toy. The cube follows the pointer -- a drag the width of
  // the cube is one face -- and a flick leaves it spinning at the speed of the
  // last moment of the drag, slowing fast so the face it lands on is readable
  // almost at once. A slow release just settles on the nearest face.
  // Captured, so a drag that leaves the cube still ends. Vertical drags stay
  // the page's on touch (touch-action: pan-y in the styles), which cancels the
  // pointer instead.
  el.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0) return;
      try {
        el.setPointerCapture(event.pointerId);
      } catch {
        // Capture is a nicety; without it a drag still works on the cube.
      }
      hand = { x: event.clientX, samples: [{ x: event.clientX, t: event.timeStamp }] };
      grab(performance.now());
    },
    { signal }
  );

  el.addEventListener(
    "pointermove",
    (event) => {
      if (!hand) return;
      moveBy(-(event.clientX - hand.x) / cubeSize());
      hand.x = event.clientX;
      hand.samples.push({ x: event.clientX, t: event.timeStamp });
      while (hand.samples.length > 2 && event.timeStamp - hand.samples[0].t > FLICK_WINDOW_MS) hand.samples.shift();
    },
    { signal }
  );

  const release = (event, cancelled) => {
    if (!hand) return;
    const first = hand.samples[0];
    const last = hand.samples[hand.samples.length - 1];
    const elapsed = event.timeStamp - first.t;
    // Quarter-turns per millisecond over the last moment of the drag. A
    // pointer that stopped before letting go has nothing left to give.
    const recent = elapsed > 0 && event.timeStamp - last.t < FLICK_WINDOW_MS;
    const speed = cancelled || !recent ? 0 : -(last.x - first.x) / elapsed / cubeSize();
    hand = null;

    const now = performance.now();
    if (reducedMotion || Math.abs(speed) < FLICK_SPEED) settle(now, speed);
    else {
      velocity = clamp(speed, -MAX_SPEED, MAX_SPEED);
      resumeAt = now + IDLE_MS;
      kick();
    }
  };
  el.addEventListener("pointerup", (event) => release(event, false), { signal });
  el.addEventListener("pointercancel", (event) => release(event, true), { signal });

  // A two-finger swipe on a trackpad arrives as horizontal scrolling, never as
  // a pointer. The cube follows it, momentum included -- the trackpad sends
  // its own -- and settles on the nearest face once the scrolling stops.
  // preventDefault keeps the browser from reading it as back/forward.
  el.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (hand) return;

      if (!wheelTimer) grab(performance.now());
      else clearTimeout(wheelTimer);
      // deltaMode 1 is lines, from a mouse's horizontal wheel.
      moveBy((event.deltaX * (event.deltaMode === 1 ? 16 : 1)) / cubeSize());
      resumeAt = performance.now() + IDLE_MS;
      wheelTimer = setTimeout(() => {
        wheelTimer = 0;
        settle(performance.now(), 0);
      }, WHEEL_GAP_MS);
    },
    { passive: false, signal }
  );

  kick();

  teardown = () => {
    cancelAnimationFrame(frame);
    clearTimeout(wheelTimer);
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
/* The cube over its hint. The root is what the hero sizes -- a square by
   width beside the copy, or a set height on a phone -- and the cube takes
   whatever the hint's line leaves. */
.pod-cube-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.pod-cube {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
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

/* Out of flow, so the canvas follows the box rather than holding it open.
   Centred across, and down on the box's bottom edge for when the box is
   taller than the cube -- so the hint under it stays close. */
.pod-cube :deep(canvas) {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: block;
}

.pod-cube-hint {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  line-height: 1.5rem;
  text-transform: uppercase;
  color: var(--pod-accent);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.pod-cube-hint.is-shown {
  opacity: 1;
}

/* A thumb flicking left to right: presses in, swipes across with a tilt,
   lifts off and comes back for another go. The icon says it on its own. */
.pod-cube-hint-thumb {
  display: inline-flex;
  justify-content: center;
  width: 4rem;
  font-size: 1.25rem;
}

.pod-cube-hint-thumb i {
  animation: pod-cube-hint-swipe 1.8s cubic-bezier(0.45, 0, 0.3, 1) infinite;
}

@keyframes pod-cube-hint-swipe {
  0% {
    opacity: 0;
    transform: translateX(-18px) rotate(-14deg) scale(1);
  }
  15% {
    opacity: 1;
    transform: translateX(-18px) rotate(-14deg) scale(0.88);
  }
  55% {
    opacity: 1;
    transform: translateX(18px) rotate(12deg) scale(0.88);
  }
  75%,
  100% {
    opacity: 0;
    transform: translateX(20px) rotate(12deg) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pod-cube-hint-thumb i {
    animation: none;
  }
}
</style>
