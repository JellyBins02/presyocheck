// shared.js - helpers used by EVERY page. Loaded after data.js.
//
//   1. Storage      saving products and remembering who is logged in
//   2. Small helpers  formatting, safe text, links between pages
//   3. Promos       promo prices and the promo form
//   4. Navigation   greeting row and menu bar
//   5. Accounts     sign up / log in (demo only, see README)

// ============================================================
// 1. STORAGE
// ============================================================

// Data version. Raise this number whenever you change data.js, so browsers drop their old saved copy.
var DBV = 2;

// Load the saved copy (if any) over the sample data from data.js.
try {
  var _s = JSON.parse(localStorage.getItem("pc_db") || "null");
  if (_s && _s.v === DBV) {
    STORES = _s.S;
    P = _s.P;
    M = _s.M;
  }
} catch (e) {
}

// Saves stores/products to localStorage so every page sees changes. Call after editing STORES, P or M.
function saveDB() {
  try {
    localStorage.setItem("pc_db", JSON.stringify({ v: DBV, S: STORES, P, M }));
  } catch (e) {
  }
}
// Who is logged in. Kept per browser tab (sessionStorage). null = nobody chose yet.
function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem("pc_user") || "null");
  } catch (e) {
    return null;
  }
}
// Remembers the logged-in user (or forgets them when passed null).
function setUser(u) {
  try {
    if (u) sessionStorage.setItem("pc_user", JSON.stringify(u));
    else sessionStorage.removeItem("pc_user");
  } catch (e) {
  }
}
var user = getUser() || { guest: true };
// Whether the "On Promo" toggle is on (shared by home and comparison pages).
function getPromoFilter() {
  try {
    return sessionStorage.getItem("pc_promo") === "1";
  } catch (e) {
    return false;
  }
}
// Saves the "On Promo" toggle.
function setPromoFilter(v) {
  try {
    sessionStorage.setItem("pc_promo", v ? "1" : "0");
  } catch (e) {
  }
}

// ============================================================
// 2. SMALL HELPERS
// ============================================================

