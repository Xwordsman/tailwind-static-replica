# Page Mapping

Use this guide to decide which static HTML files to generate.

## Inputs

Honor explicit user requests first. If the user asks for `index.html`, `category.html`, and `detail.html`, generate those pages from the closest target routes.

When the user provides only one URL, inspect the page and its public navigation to infer whether additional representative page types are needed.

## Common Mappings

Home:

- Source: root path, landing page, brand homepage, shop homepage, publication homepage.
- Output: `index.html`.
- Preserve nav, hero, featured sections, public content blocks, footer, and major calls to action.

Category or listing:

- Source: category, collection, blog index, product grid, archive, search results, gallery, directory.
- Output: `category.html` or `list.html`.
- Preserve cards, filters, sorting UI, pagination, breadcrumbs, active category states, and empty/loading states when visible.

Detail:

- Source: product, article, post, case study, portfolio item, documentation page, property listing.
- Output: `detail.html`, `article.html`, or `product.html`.
- Preserve title, media gallery, body content, metadata, related items, sticky purchase/share/sidebar UI, and breadcrumbs.

Utility pages:

- Source: about, contact, pricing, FAQ, support, terms, careers.
- Output: named page such as `about.html`, `contact.html`, `pricing.html`, or `faq.html`.
- Generate only when requested or clearly central to the target.

## Selection Rules

- Do not force `category.html` or `detail.html` if the site does not have those concepts.
- Do not create generic sample pages unrelated to the target.
- Use one representative public source page for each repeated page type.
- Prefer public pages reachable from normal navigation.
- Avoid private routes, logged-in dashboards, checkout, payment, admin, account, and user-specific pages.

## Link Rewriting

Map source links to local files:

```text
/                  -> index.html
/category/example  -> category.html
/product/example   -> detail.html or product.html
/post/example      -> detail.html or article.html
```

If multiple source links map to one representative static page, keep the UI plausible by linking repeated cards to that generated page.

For unavailable or intentionally omitted pages, use `#` and keep the visual state static.
