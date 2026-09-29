// Share cards: one Instagram Story-sized image (1080x1920) per episode, per
// language, taken from the built episodes page as a phone shows it -- the
// station's frame with its date, headline and play button underneath.
// The share button on each station (components/podcast/Station.vue) hands
// the card to the phone's share sheet.
//
// Run after the static build:
//   npx nuxt build --preset github_pages && node scripts/share-cards.mjs
// Cards land in .output/public/podcast/share/<id>.jpg (<id>.zh.jpg for the
// Mandarin page).
import { createServer } from "node:http";
import { mkdir, readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const ROOT = new URL("../.output/public/", import.meta.url).pathname;
const OUT = join(ROOT, "podcast/share");
const PAGES = { "": "/podcast/episodes", ".zh": "/podcast/zh/episodes" };

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

// Serve the built site as GitHub Pages would: a folder answers with its
// index.html.
const server = createServer(async (req, res) => {
  let path = join(ROOT, normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)));
  try {
    if ((await stat(path)).isDirectory()) path = join(path, "index.html");
    res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

// Playwright's own Chromium, or the one a preinstalled environment points to.
const browser = await chromium.launch(
  process.env.SHARE_CARDS_CHROMIUM ? { executablePath: process.env.SHARE_CARDS_CHROMIUM } : {}
);
// 360x640 CSS pixels at 3x: a 9:16 phone screen, 1080x1920 in the image.
const page = await browser.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await mkdir(OUT, { recursive: true });

let count = 0;
for (const [suffix, path] of Object.entries(PAGES)) {
  await page.goto(origin + path, { waitUntil: "networkidle" });
  // No sticky bar, language tile or share button on the card, and no
  // snapping between stations while it's taken.
  await page.addStyleTag({
    content: `
      html { scroll-snap-type: none !important; }
      :root { --pod-bar-h: 0px !important; }
      .pod-episodes-bar, .pod-langtile, .pod-station-share { display: none !important; }
    `
  });
  await page.evaluate(() => document.fonts.ready);

  const ids = await page.$$eval(".pod-station", (els) => els.map((el) => el.id));
  for (const id of ids) {
    await page.evaluate((id) => document.getElementById(id).scrollIntoView({ block: "start" }), id);
    // Let the character step onto the platform and the images settle.
    await page.waitForTimeout(1500);
    await page.screenshot({ path: join(OUT, `${id}${suffix}.jpg`), type: "jpeg", quality: 90 });
    count++;
  }
}

await browser.close();
server.close();
console.log(`share-cards: ${count} cards in ${OUT}`);
