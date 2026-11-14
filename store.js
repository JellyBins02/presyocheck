// store.js - store.html: the list of stores, or one store's locations and what each sells.
// Wrapped in (function(){ ... })() for the same window.name reason as manufacturer.js.

(function() {
  var app = document.getElementById("app"), name = qs("name"), bi = qs("i");
  bi = bi === null || bi === "" ? -1 : +bi;
  // 1 location / 2 locations.
  function plural(n, w) {
    return n + " " + w + (n === 1 ? "" : "s");
  }
  // Groups store branches by store name.
  function chains() {
    var g = {}, o = [];
    STORES.forEach(function(s, i) {
      var k = s.n.toLowerCase();
      if (!g[k]) {
        g[k] = { n: s.n, ix: [] };
        o.push(g[k]);
      }
      g[k].ix.push(i);
    });
    return o.sort(function(a, b) {
      return a.n.localeCompare(b.n);
    });
  }
  // Products sold at branch i.
  function sold(i) {
    return P.filter(function(p) {
      return p[3][i] != null;
    });
  }
  // Draws the store list, a store's locations, or one location's items.
  function render() {
    var h = navbar("store"), cs = chains(), c = name ? cs.filter(function(x) {
      return x.n.toLowerCase() === name.toLowerCase();
    })[0] : null;
    if (!name) {
      document.title = "Stores | ₱resyo Check";
      h += '<h2>Stores</h2><p class="mute">Tap a store to see its locations.</p><div class="grid">' +
          cs.map(function(x) {
        return '<a class="item" href="' + urlStore(x.n) + '"><b>' +
            esc(x.n) + "</b><small>" + plural(x.ix.length, "location") + "</small></a>";
      }).join("") + "</div>";
    } else if (!c) {
      h += '<a class="link" href="store.html">‹ All stores</a><h2>Store not found</h2>' +
          '<p class="mute">No store named “' + esc(name) + "” yet.</p>";
    } else {
      document.title = c.n + " | ₱resyo Check";
      h += '<a class="link" href="store.html">‹ All stores</a><h2>' +
          esc(c.n) + '</h2><p class="mute">' + plural(c.ix.length, "location") +
          ". Pick one to see what it sells.</p>";
      var areas = [];
      c.ix.forEach(function(i) {
        if (areas.indexOf(STORES[i].l) < 0) areas.push(STORES[i].l);
      });
      areas.sort();
      areas.forEach(function(a) {
        h += "<h3>" + esc(a) + '</h3><div class="grid">' + c.ix.filter(function(i) {
          return STORES[i].l === a;
        }).map(function(i) {
          return '<a class="item' + (i === bi ? " sel" : "") + '" href="' +
              urlStore(c.n) + "&i=" + i + '"><b>' + esc(STORES[i].b || "Main branch") +
              "</b><small>" + esc(a) + " · " + plural(sold(i).length, "item") +
              "</small></a>";
        }).join("") + "</div>";
      });
      if (bi >= 0 && c.ix.indexOf(bi) >= 0) {
        var it = sold(bi);
        h += '<h3 style="margin-top:22px">Items at ' + esc(c.n) +
            ", " + esc(locName(bi)) + "</h3>" + (it.length ? '<div class="grid">' +
            it.map(function(p) {
          var m = M[P.indexOf(p)];
          return '<div class="item"><a class="tl" href="' + urlProduct(p[0], bi) +
              '"><b>' + esc(m.n) + "</b></a>" + (isPromoActive(p[5][bi]) ? ' <span class="badge" style="background:#EF4444;color:#fff">PROMO</span>' : "") +
              "<br><small>" + esc(p[2]) + '</small> <span class="price" style="font-size:1.1rem">' +
              priceHTML(p, bi) + '</span> <span class="stars">' + stars(p[4][bi]) +
              '</span><a class="btn" style="margin:8px 0 0;padding:8px" href="compare.html?code=' +
              encodeURIComponent(p[0]) + "&area=" + encodeURIComponent(STORES[bi].l) +
              '">Compare with other stores in ' + esc(STORES[bi].l) + "</a></div>";
        }).join("") + "</div>" : '<p class="mute">No items listed for this location yet.</p>');
      }
    }
    app.innerHTML = h;
  }
  render();
})();
