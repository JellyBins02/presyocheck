// signup.js - the sign-up form on signup.html.

var app = document.getElementById("app");
app.className = "wrap v-signin";
document.title = "Sign up | ₱resyo Check";
// One labelled input for the form.
function f(id, l, t, ac, x) {
  return "<label>" + l + '<input class="in" id="' + id + '" type="' +
      (t || "text") + '" autocomplete="' + ac + '" maxlength="' + (x || 40) +
      '"></label>';
}
app.innerHTML = '<a class="link" href="index.html">‹ Back</a><h2>Create your account</h2>' +
    '<p class="mute">Accounts let you add products, tag promos and read reviews.</p>' +
    '<form class="frm" id="sf">' + f("first", "First name", "text", "given-name") +
    f("mid", "Middle name", "text", "additional-name") + '<label class="rd"><input type="checkbox" id="nomid"> I don’t have a middle name</label>' +
    f("last", "Last name", "text", "family-name") + f("email", "Email", "email", "email", 80) +
    f("username", "Username", "text", "username", 20) + f("pw", "Password (at least 8 characters)", "password", "new-password", 100) +
    '<p class="msg" id="err" role="alert"></p><button class="btn main" type="submit">Sign up</button>' +
    '</form><p class="mute" style="margin-top:12px">Already have an account? <a class="tl" href="index.html#signin">Log in</a></p>';
document.getElementById("nomid").addEventListener("change", function(e) {
  var m = document.getElementById("mid");
  m.disabled = e.target.checked;
  if (e.target.checked) m.value = "";
});
document.getElementById("sf").addEventListener("submit", function(e) {
  e.preventDefault();
  var g = function(id) {
    return document.getElementById(id).value.trim().replace(/\s+/g, " ");
  }, err = document.getElementById("err"), nm = document.getElementById("nomid").checked;
  if (!nm && !g("mid")) {
    err.textContent = "Enter your middle name, or tick “I don’t have a middle name”.";
    return;
  }
  err.textContent = "";
  signUp({ first: g("first"), mid: nm ? "" : g("mid"), last: g("last"), email: g("email"), username: g("username"), password: document.getElementById("pw").value }).then(function(r) {
    if (r.e) {
      err.textContent = r.e;
      return;
    }
    setUser(r.user);
    location.href = "index.html";
  });
});
