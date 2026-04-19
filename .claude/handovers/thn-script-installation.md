# THN (The Hotels Network) Script Installation

## Context

Chamade is starting a partnership with The Hotels Network (THN). Their scripts need to be installed on the Chamade website. Jeffrey is waiting on the script IDs from his THN contact.

## What to install

THN provides up to 3 scripts. Confirm with Jeffrey which products were purchased:

### 1. THN Script (required)
- Place inside `<body>` on **every page**
- Has `async` attribute
```html
<script src='https://www.thehotelsnetwork.com/js/loader.js?property_id=XX' async></script>
```
The URL parameter can be `property_id`, `site_id`, `account_key`, or `partnership_id` — use whatever THN provided.

### 2. Connect Script (likely — for GEO product)
- Place on **every page**, same as THN script
- Has `async` attribute
- Per-property script (individual `site_id`)
- Must run **independently from consent manager** (no personal data collected)
```html
<script src='https://www.thehotelsnetwork.com/js/connect.js?site_id=XX' async></script>
```

### 3. Swaps Script (only if purchased)
- Place inside `<head>`, **as high as possible**
- **No** `async` or `defer` — must be render-blocking
- Single script for the entire account (not per-property)
```html
<script src='https://www.thehotelsnetwork.com/js/swaps.js?account_id=XX'></script>
```

## Website structure

Static HTML site — no framework, no build step. Each page is self-contained with inline styles.

### Pages to update (15 total)

**Main site (9 pages across 3 languages):**
- `/en/index.html`, `/en/co2.html`, `/en/terms.html`
- `/fr/index.html`, `/fr/co2.html`, `/fr/conditions.html`
- `/nl/index.html`, `/nl/co2.html`, `/nl/voorwaarden.html`

**Root router:**
- `/index.html` (language redirect only — probably skip this one)

**Guest portal (6 pages per language, 18 total) — ask Jeffrey if needed:**
- `/guest/{en,fr,nl}/index.html`
- `/guest/{en,fr,nl}/hotel.html`
- `/guest/{en,fr,nl}/breakfast.html`
- `/guest/{en,fr,nl}/parking.html`
- `/guest/{en,fr,nl}/transport.html`
- `/guest/{en,fr,nl}/city.html`
- `/guest/{en,fr,nl}/contact.html`

### Where in each file

- Existing third-party script: Google Analytics gtag in `<head>`
- **Swaps** (if applicable): right after the GA gtag script in `<head>`, before any other tags
- **THN + Connect**: just before `</body>` or right after the GA script in `<body>`

## Open questions

1. Which IDs did THN provide? (`property_id`, `site_id`, etc.)
2. Which products: just THN + Connect, or also Swaps?
3. Should guest portal pages (`/guest/...`) also get the scripts?

## Reference

The full installation guide PDF is in Jeffrey's files: "THN - Installing THN script guidelines.pdf"
