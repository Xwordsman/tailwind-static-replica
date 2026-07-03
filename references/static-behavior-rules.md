# Static Behavior Rules

Use this guide when the target has dynamic behavior.

## General

Implement simple public UI behavior with vanilla JS in `assets/js/main.js`. Do not require APIs, databases, authentication, cookies, server sessions, or build-time data fetching.

## Navigation

- Desktop dropdowns may open on hover or click to match the target.
- Mobile menus must include open and closed states.
- Sticky headers must match scroll behavior when visible in the target.
- Internal links must point to generated local pages or inert `#` targets.

## Tabs, Accordions, Menus

Recreate visible states and transitions with client-side JS. Include ARIA attributes when straightforward. Preserve active states, disabled states, icons, and animation timing.

## Carousels And Galleries

Use a lightweight vanilla JS implementation only when the carousel is visible and important. Static first slide is acceptable for minor decorative carousels, but preserve arrows, dots, thumbnails, and responsive layout when they affect the UI.

## Filters, Sorting, Search

Use static mock behavior:

- Toggle chips, checkboxes, or dropdown states locally.
- Filter or sort a small local data set only when it improves the UI.
- Do not query the original site or external APIs.
- Show static results and empty states when useful.

## Forms

Contact, newsletter, search, quote, booking, or lead forms must not submit to real services. Options:

- Disable submit.
- Show a local success message.
- Use `action="#"`.
- Remove hidden tracking fields.

Credential, payment, account, checkout, and admin forms must not be functional and must not collect real sensitive information.

## Maps, Embeds, Videos

- Replace maps with a static image or inert embedded area unless the user wants live embeds.
- Keep public videos only when allowed; otherwise use posters or static placeholders that match layout.
- Remove trackers, analytics, chat widgets, ad scripts, and tag managers.

## Infinite Scroll And Pagination

Convert infinite scroll to a static page with representative content. Preserve pagination controls visually when part of the target design, but link them to `#` unless generated pages exist.
