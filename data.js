// data.js - the sample (seed) data the app starts with.
//
// Three parallel lists describe the catalogue:
//   STORES  one entry per store branch:  { n: store name, l: area/city, b: branch or street }
//   P       one row per product:
//           [ barcode, name, size, prices, ratings, promos ]
//           prices / ratings / promos are lists with ONE slot per STORES entry (same order).
//           A null price means "this branch does not sell it".
//   M       product details, same order as P:
//           { n: full name, b: brand, m: manufacturer, c: categories, o: country, t: tags, col: image color }
//   RV      sample reviews shown for every product: [ reviewer, stars, text ]
//
// Changing this file does not affect browsers that already saved data - raise DBV in shared.js.

var STORES = [
  { n: "Dali", l: "Pasig City" },
  { n: "Puregold", l: "Ortigas Ave., Pasig City" },
  { n: "Shopwise", l: "Cainta, Rizal" },
  { n: "Robinsons Supermarket", l: "Ortigas, Pasig City" },
  { n: "SM Markets", l: "Megamall, Mandaluyong" }
];
// barcode, name, size, prices per store, ratings per store, promos per store [{active, mechanics, start, end} or null]
var P = [
  ["4800000000011", "Century Tuna", "155 g", [38, 42, 44, 43, 45], [4.1, 4.4, 4.2, 4.3, 4.5], [
    { active: true, mechanics: "Buy 1 get 1 free tag on selected stocks", until: "2026-12-31" },
    null,
    null,
    null,
    null
  ]],
  ["4800000000028", "Sardines in tomato sauce", "155 g", [17, 18.5, 19.5, 19, 19.75], [4.2, 4.3, 4, 4.1, 4.4], [
    null,
    { active: true, mechanics: "₱2 off promo discount", until: "2026-11-20", mode: "price", price: 16.5 },
    null,
    null,
    null
  ]],
  ["4800000000035", "Instant pancit canton", "60 g", [14, 15, 15.5, 15.5, 16], [4.6, 4.6, 4.5, 4.4, 4.6], [
    null,
    null,
    { active: true, mechanics: "Bundle pack discount", until: "2026-11-30" },
    null,
    null
  ]],
  ["4800000000042", "Canned corned beef", "150 g", [38, 41, 44, 43, 45], [3.9, 4.1, 4, 4, 4.2], [
    null,
    null,
    null,
    { active: true, mechanics: "Weekend special markdown", until: "2026-11-09" },
    null
  ]],
  ["4800000000059", "Evaporated milk", "370 mL", [31, 33, 35, 34, 35.5], [4.3, 4.4, 4.2, 4.3, 4.5], [
    null,
    null,
    null,
    null,
    { active: true, mechanics: "Save ₱3 with loyalty card", until: "2026-12-01" }
  ]],
  ["4800000000066", "3-in-1 coffee", "10 sachets", [null, 72, 76, 75, 77], [0, 4.5, 4.4, 4.5, 4.6], [
    null,
    { active: true, mechanics: "Free mug bundle", until: "2026-11-15" },
    null,
    null,
    null
  ]],
  ["4800000000073", "Datu Puti", "1 L", [34, 37, 39, 38, 40], [4, 4.2, 4.1, 4.1, 4.3], [
    { active: true, mechanics: "Price rollback promo", until: "2026-11-25" },
    null,
    null,
    null,
    null
  ]],
  ["4800000000080", "Safeguard", "90 g", [null, 31, 33, 32, 34], [0, 4.4, 4.3, 4.4, 4.5], [
    null,
    null,
    { active: true, mechanics: "Buy 3 save ₱5", until: "2026-11-18" },
    null,
    null
  ]],
  ["4809012906104", "Amanda's Sweet Ginisang Bagoong", "340 g", [85, 92, 95, 90, 96], [4.5, 4.3, 4.4, 4.2, 4.6], [
    { active: true, mechanics: "Introductory discount", until: "2026-12-15" },
    null,
    null,
    { active: true, mechanics: "Bundle promo", until: "2026-11-10" },
    null
  ]]
];
var M = [
  { n: "Century Tuna (Flakes in Oil)", b: "Century Tuna", m: "Century Pacific Food, Inc.", c: "Canned Goods, Seafood", o: "Philippines", t: ["Century Tuna", "Century Pacific Food, Inc.", "Canned Goods", "Seafood", "Philippines"], col: "#2f6fb0" },
  { n: "555 Sardines (Tomato Sauce)", b: "555", m: "Century Pacific Food, Inc.", c: "Canned Goods, Seafood", o: "Philippines", t: ["555", "Century Pacific Food, Inc.", "Canned Goods", "Seafood", "Philippines"], col: "#c0392b" },
  { n: "Lucky Me! Pancit Canton (Original)", b: "Lucky Me!", m: "Monde Nissin Corporation", c: "Instant Noodles", o: "Philippines", t: ["Lucky Me!", "Monde Nissin Corporation", "Noodles", "Instant Food", "Philippines"], col: "#e0a800" },
  { n: "Argentina Corned Beef (Classic)", b: "Argentina", m: "Century Pacific Food, Inc.", c: "Canned Goods, Meat", o: "Philippines", t: ["Argentina", "Century Pacific Food, Inc.", "Canned Goods", "Meat", "Philippines"], col: "#a33a2a" },
  { n: "Alaska Evaporated Milk", b: "Alaska", m: "Alaska Milk Corporation", c: "Dairy", o: "Philippines", t: ["Alaska", "Alaska Milk Corporation", "Dairy", "Canned Milk", "Philippines"], col: "#2a8f5b" },
  { n: "Nescafé 3-in-1 (Original)", b: "Nescafé", m: "Nestlé Philippines, Inc.", c: "Coffee, Beverages", o: "Philippines", t: ["Nescafé", "Nestlé Philippines, Inc.", "Beverages", "Coffee", "Philippines"], col: "#7a4b2a" },
  { n: "Datu Puti Soy Sauce", b: "Datu Puti", m: "NutriAsia, Inc.", c: "Condiments, Sauces", o: "Philippines", t: ["Datu Puti", "NutriAsia, Inc.", "Condiments", "Sauces", "Philippines"], col: "#3b2a1f" },
  { n: "Safeguard Bar Soap (White)", b: "Safeguard", m: "Procter & Gamble Philippines", c: "Personal Care", o: "Philippines", t: ["Safeguard", "Procter & Gamble Philippines", "Personal Care", "Soap", "Philippines"], col: "#3a7bd5" },
  { n: "Amanda's Sweet Ginisang Bagoong", b: "Amanda's", m: "Amanda's Marine Products", c: "Condiments, Sauces", o: "Philippines", t: ["Amanda's", "Amanda's Marine Products", "Condiments", "Sauces", "Bagoong", "Shrimp Paste", "Philippines"], col: "#2a8f5b" }
];
var RV = [["Maria S.", 5, "Always fresh and a good price. I buy it every payday."], ["Jun R.", 4, "Reliable quality. Sometimes sold out in the afternoon."], ["Ate Liza", 5, "Family favorite. Cheaper here than the corner store."], ["Paolo D.", 3, "Okay, but the price went up last month."], ["Kuya Ben", 4, "Good for the budget. Check the expiry date on the shelf."], ["Carla M.", 5, "Consistent every time."], ["Rhea T.", 4, "Easy to find, near the front aisle."]];
