# Static Output Contract

Use this contract before creating files.

## Required Shape

Default to this structure:

```text
dist/
  index.html
  assets/
    css/styles.css
    js/main.js
    images/
    fonts/
```

Add only the HTML files justified by the target website or the user's request, such as `category.html`, `list.html`, `detail.html`, `article.html`, `product.html`, `search.html`, `about.html`, or `contact.html`.

## File Rules

- `index.html` must be the main entry.
- All generated pages must use relative links.
- Shared CSS must be local, usually `assets/css/styles.css`.
- Shared JS must be local, usually `assets/js/main.js`.
- Images, icons, video posters, and fonts must live under `assets/` when they can be legally and technically downloaded.
- Do not use absolute local machine paths in generated HTML.
- Do not require Node, a dev server, or a build step to view the final `dist/` unless the user requested a source project too.

## Tailwind

Prefer compiled Tailwind CSS in the final output. A source folder is allowed when a build step is used:

```text
src/
  input.css
tailwind.config.js
package.json
dist/
```

The final reviewed UI must load from `dist/*.html`.

## External Dependencies

Avoid external runtime dependencies. External fonts, CDNs, maps, embeds, analytics, tracking scripts, and API calls must be removed, localized, or replaced with a static equivalent unless the user explicitly asks to keep them.

Tailwind CDN is acceptable only as a fallback when no dependency installation is possible and the user accepts a non-fully-local result.

## Links

- Rewrite internal navigation to generated local pages.
- Keep external links only when they are ordinary outbound links.
- Replace missing internal targets with `#` only when no corresponding static page is generated.
- Do not leave links to private, account, checkout, login, admin, or destructive actions unless they are visibly inert.

## Forms And Backend UI

- Forms must not submit to real services.
- Search, filters, sorters, tabs, menus, carousels, and accordions may use vanilla JS and local mock data.
- Login, signup, account, checkout, payment, and password forms must be static, disabled, removed, or clearly non-functional.
- Do not preserve credential capture behavior.

## Content

Preserve public visible copy, labels, navigation text, headings, metadata, card titles, and representative body content. Replace private, user-specific, unavailable, or legally sensitive content with same-density neutral static content.

Do not invent a new visual concept. The result must read as a faithful static frontend reconstruction of the target.
