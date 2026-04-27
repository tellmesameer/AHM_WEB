# CODEBASE_REFERENCE

Last updated: 2026-04-27 (UTC)

## 1) Current runtime architecture

This project is a static multi-page website (HTML + CSS + vanilla JS).

### Primary runtime entry points
- `index.html`
- `AHM_Website/pages/services/index.html`
- `AHM_Website/pages/solutions/index.html`
- `AHM_Website/pages/partners/index.html`
- `AHM_Website/pages/about/index.html`
- `AHM_Website/pages/contact/index.html`

### Shared partials loaded at runtime
- `AHM_Website/components/organisms/header.html`
- `AHM_Website/components/organisms/footer.html`

### Core runtime scripts/styles used by primary pages
- CSS: `css/system.css` (~42.5 KB)
- JS:
  - `js/partials.js` (~4.7 KB) — client-side include loader + cache
  - `js/main.js` (~18.5 KB) — UI behavior and interactions
  - `js/site-config.js` (~4.1 KB) + `base-config.js`

## 2) Dependency check

### External dependencies currently used
- Google Fonts (Inter)
- Font Awesome CDN (`cdnjs.cloudflare.com`)

### Local JS dependencies
- **Required by active pages:**
  - `js/main.js`
  - `js/partials.js`
  - `js/site-config.js`
- **Legacy-only (404 path):**
  - `js/includes.js`
  - `js/site-phase3.js`
- **Currently unreferenced by HTML:**
  - `js/phase3.js`

### Local CSS dependencies
- **Required by active pages:**
  - `css/system.css`
- **Legacy styles still in repo:**
  - `css/design-tokens.css`, `css/atoms.css`, `css/molecules.css`, `css/components.css`, `css/organisms.css`, `css/forms.css`, `css/responsive.css`, `css/phase3.css`
- **Currently unreferenced by HTML:**
  - `css/multi-step-forms.css`

## 3) Unused / low-value inventory (current)

### A) Unused component templates (not included anywhere)
- `AHM_Website/components/organisms/hero.html`
- `AHM_Website/components/atoms/button.html`
- `AHM_Website/components/atoms/icon.html`
- `AHM_Website/components/atoms/input.html`
- `AHM_Website/components/molecules/form-group.html`
- `AHM_Website/components/molecules/service-card.html`

### B) Unused JS/CSS files
- `js/phase3.js`
- `css/multi-step-forms.css`

### C) Duplicate or potentially removable asset sets
- Duplicate icon trees:
  - `images/icons/*`
  - `AHM_Website/assets/icons/*`
- Large PNG assets (strong candidates for compression/WebP conversion):
  - `images/asrg.png` (~836 KB)
  - `images/Gemini_Generated_Image_3o0zde3o0zde3o0z.png` (~836 KB)
  - `images/Python_AI.png` (~734 KB)
  - `images/AHM logo clear bg red[1].png` (~452 KB)

### D) Legacy page path
- `404.html` uses old script pipeline (`js/includes.js` + `js/site-phase3.js`).

## 4) Speed improvement opportunities (prioritized)

### Priority 1 (largest gains)
1. **Convert heavy PNGs to WebP/AVIF** and serve responsive sizes (`srcset`, width/height hints).
2. **Lazy-load non-critical images** on pages that still render logos/images without `loading="lazy"` (e.g., `index.html`, `about`, `partners`, `contact`).
3. **Remove duplicate icon folders** and keep one canonical path to reduce transfer + maintenance overhead.

### Priority 2 (network + render path)
4. **Enable strong static caching headers** (`Cache-Control` for CSS/JS/images and immutable hashed filenames).
5. **Preload critical assets** (`system.css`, above-the-fold hero image when applicable) and keep non-critical scripts deferred.
6. **Self-host icon/font subsets (or reduce icon set usage)** to limit third-party dependency latency.

### Priority 3 (runtime JS micro-optimizations)
7. In `js/main.js`, avoid computing `getComputedStyle(document.documentElement)` on every scroll tick; cache theme/nav colors once per theme change.
8. In `js/main.js`, throttle/debounce expensive resize-driven accordion height recalculations.
9. In `js/partials.js`, gate verbose `console.debug/info/warn` behind a debug flag to reduce runtime overhead/noise in production.

## 5) Suggested cleanup order

1. Delete/archive unreferenced templates in `components/atoms|molecules` and `components/organisms/hero.html`.
2. Remove `js/phase3.js` and `css/multi-step-forms.css` if no feature branch depends on them.
3. Consolidate icon folders and update references.
4. Compress/convert large PNGs and add lazy-loading where missing.
5. Modernize `404.html` to the same stack as other pages or explicitly document it as intentionally legacy.

## 6) Commands used for verification

```bash
rg -n "partials\.js|main\.js|site-config\.js|includes\.js|site-phase3\.js|phase3\.js|multi-step-forms\.css|system\.css" *.html AHM_Website/pages/**/*.html 404.html
python - <<'PY'
# checks reference status for selected files in HTML attributes
PY
wc -c css/*.css js/*.js | sort -n
du -h --max-depth=2 | sort -h | tail -n 20
find . -type f -printf '%s %p\n' | sort -nr | head -n 15
rg -n "<img|loading=\"lazy\"|font-awesome|fonts.googleapis|preconnect|defer" index.html AHM_Website/pages/**/*.html
```
