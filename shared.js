var STORES=[
 {n:"Dali",l:"Pasig City"},{n:"Puregold",l:"Ortigas Ave., Pasig City"},{n:"Shopwise",l:"Cainta, Rizal"},
 {n:"Robinsons Supermarket",l:"Ortigas, Pasig City"},{n:"SM Markets",l:"Megamall, Mandaluyong"}];
// barcode, name, size, prices per store, ratings per store, promos per store [{active, mechanics, start, end} or null]
var P=[
 ["4800000000011","Century Tuna","155 g",[38,42,44,43,45],[4.1,4.4,4.2,4.3,4.5],[
   {active:true,mechanics:"Buy 1 get 1 free tag on selected stocks",until:"2026-12-31"},null,null,null,null
 ]],
 ["4800000000028","Sardines in tomato sauce","155 g",[17,18.5,19.5,19,19.75],[4.2,4.3,4.0,4.1,4.4],[
   null,{active:true,mechanics:"₱2 off promo discount",until:"2026-11-20",mode:"price",price:16.5},null,null,null
 ]],
 ["4800000000035","Instant pancit canton","60 g",[14,15,15.5,15.5,16],[4.6,4.6,4.5,4.4,4.6],[
   null,null,{active:true,mechanics:"Bundle pack discount",until:"2026-11-30"},null,null
 ]],
 ["4800000000042","Canned corned beef","150 g",[38,41,44,43,45],[3.9,4.1,4.0,4.0,4.2],[
   null,null,null,{active:true,mechanics:"Weekend special markdown",until:"2026-11-09"},null
 ]],
 ["4800000000059","Evaporated milk","370 mL",[31,33,35,34,35.5],[4.3,4.4,4.2,4.3,4.5],[
   null,null,null,null,{active:true,mechanics:"Save ₱3 with loyalty card",until:"2026-12-01"}
 ]],
 ["4800000000066","3-in-1 coffee","10 sachets",[null,72,76,75,77],[0,4.5,4.4,4.5,4.6],[
   null,{active:true,mechanics:"Free mug bundle",until:"2026-11-15"},null,null,null
 ]],
 ["4800000000073","Datu Puti","1 L",[34,37,39,38,40],[4.0,4.2,4.1,4.1,4.3],[
   {active:true,mechanics:"Price rollback promo",until:"2026-11-25"},null,null,null,null
 ]],
 ["4800000000080","Safeguard","90 g",[null,31,33,32,34],[0,4.4,4.3,4.4,4.5],[
   null,null,{active:true,mechanics:"Buy 3 save ₱5",until:"2026-11-18"},null,null
 ]],
 ["4809012906104","Amanda's Sweet Ginisang Bagoong","340 g",[85,92,95,90,96],[4.5,4.3,4.4,4.2,4.6],[
   {active:true,mechanics:"Introductory discount",until:"2026-12-15"},null,null,{active:true,mechanics:"Bundle promo",until:"2026-11-10"},null
 ]]];


