// Air dates are stored in podcast-episodes.json as plain YYYY-MM-DD. Read
// as UTC so a visitor west of Greenwich doesn't see the day before.
export function formatAirDate(iso, options) {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
}

