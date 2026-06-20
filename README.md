# Atlas Air &amp; Heat — Demo Website

A bold, modern marketing website for a fictional large-scale Texas HVAC company,
built as the **lead authority package** demo for workshopsites.com.

> **Atlas Air &amp; Heat** — *"Beat the Texas heat with comfort you can trust."*
> Fictional brand · Greater Houston, TX

## Tech

- **Static HTML / CSS / JS** — no build step, no dependencies.
- Open `index.html` in any browser, or serve the folder with any static host
  (GitHub Pages, Netlify, Vercel, `python -m http.server`, etc.).
- Fonts via Google Fonts; HVAC stock imagery hotlinked from Unsplash (free license).

## Pages

| Page | File | Notes |
|------|------|-------|
| Home | `index.html` | Hero, services, stats, process, projects, testimonials, CTA |
| About | `about.html` | Story, values, team, service area |
| Gallery | `gallery.html` | Filterable grid + lightbox |
| Pricing | `pricing.html` | Maintenance plans, flat-rate price sheet, FAQ |
| Contact | `contact.html` | Validated demo form, info cards, map |
| Blog | `blog.html` | "The Comfort Brief" — linked in the footer |
| Terms of Service | `terms.html` | Legal |
| Privacy Policy | `privacy.html` | Legal (incl. Texas TDPSA note) |
| Cookie Policy | `cookies.html` | Legal |
| Accessibility | `accessibility.html` | WCAG 2.1 AA statement |

## Structure

```
css/styles.css   Design system (navy + heat-orange theme)
js/main.js       Nav, scroll reveal, counters, gallery filter + lightbox, form
assets/          Logo + favicon (SVG)
*.html           Pages (shared header/footer inlined for portability)
```

## Branches

- **`production-live`** — the polished site used in live demos (prod).
- **`qaqc`** — QA/QC working branch.
- **`claude/sharp-noether-c2zle6`** — development trunk.

## Notes

The contact and newsletter forms are front-end demos only — no data is
transmitted or stored. Legal pages are illustrative and not legal advice.
