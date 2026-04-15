# Snap or Slap — Landing Page (`docs/`)

> **Canonical homepage:** `docs/index.html`
> Deploy this folder as a static site on Vercel with **Root Directory = `docs`**.

---

## 📁 File & Folder Map

| Path | Purpose |
|---|---|
| `index.html` | **The single canonical homepage.** All section content is inlined here. This is the file Vercel (and every browser) serves at `/`. **Never rename or move this file.** |
| `404.html` | Custom "Page Not Found" page. Vercel picks it up automatically. |
| `assets/icons/` | Favicon, SVG icons, and small UI graphics. |
| `assets/images/` | General images (photos, illustrations, OG preview). |
| `assets/mockups/` | Phone mockup screenshots used in the hero and gallery sections. |
| `assets/logos/` | Project and partner logos. |
| `styles/tokens.css` | **Design tokens** — colors, spacing, radius, shadows, typography. Edit this to change the visual identity globally. |
| `styles/base.css` | CSS reset and base element defaults (body, headings, links). |
| `styles/layout.css` | Container, grid, split, and responsive breakpoints. |
| `styles/components.css` | Reusable UI components — buttons, cards, badges, nav, phone frames. |
| `styles/sections.css` | Section-specific overrides keyed to `#section-id`. |
| `styles/utilities.css` | Single-purpose helper classes and the `reveal` animation. |
| `scripts/nav.js` | Sticky nav shadow on scroll + mobile hamburger toggle. |
| `scripts/interactions.js` | IntersectionObserver-based reveal-on-scroll animations. |
| `scripts/main.js` | Global page logic (reserved for future features). |
| `sections/*.html` | Reference partials — the source-of-truth for each section's markup. Edit a partial, then copy it into `index.html`. |
| `README.md` | This file. |

---

## ✏️ Files You Should Edit Most Often

1. **`index.html`** — update section copy, images, and button links.
2. **`styles/tokens.css`** — change colors, fonts, spacing, or shadows globally.
3. **`sections/*.html`** — edit a section's markup here first, then paste it into `index.html`.
4. **`assets/mockups/`** — drop in real phone screenshots to replace the gradient placeholders.

---

## 🔗 Placeholder Links to Replace

Search `index.html` for `href="#"` — these are the buttons you need to update:

| Button ID | What it should link to |
|---|---|
| `#btn-figma` | Figma prototype URL |
| `#btn-behance` | Behance case study URL |
| `#nav-wiki` | Project wiki URL |
| `#cta-figma` | Figma prototype URL |
| `#cta-behance` | Behance case study URL |
| `#cta-wiki` | Project wiki URL |

Footer links (Figma, Behance, Wiki, GitHub) also need real URLs.

---

## 🚀 Deploying on Vercel

### First-time setup

1. Go to [vercel.com/new](https://vercel.com/new) and import this GitHub repository.
2. In the project settings, set:
   - **Framework Preset:** `Other`
   - **Root Directory:** `docs`
   - **Build Command:** *(leave empty — no build step needed)*
   - **Output Directory:** `.` *(the root of `docs/` itself)*
3. Click **Deploy**.

### Result

- Vercel will serve `docs/index.html` at the root URL (`/`).
- The URL is **stable** — you can edit files, push, and Vercel redeploys automatically without changing the URL.
- The `404.html` page is automatically used for missing routes.

### Subsequent edits

Just push to your default branch. Vercel rebuilds instantly because there is no build step.

---

## 🏗️ Architecture Notes

- **No npm, no bundler, no framework.** Open `index.html` in any browser — it works offline.
- **Modular CSS** — tokens → base → layout → components → sections → utilities. They load in this order.
- **Section IDs** are stable anchors: `#hero`, `#problem`, `#why-sos`, `#mvp`, `#how-it-works`, `#screens`, `#difference`, `#cta`, `#footer`.
- **Scroll-reveal** is handled by adding the CSS class `reveal` to any element; `interactions.js` observes it automatically.
- **Mobile nav** is a CSS + JS hamburger menu that toggles on ≤ 768 px screens.

---

## ⚠️ Important

> The **stable public URL** must come from the same Vercel project.
> Set **Root Directory = `docs`** so that `index.html` is always the homepage at `/`.
> **Do not rename or move `index.html`** — the URL depends on it.
