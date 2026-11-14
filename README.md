# ₱resyo Check

A static web app (plain HTML, CSS and JavaScript, no build step) for comparing grocery prices and ratings across stores in the Philippines.

## Run it

- **Hosting:** upload the whole folder to GitHub Pages or any static host. Every link between pages is relative, so it also works in a sub-folder.
- **Locally:** from this folder run `python3 -m http.server 8000`, then open <http://localhost:8000>.
  Opening `index.html` by double-click may work, but camera scanning and sign-up/log-in need a secure page (`https://` or `localhost`).

## Folder map

| File | What it is |
|---|---|
| `index.html` | Home: login screen, scan/search, filters, add a product |
| `signup.html` | Sign-up form |
| `compare.html?code=<barcode>` | One product, every store that sells it |
| `product.html?code=<barcode>&s=<store index>` | One product at one store: details, reviews, promo |
| `manufacturer.html` / `?name=<manufacturer>` | Manufacturer list, or one manufacturer's products |
| `store.html` / `?name=<store>` / `&i=<store index>` | Store list, a store's locations, one location's items |
| `css/app.css` | All styles (colors are variables at the top) |
| `js/data.js` | Sample data (stores, products, details, reviews) |
| `js/shared.js` | Helpers used by every page (storage, formatting, promos, menu bar, accounts) |
| `js/theme.js` | Light/dark button and palette picker |
| `js/home.js`, `signup.js`, `compare.js`, `product.js`, `manufacturer.js`, `store.js` | The code of each page |

Each HTML page is a small shell. It loads, in this order: `data.js` → `shared.js` → the page's own file → `theme.js`. **The order matters** because later files use things defined by earlier ones. Each page draws itself into `<div id="app">` by building HTML text and setting `innerHTML`.

## How data works

`js/data.js` holds three lists that line up by position:

- `STORES[i]` = `{ n: name, l: area, b: branch/street }`
- `P[k]` = `[barcode, name, size, prices[], ratings[], promos[]]` where each of the three lists has one slot per store (same order as `STORES`; `null` price = not sold there)
- `M[k]` = details for `P[k]`: `{ n, b: brand, m: manufacturer, c: categories, o: country, t: tags, col }`

Anything users add or tag is saved in the browser (`localStorage`, key `pc_db`) by `saveDB()` and loaded by `shared.js` on every page. **After you edit `data.js`, raise `DBV` in `shared.js`**, otherwise browsers that already saved data keep showing the old data.

A promo is `{ active, mechanics, until, mode, price, pct, by }`. It counts as active through its `until` date and is removed automatically afterwards.

## Where to change things

| I want to… | Edit |
|---|---|
| Change colors | `css/app.css` variables (`--green` is the main color, `--bg` background, …). Palette presets: `palettes` in `js/theme.js` |
| Add a sample product or store | `js/data.js` (add to `STORES`, `P`, `M` in the same position), then raise `DBV` |
| Add or rename a menu item | `navbar()` in `js/shared.js`, then create the page |
| Change how names are shown ("Juan D. S.") | `displayName()` in `js/shared.js` |
| Change promo rules or the promo form | `isPromoActive()`, `promoFields()`, `readPromo()` in `js/shared.js` |
| Change what the product page shows | `render()` in `js/product.js` |
| Change the duplicate-product check | `sim()` and `tryAdd()` in `js/home.js` (threshold `0.45`) |

Handy habits: wrap anything a user typed in `esc(...)` before putting it in HTML; call `saveDB()` after changing `STORES`, `P` or `M`; page links come from `urlCompare()`, `urlProduct()`, `urlMfr()`, `urlStore()`.

## Browser storage keys

`pc_db` products/stores · `pc_accounts` accounts · `pc_theme`, `pc_palette` look · `pc_user`, `pc_promo` (per tab) current user and promo toggle.

## Limits to know about

- **No server.** Data and accounts live only in the visitor's browser, so nothing is shared between people or devices. Passwords are hashed (PBKDF2) but this is **demo security**; real accounts, shared prices and reviews need a backend.
- Prices, ratings, reviews and barcodes in `data.js` are sample data.
- `css/app.css` grew in layers: later rules at the bottom override earlier ones. If a style does not apply, search the selector and check the last rule. Merging those layers is a good future clean-up.
- Page HTML is built from text in JavaScript. That is plain but verbose; moving to templates would be a possible next step.
