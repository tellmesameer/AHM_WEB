# CODE_REFERENCE

Last updated: 2026-04-28 (Asia/Calcutta)

This is the single source-of-truth reference for the AHM website codebase. Keep this file in the repo and update it whenever page inventory, shared runtime files, dependencies, behavior ownership, cleanup priorities, or important implementation details change.

## 1) Code Ownership Map

| Code area | Primary files | Current responsibility | If making codebase changes, update this file and why |
| --- | --- | --- | --- |
| HTML pages | `index.html`, `404.html`, `AHM_Website/pages/**/*.html` | Page content, metadata, per-page sections, and `data-include` placeholders. | Update when adding/removing pages, changing page-specific dependencies, or moving inline scripts/styles so future edits start in the right place. |
| Shared header/footer | `AHM_Website/components/organisms/header.html`, `footer.html` | Global navigation, footer CTA, footer links, social links, and shared site chrome. | Update when nav/footer links or partial paths change because every included page can be affected. |
| Shared head resources | `AHM_Website/components/organisms/head-resources.html` | Legacy/shared head include currently referenced by `404.html`. | Update if it is reused, removed, or replaced by direct head tags. |
| Design system CSS | `css/system.css` | Core tokens, layout utilities, cards, buttons, nav, footer, responsive behavior, and page-specific migrated styles. | Update when selectors are renamed or ownership moves into smaller CSS files. |
| Service/page CSS | `css/python-ai-sections.css`, `css/priority-sections.css`, `css/services.css`, inline `<style>` blocks | Extra styles for selected pages and older service styling. | Update when extracting inline styles or removing unused CSS files. |
| Include runtime | `js/partials.js` | Fetches `[data-include]` partials, tries fallback paths, caches fetched HTML, dispatches `includes:loaded`. | Update when include attributes, events, or caching behavior change because dependent JS listens for this event. |
| Main UI runtime | `js/main.js` | Theme toggle, nav init, active nav, metrics rendering, accordions, tabs, copy buttons, animation observers, form handling, count-up stats. | Update when adding/removing shared interactions or when pages need to load/unload `main.js`. |
| Deployment path runtime | `base-config.js`, `js/site-config.js` | Rewrites `href`, `src`, and `data-include` paths for base URL/deployment scenarios. | Update when deployment base path rules change. |
| Legacy runtime | `js/includes.js`, `js/site-phase3.js`, `js/phase3.js` | Older include/page enhancement scripts; only `includes.js` is currently referenced by `404.html`. | Update after any legacy cleanup so active and parked JS are not confused. |
| Assets | `images/**`, `AHM_Website/assets/icons/**`, `AHM_Website/assets/illustrations/**` | Logos, icons, social/contact imagery, and illustration SVGs. | Update when filenames, canonical asset folders, or optimized image formats change. |

## 2) Active Page Inventory

