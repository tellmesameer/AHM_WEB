# Phase 3 Component Implementation

This folder contains a small, self-contained implementation of Phase 3 (Atomic Design) components and a demo page.

Files added:
- `components/atoms/*` – small atom snippets (button, input, icon)
- `components/molecules/*` – service card and form-group
- `components/organisms/*` – hero and header (navigation)
- `pages/phase3-demo.html` – demo page composing the components
- `css/phase3.css` – scoped CSS for the demo
- `js/phase3.js` – tiny JS for nav toggle and form submit handling

How to test:
1. Open `AHM_Website/pages/phase3-demo.html` in a browser (serve from root to allow asset paths).
2. Resize the viewport to observe grid changes at 600px and 900px breakpoints.
3. Click the menu toggle on small screens to open/close navigation.

Notes:
- Components are plain HTML snippets to keep integration flexible with server-side includes or templating systems.
- Image placeholders referenced in `service-card.html` should be replaced with real assets in `/images/`.
