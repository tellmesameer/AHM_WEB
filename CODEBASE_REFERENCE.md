# CODEBASE_REFERENCE

Last updated: 2026-04-23 (UTC)

## 0) Latest update (SaaS product-grade redesign)

- Transformed the website from marketing-style to product-grade SaaS interface following Stripe/Databricks patterns.
- Implemented strict design system: 12-column grid, 8px spacing, typography scale (H1 48px, H2 32px, etc.).
- Standardized hero sections across all pages: left text + right product UI visual.
- Added missing product sections: System Flow (pipeline), Data/Code Blocks, Metrics/Observability, Comparison Tables.
- Unified card system with hover effects, visual depth with gradients/blur panels.
- Fixed content hierarchy, upgraded CTAs, added trust & proof elements.
- Redesigned contact form: 2-column grid, full-width fields, message below, trust strip.
- Fixed all paths to absolute /AHM_WEB/... for consistent serving.
- Applied design system to all pages: home, services, about, careers, consultation, contact, feedback, partners, solutions, legal/privacy, and service subpages.

## 1) Design System Components

### Grid & Spacing
- 12-column layout, max-width 1200px
- 8px spacing system (sp-1 to sp-6)
- Consistent gutters and section spacing (80-120px)

### Typography
- H1: 48px bold, H2: 32px, H3: 20px, Body: 16px, Labels: 13px
- Inter font family

### Cards
- Equal height, consistent padding/radius/shadow
- Hover: translateY(-4px), soft shadow increase
- Icons: 24px, consistent sizing

### CTAs
- Primary: solid button, Secondary: outline
- Multiple levels: hero, mid-section, bottom

### Visual Depth
- Subtle gradients, layered cards, glass/blur panels
- Realistic UI mocks (dashboards, charts, pipelines)

## 2) Page Structure

Each page follows:
- Hero (badge, headline, subtitle, CTAs, right visual)
- Product sections (flow, code, metrics, comparison)
- Trust elements (logos, metrics)
- Contact/CTA sections

## 3) File verification matrix

| File | Exists | Notes |
|---|---|---|
| `index.html` | ✅ Yes | Home page with full SaaS redesign. |
| `css/system.css` | ✅ Yes | Main design system stylesheet. |
| `css/design-tokens.css` | ✅ Yes | Design tokens and variables. |
| `css/atoms.css` | ✅ Yes | Atomic styles. |
| `css/components.css` | ✅ Yes | Component styles. |
| `css/organisms.css` | ✅ Yes | Organism styles. |
| `js/main.js` | ✅ Yes | Main JS with animations. |
| `js/partials.js` | ✅ Yes | Partial loading. |
| `AHM_Website/components/organisms/header.html` | ✅ Yes | Header component. |
| `AHM_Website/components/organisms/footer.html` | ✅ Yes | Footer component. |
| `AHM_Website/components/organisms/hero.html` | ✅ Yes | Hero component. |
| All pages in `AHM_Website/pages/` | ✅ Yes | Redesigned with consistent design system. |
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
