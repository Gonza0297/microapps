// ===== Idiomas de Apps Útiles =====
// Orden de todas las traducciones: [español, français, English, italiano, português]
(function () {
  var LANGS = [["es", "Español", "es-ES"], ["fr", "Français", "fr-BE"], ["en", "English", "en-IE"], ["it", "Italiano", "it-IT"], ["pt", "Português", "pt-PT"]];
  var lang = "es";
  try {
    var q = new URLSearchParams(location.search).get("lang");
    var s = localStorage.getItem("apps-lang");
    var n = (navigator.language || "es").slice(0, 2).toLowerCase();
    var ok = function (l) { return l && LANGS.some(function (x) { return x[0] === l; }); };
    lang = ok(q) ? q : ok(s) ? s : ok(n) ? n : "es";
    if (ok(q)) localStorage.setItem("apps-lang", q);
  } catch (e) {}
  var LI = LANGS.findIndex(function (x) { return x[0] === lang; });
  window.LANGS = LANGS; window.LANG = lang; window.LI = LI; window.LOCALE = LANGS[LI][2];
  document.documentElement.lang = lang;

  window.T = function (a, vars) {
    var s = Array.isArray(a) ? (a[LI] != null ? a[LI] : a[0]) : (a == null ? "" : String(a));
    if (vars) for (var k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  };
  window.fmtEUR = function (v, d) { if (d == null) d = 2; return (v || 0).toLocaleString(window.LOCALE, { style: "currency", currency: "EUR", minimumFractionDigits: d, maximumFractionDigits: d }); };
  window.fmtNum = function (v, d) { return (v || 0).toLocaleString(window.LOCALE, { maximumFractionDigits: d || 0 }); };
  window.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var C = {
    back: ["← Apps Útiles", "← Apps Útiles", "← Apps Útiles", "← Apps Útiles", "← Apps Útiles"],
    langLabel: ["Idioma", "Langue", "Language", "Lingua", "Idioma"],
    made: ["Creado por Gonzalo Leon", "Créé par Gonzalo Leon", "Made by Gonzalo Leon", "Creato da Gonzalo Leon", "Criado por Gonzalo Leon"],
    contact: ["Contacto", "Contact", "Contact", "Contatto", "Contacto"],
    free: ["Gratis, sin registro. Tus datos se quedan en tu móvil.", "Gratuit, sans inscription. Vos données restent sur votre téléphone.", "Free, no sign-up. Your data stays on your phone.", "Gratis, senza registrazione. I tuoi dati restano sul tuo telefono.", "Grátis, sem registo. Os seus dados ficam no seu telemóvel."]
  };
  window.COMMON = C;

  window.applyI18n = function (D) {
    var all = Object.assign({}, C, D || {});
    document.querySelectorAll("[data-i18n]").forEach(function (e) { var k = e.getAttribute("data-i18n"); if (all[k]) e.innerHTML = T(all[k]); });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (e) { var k = e.getAttribute("data-i18n-ph"); if (all[k]) e.placeholder = T(all[k]); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (e) { var k = e.getAttribute("data-i18n-aria"); if (all[k]) e.setAttribute("aria-label", T(all[k])); });
    document.querySelectorAll("select.lang").forEach(function (sel) {
      sel.setAttribute("aria-label", T(C.langLabel));
      sel.innerHTML = LANGS.map(function (l) { return '<option value="' + l[0] + '"' + (l[0] === lang ? " selected" : "") + ">" + l[1] + "</option>"; }).join("");
      sel.onchange = function () {
        try { localStorage.setItem("apps-lang", sel.value); } catch (e) {}
        var u = new URL(location.href); u.searchParams.set("lang", sel.value); location.href = u.toString();
      };
    });
    var f = document.querySelector("footer[data-auto]");
    if (f) {
      var note = f.getAttribute("data-note");
      f.innerHTML = "<span>" + T(C.free) + "</span><span>" + T(C.made) + " · " + T(C.contact) + ': <a href="mailto:appsutiles8@gmail.com">appsutiles8@gmail.com</a></span>' + (note && D && D[note] ? "<span>" + T(D[note]) + "</span>" : "");
    }
  };
})();
