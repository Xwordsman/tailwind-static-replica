# Extraction Snippets

Use these snippets in browser automation or DevTools while inspecting the target site.

## Page Summary

```javascript
JSON.stringify({
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
  })).filter((item) => item.text || item.href),
  bodyClasses: document.body.className?.toString()
}, null, 2);
```

## Page Type Candidates

```javascript
JSON.stringify([...document.querySelectorAll("a[href]")]
  .map((a) => ({
    text: a.textContent.trim().replace(/\s+/g, " ").slice(0, 100),
    href: a.href,
    classes: a.className?.toString().slice(0, 160),
    nearestHeading: a.closest("section, article, main, div")?.querySelector("h1,h2,h3")?.textContent?.trim()?.replace(/\s+/g, " ").slice(0, 100)
  }))
  .filter((item) => item.href && !item.href.startsWith("javascript:"))
  .slice(0, 300), null, 2);
```

## Asset Inventory

```javascript
JSON.stringify({
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
}, null, 2);
```

## Global Tokens

```javascript
(() => {
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
  return JSON.stringify(Object.fromEntries(
    Object.entries(values).map(([key, set]) => [key, [...set].filter(Boolean)])
  ), null, 2);
})();
```

## Component Tree And Computed Styles

Replace `SELECTOR` with the section or component container selector.

```javascript
((selector) => {
  const root = document.querySelector(selector);
  if (!root) return JSON.stringify({ error: `Element not found: ${selector}` });

  const props = [
    "fontSize", "fontWeight", "fontFamily", "lineHeight", "letterSpacing", "color",
    "textTransform", "backgroundColor", "background", "padding", "margin",
    "width", "height", "maxWidth", "minWidth", "display", "flexDirection",
    "justifyContent", "alignItems", "gap", "gridTemplateColumns",
    "borderRadius", "border", "boxShadow", "overflow", "position", "top",
    "right", "bottom", "left", "zIndex", "opacity", "transform", "transition",
    "objectFit", "objectPosition", "whiteSpace", "textOverflow", "WebkitLineClamp"
  ];

  function stylesFor(element) {
    const cs = getComputedStyle(element);
    const styles = {};
    for (const prop of props) {
      const value = cs[prop];
      if (value && value !== "none" && value !== "normal" && value !== "auto" && value !== "0px" && value !== "rgba(0, 0, 0, 0)") {
        styles[prop] = value;
      }
    }
    return styles;
  }

  function walk(element, depth = 0) {
    if (depth > 5) return null;
    const children = [...element.children];
    return {
      tag: element.tagName.toLowerCase(),
      id: element.id || undefined,
      classes: element.className?.toString().split(/\s+/).slice(0, 10).join(" ") || undefined,
      text: element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE
        ? element.textContent.trim().replace(/\s+/g, " ").slice(0, 250)
        : undefined,
      styles: stylesFor(element),
      image: element.tagName === "IMG" ? {
        src: element.currentSrc || element.src,
        alt: element.alt,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight
      } : undefined,
      children: children.slice(0, 40).map((child) => walk(child, depth + 1)).filter(Boolean)
    };
  }

  return JSON.stringify(walk(root), null, 2);
})("SELECTOR");
```

## Text Inventory

```javascript
JSON.stringify([...document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,button,label,li,span,small")]
  .map((el) => ({
    tag: el.tagName.toLowerCase(),
    text: el.textContent.trim().replace(/\s+/g, " "),
    aria: el.getAttribute("aria-label"),
    href: el.getAttribute("href")
  }))
  .filter((item) => item.text || item.aria)
  .slice(0, 700), null, 2);
```

## State Capture Rule

Capture state A, trigger the behavior, then capture state B with the same selector.

Examples:

- Header at scroll `0`, then after scrolling past its sticky trigger.
- Mobile nav closed, then open.
- Tabs before clicking, then for each active tab.
- Hover before and after on buttons, cards, links, and media.
