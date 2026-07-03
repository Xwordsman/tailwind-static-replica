# Page Mapping

Use this guide to decide which static HTML files to generate. The page list and file names must come from the target website's actual structure, not from a fixed preset.

## Inputs

Honor explicit user requests first. If the user names specific output files, generate those files from the closest matching target routes.

When the user provides only one URL, inspect the page and its public navigation to infer whether additional representative pages are needed. Before coding, write a short page plan that maps source routes or visible navigation items to output filenames.

## Common Mappings

Home:

- Source: root path, landing page, brand homepage, shop homepage, publication homepage.
- Output: `index.html`.
- Preserve nav, hero, featured sections, public content blocks, footer, and major calls to action.

Collection, listing, or index:

- Source: category, collection, blog index, product grid, archive, search results, gallery, directory.
- Output: use the target's own semantic name, such as `products.html`, `shop.html`, `blog.html`, `news.html`, `resources.html`, `case-studies.html`, `portfolio.html`, `docs.html`, `list.html`, or `category.html`.
- Preserve cards, filters, sorting UI, pagination, breadcrumbs, active category states, and empty/loading states when visible.

Detail:

- Source: product, article, post, case study, portfolio item, documentation page, property listing.
- Output: use the content type's semantic name, such as `product.html`, `article.html`, `post.html`, `case-study.html`, `portfolio-detail.html`, `docs-page.html`, `property.html`, or `detail.html`.
- Preserve title, media gallery, body content, metadata, related items, sticky purchase/share/sidebar UI, and breadcrumbs.

Utility pages:

- Source: about, contact, pricing, FAQ, support, terms, careers.
- Output: named page such as `about.html`, `contact.html`, `pricing.html`, or `faq.html`.
- Generate only when requested or clearly central to the target.

## Selection Rules

- Do not force `category.html` or `detail.html`; they are fallback names only.
- Do not create generic sample pages unrelated to the target.
- Use one representative public source page for each repeated page type.
- Prefer public pages reachable from normal navigation.
- Avoid private routes, logged-in dashboards, checkout, payment, admin, account, and user-specific pages.
- Prefer meaningful filenames over generic ones. Use `products.html` over `category.html` for product collections, `blog.html` over `list.html` for blog indexes, and `article.html` over `detail.html` for articles.

## Link Rewriting

Map source links to local files:

```text
/                       -> index.html
/about                  -> about.html
/pricing                -> pricing.html
/products               -> products.html
/products/example       -> product.html
/blog                   -> blog.html
/blog/post-title        -> article.html or blog-post.html
/case-studies           -> case-studies.html
/case-studies/example   -> case-study.html
```

If multiple source links map to one representative static page, keep the UI plausible by linking repeated cards to that generated page.

For unavailable or intentionally omitted pages, use `#` and keep the visual state static.
