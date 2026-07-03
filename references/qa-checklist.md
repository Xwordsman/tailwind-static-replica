# QA Checklist

Run this checklist before final delivery.

## Static Audit

- `index.html` exists.
- All requested or inferred static pages exist.
- Local CSS and JS files load.
- Local images, fonts, videos, and icons load.
- Internal links point to generated `.html` files or intentional inert `#` targets.
- No unexpected external API calls remain.
- Forms do not submit to real services.
- Credential, checkout, payment, account, and admin flows are not functional.

Use:

```bash
node scripts/audit-static-output.mjs dist
```

Use strict mode when external runtime dependencies should fail the audit:

```bash
node scripts/audit-static-output.mjs dist --strict
```

## Browser QA

Open the generated pages locally and check:

- Desktop `1440px`.
- Tablet `768px`.
- Mobile `390px`.
- Top, middle, and bottom scroll positions.
- Open and closed mobile menu.
- Hover states for buttons, cards, nav links, and image links.
- Tabs, accordions, filters, sorters, carousels, and modals when present.
- Long text, narrow screens, and repeated cards do not overlap or overflow.

## Visual QA

Compare generated pages against captured source evidence:

- Same page hierarchy and section order.
- Same brand feel, colors, type scale, density, and spacing.
- Same image aspect ratios and crop behavior.
- Same responsive stacking and header behavior.
- Static approximations are clearly intentional and polished.

## Final Notes

Report any intentionally omitted backend behavior, external assets that could not be localized, and source states that could not be inspected.
