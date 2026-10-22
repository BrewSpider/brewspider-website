# Homepage redesign: hand-off

Rebuild the brewspider.com homepage to match `_design/option-b.html` (open it in a browser straight from disk). Direction: option B. The design canvas with the notes is at https://claude.ai/artifact/XaoCLdzZzgdxvA9vGoCxnw (row "Option B").

Jekyll ignores folders that start with `_`, so nothing in `_design/` gets published.

## Ground rules

- **Stay on Jekyll + Netlify.** Keep `jekyll-seo-tag`, `jekyll-sitemap`, `netlify.toml` (headers, build), the Cloudflare analytics slot (`site.analytics.cloudflare_token`), `legal.md`, `404.html` and `robots.txt`.
- **Copy stays in `_data/sitetext.yml`** (change its keys to fit the new sections), so wording edits don't touch templates.
- **No price, no launch date** anywhere (Nader's decision).
- **Don't invent facts.** The reference has placeholders: `[SUPPORTED SMART PLUGS]`, `[FITTING SIZE]`, `[MANUAL URL]`, `[COMPANY NAME, ORG. NUMBER]`. Don't publish brackets. Leave the two FAQ items that need them, the manual link and the company line out of the page (commented out in `sitetext.yml`), and list them in the PR.
- Work on a new branch from this one (e.g. `redesign`), in small commits, and open a PR to `main`. Don't merge it: Nader reviews the Netlify deploy preview first.

## What to build

The sections, top to bottom, as in the reference: sticky nav, hero (headline, launch-list email form, product render with a live-readings card), highlights strip, "Sensors in, heater, fridge and valve out" diagram, three feature cards, app section, How it works (3 steps), brewing apps, Who makes it, FAQ, launch-list band, footer.

- **Remove the Agency theme stack:** `bootstrap.min.css`, `bootstrap.bundle.min.js`, `jquery.min.js`, `jquery.easing.min.js`, `agency.min.js`, `clients.js`, and the `.map` files. Replace them with one hand-written stylesheet built from `_sass` (rewrite `_sass` for the new design) and one small plain-JS file (under 2 kB) that does:
  - the mobile menu toggle (`<button aria-expanded>`), at phone width;
  - the form submit;
  - one `IntersectionObserver` that adds a class to start the animations when a section scrolls into view.
- **Smooth scroll** with CSS `scroll-behavior: smooth`, plus `scroll-margin-top` for the sticky nav.
- **Colours:** dark `#1C0B00`, brown `#2B1100`, cream `#FFF8F2`, peach `#FFE6D5`, orange `#D45500` (decor only), button orange `#B84A00` (white text passes contrast), gold `#E0980B`. Put them in CSS custom properties.
- **Fonts:** Space Grotesk (headings, 500/700) and Inter (body, 400/500/600). Self-host them as latin-subset variable `woff2` with their OFL licence files, like the current fonts in `assets/fonts`. Preload the two the hero uses. Delete the old Montserrat, Roboto Slab, Noto Serif and Nova Round files once nothing uses them (the logo is an image, so it doesn't need Nova Round).
- **Animations:** take the keyframes from the reference (pulse dot, floating render, chart line drawing, flowing connector lines, valve vent puffs, glow). Animate only `transform`, `opacity` and SVG stroke. Turn all of them off under `@media (prefers-reduced-motion: reduce)`.
- **Images:**
  - `assets/img/product/product.webp` is the hero render.
  - `assets/img/product/device-with-ispindel.webp` is the real device photo, already cleaned up and recoloured (it's the diagram centre).
  - `assets/img/product/app-status.webp` is the app screen.
  - Set `width`/`height` on every `<img>`, use `loading="lazy"` below the fold and `fetchpriority="high"` on the hero image.
  - The AI pictures are no longer used: `header*.webp`, `contact.webp`, `mascot.webp`, `timeline/*`, `app.webp` if nothing else uses it. Remove them in their own commit, after a grep shows they aren't referenced. Keep `header-thumbnail.jpg` for social cards unless you make a better one from the hero.
- **Launch list:** a Netlify form named `launch-list` with fields `email` and the honeypot (`netlify-honeypot`) plus the hidden `form-name` input. Use the same name for both forms on the page (hero and bottom band). Submit with `fetch` and show an inline success or error message (`aria-live`). Each form needs a real `<label>` (visually hidden is fine).
- **Contact form:** keep the existing Netlify form `contact-brewspider` (name, email, optional phone, message), restyled, on its own `/contact/` page. Link it from the footer and from "Questions?" in the bottom band. Don't rename the form: Netlify keeps its submissions under that name.
- **Privacy:** the launch list is new personal data. Add a "Launch list" section to `legal.md` covering:
  - what is collected (the email address);
  - why (one email when pre-orders open and occasional build updates);
  - the legal basis (consent, GDPR article 6.1 a);
  - that the data is held at Netlify (same as for the contact form);
  - how to unsubscribe (reply or email `contact@brewspider.com`);
  - how long it's kept (until the person unsubscribes, or [RETENTION, ask Nader]).

  Flag this text in the PR for Nader to review.
- **The "Updates" items** (`_portfolio/`, modals with emoji) leave the homepage. Keep the files; ask Nader in the PR whether they become a dated "News" page or get dropped.
- **`legal.md`, `/contact/` and `404.html`** use a simple page layout in the new style (nav plus footer).

## Done means

- `bundle exec jekyll build` runs with no warnings, and no Bootstrap or jQuery is left in `_site` (grep for them).
- The page looks right at 390, 768 and 1440 px wide. Check with headless Chromium (Playwright) screenshots and attach them to the PR.
- The homepage's first load is under about 200 kB in total (measure the `_site` output or with Lighthouse if it's available); aim for Lighthouse 95+ in all four categories.
- Keyboard: every link, button and form field is reachable with Tab and has a visible focus style; the mobile menu works with the keyboard.
- The PR lists what wasn't tested, which is always the real form submission (only Netlify can test that, on the deploy preview), and the open questions: placeholders, retention, Updates page.
