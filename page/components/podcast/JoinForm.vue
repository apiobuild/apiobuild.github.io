<template>
  <div class="pod-join-card">
    <!-- Sent: the reply as one chat bubble. No invite link -- the hosts
      review each request and add the number to the WhatsApp group
      themselves, so a link can't leak to spammers from here. -->
    <div v-if="status === 'sent'" class="pod-join-bubble">
      <h2 ref="thanksHeading" class="pod-join-bubble-title" tabindex="-1">{{ join.thanks.title }}</h2>
      <p>{{ join.thanks.body }}</p>
      <span class="pod-join-tail-side" aria-hidden="true"></span>
      <span class="pod-join-tail" aria-hidden="true"></span>
    </div>

    <!-- The intro asks for the form, so it goes when the form does. -->
    <p v-if="status !== 'sent'" class="pod-lede pod-join-intro">{{ join.body }}</p>

    <form v-if="status !== 'sent'" class="pod-join-fields" @submit.prevent="submit">
      <!-- A lone field renders as a group of one without a legend. A group's
        legend carries the "optional" for all its fields. -->
      <fieldset v-for="group in groups" :key="group.legend ?? group.fields[0].name" class="pod-join-group">
        <legend v-if="group.legend" class="pod-join-legend">
          {{ group.legend }}
          <span class="pod-join-optional">{{ join.optionalLabel }}</span>
        </legend>
        <div v-for="field in group.fields" :key="field.name" class="pod-join-field">
          <label :for="fieldId(field)" :class="{ 'pod-join-sublabel': group.legend }">
            {{ field.label }}
            <span v-if="!field.required && !group.legend" class="pod-join-optional">{{ join.optionalLabel }}</span>
          </label>
          <textarea
            v-if="field.type === 'textarea'"
            :id="fieldId(field)"
            v-model="values[field.name]"
            :placeholder="field.placeholder"
            :required="field.required"
            rows="3"
          ></textarea>
          <input
            v-else
            :id="fieldId(field)"
            v-model="values[field.name]"
            :type="field.type"
            :autocomplete="field.autocomplete"
            :placeholder="field.placeholder"
            :required="field.required"
            :aria-describedby="field.hint ? `${fieldId(field)}-hint` : undefined"
          />
          <p v-if="field.hint" :id="`${fieldId(field)}-hint`" class="pod-join-hint">{{ field.hint }}</p>
        </div>
      </fieldset>

      <!-- Web3Forms' honeypot: people never see it, form-filling bots tick
        it, and Web3Forms drops any submission that arrives ticked. -->
      <input v-model="botcheck" type="checkbox" name="botcheck" class="pod-join-botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" />

      <p v-if="status === 'error'" class="pod-join-error" role="alert">{{ join.error }}</p>

      <button class="pod-btn pod-btn-solid pod-join-submit" type="submit" :disabled="status === 'sending'">
        {{ status === "sending" ? join.sendingLabel : join.submitLabel }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { nextTick, reactive, ref } from "vue";

const props = defineProps({
  // The "join" block of assets/podcast.json.
  join: { type: Object, required: true }
});

const groups = props.join.fields.map((item) => (item.fields ? item : { fields: [item] }));

// Keyed by each field's name, which is also the label it arrives under in
// the Web3Forms email.
const values = reactive(Object.fromEntries(groups.flatMap((group) => group.fields).map((field) => [field.name, ""])));
const botcheck = ref(false);
const status = ref("idle");
const thanksHeading = ref(null);

const fieldId = (field) => `pod-join-${field.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

async function submit() {
  status.value = "sending";
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      // The answers first, so a field named like one of Web3Forms' own keys
      // can't overwrite it.
      body: JSON.stringify({
        ...values,
        access_key: props.join.web3formsAccessKey,
        subject: `The Ninth: ${values.Name} wants to join`,
        from_name: "The Ninth",
        botcheck: botcheck.value
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    status.value = "sent";
    // The form the visitor was in is gone, so move them to what replaced it.
    await nextTick();
    thanksHeading.value?.focus();
  } catch (error) {
    console.error("Join form:", error);
    status.value = "error";
  }
}
</script>

<script>
export default {
  name: "PodcastJoinForm"
};
</script>

<style scoped>
.pod-join-card {
  max-width: 34rem;
}

.pod-join-intro {
  margin-bottom: 2.5rem;
}

.pod-join-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pod-join-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

/* A group reads as one question with small labelled answers under it. */
.pod-join-group:has(.pod-join-legend) {
  gap: 0.9rem;
}

.pod-join-legend {
  padding: 0;
  margin-bottom: 0.1rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.pod-join-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.pod-join-field label {
  font-weight: 600;
  font-size: 0.95rem;
}

.pod-join-field .pod-join-sublabel {
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--pod-text-muted);
}

.pod-join-optional {
  margin-left: 0.4rem;
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--pod-text-muted);
}

.pod-join-field input,
.pod-join-field textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--pod-field-border);
  border-radius: 0.75rem;
  background: #fff;
  color: var(--pod-text);
  font: inherit;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.pod-join-field textarea {
  resize: vertical;
}

.pod-join-field input::placeholder,
.pod-join-field textarea::placeholder {
  color: var(--pod-placeholder);
}

/* The brand lime as a ring, with the accent on the edge so it still reads
   against the near-white ground. */
.pod-join-field input:focus,
.pod-join-field textarea:focus {
  outline: none;
  border-color: var(--pod-accent);
  box-shadow: 0 0 0 4px var(--pod-lime);
}

.pod-join-hint {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--pod-text-muted);
}

.pod-join-botcheck {
  display: none;
}

.pod-join-error {
  font-size: 0.95rem;
  color: var(--pod-error);
}

.pod-join-submit {
  align-self: flex-start;
  cursor: pointer;
}

.pod-join-submit:disabled {
  opacity: 0.6;
  cursor: progress;
}

/* A 3D lime speech bubble, in the style of the hero scene's signs. */
.pod-join-bubble {
  --pod-depth: 10px;
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 26rem;
  /* Room for the sides and the tail, which hang outside the box. */
  margin: 0 var(--pod-depth) calc(var(--pod-depth) + 1.4rem) 0;
  padding: 1.5rem 1.75rem;
  background: var(--pod-lime);
  color: var(--pod-text);
  transform-origin: bottom left;
  animation: pod-join-bubble-in 420ms cubic-bezier(0.34, 1.4, 0.64, 1) 100ms backwards;
}

.pod-join-bubble::before,
.pod-join-bubble::after {
  content: "";
  position: absolute;
  transform-origin: top left;
}

/* The bottom side. */
.pod-join-bubble::before {
  left: 0;
  top: 100%;
  width: 100%;
  height: var(--pod-depth);
  background: var(--pod-lime-bottom);
  transform: skewX(45deg);
}

/* The right side. */
.pod-join-bubble::after {
  left: 100%;
  top: 0;
  width: var(--pod-depth);
  height: 100%;
  background: var(--pod-lime-side);
  transform: skewY(45deg);
}

/* The tail: a lime wedge, over its darker side (the wedge swept down and
   right by the depth). */
.pod-join-tail,
.pod-join-tail-side {
  --pod-tail-w: 1.6rem;
  --pod-tail-h: 1.4rem;
  position: absolute;
  z-index: 1;
  left: 1.5rem;
  top: 100%;
}

.pod-join-tail {
  width: var(--pod-tail-w);
  height: var(--pod-tail-h);
  background: var(--pod-lime);
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.pod-join-tail-side {
  width: calc(var(--pod-tail-w) + var(--pod-depth));
  height: calc(var(--pod-tail-h) + var(--pod-depth));
  background: var(--pod-lime-bottom);
  clip-path: polygon(
    0 0,
    var(--pod-tail-w) 0,
    calc(var(--pod-tail-w) + var(--pod-depth)) var(--pod-depth),
    var(--pod-depth) calc(var(--pod-tail-h) + var(--pod-depth)),
    0 var(--pod-tail-h)
  );
}

.pod-join-bubble-title {
  font-size: clamp(1.4rem, 3vw, 1.75rem);
  outline: none;
}

.pod-join-bubble p {
  color: var(--pod-on-lime-muted);
  line-height: 1.5;
}

@keyframes pod-join-bubble-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem) scale(0.9);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pod-join-bubble {
    animation: none;
  }
}
</style>
