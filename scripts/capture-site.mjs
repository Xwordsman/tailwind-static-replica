#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const help = args.includes("--help") || args.includes("-h");

if (help || args.length < 2) {
  console.log(`Usage: node scripts/capture-site.mjs <url> <out-dir>

Captures desktop/tablet/mobile screenshots plus page summary, text inventory,
asset inventory, and token samples using Playwright. Install Playwright in the
working project before running this script.`);
  process.exit(help ? 0 : 1);
}

const [targetUrl, outDirArg] = args;
const outDir = path.resolve(outDirArg);

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. Install it in the working project, then rerun this script.");
  process.exit(1);
}

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1000 },
  { name: "mobile", width: 390, height: 900 }
];

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

async function saveJson(name, data) {
  await fs.writeFile(path.join(outDir, name), JSON.stringify(data, null, 2), "utf8");
}

for (const viewport of viewports) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 60000 });
  await page.screenshot({ path: path.join(outDir, `${viewport.name}.png`), fullPage: true });
}

const summary = await page.evaluate(() => ({
  url: location.href,
  title: document.title,
  description: document.querySelector('meta[name="description"]')?.content || "",
  h1: [...document.querySelectorAll("h1")].map((el) => el.textContent.trim()),
  headings: [...document.querySelectorAll("h1,h2,h3")].map((el) => ({
    tag: el.tagName.toLowerCase(),
    text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 220)
  })),
  navLinks: [...document.querySelectorAll("nav a, header a")].map((a) => ({
    text: a.textContent.trim().replace(/\s+/g, " "),
    href: a.href
  })).filter((item) => item.text || item.href)
}));

const textInventory = await page.evaluate(() => [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,button,label,li,span,small")]
  .map((el) => ({
    tag: el.tagName.toLowerCase(),
    text: el.textContent.trim().replace(/\s+/g, " "),
    aria: el.getAttribute("aria-label"),
    href: el.getAttribute("href")
  }))
  .filter((item) => item.text || item.aria)
  .slice(0, 700));

const assetInventory = await page.evaluate(() => ({
  images: [...document.querySelectorAll("img")].map((img) => ({
    src: img.currentSrc || img.src,
    alt: img.alt,
    width: img.naturalWidth,
    height: img.naturalHeight,
    loading: img.loading,
    classes: img.className?.toString(),
    objectFit: getComputedStyle(img).objectFit,
    objectPosition: getComputedStyle(img).objectPosition
  })),
  videos: [...document.querySelectorAll("video")].map((video) => ({
    src: video.currentSrc || video.src || video.querySelector("source")?.src,
    poster: video.poster,
    autoplay: video.autoplay,
    loop: video.loop,
    muted: video.muted
  })),
  backgroundImages: [...document.querySelectorAll("*")]
    .map((el) => ({
      tag: el.tagName.toLowerCase(),
      classes: el.className?.toString(),
      backgroundImage: getComputedStyle(el).backgroundImage
    }))
    .filter((item) => item.backgroundImage && item.backgroundImage !== "none"),
  favicons: [...document.querySelectorAll('link[rel*="icon"]')].map((link) => ({
    href: link.href,
    rel: link.rel,
    sizes: link.sizes?.toString()
  }))
}));

const tokenSample = await page.evaluate(() => {
  const sample = [...document.querySelectorAll("body, h1, h2, h3, p, a, button, input, textarea, select, [class]")]
    .slice(0, 400);
  const values = {
    fonts: new Set(),
    colors: new Set(),
    backgrounds: new Set(),
    fontSizes: new Set(),
    lineHeights: new Set(),
    radii: new Set(),
    shadows: new Set(),
    gaps: new Set()
  };
  for (const el of sample) {
    const cs = getComputedStyle(el);
    values.fonts.add(cs.fontFamily);
    values.colors.add(cs.color);
    values.backgrounds.add(cs.backgroundColor);
    values.fontSizes.add(cs.fontSize);
    values.lineHeights.add(cs.lineHeight);
    values.radii.add(cs.borderRadius);
    values.gaps.add(cs.gap);
    if (cs.boxShadow !== "none") values.shadows.add(cs.boxShadow);
  }
  return Object.fromEntries(Object.entries(values).map(([key, set]) => [key, [...set].filter(Boolean)]));
});

await saveJson("page-summary.json", summary);
await saveJson("text-inventory.json", textInventory);
await saveJson("asset-inventory.json", assetInventory);
await saveJson("token-sample.json", tokenSample);

await browser.close();
console.log(`Captured ${targetUrl} into ${outDir}`);
