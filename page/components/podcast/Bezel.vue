<template>
  <!-- The show's device frame: a rounded bezel, a header with the 9 and a
    two-line wordmark, and a viewport for whatever scene goes inside. Drawn
    at a native 488x620 and scaled to "contain" whatever box its parent
    gives it, so every absolutely-positioned pixel inside stays in step.
    The hero's train ride and each episode's platform both sit in one. -->
  <div ref="stage" class="pod-bezel-stage">
    <div ref="frame" class="pod-bezel">
      <div class="pod-bezel-header">
        <div class="pod-bezel-logo">9</div>
        <div class="pod-bezel-wordmark">
          <div class="pod-bezel-name">{{ name }}</div>
          <div class="pod-bezel-tag">{{ tag }}</div>
        </div>
      </div>
      <div class="pod-bezel-viewport">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps({
  name: { type: String, required: true },
  tag: { type: String, default: "" }
});

// The current scale, for a scene that has to convert screen pixels back to
// native ones (the hero's drag does).
const emit = defineEmits(["scale"]);

const WIDTH = 488;
const HEIGHT = 620;

const stage = ref(null);
const frame = ref(null);
let resizeObserver = null;

onMounted(() => {
  const fit = () => {
    const el = stage.value;
    const scale = Math.min(el.clientWidth / WIDTH, el.clientHeight / HEIGHT) || 1;
    frame.value.style.transform = `translate(-50%, -50%) scale(${scale})`;
    emit("scale", scale);
  };
  resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(stage.value);
  fit();
});

onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<script>
export default {
  name: "PodcastBezel"
};
</script>

<style scoped>
/* Fills whatever box the parent sizes; the frame centres inside it. */
.pod-bezel-stage {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.pod-bezel {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 488px;
  height: 620px;
  transform: translate(-50%, -50%);
  transform-origin: center;
  border: 14px solid #cfcfc9;
  border-radius: 36px;
  box-sizing: border-box;
  background: #0e0e12;
  box-shadow:
    0 0 0 3px rgba(0, 0, 0, 0.16),
    inset 0 0 0 7px #1d2027,
    inset 0 0 0 9px #8f8f8a;
  overflow: hidden;
}

.pod-bezel-header {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 92px;
  background: #101014;
  box-sizing: border-box;
  padding: 0 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 10;
}

.pod-bezel-logo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ff6319;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 39px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.pod-bezel-wordmark {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.pod-bezel-name {
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.01em;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pod-bezel-tag {
  font-size: 12px;
  font-weight: 900;
  /* Lighter than the logo's own orange, and bolder -- that shade as small
     letter-spaced text on the header's near-black reads low-contrast even
     lightened alone. */
  color: #ffc694;
  letter-spacing: 0.18em;
  line-height: 1;
}

.pod-bezel-viewport {
  position: absolute;
  left: 0;
  right: 0;
  top: 93px;
  bottom: 0;
  overflow: hidden;
}
</style>
