// A first page load on an English podcast page, for a reader whose default
// is Mandarin (see podcastDefaultRedirect): go straight to the Mandarin page
// before the app starts, so its title, language and copy are right from the
// first paint. Later navigations are middleware/podcast-lang.global.js's.
export default defineNuxtPlugin(async () => {
  const redirect = podcastDefaultRedirect(window.location.pathname);
  if (!redirect) return;
  notePodcastAutoSwitch(redirect.method);
  window.location.replace(redirect.path + window.location.search + window.location.hash);
  // Hold this page's start-up while the browser leaves, so nothing here
  // (like the note above) is acted on by a page that's about to go away.
  await new Promise(() => {});
});