// Reads a value from the page address, e.g. qs("code") for ?code=123.
function qs(k) {
  return new URLSearchParams(location.search).get(k);
}
// Finds a product row in P by barcode. Returns null when not found.
function findP(c) {
  c = (c || "").trim();
  for (var i = 0; i < P.length; i++) if (P[i][0] === c) return P[i];
  return null;
}
// Link to the comparison page of a product.
function urlCompare(c) {
  return "compare.html?code=" + encodeURIComponent(c);
}
// Link to the product page: product barcode + store index s.
function urlProduct(c, s) {
  return "product.html?code=" + encodeURIComponent(c) + "&s=" + s;
}
// Reads a text box: trimmed, with < > " removed.
function V(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim().replace(/[<>"]/g, "") : "";
}
// Formats a number as pesos, e.g. 18.5 -> ₱18.50.
function peso(n) {
  return "₱" + (n % 1 ? n.toFixed(2) : n);
}
// Rating text, e.g. "★ 4.5 / 5".
function stars(r) {
  return r ? "★ " + r.toFixed(1) + " / 5" : "No rating yet";
}
// Makes text safe to place inside HTML. Use it on anything a user typed.
function esc(s) {
  return String(s).replace(/[&<>"]/g, function(c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
// Today as yyyy-mm-dd in the visitor's local time.
function today() {
  var d = /* @__PURE__ */ new Date(), p = function(n) {
    return (n < 10 ? "0" : "") + n;
  };
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
// True while a promo exists and its "until" date has not passed.
function isPromoActive(pr) {
  return !!(pr && pr.active && (!pr.until || pr.until >= today()));
}
// yyyy-mm-dd -> "Nov 20, 2026".
function fmtDate(s) {
  var a = String(s).split("-");
  return new Date(+a[0], a[1] - 1, +a[2]).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}
// Placeholder product picture (a colored can with the brand name).
function img(m) {
  return '<svg viewBox="0 0 100 110" role="img" aria-label="Product image placeholder">' +
      '<rect x="15" y="15" width="70" height="80" rx="8" fill="' + m.col +
      '"/><ellipse cx="50" cy="15" rx="35" ry="7" fill="#d5dbd7"/><rect x="15" y="45" width="70" height="26" fill="#fff" opacity=".92"/>' +
      '<text x="50" y="62" text-anchor="middle" font-size="11" font-weight="700" fill="#16261c">' +
      esc(m.b) + "</text></svg>";
}
// HTML for a product's reviews.
function revs(m) {
  var L = m.rv || RV;
  if (!L.length) return '<div class="r mute">No reviews yet.</div>';
  return L.map(function(r) {
    return '<div class="r"><b>' + esc(r[0]) + '</b> <span class="stars">' +
        "★".repeat(r[1]) + "</span><br>" + esc(r[2]) + "</div>";
  }).join("");
}
// ---------- promo pricing + promo form (shared by index.html and product.html) ----------

// ============================================================
// 3. PROMOS
// ============================================================

// The promo price when it is really lower than the regular price, else null.
function promoPrice(pr, orig) {
  return isPromoActive(pr) && pr.price != null && pr.price < orig ? pr.price : null;
}
// The price a shopper pays right now (promo price if there is one).
function effPrice(p, s) {
  var x = promoPrice(p[5][s], p[3][s]);
  return x != null ? x : p[3][s];
}
// Price as HTML. On promo: old price crossed out + promo price.
function priceHTML(p, s) {
  var x = promoPrice(p[5][s], p[3][s]);
  return x != null ? '<s class="old">' + peso(p[3][s]) + '</s> <span class="now">' +
      peso(x) + "</span>" : peso(p[3][s]);
}
// HTML for the promo form fields (mechanics, until date, price option).
function promoFields() {
  return '<label>Promo mechanics<input class="in" id="pMech" maxlength="80" placeholder="e.g., Buy 1 Take 1">' +
      '</label><label>Promo valid until<input class="in" id="pUntil" type="date" min="' +
      today() + '"></label><fieldset class="pm"><legend>Promo price</legend><label class="rd">' +
      '<input type="radio" name="pMode" value="same" checked> Same price</label>' +
      '<label class="rd"><input type="radio" name="pMode" value="price"> New price</label>' +
      '<label class="rd"><input type="radio" name="pMode" value="pct"> Percent off</label>' +
      '<label id="pPriceW" hidden>Promo price (₱)<input class="in" id="pPrice" type="number" step="0.01" min="0.01">' +
      '</label><label id="pPctW" hidden>Percent off (%)<input class="in" id="pPct" type="number" step="1" min="1" max="99">' +
      '</label></fieldset><p class="msg" id="perr" role="alert"></p>';
}
// Reads and checks the promo form. Returns {e: error message} or {p: promo}.
function readPromo(orig, by) {
  var mech = V("pMech"), u = V("pUntil"), c = document.querySelector('input[name="pMode"]:checked'), mode = c ? c.value : "same";
  if (!mech || !u) return { e: "Add the promo mechanics and the until date." };
  if (u < today()) return { e: "The until date can’t be in the past." };
  var pr = { active: true, mechanics: mech, until: u, by, mode, price: null };
  if (mode === "price") {
    var x = parseFloat(V("pPrice"));
    if (!(x > 0)) return { e: "Enter the promo price." };
    if (orig && x >= orig) return { e: "The promo price must be lower than the regular price (₱" +
        orig + "). Choose “Same price” if it didn’t change." };
    pr.price = Math.round(x * 100) / 100;
  }
  if (mode === "pct") {
    var q = parseFloat(V("pPct"));
    if (!(orig > 0)) return { e: "Enter the regular price first." };
    if (!(q > 0 && q < 100)) return { e: "Enter a percentage between 1 and 99." };
    pr.pct = q;
    pr.price = Math.round(orig * (1 - q / 100) * 100) / 100;
  }
  return { p: pr };
}
document.addEventListener("change", function(e) {
  if (e.target.name === "pMode") {
    var a = document.getElementById("pPriceW"), b = document.getElementById("pPctW");
    if (a) a.hidden = e.target.value !== "price";
    if (b) b.hidden = e.target.value !== "pct";
  }
});
// promos are removed automatically once their "until" date has passed
(function() {
  var ch = false;
  P.forEach(function(r) {
    (r[5] || []).forEach(function(pr, i) {
      if (pr && pr.until && pr.until < today()) {
        r[5][i] = null;
        ch = true;
      }
    });
  });
  if (ch) saveDB();
})();
// ---------- navigation bar + page links ----------

// ============================================================
// 4. NAVIGATION
// ============================================================

// Link to a manufacturer page.
function urlMfr(n) {
  return "manufacturer.html?name=" + encodeURIComponent(n);
}
// Link to a store page.
function urlStore(n) {
  return "store.html?name=" + encodeURIComponent(n);
}
// Greeting row + menu bar. Pass the active menu: "home", "mfr" or "store".
function navbar(a) {
  var L = [["home", "index.html", "Home"], ["mfr", "manufacturer.html", "Manufacturers"], ["store", "store.html", "Stores"]];
  return userbar() + '<nav class="nav" aria-label="Main"><span class="brand"><span class="pg">₱</span>resyo Check</span>' +
      L.map(function(l) {
    return '<a href="' + l[1] + '"' + (l[0] === a ? ' aria-current="page"' : "") +
        ">" + l[2] + "</a>";
  }).join("") + "</nav>";
}
// Lowest current price of product i across all branches.
function lowest(i) {
  var v = null;
  P[i][3].forEach(function(x, s) {
    if (x != null) {
      var e = effPrice(P[i], s);
      if (v == null || e < v) v = e;
    }
  });
  return v;
}
// Full location text of store index i: branch + area.
function locName(i) {
  var s = STORES[i];
  return (s.b ? s.b + ", " : "") + s.l;
}
// The "Hi, Name!" row with Log out (or Log in for guests).
function userbar() {
  return '<div class="who"><span>Hi, ' + (user.guest ? "Guest" : esc(user.name)) +
      "!</span>" + (user.guest ? '<a class="link" href="index.html#signin">Log in existing user</a>' : '<button class="link" type="button" data-a="logout">Log out</button>') +
      "</div>";
}
document.addEventListener("click", function(e) {
  var b = e.target.closest && e.target.closest('button[data-a="logout"]');
  if (b && typeof go !== "function") {
    setUser(null);
    location.href = "index.html";
  }
});
// ---------- accounts (browser-only demo: no server) ----------

// ============================================================
// 5. ACCOUNTS (demo only)
// ============================================================

// All saved accounts (list). Browser-only demo storage.
function accounts() {
  try {
    return JSON.parse(localStorage.getItem("pc_accounts") || "[]");
  } catch (e) {
    return [];
  }
}
// Saves the account list.
function saveAccounts(a) {
  try {
    localStorage.setItem("pc_accounts", JSON.stringify(a));
  } catch (e) {
  }
}
// "Juan Dela Cruz Santos" -> first name + middle initial + last-name initial: "Juan D. S."
// "Juan" + "Dela" + "Santos" -> "Juan D. S." (first name, middle initial, last initial).
function displayName(first, mid, last) {
  return first + (mid ? " " + mid.charAt(0).toUpperCase() + "." : "") +
      " " + last.charAt(0).toUpperCase() + ".";
}
// Bytes -> hex text (used for password hashes).
function hex(b) {
  return Array.from(new Uint8Array(b)).map(function(x) {
    return (x < 16 ? "0" : "") + x.toString(16);
  }).join("");
}
// Salted PBKDF2 hash of a password. Passwords are never stored as typed.
async function hashPw(pw, salt) {
  var e = new TextEncoder(), k = await crypto.subtle.importKey("raw", e.encode(pw), "PBKDF2", false, ["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: e.encode(salt), iterations: 1e5, hash: "SHA-256" }, k, 256));
}
// Validates the sign-up form and saves the account. Returns {e} or {user}.
async function signUp(f) {
  var nm = /^[\p{L}][\p{L}\s'.\-]{0,39}$/u;
  if (!nm.test(f.first)) return { e: "Enter a valid first name." };
  if (f.mid && !nm.test(f.mid)) return { e: "Enter a valid middle name." };
  if (!nm.test(f.last)) return { e: "Enter a valid last name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return { e: "Enter a valid email address." };
  if (!/^[A-Za-z0-9_.]{3,20}$/.test(f.username)) return { e: "Username must be 3 to 20 letters, numbers, dots or underscores." };
  if (f.password.length < 8) return { e: "Password must be at least 8 characters." };
  if (!(window.crypto && crypto.subtle)) return { e: "Signing up needs a secure (https) page." };
  var A = accounts(), u = f.username.toLowerCase(), em = f.email.toLowerCase();
  if (A.some(function(a) {
    return a.u === u;
  })) return { e: "That username is taken." };
  if (A.some(function(a) {
    return a.email === em;
  })) return { e: "An account with that email already exists." };
  var salt = hex(crypto.getRandomValues(new Uint8Array(16))), name = displayName(f.first, f.mid, f.last);
  A.push({ u, username: f.username, email: em, first: f.first, mid: f.mid, last: f.last, name, salt, hash: await hashPw(f.password, salt) });
  saveAccounts(A);
  return { user: { guest: false, name, username: f.username } };
}
// Checks username + password. Returns {e} or {user}.
async function logIn(un, pw) {
  var a = accounts().filter(function(x) {
    return x.u === un.toLowerCase();
  })[0], bad = { e: "Wrong username or password." };
  if (!(window.crypto && crypto.subtle)) return { e: "Logging in needs a secure (https) page." };
  if (!a || await hashPw(pw, a.salt) !== a.hash) return bad;
  return { user: { guest: false, name: a.name, username: a.username } };
}
