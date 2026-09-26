// The podcast's default language for a reader arriving from elsewhere on the
// site (see podcastDefaultRedirect). A first page load is handled before the
// app starts by plugins/podcast-lang.client.js instead: Nuxt doesn't run
// route middleware in the browser for the page it was served with.
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return;
  // Once someone is browsing pages with the language tile, their taps on it decide.
  // Coming back from an English-only page (the join form) they return to
  // their own language.
  if (from && podcastHasZh(from.path)) return;
  const redirect = podcastDefaultRedirect(to.path);
  if (!redirect) return;
  useTrackEvent("language_switch", { from: "en", to: "zh", method: redirect.method });
  // force: the Mandarin pages are aliases of the English ones (see LangTile).
  return navigateTo({ path: redirect.path, hash: to.hash, force: true }, { replace: true });
});
