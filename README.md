# Worthback website

Static website for Worthback (worthback.in). Plain HTML, CSS and JavaScript — no build step, no database, no admin dashboard.

Every page links to every other page (header menu, footer and policy sidebar) using relative links, so the site works on Vercel, GitHub Pages, or opened straight from the folder.

All pages link to each other with relative links, so the site also works when you open `index.html` straight from the folder.

## Add or change offers
Edit **`assets/js/offers.js`**. Instructions and a copy-ready template are at the top of that file.
- Offers appear automatically on `/offers`; the first three also show on the home page.
- Offers past their `validTill` date hide themselves.
- Links must start with `https://`.

## Deploy (Vercel)
1. Upload this folder to a GitHub repository.
2. In Vercel: **Add New → Project**, import the repository, framework preset **Other**, no build command, output directory `.` (root).
3. Add the domain `worthback.in` in **Project → Settings → Domains**.

`vercel.json` turns on clean URLs (`/offers` instead of `/offers.html`) and adds security headers.

## Files
- `index.html`, `offers.html`, `how-it-works.html`, `about.html`, `contact.html`
- `privacy-policy.html`, `terms.html`, `cashback-policy.html`, `refund-policy.html`, `404.html`
- `assets/css/style.css` — all styles (colours are variables at the top)
- `assets/js/main.js` — menu, offer cards and filtering, contact form
- `assets/js/offers.js` — your offers
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, favicons and `assets/img/og-image.png` (social sharing image)

## Contact form
The form checks the fields, then opens the visitor's email app with a message addressed to support@worthback.in. Nothing is stored on the website. If no email app opens, the visitor can copy the message with one click.

## Fonts
Lora and Inter, self-hosted under the SIL Open Font License (see `assets/fonts/`).
