<template>
  <div class="pod-join-card">
    <!-- No invite link, ever: the hosts review each request and add the
      number to the WhatsApp group themselves, so a link can't leak to
      spammers from here. -->
    <div v-if="status === 'sent'" class="pod-join-thanks">
      <h2 ref="thanksHeading" class="pod-join-thanks-title" tabindex="-1">{{ join.thanks.title }}</h2>
      <p class="pod-lede">{{ join.thanks.body }}</p>
    </div>

    <!-- The intro asks for the form, so it goes when the form does. -->
    <p v-if="status !== 'sent'" class="pod-lede pod-join-intro">{{ join.body }}</p>

    <form v-if="status !== 'sent'" class="pod-join-fields" @submit.prevent="submit">
      <!-- A lone field is a group of one without a legend, so fields and
        groups share one set of markup. A group's fields are all optional, so
        its legend carries the one "optional" instead of every field. -->
      <fieldset v-for="(group, index) in groups" :key="index" class="pod-join-group">
        <legend v-if="group.legend" class="pod-join-legend">
          {{ group.legend }}
          <span class="pod-join-optional">optional</span>
        </legend>
        <div v-for="field in group.fields" :key="field.name" class="pod-join-field">
          <label :for="fieldId(field)" :class="{ 'pod-join-sublabel': group.legend }">
            {{ field.label }}
            <span v-if="!field.required && !group.legend" class="pod-join-optional">optional</span>
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
        {{ status === "sending" ? "Sending..." : join.submitLabel }}
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
      body: JSON.stringify({
        access_key: props.join.web3formsAccessKey,
        subject: `The Ninth: ${values.Name} wants to join`,
        from_name: "The Ninth",
        botcheck: botcheck.value,
        ...values
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
  border: 1px solid rgba(40, 43, 13, 0.25);
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
  color: rgba(40, 43, 13, 0.4);
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
  color: #a12a1c;
}

.pod-join-submit {
  align-self: flex-start;
  cursor: pointer;
}

/* podcast.css only gives links a hover, and this is a button. */
.pod-join-submit:hover:not(:disabled) {
  background: var(--pod-accent-strong);
}

.pod-join-submit:disabled {
  opacity: 0.6;
  cursor: progress;
}

.pod-join-thanks {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding: 2rem;
  border-radius: 1.25rem;
  background: var(--pod-lime);
}

.pod-join-thanks .pod-lede {
  color: var(--pod-on-lime-muted);
}

.pod-join-thanks-title {
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  outline: none;
}
</style>
