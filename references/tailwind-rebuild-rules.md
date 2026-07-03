# Tailwind Rebuild Rules

Use Tailwind to reproduce the target, not to impose a template aesthetic.

## Fidelity First

- Match layout, spacing, typography, color, visual density, breakpoints, and component states before refactoring.
- Use arbitrary values for exact matches: `w-[312px]`, `text-[13px]`, `tracking-[0.02em]`, `shadow-[0_18px_40px_rgba(0,0,0,.16)]`.
- Use CSS custom properties when repeated exact colors, shadows, and dimensions appear across components.
- Avoid default Tailwind-looking cards, gradients, rounded pills, and oversized hero layouts unless the target uses them.

## CSS Organization

Prefer:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root { /* extracted tokens */ }
}

@layer components {
  .site-container { /* repeated layout primitive */ }
}
```

Keep component classes in HTML when they are local and readable. Extract to `@layer components` only for repeated patterns or long exact-value combinations.

## Responsive Behavior

- Match target breakpoints from browser inspection, not only Tailwind defaults.
- Use Tailwind breakpoints when close enough; use custom media queries for exact target behavior.
- Check mobile nav, stacked grids, wrapped text, hidden sidebars, sticky areas, and image cropping.
- Prevent text overflow in buttons, cards, nav items, breadcrumbs, tables, and filter chips.

## Assets

- Download allowed public images, icons, posters, and fonts locally.
- Preserve intrinsic image ratios and crop behavior with `object-fit`, `object-position`, and stable aspect ratios.
- Use optimized filenames that describe the asset role.
- Do not hotlink unless the asset cannot be downloaded and the user accepts an external dependency.

## Typography

- Match source fonts when allowed; otherwise choose a close local or system fallback.
- Preserve weights, sizes, line heights, casing, and letter spacing.
- Do not scale font size with viewport width.
- Keep letter spacing at `0` unless the source uses a nonzero value.

## Polishing Rule

The result may be better than the source only through restrained execution quality:

- Cleaner responsive alignment.
- Better accessibility focus states.
- More consistent hover states.
- Removal of broken backend-only fragments.
- Smoother static approximations of public interactions.

Do not redesign the page.