| Page | Purpose / current role | Key shared dependencies | If making codebase changes, update this file and why |
| --- | --- | --- | --- |
| `index.html` | Home page, services overview, pipeline, outcomes, partners, testimonials. | `system.css`, Font Awesome, Google Fonts, `base-config.js`, `site-config.js`, `partials.js`, `main.js`. | Update when homepage sections, global scripts, or top-level CTAs change because it is the main entry point. |
| `AHM_Website/pages/about/index.html` | About/company page. | `system.css`, Font Awesome, `base-config.js`, `site-config.js`, `partials.js`. | Update when about page layout/assets change so page inventory stays current. |
| `AHM_Website/pages/careers/index.html` | Careers page. | `system.css`, Font Awesome, `partials.js`. | Update when careers becomes hidden/active or gains custom dependencies. |
| `AHM_Website/pages/consultation/index.html` | Architecture review / consultation page. | `system.css`, Font Awesome, `partials.js`. | Update when lead workflow or form/CTA ownership changes. |
| `AHM_Website/pages/contact/index.html` | Contact page with custom inline styling and forms/trust sections. | `system.css`, Font Awesome, `base-config.js`, `site-config.js`, `partials.js`, `main.js`. | Update when contact form behavior, embedded styles, or script dependencies change. |
| `AHM_Website/pages/feedback/index.html` | Feedback page. | `system.css`, Font Awesome, `partials.js`. | Update when feedback flow or dependencies change. |
| `AHM_Website/pages/legal/privacy.html` | Privacy/legal page. | `system.css`, Font Awesome, `partials.js`. | Update when legal page path or shared legal pages change. |
| `AHM_Website/pages/partners/index.html` | Partner ecosystem page. | `system.css`, Font Awesome, `base-config.js`, `site-config.js`, `partials.js`, `main.js`. | Update when partners page becomes hidden/active or partner assets change. |
| `AHM_Website/pages/solutions/index.html` | Industry solutions and use-case walkthroughs. | `system.css`, Font Awesome, `partials.js`, inline page styles. | Update when solution sections or custom style ownership changes. |
| `AHM_Website/pages/services/index.html` | Services landing page. | `system.css`, Font Awesome, `partials.js`, inline page scripts. | Update when the service catalog changes so navigation docs stay accurate. |
| `AHM_Website/pages/services/data-profiling.html` | Data profiling service page with inline counters/donut script. | `system.css`, Font Awesome, `partials.js`. | Update when data profiling scripts/styles are moved or reused. |
| `AHM_Website/pages/services/informatica.html` | Informatica service page. | `system.css`, Font Awesome, `partials.js`. | Update when Informatica content, anchors, or dependency files change. |
| `AHM_Website/pages/services/python-ai.html` | Python and AI service page with extra section styles. | `system.css`, `python-ai-sections.css`, `priority-sections.css`, Font Awesome, `partials.js`. | Update when AI page-specific CSS is consolidated or renamed. |
| `AHM_Website/pages/services/snowflake.html` | Snowflake service page. | `system.css`, Font Awesome, `partials.js`. | Update when Snowflake page path or shared dependencies change. |
| `AHM_Website/pages/services/web-development.html` | Web development service page with inline CSS. | `system.css`, Font Awesome, `partials.js`. | Update when web page custom styles/scripts are extracted. |
| `404.html` | Error page using older include loader. | `head-resources.html`, `header.html`, `footer.html`, `js/includes.js`. | Update when 404 is migrated to the main stack or intentionally kept legacy. |

## 3) Shared JavaScript Hooks

| Hook / selector / event | Defined or used in | Current behavior | If making codebase changes, update this file and why |
| --- | --- | --- | --- |
| `[data-include]` | HTML pages, `js/partials.js`, `js/includes.js`, `js/site-config.js` | Marks placeholder elements whose HTML is fetched and injected. | Update if the include attribute changes because all shared partial loading depends on it. |
| `includes:loaded` | `js/partials.js`, `js/includes.js`, `js/main.js`, `js/site-config.js`, legacy scripts | Signals that partial injection has completed. | Update if event timing/name changes because nav/theme/path code listens for it. |
| `.ds-nav` / header markup | `header.html`, `js/main.js`, `css/system.css` | Shared navigation styling and behavior. | Update when header classes change because JS and CSS are tightly coupled to them. |
| Theme controls | `js/main.js`, `header.html`, `css/system.css` | Initializes and toggles theme state after partials load. | Update if theme markup or storage behavior changes. |
| `.ds-animate` | HTML pages, `js/main.js`, `css/system.css` | Animation observer target for reveal effects. | Update when animation classes are renamed or removed. |
| KPI accordions | `js/main.js`, consultation-style markup | Opens/closes `.kpi-accordion` panels. | Update when accordion HTML changes so accessibility state remains aligned. |
| API tabs / copy buttons | `js/main.js`, services pages | Handles tab switching and copy-to-clipboard buttons where matching markup exists. | Update when API/code samples change behavior or selectors. |
| Form submission hooks | `js/main.js`, contact/feedback/consultation forms if matching markup/action exists | Submits forms via `fetch` when configured and displays status. | Update when forms are added or moved so behavior ownership is clear. |
| `href`, `src`, `data-include` path rewriting | `js/site-config.js` | Rewrites paths after DOM load and after includes load. | Update if new path-bearing attributes are introduced. |