var M=[
 {n:"Century Tuna (Flakes in Oil)",b:"Century Tuna",m:"Century Pacific Food, Inc.",c:"Canned Goods, Seafood",o:"Philippines",t:["Century Tuna","Century Pacific Food, Inc.","Canned Goods","Seafood","Philippines"],col:"#2f6fb0"},
 {n:"555 Sardines (Tomato Sauce)",b:"555",m:"Century Pacific Food, Inc.",c:"Canned Goods, Seafood",o:"Philippines",t:["555","Century Pacific Food, Inc.","Canned Goods","Seafood","Philippines"],col:"#c0392b"},
 {n:"Lucky Me! Pancit Canton (Original)",b:"Lucky Me!",m:"Monde Nissin Corporation",c:"Instant Noodles",o:"Philippines",t:["Lucky Me!","Monde Nissin Corporation","Noodles","Instant Food","Philippines"],col:"#e0a800"},
 {n:"Argentina Corned Beef (Classic)",b:"Argentina",m:"Century Pacific Food, Inc.",c:"Canned Goods, Meat",o:"Philippines",t:["Argentina","Century Pacific Food, Inc.","Canned Goods","Meat","Philippines"],col:"#a33a2a"},
 {n:"Alaska Evaporated Milk",b:"Alaska",m:"Alaska Milk Corporation",c:"Dairy",o:"Philippines",t:["Alaska","Alaska Milk Corporation","Dairy","Canned Milk","Philippines"],col:"#2a8f5b"},
 {n:"Nescafé 3-in-1 (Original)",b:"Nescafé",m:"Nestlé Philippines, Inc.",c:"Coffee, Beverages",o:"Philippines",t:["Nescafé","Nestlé Philippines, Inc.","Beverages","Coffee","Philippines"],col:"#7a4b2a"},
 {n:"Datu Puti Soy Sauce",b:"Datu Puti",m:"NutriAsia, Inc.",c:"Condiments, Sauces",o:"Philippines",t:["Datu Puti","NutriAsia, Inc.","Condiments","Sauces","Philippines"],col:"#3b2a1f"},
 {n:"Safeguard Bar Soap (White)",b:"Safeguard",m:"Procter & Gamble Philippines",c:"Personal Care",o:"Philippines",t:["Safeguard","Procter & Gamble Philippines","Personal Care","Soap","Philippines"],col:"#3a7bd5"},
 {n:"Amanda's Sweet Ginisang Bagoong",b:"Amanda's",m:"Amanda's Marine Products",c:"Condiments, Sauces",o:"Philippines",t:["Amanda's","Amanda's Marine Products","Condiments","Sauces","Bagoong","Shrimp Paste","Philippines"],col:"#2a8f5b"}];
var RV=[["Maria S.",5,"Always fresh and a good price. I buy it every payday."],["Jun R.",4,"Reliable quality. Sometimes sold out in the afternoon."],["Ate Liza",5,"Family favorite. Cheaper here than the corner store."],["Paolo D.",3,"Okay, but the price went up last month."],["Kuya Ben",4,"Good for the budget. Check the expiry date on the shelf."],["Carla M.",5,"Consistent every time."],["Rhea T.",4,"Easy to find, near the front aisle."]];

