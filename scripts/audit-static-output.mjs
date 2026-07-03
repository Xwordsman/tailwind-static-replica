#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const help = args.includes("--help") || args.includes("-h");

if (help || args.length === 0) {
  console.log(`Usage: node scripts/audit-static-output.mjs <dist-dir> [--strict]

Checks generated static HTML output for missing local assets, broken local page links,
unexpected external runtime dependencies, backend calls, and functional sensitive forms.`);
  process.exit(help ? 0 : 1);
}

const root = path.resolve(args[0]);
const strict = args.includes("--strict");
const errors = [];
const warnings = [];

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function isExternal(value) {
  return /^(https?:)?\/\//i.test(value) || /^data:/i.test(value);
}

function isRootRelative(value) {
  return value.startsWith("/") && !value.startsWith("//");
}

function isIgnorable(value) {
  return !value || value === "#" || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:") || value.startsWith("javascript:");
}

function stripQuery(value) {
  return value.split("#")[0].split("?")[0];
}

function localTarget(baseFile, value) {
  const clean = stripQuery(value);
  if (isIgnorable(clean) || isExternal(clean) || isRootRelative(clean) || path.isAbsolute(clean)) return null;
  return path.resolve(path.dirname(baseFile), clean);
}

function collectAttr(content, attr) {
  const values = [];
  const re = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, "gi");
  let match;
  while ((match = re.exec(content))) values.push(match[1].trim());
  return values;
}

function collectCssUrls(content) {
  const values = [];
  const re = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
  let match;
  while ((match = re.exec(content))) values.push(match[1].trim());
  return values;
}

if (!exists(root)) {
  errors.push(`Output directory does not exist: ${root}`);
} else {
  const indexFile = path.join(root, "index.html");
  if (!exists(indexFile)) errors.push("Missing required index.html");

  const files = walk(root);
  const htmlFiles = files.filter((file) => file.toLowerCase().endsWith(".html"));
  const cssFiles = files.filter((file) => file.toLowerCase().endsWith(".css"));
  const jsFiles = files.filter((file) => file.toLowerCase().endsWith(".js"));

  if (htmlFiles.length === 0) errors.push("No HTML files found.");

  for (const file of htmlFiles) {
    const content = read(file);
    const rel = path.relative(root, file);

    for (const src of collectAttr(content, "src")) {
      if (isIgnorable(src)) continue;
      if (isExternal(src)) {
        warnings.push(`${rel}: external src ${src}`);
        continue;
      }
      if (isRootRelative(src)) {
        warnings.push(`${rel}: root-relative src ${src}`);
        continue;
      }
      const target = localTarget(file, src);
      if (target && !exists(target)) errors.push(`${rel}: missing local src ${src}`);
    }

    for (const href of collectAttr(content, "href")) {
      if (isIgnorable(href)) continue;
      if (isExternal(href)) {
        warnings.push(`${rel}: external href ${href}`);
        continue;
      }
      if (isRootRelative(href)) {
        warnings.push(`${rel}: root-relative href ${href}`);
        continue;
      }
      const target = localTarget(file, href);
      if (target && !exists(target)) errors.push(`${rel}: missing local href ${href}`);
    }

    for (const action of collectAttr(content, "action")) {
      if (!isIgnorable(action)) warnings.push(`${rel}: form action is not inert: ${action}`);
    }

    if (/<input[^>]+type=["']?password/i.test(content)) {
      warnings.push(`${rel}: password field found; credential UI must be clearly non-functional.`);
    }
  }

  for (const file of cssFiles) {
    const content = read(file);
    const rel = path.relative(root, file);
    for (const value of collectCssUrls(content)) {
      if (isIgnorable(value)) continue;
      if (isExternal(value)) {
        warnings.push(`${rel}: external css url ${value}`);
        continue;
      }
      if (isRootRelative(value)) {
        warnings.push(`${rel}: root-relative css url ${value}`);
        continue;
      }
      const target = localTarget(file, value);
      if (target && !exists(target)) errors.push(`${rel}: missing css url asset ${value}`);
    }
  }

  for (const file of [...htmlFiles, ...jsFiles]) {
    const content = read(file);
    const rel = path.relative(root, file);
    if (/\b(fetch|XMLHttpRequest|axios)\s*\(/.test(content)) {
      warnings.push(`${rel}: possible backend/API call found.`);
    }
    if (/\b(api|graphql|checkout|payment|login|auth)\b/i.test(content)) {
      warnings.push(`${rel}: backend-sensitive keyword found; verify this is static UI only.`);
    }
  }

  if (strict) {
    for (const warning of warnings) {
      if (/external|root-relative|backend|password|form action/i.test(warning)) errors.push(`Strict mode: ${warning}`);
    }
  }
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length > 0) {
  console.error(`Audit failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`Audit passed with ${warnings.length} warning(s).`);