## 4) Page Dependency Matrix

| Page group | Active files | CSS / JS pattern | If making codebase changes, update this file and why |
| --- | --- | --- | --- |
| Root home | `index.html` | `system.css`, Font Awesome, Google Fonts, `base-config.js`, `site-config.js`, `partials.js`, `main.js`. | Update when root dependencies or homepage behavior changes. |
| About/contact/partners | `about/index.html`, `contact/index.html`, `partners/index.html` | Mostly `system.css`, Font Awesome, `base-config.js`, `site-config.js`, `partials.js`; contact/partners also load `main.js`. | Update when script inclusion is normalized or page-specific inline styles move. |
| Services landing and detail pages | `services/index.html`, `data-profiling.html`, `informatica.html`, `python-ai.html`, `snowflake.html`, `web-development.html` | `system.css`, Font Awesome, `partials.js`; Python/AI also uses `python-ai-sections.css` and `priority-sections.css`; some pages include inline scripts/styles. | Update when service pages gain shared JS, lose inline code, or new service pages are added. |
| Solutions | `solutions/index.html` | `system.css`, Font Awesome, `partials.js`, inline page CSS. | Update when inline solution styles move into CSS files. |
| Careers/consultation/feedback/legal | `careers/index.html`, `consultation/index.html`, `feedback/index.html`, `legal/privacy.html` | `system.css`, Font Awesome, `partials.js`; page content may include interactive markup handled by shared JS only if loaded. | Update when these pages become part of visible nav or adopt `main.js`. |
| Error page | `404.html` | `head-resources.html`, `header.html`, `footer.html`, `js/includes.js`. | Update if migrated to the same stack as the rest of the site. |

## 5) Files To Check Before Editing

| Change type | Check these files first | Why | If making codebase changes, update this file and why |
| --- | --- | --- | --- |
| Add a new page | Nearby `AHM_Website/pages/**/index.html`, `header.html`, `footer.html`, `site-config.js`, `partials.js` | New pages need consistent includes, nav links, and base-path behavior. | Add the page to this reference so it is discoverable. |
| Change navigation | `header.html`, `footer.html`, active page paths, `js/main.js` active-nav code | Nav is injected at runtime, so behavior may not exist in source page HTML. | Update shared partial and JS hook rows if classes or paths change. |
| Change page styling | `css/system.css`, page-specific CSS, inline styles in the target page | Styles are mixed between global CSS and page-level blocks. | Update CSS ownership rows so future cleanup does not duplicate work. |
| Change forms | Contact/feedback/consultation page HTML, `js/main.js`, `css/system.css`, `css/multi-step-forms.css` if activated | Form behavior may be shared or inline depending on the page. | Update form hook and dependency matrix rows after moving logic. |
| Change images/icons | HTML references, CSS background references, `images/**`, `AHM_Website/assets/icons/**` | There are duplicate icon folders and multiple logo assets. | Update asset inventory with canonical paths and optimized file sizes. |
| Remove old files | Search with `rg` before deleting: HTML, CSS, JS, Markdown docs | Some files look unused but may be staging/reference material. | Update unused inventory after deletion/archive so stale cleanup advice is removed. |

## 6) Current Cleanup Watchlist

| File / folder | Current status | Before changing | If making codebase changes, update this file and why |
| --- | --- | --- | --- |
| `js/includes.js` | Active only for `404.html`. | Migrate `404.html` first or keep this file. | Update legacy runtime rows after migration/removal. |
| `js/phase3.js` | Not found in active HTML script tags. | Search again before deletion and compare behavior against `main.js`. | Update watchlist after removal or reconnection. |
| `js/site-phase3.js` | Not found in active HTML script tags. | Confirm no deployment template injects it. | Update watchlist after removal or reconnection. |
| `css/multi-step-forms.css` | Not found in active HTML stylesheet links. | Confirm forms do not need it before removing. | Update watchlist if activated or deleted. |
| `css/services.css` | Exists, not found in active HTML stylesheet links during this pass. | Confirm no hidden page or generated build uses it. | Update CSS matrix if linked or removed. |
| `AHM_Website/components/atoms/**` and `molecules/**` | Not currently included by active `data-include` markup. | Decide whether these are future snippets or archive material. | Update component ownership after decision. |
| `images/icons/**` vs `AHM_Website/assets/icons/**` | Duplicate icon sets. | Pick canonical folder and update every reference. | Update asset rows after consolidation. |

