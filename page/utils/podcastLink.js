// Every link on /podcast reads its destination from assets/podcast.json, and
// what a link should do depends on where it points.
//
// Anything that navigates opens in a new tab, including the links back to
// the rest of apiobuild.com -- someone reading the show's page should still
// have it when they come back from the privacy policy.
//
// Three kinds get nothing:
//   "#"       a CTA that isn't pointed anywhere yet -- a new tab would land
//             the visitor on a second copy of the page they're reading
//   mailto:   and tel:. A new tab has nothing to render: the browser hands
//             off to the mail client and leaves a blank tab behind, which is
//             what made the footer's "Email us" look broken. Handing off from
//             this tab costs nothing, since the page never navigates.
//   /podcast/ the show's own pages, like the join form. They are the next
//             step, not a detour, so there is nothing to come back to.
export function podcastLinkAttrs(href) {
  if (!href || href === "#") return {};
  if (/^(mailto:|tel:)/i.test(href)) return {};
  if (href.startsWith("/podcast/")) return {};
  return { target: "_blank", rel: "noopener" };
}
