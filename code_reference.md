# CODEBASE_REFERENCE

Last updated: 2026-04-24 (UTC)

## 1) Current runtime architecture

This project is a static multi-page site with HTML + CSS + vanilla JS.

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
- CSS: `css/system.css`
- JS: `js/partials.js` (component include loader), `js/main.js` (UI behavior)
- Base config: `base-config.js`, `js/site-config.js`

## 2) Dependency check (double-checked)

### External dependencies currently used
- Google Fonts (Inter)
- Font Awesome CDN (`cdnjs.cloudflare.com`)

### Local JS dependencies
- **Required (primary pages):**
  - `js/main.js`
  - `js/partials.js`
  - `js/site-config.js`
- **Only used by legacy 404 page:**
  - `js/includes.js`
  - `js/site-phase3.js`
- **Currently unreferenced:**
  - `js/phase3.js`

### Local CSS dependencies
- **Required (primary pages):**
  - `css/system.css`
- **Legacy styles still present and referenced by old/aux pages:**
  - `css/design-tokens.css`, `css/atoms.css`, `css/molecules.css`, `css/components.css`, `css/organisms.css`, `css/forms.css`, `css/responsive.css`, `css/phase3.css`
- **Currently unreferenced:**
  - `css/multi-step-forms.css`

## 3) Unused / not-required code inventory (current)

> Scope used for this list: files not referenced by the current primary pages and component partial chain.
> Some files may be intentionally retained for legacy routes (ex: `404.html`) or future migration.

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

### C) Legacy/duplicate icon/image assets not required by current main pages
- Duplicate icon sets (both locations mostly unused by active pages):
  - `images/icons/*`
  - `AHM_Website/assets/icons/*` (except favicon)
- Example unused images currently not referenced in primary pages:
  - `images/Gemini_Generated_Image_3o0zde3o0zde3o0z.png`
  - `images/Python_AI.png`
  - `images/Remove background project.png`
  - `images/WhatsApp Image 2025-09-12 at 12.01.56_714598bf.jpg`
  - `images/WhatsApp Image 2025-09-12 at 12.01.56_714598bf (1).jpg`
  - `images/asrg.png`
  - `images/backgorundImage.svg`
  - `images/web development logo.png`

### D) Legacy page path
- `404.html` (uses legacy script pipeline `js/includes.js` + `js/site-phase3.js`).

## 4) Recommended cleanup order (safe)

1. Remove or archive unreferenced component templates in `components/atoms|molecules` and old `organisms/hero.html`.
2. Remove `js/phase3.js` and `css/multi-step-forms.css` if no upcoming feature depends on them.
3. Consolidate icon folders (`images/icons` vs `AHM_Website/assets/icons`) and keep one canonical location.
4. Prune unused image assets after final visual QA.
5. Either modernize `404.html` to current stack (`partials.js` + `main.js`) or keep legacy scripts intentionally documented.

## 5) Commands used for verification

```bash
rg -n "includes\.js|site-phase3\.js|phase3\.js|multi-step-forms\.css"
python <reference scanner for src/href/data-include across *.html>
node -e "new Function(require('fs').readFileSync('js/main.js','utf8')); console.log('main.js syntax ok')"
```
