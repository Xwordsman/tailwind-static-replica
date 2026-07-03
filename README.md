# Tailwind Static Replica

Tailwind Static Replica is a portable AI skill for recreating authorized target websites as static Tailwind CSS frontend pages.

It guides an AI coding agent to inspect a target website, infer the needed page set and filenames from the site's actual structure, extract visual details and public assets, then generate static UI files such as `index.html`, `about.html`, `products.html`, `product.html`, `blog.html`, `article.html`, or other target-derived pages.

The goal is not to build a backend or apply a generic template. The goal is to produce a faithful static frontend reconstruction of the target site, with visual fidelity equal to or better than the source.

## What It Does

- Recreates authorized websites as static HTML/CSS/JS pages.
- Uses Tailwind CSS by default.
- Generates local pages based on the target site's real navigation, route semantics, and content types.
- Downloads allowed public assets into a local `assets/` folder.
- Rewrites internal navigation to local `.html` files.
- Converts backend-dependent behavior into static UI states or small vanilla JS interactions.
- Checks final output for missing assets, broken links, external runtime dependencies, API calls, and sensitive forms.

## What It Does Not Do

- It does not create a backend.
- It does not connect to live APIs.
- It does not scrape private, logged-in, paywalled, or protected content.
- It does not preserve functional login, checkout, payment, account, or credential flows.
- It does not replace the target design with a generic Tailwind template.

## Safety

Use this only for websites you own, control, or have permission to reproduce.

Do not use it for phishing, impersonation, credential capture, deceptive login pages, private dashboards, payment flows, or bypassing access controls.

## Files

```text
SKILL.md
agents/openai.yaml
references/
  extraction-snippets.md
  page-mapping.md
  qa-checklist.md
  static-behavior-rules.md
  static-output-contract.md
  tailwind-rebuild-rules.md
scripts/
  audit-static-output.mjs
  capture-site.mjs
```

- `SKILL.md`: Main skill instructions.
- `references/`: Detailed rules for page mapping, Tailwind reconstruction, static behavior, output contracts, QA, and browser extraction.
- `scripts/capture-site.mjs`: Optional Playwright helper for capturing screenshots and page inventories.
- `scripts/audit-static-output.mjs`: Static output checker for generated HTML sites.
- `agents/openai.yaml`: Optional metadata for Codex/OpenAI-compatible skill UIs.

## Installation

If your AI tool supports local skills, copy this folder into its skills directory.

For Codex-style local skills, the destination is commonly:

```bash
~/.codex/skills/tailwind-static-replica
```

Then invoke it with:

```text
Use $tailwind-static-replica to recreate https://example.com as a static Tailwind site. Inspect the target structure first, decide the needed HTML pages and filenames, then generate the static UI with local assets and no backend.
```

## Typical Workflow

1. Provide a target URL and any required pages if you already know them.
2. Let the agent inspect the website in a browser.
3. The agent creates a page plan by mapping source routes and navigation items to target-derived static filenames.
4. The agent extracts text, layout, colors, typography, assets, spacing, breakpoints, and interactive states.
5. The agent builds static Tailwind pages.
6. The agent localizes allowed assets and rewrites links.
7. The agent runs browser QA and static output checks.

## Expected Output

The generated project should look similar to:

```text
dist/
  index.html
  about.html
  products.html
  product.html
  assets/
    css/styles.css
    js/main.js
    images/
    fonts/
```

The final `dist/*.html` files should be viewable locally without a backend.

## Optional Scripts

Capture a target site with Playwright:

```bash
node scripts/capture-site.mjs https://example.com work/research/example
```

Audit generated static output:

```bash
node scripts/audit-static-output.mjs dist
```

Use strict mode when external runtime dependencies should fail the audit:

```bash
node scripts/audit-static-output.mjs dist --strict
```

## License

MIT. See `LICENSE`.
