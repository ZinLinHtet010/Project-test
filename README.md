# AURA Travel v1

A modern, responsive single-page luxury travel landing page built with vanilla HTML, CSS, and JavaScript.

## Run locally

1. Open `index.html` directly in a browser, or
2. Serve with a local static server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Project structure

- `index.html` - semantic page structure and content sections.
- `styles.css` - design system tokens, layout, responsive behavior, and animations.
- `script.js` - navigation behavior, reveal effects, parallax accent, and form validation.
- `assets/img/hero.svg` - hero visual placeholder.
- `assets/img/santorini.svg` - destination placeholder.
- `assets/img/kyoto.svg` - destination placeholder.
- `assets/img/marrakech.svg` - destination placeholder.

## Stable IDs and hooks

Section anchors (for deep links/navigation):
- `#home`
- `#destinations`
- `#experiences`
- `#testimonials`
- `#plan`

JS hooks:
- `data-nav-link`
- `data-reveal`
- `data-parallax`
- `data-inquiry-form`

## Theme tokens

Edit these values in `:root` inside `styles.css`:
- `--bg`
- `--surface`
- `--text`
- `--muted`
- `--accent`
- `--accent-2`
- `--radius`
- `--shadow`

## Replace placeholder content

- Update headline and body copy in `index.html`.
- Swap images in `assets/img/` while keeping filenames or update image paths.
- Keep form field names unchanged if you plan to attach a backend later:
  - `name`, `email`, `destination_interest`, `travel_month`, `group_size`, `message`

## Notes

- Current form submission is frontend-only and does not send data to a server.
- Non-hero images use lazy loading.
- Reduced motion preferences are respected.
