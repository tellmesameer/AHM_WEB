# CODEBASE_REFERENCE

Last updated: 2026-04-23 (UTC)

## 0) Latest update (theme correction)

- Reworked the homepage theme in `css/phase3.css` to resolve inconsistent dark/gray blocks and improve visual cohesion.
- Unified header/hero contrast, corrected subtitle spacing (`margin-top: 0`), and applied consistent container card styling across sections.
- Improved mobile behavior for hero and nav theme states.

- Added 1920px-focused alignment and spacing normalization in `css/phase3.css` (centered section headers/subtitles, constrained form width, improved wide-screen grid behavior).
- Removed problematic legacy spacing constraints in `css/organisms.css` (`margin-top: -39px`, excessive min-heights, and over-dense 6-column 1400px grid).

- Refreshed the Solutions page structure and styling with an Apple-inspired compact layout: removed inline CSS from `AHM_Website/pages/solutions/index.html`, added scoped shells/classes, tightened catalog card density, and improved KPI/industry card visuals in `css/components.css`.


- Redesigned the Partners page with a premium card layout and added intrinsic logo dimensions (`width`/`height`) plus async decoding/lazy loading to reduce initial logo reflow/glitch on navigation.

- Reimagined the About page by removing the duplicated hero-style section from that page flow, applying a cleaner premium layout, and normalizing CTA button alignment (`.cta-actions`) across About/Solutions CTAs.

## 1) Recent fixes implemented

The following changes from the latest UI/cleanup work are now implemented:

1. **Inline CSS removed from `index.html`**
   - Baseline rules were moved to external stylesheet (`css/components.css`).
2. **Homepage spacing and visual polish added**
   - Section shell spacing utilities, subtle gradient backgrounds, card elevation/hover consistency, contact/newsletter visual improvements.
3. **Placeholder form redirect values removed**
   - Removed dummy `_next` values (`https://yoursite.com/...`) from forms.
4. **Debug logs removed from production JS path**
   - Removed `console.log` debug statements from `js/main.js`.
5. **Footer include path corrected**
   - Fixed footer partial include to use `./AHM_Website/components/organisms/footer.html` (local relative path).

---

## 2) File verification matrix (mentioned/critical files)

| File | Exists | Notes |
|---|---|---|
| `index.html` | ✅ Yes | Main page updated with section-shell classes and corrected footer include. |
| `css/components.css` | ✅ Yes | Externalized baseline rules + visual polish ruleset. |
| `js/main.js` | ✅ Yes | Debug logs removed; responsive helper retained. |
| `js/phase3.js` | ✅ Yes | Syntax checked. |
| `js/partials.js` | ✅ Yes | Syntax checked. |
| `js/site-config.js` | ✅ Yes | Syntax checked. |
| `AHM_Website/components/organisms/header.html` | ✅ Yes | Referenced via `data-include`. |
| `AHM_Website/components/organisms/hero.html` | ✅ Yes | Referenced via `data-include`. |
| `AHM_Website/components/organisms/footer.html` | ✅ Yes | Reference fixed and verified. |
| `AHM_Website/assets/icons/favicon.svg` | ✅ Yes | Referenced favicon exists. |
| `css/design-tokens.css` | ✅ Yes | Referenced stylesheet exists. |
| `css/responsive.css` | ✅ Yes | Referenced stylesheet exists. |
| `css/atoms.css` | ✅ Yes | Referenced stylesheet exists. |
| `css/molecules.css` | ✅ Yes | Referenced stylesheet exists. |
| `css/organisms.css` | ✅ Yes | Referenced stylesheet exists. |
| `css/forms.css` | ✅ Yes | Referenced stylesheet exists. |
| `css/phase3.css` | ✅ Yes | Referenced stylesheet exists; theme rework overrides added. |

---

## 3) Verification commands used

```bash
rg --files -g 'CODEBASE_REFERENCE.md'
rg -n "yoursite\.com|console\.log" index.html js/main.js css/components.css
node --check js/main.js
node --check js/phase3.js
node --check js/partials.js
node --check js/site-config.js
python <script to validate local src/href/data-include references in index.html>
```

Result summary:
- `CODEBASE_REFERENCE.md` now exists.
- No leftover `yoursite.com` placeholders.
- No `console.log` debug statements in checked files.
- JS syntax checks pass.
- All local `index.html` references currently resolve to existing files.
