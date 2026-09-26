// Air dates are stored in podcast-episodes.json as plain YYYY-MM-DD. Read
// as UTC so a visitor west of Greenwich doesn't see the day before. The
// locale follows the page's language ("zh-TW" on the Mandarin pages).
export function formatAirDate(iso, options, locale = "en-US") {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, { ...options, timeZone: "UTC" });
}

