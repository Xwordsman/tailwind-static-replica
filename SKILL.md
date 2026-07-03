---
name: tailwind-static-replica
description: Recreate authorized target websites as static Tailwind CSS frontend pages. Use when the user asks to replicate, rebuild, copy, reimplement, or convert a target website into static UI files such as index.html, category.html, detail.html, article.html, product.html, list.html, or search.html with no backend, no API dependency, and visual fidelity equal to or better than the source.
---

# Tailwind Static Replica

Recreate authorized target websites as static frontend UI pages using Tailwind CSS by default. Produce runnable HTML/CSS/JS files, not a backend and not a generic template.

## Safety

Proceed only when the user owns, controls, or has permission to reproduce the target. Refuse phishing, impersonation, credential capture, deceptive login pages, private content, paywalled content, backend scraping, or attempts to bypass access controls.

If the target includes account, checkout, payment, login, private dashboard, or submission flows, recreate only non-deceptive static UI states. Do not make those flows appear functional.

## Default Output

Read `references/static-output-contract.md` before creating files.

Produce a static site such as:

```text
dist/
  index.html
  category.html
  detail.html
  assets/
    css/styles.css
    js/main.js
    images/
    fonts/
```

Do not create a backend. Do not require live APIs. Do not leave broken external dependencies. Use relative local links between generated pages.

## Workflow

1. Inspect the target URL and any user-provided page list in a browser.
2. Read `references/page-mapping.md`, then decide which static HTML pages to generate.
3. Capture desktop, tablet, and mobile evidence for each target page or representative page type.
4. Use `references/extraction-snippets.md` to extract visible text, navigation, assets, colors, fonts, spacing, component structure, breakpoints, and simple states.
5. Read `references/tailwind-rebuild-rules.md`, then build the static pages section by section with Tailwind-first styling.
6. Read `references/static-behavior-rules.md`, then replace backend behavior with static UI states or vanilla JS interactions.
7. Download allowed public assets locally, optimize filenames, and rewrite references to `assets/`.
8. Run build or CSS compilation commands when used, then run local browser QA and `scripts/audit-static-output.mjs`.
9. Read `references/qa-checklist.md` before final delivery.

## Fidelity

Match the target first. Improve only when it makes the static UI more polished without changing the target site's identity, information architecture, content hierarchy, brand feel, or expected layout.

Acceptable improvements:

- Better responsive spacing and line wrapping.
- Cleaner Tailwind structure while preserving visual output.
- More consistent hover, focus, menu, tab, and carousel states.
- Improved accessibility contrast, focus visibility, and semantic structure.
- Removal or static replacement of broken, ad-like, private, or backend-only fragments.

Unacceptable changes:

- Replacing the target design with a generic Tailwind template.
- Inventing unrelated copy, sections, products, posts, or branding.
- Changing the site's visual direction, hierarchy, or navigation model.
- Flattening meaningful UI states into screenshots.
- Making login, checkout, account, payment, or submission flows appear functional.

## Tailwind Rules

Use Tailwind CSS as the default implementation language, but do not let Tailwind's common visual patterns override the source design. Use arbitrary values such as `text-[15px]`, `mt-[37px]`, and `shadow-[...]` when needed for fidelity.

Prefer compiled local CSS in `assets/css/styles.css`. Use Tailwind CDN only for quick inspection or when dependency installation is unavailable and the user accepts the external dependency.

Preserve real text and visible content unless it is private, user-specific, illegal to reproduce, or impossible to access. When content must be replaced, keep the same layout density and clearly static behavior.

## Browser Work

Use browser automation when available. Capture at least these widths unless the user specifies otherwise:

- Desktop: `1440px`
- Tablet: `768px`
- Mobile: `390px`

Inspect top, middle, and bottom scroll positions. Capture open/closed menus, hover states, tabs, accordions, carousels, filters, search surfaces, and sticky headers when present.

If no browser tool is available, ask for screenshots or a browser-capable environment before promising high visual fidelity.

## Final Report

Finish with:

- Target URL(s).
- Generated static pages.
- Assets downloaded or intentionally externalized.
- Tailwind/build commands run.
- Static audit and browser QA results.
- Known gaps or source behaviors intentionally staticized.
