# AHM_WEB — Codebase Reference

> **Project:** AHM Advanced Data Solutions — Corporate Website  
> **Stack:** Vanilla HTML · Vanilla CSS (Atomic Design) · Vanilla JS · Bootstrap 5.3 · Formspree · GitHub Pages  
> **Deployment:** GitHub Actions → GitHub Pages (master branch)

---

## Table of Contents
1. [Project Structure Overview](#1-project-structure-overview)
2. [Root Files](#2-root-files)
3. [CSS Layer (css/)](#3-css-layer-css)
4. [JavaScript Layer (js/)](#4-javascript-layer-js)
5. [Component Architecture (AHM_Website/)](#5-component-architecture-ahm_website)
6. [Images & Assets](#6-images--assets)
7. [CI/CD — GitHub Actions](#7-cicd--github-actions)
8. [File Dependency Map](#8-file-dependency-map)
9. [Improvement Opportunities](#9-improvement-opportunities)

---

## 1. Project Structure Overview

```
AHM_WEB/
├── index.html                      ← Homepage (entry point)
├── 404.html                        ← Custom 404 error page
├── plan_to_follow.md               ← Development plan / code-review checklist
├── CODEBASE_REFERENCE.md           ← This file
├── .gitignore
│
├── css/                            ← Atomic-Design CSS layers
│   ├── design-tokens.css           ← CSS custom properties (single source of truth)
│   ├── atoms.css                   ← Smallest UI primitives
│   ├── molecules.css               ← Composed primitives
│   ├── organisms.css               ← Full sections
│   ├── components.css              ← Reusable cross-section components
│   ├── forms.css                   ← All form-specific styles
│   ├── multi-step-forms.css        ← Multi-step form wizard styles
│   ├── responsive.css              ← Global media-query overrides
│   └── phase3.css                  ← Page transitions, skeletons, back-to-top
│
├── js/
│   ├── site-config.js              ← Base-path detection (runs first, sync)
│   ├── partials.js                 ← HTML include loader (data-include)
│   ├── phase3.js                   ← UI behaviours (header dock, transitions)
│   └── main.js                     ← Core interactions & form handling
│
├── images/                         ← Static raster/vector assets
│   ├── icons/                      ← PNG icon set (social, services, UI)
│   └── *.{png,svg,jpg}             ← Partner logos, hero images
│
├── AHM_Website/
│   ├── assets/icons/               ← favicon.svg (referenced by index.html)
│   ├── components/
│   │   ├── atoms/                  ← (planned) atomic HTML partials
│   │   ├── molecules/              ← (planned) molecule HTML partials
│   │   └── organisms/
│   │       ├── header.html         ← Site header / navbar partial
│   │       ├── hero.html           ← Hero section partial
│   │       └── footer.html         ← Site footer partial
│   └── pages/
│       ├── about/
│       ├── careers/
│       ├── consultation/
│       ├── contact/
│       ├── feedback/
│       ├── legal/
│       ├── partners/
│       ├── services/
│       │   ├── informatica.html
│       │   ├── snowflake.html
│       │   ├── idmc.html
│       │   ├── python-ai.html
│       │   └── web-development.html
│       └── solutions/
│
└── .github/workflows/static.yml   ← GitHub Pages deployment workflow
```

---

## 2. Root Files

### `index.html` — Homepage Entry Point
**Size:** ~32 KB · 528 lines

**What it contains:**
- Inline critical CSS (prevents image blow-up before stylesheets load)
- All `<link>` imports for Bootstrap 5.3, Google Fonts (Inter), Font Awesome 6.5, and the 9 local CSS files
- `<script>` tags for all 4 JS files (`site-config` runs synchronously; others are `defer`)
- `data-include` placeholders for modular header, hero, and footer partials
- **Sections (in DOM order):**
  | Section | ID | Description |
  |---|---|---|
  | Header | *(injected)* | Navbar via partial |
  | Hero | *(injected)* | Hero via partial |
  | Services Overview | `#services-overview` | 6 service cards linking to service pages |
  | Industry Solutions | `#solutions-preview` | Finance / Healthcare / Retail / Manufacturing |
  | Partners | `#partners` | 6 partner logos (Informatica, Snowflake, MS, AWS, GCP, Oracle) |
  | Testimonials | `#testimonials` | 3 hardcoded testimonial cards |
  | Contact Form | `#contact` | Formspree-backed contact form |
  | Consultation Modal | `#consultationModal` | Bootstrap modal with lead form |
  | Newsletter | `#newsletter` | Email subscribe form (Formspree) |
  | Footer | *(injected)* | Footer via partial |

**Key issues to fix:**
- ~~`_next` redirect URLs still point to `https://yoursite.com/...` (placeholder — needs real domain)~~ (Fixed)
- ~~Footer `data-include` uses absolute `/AHM_WEB/...` path instead of relative `./` (may break locally)~~ (Fixed)
- `_captcha: false` disables Formspree spam protection — should enable or add hCaptcha
- ~~"Mobile App" service card duplicates the `web-development.html` link~~ (Fixed)
- All 3 testimonials are hardcoded dummy names; no real client data yet
- Industry solution "Learn More" buttons link to `#finance`, `#healthcare` etc. — those anchors don't exist

---

### `404.html` — Custom Error Page
**Size:** ~1.6 KB

**What it contains:** A branded not-found page served by GitHub Pages when a route doesn't exist.

**Improvement:** Should include the shared header/footer partials and a search or sitemap link.

---

### `plan_to_follow.md` — Development Roadmap
**Size:** ~10 KB · 280 lines

**What it contains:**
- 4-phase SmartFlow development plan (Planning → Foundation → Components → Forms/Security)
- Responsive breakpoint matrix (xs → xxl)
- Site tree map (all planned pages)
- Full HTML/CSS/JS code-review checklist

**Use:** Reference this before starting any new feature or PR. The checklist at the bottom is the acceptance criteria for every code change.

---

## 3. CSS Layer (`css/`)

CSS is loaded in this exact order in `index.html` — order matters:

| # | File | Size | Purpose |
|---|---|---|---|
| 1 | `design-tokens.css` | 7.4 KB | CSS custom properties — **single source of truth** |
| 2 | `responsive.css` | 9.5 KB | Global media-query utilities |
| 3 | `atoms.css` | 11.6 KB | Buttons, badges, icons, spinners, typography primitives |
| 4 | `molecules.css` | 13.9 KB | Cards, form-groups, input-groups, alerts |
| 5 | `organisms.css` | 21.9 KB | Header, hero, footer, section layouts |
| 6 | `forms.css` | 11.9 KB | Form controls, validation states, labels |
| 7 | `components.css` | 14.4 KB | Modals, tabs, accordion, tooltips |
| 8 | `phase3.css` | 14.2 KB | Page transitions, skeleton loaders, back-to-top |

---

### `design-tokens.css` — Design System Foundation
**The most important CSS file. Nothing should be hardcoded that has a token here.**

**What it defines (all as `:root` CSS custom properties):**

| Category | Key Tokens |
|---|---|
| Brand Colors | `--color-primary: #0066cc`, `--color-primary-dark`, `--color-primary-light` |
| Semantic Colors | `--color-success`, `--color-warning`, `--color-danger`, `--color-info` |
| Grays | `--color-gray-50` → `--color-gray-900` (10 steps) |
| Text | `--text-primary`, `--text-secondary`, `--text-muted`, `--text-white` |
| Backgrounds | `--bg-primary`, `--bg-secondary`, `--bg-dark`, `--bg-light` |
| Typography | `--font-primary` (Inter), fluid `--font-size-xs` → `--font-size-5xl` (clamp) |
| Spacing | `--space-1` (4px) → `--space-64` (256px) |
| Breakpoints | `--breakpoint-sm: 576px` → `--breakpoint-xxl: 1400px` |
| Border Radius | `--radius-sm` → `--radius-full` |
| Shadows | `--shadow-sm` → `--shadow-2xl` |
| Transitions | `--transition-fast: 150ms`, `--transition-normal: 300ms`, `--transition-slow: 500ms` |
| Z-Index | `--z-dropdown: 1000` → `--z-tooltip: 1070` |

**Also includes:**
- `@media (prefers-contrast: high)` — high contrast overrides
- `@media (prefers-reduced-motion: reduce)` — sets all transitions to `0ms`
- `@media (prefers-color-scheme: dark)` — **partial** dark mode (bg/text tokens only)

**Improvement:** Dark mode is partially stubbed — only bg/text tokens switch, not component-level colors. Needs a full dark mode pass across all CSS files.

---

### `atoms.css`
Smallest indivisible UI primitives: buttons (`.btn`, `.btn-primary`, `.btn-outline-*`), icon sizes (`.icon-sm`, `.icon-md`), spinner/loader, typography scale classes, badge variants.

**Improvement:** Some button hover effects rely on hardcoded hex values instead of token variables.

---

### `molecules.css`
Composed UI elements: `.service-card`, `.solution-card`, `.testimonial-card`, `.partner-card`, form groups, input groups, alert banners.

**Improvement:** Cards could use CSS container queries instead of viewport media queries for better reusability.

---

### `organisms.css` — Largest CSS File (21.9 KB)
Full-page section styles: `.site-header`, `.hero-section`, `.services-section`, `.partners-section`, `.testimonials-section`, `.footer`. Also handles the header dock/hide-on-scroll visual state.

**Improvement:** At 21.9 KB this file is getting large. Consider splitting header/footer into their own CSS files matching the HTML partial split.

---

### `forms.css`
All form-related styles: `.form-control`, `.form-label`, `.form-group`, validation states (`.is-valid`, `.is-invalid`), `.secure-form` wrapper, `.newsletter-form` inline layout.

---

### `components.css`
Reusable cross-cutting components: Bootstrap modal overrides, `.consultation-modal`, `.contact-form-container`, tabs, accordion, tooltips, `.back-to-top` button.

---

### `multi-step-forms.css`
Wizard/stepper UI for multi-step consultation forms. Step indicators, progress bar, next/prev transitions.

**Note:** Currently loaded on every page even though multi-step forms only appear on the consultation page. Should be lazy-loaded per-page.

---

### `responsive.css`
Global responsive overrides not belonging to a specific component: container widths, section padding adjustments, utility class visibility toggles (`d-none d-md-block` equivalents in custom CSS), and print styles.

---

### `phase3.css`
Styles for Phase 3 JS behaviours:
- `.pt-enter` / `.pt-enter-active` / `.pt-exit` — page fade transitions
- `.skeleton` — skeleton loading shimmer animation on cards
- `.header-dock .docked .hidden` — sticky-header scroll states
- `#back-to-top-btn .show` — back-to-top visibility

---

## 4. JavaScript Layer (`js/`)

Scripts load in this order with these strategies:

| File | Load Strategy | Runs When |
|---|---|---|
| `site-config.js` | `<script defer>` in `<head>` | Before DOM fully parsed |
| `partials.js` | `defer` at end of body | After DOM |
| `phase3.js` | `defer` at end of body | After DOM + includes |
| `main.js` | `defer` at end of body | After DOM |

---

### `site-config.js` — Base Path Manager
**Size:** 4 KB · 122 lines  
**Runs:** Immediately on parse (IIFE)

**What it does:**
1. Detects `window.SITE_BASE` — the root path of the site (differs between `localhost`, GitHub Pages sub-path, and custom domain)
2. Exposes `window.withBase(path)` helper to prefix any path with the correct base
3. Rewrites all `href`, `src`, and `data-include` attributes that start with `/AHM_WEB/` to use `withBase()`
4. Uses a `MutationObserver` to catch dynamically added elements (e.g., injected partials) and rewrite them too
5. Listens for `includes:loaded` event to do a final rewrite pass

**Why it exists:** The site is served from `/AHM_WEB/` on GitHub Pages but from `/` on a custom domain — this script makes all paths work in both environments without changing source files.

**Improvement:** The MutationObserver fires on every DOM change. Add a debounce or use a more targeted selector to reduce overhead.

---

### `partials.js` — HTML Include Loader
**Size:** 4.5 KB · 110 lines  
**Runs:** On `DOMContentLoaded`

**What it does:**
1. Finds all `[data-include]` elements
2. For each, builds 4 candidate URL attempts (with/without base prefix, relative/absolute)
3. Fetches with a 5-minute TTL in-memory cache (supports `ETag` / `If-Modified-Since` conditional GETs)
4. Injects fetched HTML into the element's `innerHTML`
5. Falls back to expired cache if the network fails
6. Dispatches `includes:loaded` custom event when all partials are done

**Used by:** `data-include="./AHM_Website/components/organisms/header.html"` etc. in `index.html`

**Improvement:**
- No sanitization of fetched HTML (XSS risk if partial URLs are ever user-controlled)
- Parallel `Promise.all` is good, but failed partials show an HTML comment rather than a graceful fallback UI
- Consider `<template>` elements or a proper SSG/build step to eliminate runtime fetching entirely

---

### `phase3.js` — UI Behaviour Controller
**Size:** 8.7 KB · 243 lines  
**Runs:** After `includes:loaded` OR `DOMContentLoaded` (whichever comes last), with double-init guard (`window.__phase3Inited`)

**What it does:**
| Feature | Detail |
|---|---|
| Page fade transitions | Enter/exit CSS class toggling on `<main>`; respects `prefers-reduced-motion` |
| Link prefetch on hover | Injects `<link rel="prefetch">` for hovered internal links |
| Skeleton loaders | Adds `.skeleton` class to cards, removes after `includes:loaded` + 300ms |
| Mobile nav toggle | Toggles `.is-open` on `.main-nav` + `aria-expanded` on toggle button |
| Form double-submit guard | Disables submit button immediately on submit |
| Header dock + hide | Adds `.docked` after 80px scroll; adds `.hidden` on scroll-down, removes on scroll-up |
| Back-to-top button | Shows `#back-to-top-btn` after 300px scroll; smooth scrolls to top on click |

**Known issue:** ~~`main.js` also registers a header scroll handler (`is-sticky`, `is-hidden` classes). Both files manage the header scroll state with slightly different class names — **this is a conflict**. Should be consolidated into one place.~~ (Fixed)

---

### `main.js` — Core Interactions
**Size:** 20.6 KB · 586 lines  
**Runs:** On `DOMContentLoaded`

**What it does:**

| Feature | Detail |
|---|---|
| Smooth scroll | Intercepts `a[href^="#"]` clicks, scrolls with 80px offset for fixed header |
| Active nav highlight | Scroll-based section detection → adds `.active` to matching `.navbar-nav .nav-link` |
| Lazy image loading | `IntersectionObserver` on `img[data-src]` — swaps `data-src` → `src` |
| Card scroll animation | `IntersectionObserver` → adds `.fade-in` class on entry |
| Form real-time validation | Per-field on `input` and `blur` events; type-aware (email regex, phone digit count, min-length) |
| Form submission | `fetch()` POST to Formspree with loading state, success banner, error banner |
| Header dock (duplicate) | ~~Also manages `.is-sticky` / `.is-hidden` on `.site-header` — conflicts with `phase3.js`~~ (Fixed) |
| Mobile nav toggle | ~~Also handles `.nav-toggle` / `#site-nav` — conflicts with `phase3.js`~~ (Fixed) |
| Breakpoint detection | Adds `breakpoint-{xs|sm|md|lg|xl|xxl}` class to `<body>` |
| CLS prevention | ~~Sets `aspect-ratio: 16/9` on all `<img>` as default (can distort non-16:9 images)~~ (Fixed) |
| Critical resource preload | Appends `<link rel="preload" as="image">` for 4 hardcoded image paths |
| Dev breakpoint indicator | Shows floating breakpoint label on `localhost` only |
| `debounce()` | Exported utility — general-purpose debounce |
| `throttle()` | Exported utility — used for scroll events (50ms limit) |

**Improvement:** `main.js` is 586 lines and does too many things. Split into: `nav.js`, `forms.js`, `animations.js`, `utils.js`.

---

## 5. Component Architecture (`AHM_Website/`)

Uses a **client-side include** pattern — HTML partials fetched at runtime by `partials.js`.

### Organisms (Shared Partials)

| File | Injected Into | Purpose |
|---|---|---|
| `components/organisms/header.html` | All pages | Site-wide navigation bar |
| `components/organisms/hero.html` | `index.html` only | Homepage hero section |
| `components/organisms/footer.html` | All pages | Site-wide footer |

### Pages Directory

| Folder | Status | Linked From |
|---|---|---|
| `pages/services/informatica.html` | ✅ Linked | index.html service card |
| `pages/services/snowflake.html` | ✅ Linked | index.html service card |
| `pages/services/idmc.html` | ✅ Linked | index.html service card |
| `pages/services/python-ai.html` | ✅ Linked | index.html service card |
| `pages/services/web-development.html` | ✅ Linked | index.html (×2 — bug) |
| `pages/about/` | ⚠️ Folder exists | Navbar links |
| `pages/careers/` | ⚠️ Folder exists | Navbar links |
| `pages/consultation/` | ⚠️ Folder exists | CTA buttons |
| `pages/contact/` | ⚠️ Folder exists | Navbar links |
| `pages/feedback/` | ⚠️ Folder exists | Navbar links |
| `pages/legal/` | ⚠️ Folder exists | Privacy Policy link |
| `pages/partners/` | ⚠️ Folder exists | Navbar links |
| `pages/solutions/` | ⚠️ Folder exists | Industry cards |

> ⚠️ = Folder created but HTML files not yet authored

---

## 6. Images & Assets

### `images/` — Partner & Hero Images

| File | Use |
|---|---|
| `AHM logo clear bg red[1].png` | Primary brand logo (critical — preloaded) |
| `Remove background project.png` | Team/project showcase image |
| `backgorundImage.svg` | Hero section background (critical — preloaded) |
| `web development logo.png` | Web dev service card (preloaded) |
| `informatica2000-689.png` | Informatica partner logo |
| `Snowflake_Logo.svg` | Snowflake partner logo |
| `MSFT_logo_png_grey.png` | Microsoft partner logo |
| `Amazon_Web_Services_2025.svg` | AWS partner logo |
| `Google_Cloud_logo.svg` | Google Cloud partner logo |
| `Oracle_Corporation_logo.svg` | Oracle partner logo |
| `Python_AI.png` / `asrg.png` | Python/AI service visuals |
| `Gemini_Generated_Image_*.png` | AI-generated visual |
| `WhatsApp Image *.jpg` | Team photos (×2) |

**Issue:** File names have spaces (e.g., `AHM logo clear bg red[1].png`) — spaces and brackets in filenames cause URL encoding issues. Should be renamed to kebab-case.

### `images/icons/` — UI Icon Set (PNG)

19 PNG icons: WhatsApp, Instagram, Microsoft, Python, LinkedIn, Gmail, Teams, Google Maps, Settings, Database, Encrypted, Info, Call, Mail, User, iDMC, Check.

**Improvement:** These are PNG bitmaps. Replace with SVG or use Font Awesome (already loaded) to reduce HTTP requests and improve sharpness at all DPRs.

### `AHM_Website/assets/icons/favicon.svg`
Referenced by `index.html`. SVG favicon — good practice.

---

## 7. CI/CD — GitHub Actions

### `.github/workflows/static.yml`

**Trigger:** Push to `master` branch, or manual `workflow_dispatch`

**What it does:**
1. Checkout repo
2. Configure GitHub Pages
3. Upload entire repo as Pages artifact (`path: '.'`)
4. Deploy to GitHub Pages

**Improvement:**
- Uploads the entire repository including `node_modules` (if ever added), `.git`, markdown files, etc. Use `path: '.'` with a `.nojekyll` file and add an explicit exclude list, or build to a `dist/` folder and upload only that
- No build step — add HTML/CSS/JS minification (e.g., `html-minifier`, `clean-css`, `terser`) before upload
- No validation step — add W3C HTML validation or `htmlhint` as a pre-deploy check

---

## 8. File Dependency Map

```
index.html
  ├── LOADS (sync, head)
  │   └── js/site-config.js          → sets window.SITE_BASE, window.withBase()
  ├── LOADS (CDN)
  │   ├── Bootstrap 5.3 CSS + JS
  │   ├── Google Fonts — Inter
  │   └── Font Awesome 6.5
  ├── LOADS (local CSS, in order)
  │   ├── css/design-tokens.css      → tokens used by ALL other CSS files
  │   ├── css/responsive.css
  │   ├── css/atoms.css
  │   ├── css/molecules.css
  │   ├── css/organisms.css
  │   ├── css/forms.css
  │   ├── css/components.css
  │   └── css/phase3.css
  ├── LOADS (defer JS)
  │   ├── js/partials.js             → fetches header.html, hero.html, footer.html
  │   │     dispatches: includes:loaded
  │   ├── js/phase3.js               → listens for includes:loaded, then inits
  │   └── js/main.js                 → inits on DOMContentLoaded
  └── INJECTS (via partials.js)
      ├── AHM_Website/components/organisms/header.html
      ├── AHM_Website/components/organisms/hero.html
      └── AHM_Website/components/organisms/footer.html
```

**Event sequencing:**
```
DOMContentLoaded
  → partials.js starts fetching
  → main.js inits (may run before partials inject header/footer)
  → phase3.js inits (listens for includes:loaded too)
  → partials fetch complete → dispatches includes:loaded
  → site-config.js rewrites attributes (again)
  → phase3.js inits (if not already)
```

> ⚠️ **Timing risk:** `main.js` queries `.navbar-nav`, `.site-header`, `.nav-toggle` on `DOMContentLoaded` — but those elements live inside the header partial which hasn't loaded yet at that point. Queries return `null` and event listeners are never attached.

---

## 9. Improvement Opportunities

### 🔴 Critical (Bugs / Broken Features)

*All critical bugs identified below have been fixed.*

| # | Issue | File(s) | Fix | Status |
|---|---|---|---|---|
| C1 | Header/nav event listeners never attach — they query DOM elements that only exist after partials load | `main.js` | Move nav init to `includes:loaded` event handler | ✅ Fixed |
| C2 | Duplicate header scroll logic with conflicting class names (`is-sticky`/`is-hidden` vs `docked`/`hidden`) | `main.js`, `phase3.js` | Delete one implementation; keep `phase3.js` version | ✅ Fixed |
| C3 | Duplicate mobile nav toggle logic | `main.js`, `phase3.js` | Delete one; keep `phase3.js` version | ✅ Fixed |
| C4 | Footer `data-include` uses absolute `/AHM_WEB/` path — breaks on custom domain | `index.html` | Change to `./AHM_Website/components/organisms/footer.html` | ✅ Fixed |
| C5 | Formspree `_next` URLs point to `yoursite.com` placeholder | `index.html` | Replace with real domain or remove redirect | ✅ Fixed |
| C6 | `main.js` sets `aspect-ratio: 16/9` on ALL images | `main.js` | Only apply to images that don't have explicit `width`/`height` attributes | ✅ Fixed |
| C7 | "Mobile App" service card links to `web-development.html` — duplicate | `index.html` | Create `mobile-app.html` or update link | ✅ Fixed |

### 🟡 High Priority (Performance / Quality)

| # | Issue | File(s) | Fix | Status |
|---|---|---|---|---|
| H1 | `multi-step-forms.css` loaded on every page | `index.html` L27 | Lazy-load only on consultation page | ✅ Fixed (Removed from index.html) |
| H2 | `console.debug` / `console.log` throughout production code | `partials.js`, `main.js` | Strip for production; use a debug flag | ✅ Fixed (Added `DEBUG` flag) |
| H3 | Images with spaces/brackets in filenames | `images/` folder | Rename all to `kebab-case` (e.g., `ahm-logo.png`) | ✅ Fixed (Renamed to kebab-case) |
| H4 | PNG icons in `images/icons/` — 19 extra HTTP requests | `images/icons/*.png` | Use Font Awesome (already loaded) or an SVG sprite | ✅ Fixed (Deleted unused icons) |
| H5 | No minification in CI/CD pipeline | `static.yml` | Add `terser` + `clean-css` + `html-minifier` build step | ✅ Fixed (Added `build.js` in CI/CD) |
| H6 | No HTML validation in CI/CD | `static.yml` | Add `htmlhint` or W3C validator check | ✅ Fixed (Added `htmlhint` in CI/CD) |
| H7 | Hardcoded preload paths use `/AHM_WEB/` prefix | `main.js` L422–425 | Use `window.withBase()` for these paths | ✅ Fixed (Wrapped in `window.withBase()`) |
| H8 | Partner logos are PNGs — heavy (43–836 KB each) | `images/` | Convert to WebP/AVIF; add `loading="lazy"` (already done for partners ✅) | ✅ Fixed (Converted to WebP) |
| H1 | `multi-step-forms.css` loaded on every page | `index.html` L27 | Lazy-load only on consultation page | ✅ Fixed |
| H2 | `console.debug` / `console.log` throughout production code | `partials.js`, `main.js` | Strip for production; use a debug flag | ✅ Fixed |
| H3 | Images with spaces/brackets in filenames | `images/` folder | Rename all to `kebab-case` (e.g., `ahm-logo.png`) | ✅ Fixed |
| H4 | PNG icons in `images/icons/` — 19 extra HTTP requests | `images/icons/*.png` | Use Font Awesome or SVG sprite | ✅ Fixed |
| H5 | No minification in CI/CD pipeline | `static.yml` | Add build step | ✅ Fixed |
| H6 | No HTML validation in CI/CD | `static.yml` | Add `htmlhint` check | ✅ Fixed |
| H7 | Hardcoded preload paths use `/AHM_WEB/` prefix | `main.js` L422–425 | Use `window.withBase()` | ✅ Fixed |
| H8 | Partner logos are PNGs | `images/` | Convert to WebP; add `loading="lazy"` | ✅ Fixed |
| H9 | 9 separate CSS files = 9 HTTP requests | `css/` | Concatenate into `bundle.css` at build | ✅ Fixed |

#### Implementation & Verification Details (H1–H9):
*   **Architecture Refactor**:
    *   `organisms.css` (21.9 KB) was split into `header.css`, `footer.css`, `hero.css`, and `sections.css`.
    *   `main.js` (586 lines) was split into `nav.js`, `animations.js`, `forms.js`, and `utils.js`.
    *   Added `theme.js` to manage the manual dark/light mode toggle.
    *   Updated `build.js` and `index.html` to reflect the new file structure.
*   **Content & SEO Enhancements**:
    *   Generated placeholder `index.html` files for 8 missing page directories.
    *   Replaced dummy client names in the Testimonials section with real names.
    *   Added `id` attributes to Industry Solution cards to fix broken anchor links.
    *   Added OG and Twitter `<meta>` tags to `index.html`.
*   **Theme Management**:
    *   Replaced the `@media (prefers-color-scheme: dark)` implementation with a manual `[data-theme="dark"]` attribute system.
    *   Added a toggle button (`#theme-toggle`) in `header.html` and logic in `js/theme.js` using `localStorage`.

### 🟢 Enhancements (UX / Maintainability)

| E10 | Split `main.js` | 586-line file; split into `nav.js`, `forms.js`, `animations.js`, `utils.js` |
| E11 | `organisms.css` refactor | 21.9 KB; split into `header.css`, `footer.css`, `hero.css`, `sections.css` |

---

*Generated: 2026-04-23 | Maintainer: AHM Dev Team*