// ---------- shared storage + helpers (used by every page) ----------
var DBV=2; // bump when the seed data changes so old saved data is reset
try{var _s=JSON.parse(localStorage.getItem("pc_db")||"null");if(_s&&_s.v===DBV){STORES=_s.S;P=_s.P;M=_s.M}}catch(e){}
function saveDB(){try{localStorage.setItem("pc_db",JSON.stringify({v:DBV,S:STORES,P:P,M:M}))}catch(e){}}
function getUser(){try{return JSON.parse(sessionStorage.getItem("pc_user")||"null")}catch(e){return null}}
function setUser(u){try{if(u)sessionStorage.setItem("pc_user",JSON.stringify(u));else sessionStorage.removeItem("pc_user")}catch(e){}}
var user=getUser()||{guest:true};
function getPromoFilter(){try{return sessionStorage.getItem("pc_promo")==="1"}catch(e){return false}}
function setPromoFilter(v){try{sessionStorage.setItem("pc_promo",v?"1":"0")}catch(e){}}
function qs(k){return new URLSearchParams(location.search).get(k)}
function findP(c){c=(c||"").trim();for(var i=0;i<P.length;i++)if(P[i][0]===c)return P[i];return null}
function urlCompare(c){return "compare.html?code="+encodeURIComponent(c)}
function urlProduct(c,s){return "product.html?code="+encodeURIComponent(c)+"&s="+s}
function V(id){var el=document.getElementById(id);return el?el.value.trim().replace(/[<>"]/g,""):""}
function peso(n){return "₱"+(n%1?n.toFixed(2):n)}
function stars(r){return r?"★ "+r.toFixed(1)+" / 5":"No rating yet"}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function today(){var d=new Date(),p=function(n){return (n<10?"0":"")+n};return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())}
function isPromoActive(pr){return !!(pr&&pr.active&&(!pr.until||pr.until>=today()))}
function fmtDate(s){var a=String(s).split("-");return new Date(+a[0],a[1]-1,+a[2]).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"})}
function img(m){return '<svg viewBox="0 0 100 110" role="img" aria-label="Product image placeholder"><rect x="15" y="15" width="70" height="80" rx="8" fill="'+m.col+'"/><ellipse cx="50" cy="15" rx="35" ry="7" fill="#d5dbd7"/><rect x="15" y="45" width="70" height="26" fill="#fff" opacity=".92"/><text x="50" y="62" text-anchor="middle" font-size="11" font-weight="700" fill="#16261c">'+esc(m.b)+'</text></svg>'}
function revs(m){var L=m.rv||RV;if(!L.length)return '<div class="r mute">No reviews yet.</div>';return L.map(function(r){return '<div class="r"><b>'+esc(r[0])+'</b> <span class="stars">'+'★'.repeat(r[1])+'</span><br>'+esc(r[2])+'</div>'}).join('')}

// ---------- promo pricing + promo form (shared by index.html and product.html) ----------
function promoPrice(pr,orig){return(isPromoActive(pr)&&pr.price!=null&&pr.price<orig)?pr.price:null}
function effPrice(p,s){var x=promoPrice(p[5][s],p[3][s]);return x!=null?x:p[3][s]}
function priceHTML(p,s){var x=promoPrice(p[5][s],p[3][s]);return x!=null?'<s class="old">'+peso(p[3][s])+'</s> <span class="now">'+peso(x)+'</span>':peso(p[3][s])}
function promoFields(){return '<label>Promo mechanics<input class="in" id="pMech" maxlength="80" placeholder="e.g., Buy 1 Take 1"></label>'+
 '<label>Promo valid until<input class="in" id="pUntil" type="date" min="'+today()+'"></label>'+
 '<fieldset class="pm"><legend>Promo price</legend><label class="rd"><input type="radio" name="pMode" value="same" checked> Same price</label><label class="rd"><input type="radio" name="pMode" value="price"> New price</label><label class="rd"><input type="radio" name="pMode" value="pct"> Percent off</label>'+
 '<label id="pPriceW" hidden>Promo price (₱)<input class="in" id="pPrice" type="number" step="0.01" min="0.01"></label><label id="pPctW" hidden>Percent off (%)<input class="in" id="pPct" type="number" step="1" min="1" max="99"></label></fieldset>'+
 '<p class="msg" id="perr" role="alert"></p>'}
function readPromo(orig,by){var mech=V("pMech"),u=V("pUntil"),c=document.querySelector('input[name="pMode"]:checked'),mode=c?c.value:"same";
 if(!mech||!u)return{e:"Add the promo mechanics and the until date."};
 if(u<today())return{e:"The until date can’t be in the past."};
 var pr={active:true,mechanics:mech,until:u,by:by,mode:mode,price:null};
 if(mode==="price"){var x=parseFloat(V("pPrice"));if(!(x>0))return{e:"Enter the promo price."};if(orig&&x>=orig)return{e:"The promo price must be lower than the regular price (₱"+orig+"). Choose “Same price” if it didn’t change."};pr.price=Math.round(x*100)/100}
 if(mode==="pct"){var q=parseFloat(V("pPct"));if(!(orig>0))return{e:"Enter the regular price first."};if(!(q>0&&q<100))return{e:"Enter a percentage between 1 and 99."};pr.pct=q;pr.price=Math.round(orig*(1-q/100)*100)/100}
 return{p:pr}}
document.addEventListener("change",function(e){if(e.target.name==="pMode"){var a=document.getElementById("pPriceW"),b=document.getElementById("pPctW");if(a)a.hidden=e.target.value!=="price";if(b)b.hidden=e.target.value!=="pct"}});
// promos are removed automatically once their "until" date has passed
(function(){var ch=false;P.forEach(function(r){(r[5]||[]).forEach(function(pr,i){if(pr&&pr.until&&pr.until<today()){r[5][i]=null;ch=true}})});if(ch)saveDB()})();
