// ===== PACK PRO · un solo pago desbloquea todas las apps =====
// 1) Pega aquí tu enlace de pago de Stripe (empieza por https://buy.stripe.com/...)
// 2) En Stripe, "Después del pago" debe redirigir a:
//    https://gonza0297.github.io/microapps/?gracias=pack-pro
window.PAGO_URL = "https://buy.stripe.com/eVq7sLfOlgH95N9gUM7wA00";
window.PRECIO_PRO = "5,99 €";

(function () {
  var KEY = "apps-pro";
  try {
    var params = new URLSearchParams(location.search);
    if (params.get("gracias") === "pack-pro") {
      localStorage.setItem(KEY, "1");
      params.delete("gracias");
      history.replaceState(null, "", location.pathname + (params.toString() ? "?" + params : ""));
      window.PRO_JUST_UNLOCKED = true;
    }
    window.PRO = localStorage.getItem(KEY) === "1";
  } catch (e) {
    window.PRO = false;
  }

  var P = {
    once: ["Un solo pago de {p} desbloquea las 5 apps para siempre.", "Un seul paiement de {p} débloque les 5 apps pour toujours.", "One payment of {p} unlocks all 5 apps forever.", "Un solo pagamento di {p} sblocca le 5 app per sempre.", "Um único pagamento de {p} desbloqueia as 5 apps para sempre."],
    buy: ["Desbloquear Pack Pro · {p}", "Débloquer le Pack Pro · {p}", "Unlock Pro Pack · {p}", "Sblocca il Pack Pro · {p}", "Desbloquear Pack Pro · {p}"],
    soon: ["Pack Pro disponible muy pronto", "Pack Pro bientôt disponible", "Pro Pack coming soon", "Pack Pro in arrivo", "Pack Pro disponível em breve"],
    on: ["Pack Pro activado", "Pack Pro activé", "Pro Pack active", "Pack Pro attivo", "Pack Pro ativado"],
    have: ["¿Ya lo compraste? Activar con código", "Déjà acheté ? Activer avec un code", "Already bought it? Activate with a code", "Già acquistato? Attiva con un codice", "Já comprou? Ativar com código"],
    code: ["Código", "Code", "Code", "Codice", "Código"],
    go: ["Activar", "Activer", "Activate", "Attiva", "Ativar"],
    bad: ["Código incorrecto.", "Code incorrect.", "Wrong code.", "Codice errato.", "Código incorreto."],
    ok: ["¡Pack Pro activado!", "Pack Pro activé !", "Pro Pack activated!", "Pack Pro attivato!", "Pack Pro ativado!"]
  };
  // Código para activar Pro en cualquier navegador (se guarda solo su huella SHA-256, no el código)
  var CODE_HASH = "da35bf24d8a8f64ae152010dbf44c85de08e6969766f862161be9e4b8206616a";
  window.proActivate = function (form) {
    var input = form.querySelector("input"), msg = form.querySelector(".pro-cmsg");
    var v = String(input.value || "").trim().toUpperCase();
    if (!window.crypto || !crypto.subtle) { msg.textContent = tr(P.bad); return false; }
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(v)).then(function (buf) {
      var hex = Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
      if (hex === CODE_HASH) {
        try { localStorage.setItem(KEY, "1"); } catch (e) {}
        msg.textContent = tr(P.ok);
        setTimeout(function () { location.reload(); }, 600);
      } else msg.textContent = tr(P.bad);
    });
    return false;
  };
  window.PRO_TXT = P;
  var tr = function (a, v) { return window.T ? window.T(a, v) : a[0].replace("{p}", v && v.p); };

  // Devuelve el HTML de un aviso Pro para colocar en cualquier app
  window.proBanner = function (texto) {
    if (window.PRO) return "";
    var btn = window.PAGO_URL
      ? '<a class="pro-buy" href="' + window.PAGO_URL + '">' + tr(P.buy, { p: window.PRECIO_PRO }) + "</a>"
      : '<span class="pro-soon">' + tr(P.soon) + "</span>";
    var redeem = '<details class="pro-code"><summary>' + tr(P.have) + '</summary><form onsubmit="return proActivate(this)">' +
      '<input autocomplete="off" autocapitalize="characters" aria-label="' + tr(P.code) + '" placeholder="' + tr(P.code) + '"><button type="submit">' + tr(P.go) + '</button><span class="pro-cmsg" aria-live="polite"></span></form></details>';
    return '<div class="pro-box"><span class="pro-tag">PRO</span><p>' + texto + " " + tr(P.once, { p: window.PRECIO_PRO }) + "</p>" + btn + redeem + "</div>";
  };

  var css = document.createElement("style");
  css.textContent =
    ".pro-box{display:grid;gap:10px;justify-items:start;border:2px dashed #e0b31c;background:rgb(255 210 63 / .1);border-radius:18px;padding:16px}" +
    ".pro-box p{margin:0}" +
    ".pro-tag{font-size:12px;font-weight:900;letter-spacing:.1em;background:#ffd23f;color:#1c1c22;border-radius:6px;padding:3px 8px}" +
    ".pro-buy{display:inline-flex;align-items:center;min-height:48px;background:#ffd23f;color:#1c1c22;font-weight:800;text-decoration:none;border-radius:14px;padding:10px 18px}" +
    ".pro-buy:focus-visible{outline:3px solid currentColor;outline-offset:2px}" +
    ".pro-soon{font-size:13px;opacity:.7}" +
    ".pro-code{font-size:14px;width:100%}.pro-code summary{cursor:pointer;text-decoration:underline;opacity:.85;padding:4px 0}" +
    ".pro-code form{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;align-items:center}" +
    ".pro-code input{flex:1 1 160px;min-width:0;font:inherit;font-size:16px;padding:9px 12px;border-radius:12px;border:1.5px solid rgb(127 127 127 / .4);background:transparent;color:inherit;min-height:44px}" +
    ".pro-code button{font:inherit;font-weight:800;border:none;border-radius:12px;padding:10px 16px;background:#ffd23f;color:#1c1c22;min-height:44px;cursor:pointer}" +
    ".pro-cmsg{flex-basis:100%;font-weight:700}";
  document.head.appendChild(css);
})();
