# Copilot Instructions – Dor Niv Running Coach Website

## Project Overview
Hebrew RTL landing page for "דור ניב" (Dor Niv), a long-distance running coach with the brand "Break Your Limits". Single-page marketing site with lead capture form.

## Tech Stack & Architecture
- **Pure HTML/CSS/JS** – No frameworks, no build tools, no dependencies
- **Single-page structure**: `index.html` (main content), `styles.css`, `script.js`
- **Static hosting ready** – Open `index.html` directly in browser for development

## Critical Conventions

### RTL & Hebrew Language
- Document is `lang="he-IL" dir="rtl"` – maintain RTL layout throughout
- Use `inset-inline-start/end` instead of `left/right` for RTL-safe positioning
- All user-facing text must be in Hebrew (except brand "Break Your Limits")
- Font: "Assistant" (Google Fonts) – Hebrew-optimized

### CSS Architecture
```css
/* Color system via CSS custom properties in :root */
--bg: #0b0f11;           /* Dark background */
--accent: #4e9ea5;       /* Primary teal accent */
--accent-2: #6cc7cf;     /* Lighter teal for gradients */
```
- Gradients use `linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)`
- Dark theme only – no light mode
- Responsive via CSS Grid + `clamp()` for fluid typography
- Mobile nav toggle at `max-width: 900px` breakpoint

### Component Patterns
- **Sections**: Use `.section` class, alternating with `.section.alt` for visual rhythm
- **Cards**: `.step-card`, `.feature`, `.result-card` with consistent border/shadow
- **Buttons**: `.btn.primary` (gradient) or `.btn.ghost` (transparent)
- **Photo placeholders**: `.photo-placeholder` with `::before` content – replace with actual `<img>` when assets ready

### JavaScript Patterns
- Vanilla JS only, no modules, `defer` loaded
- Mobile nav: `data-nav-toggle` and `data-nav` attributes for JS hooks
- Form submission: Client-side validation + optional WhatsApp redirect via `WHATSAPP_NUMBER` constant
- Accessibility: `aria-expanded`, focus management, Escape key handling

### Form Integration
The lead form (`#leadForm`) currently shows success message only. To enable WhatsApp:
```js
const WHATSAPP_NUMBER = "972501234567"; // Set number in script.js
```

## File Reference
| File | Purpose |
|------|---------|
| `index.html` | Complete page structure with semantic sections |
| `styles.css` | All styling (~870 lines), mobile-first responsive |
| `script.js` | Nav toggle, form handling, dynamic year |
| `content.txt` | Source copy/notes from client (not used in site) |
| `images/logo.jpg` | Brand logo |

## Common Tasks

### Adding a new section
1. Copy existing `<section class="section">` pattern from `index.html`
2. Alternate `.section` / `.section.alt` classes
3. Use `.container` wrapper for consistent max-width

### Adding trainee results/photos
Replace `.photo-placeholder` elements in `#results` section with actual images:
```html
<img src="images/trainee-name.jpg" alt="שם המתאמן - שיא אישי 10K" />
```

### Connecting form to backend
Replace the client-side success message in `setupLeadForm()` with actual API call or integrate with CRM/WhatsApp Business API.

## Accessibility Notes
- Skip link: `.skip-link` for keyboard navigation
- All sections have `aria-label` in Hebrew
- Form inputs have proper `<label>` associations
- `prefers-reduced-motion` respected for scroll behavior