## 7) Prioritized Cleanup / Improvement Opportunities

| Priority | Opportunity | Why it matters | If making codebase changes, update this file and why |
| --- | --- | --- | --- |
| 1 | Modernize `404.html` to use the same `partials.js` + `main.js` stack as other current pages, or document it as intentionally legacy. | Reduces duplicate include-loader behavior. | Update the root page and legacy JS rows after migration. |
| 1 | Consolidate duplicate icon folders. | Reduces maintenance and broken-path risk. | Update asset paths and duplicate-icon cleanup notes after references are changed. |
| 1 | Add `loading="lazy"` and dimensions where appropriate for non-critical images. | Improves render stability and page speed. | Update performance notes after image behavior changes. |
| 2 | Convert/compress large PNG/JPG assets to optimized formats where visual quality allows. | Reduces transfer size. | Update asset inventory with new formats/sizes. |
| 2 | Decide whether parked files (`phase3.js`, `site-phase3.js`, `multi-step-forms.css`, draft HTML) are archive material or active roadmap. | Prevents accidental deletion and confusion. | Update unused inventory after the decision. |
| 3 | Gate verbose logs in `js/partials.js` behind a debug flag. | Keeps production console cleaner. | Update runtime JS notes if logging behavior changes. |

## 8) Quick Verification Commands

Run these after notable codebase changes and update this file if results differ:

```powershell
rg --files
rg -n "<link|<script|data-include|<img" --glob "*.html"
rg -n "partials\.js|main\.js|site-config\.js|includes\.js|site-phase3\.js|phase3\.js" --glob "*.html" --glob "*.js"
rg -n "css/|js/|images/|AHM_Website/assets|components/" --glob "*.html" --glob "*.css" --glob "*.js"
Get-ChildItem -Recurse -File -Include *.html,*.css,*.js,*.scss | Select-Object FullName,Length | Sort-Object FullName
Get-ChildItem -Recurse -File images,AHM_Website/assets | Sort-Object Length -Descending | Select-Object -First 20 FullName,Length
```


## Codebase Summary & Change Log Policy

### Purpose

This section maintains a high-level summary of the entire codebase and enforces a strict change tracking mechanism. Any modification to the code must be reflected here to preserve system understanding, traceability, and correctness.

### What Must Be Updated

For every code change, update this section with:

* **Summary of Change**
  Concise description of what was modified (feature, bug fix, refactor, config, etc.)

* **Reason for Change**
  Why the change was necessary (bug resolution, performance improvement, requirement update, etc.)

* **Impact Scope**
  Modules, services, or components affected

* **Validation / Double Check**
  Evidence that the change was verified:

  * Tests added/updated
  * Manual validation steps
  * Edge cases considered

### Rules

* No code change is complete without updating this section
* Entries must be added immediately after the change is finalized
* Avoid vague descriptions; be explicit and technical
* If rollback occurs, it must also be logged with reasoning
* Keep entries chronological (latest at top)

### Example Entry

```
### [YYYY-MM-DD] - Refactor Authentication Flow

- Summary: Replaced token-based session handling with JWT-based authentication
- Reason: Improve scalability and statelessness of auth system
- Impact: auth_service, user_service, middleware
- Validation:
  - Unit tests updated for token validation
  - Manual login/logout flow tested
  - Expiry and invalid token cases verified
```

### Enforcement

Any pull request or commit that alters logic, structure, or behavior must include a corresponding update in this section. Changes without documentation are considered incomplete.
