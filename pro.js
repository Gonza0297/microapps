// ===== PACK PRO · un solo pago desbloquea todas las apps =====
// 1) Pega aquí tu enlace de pago de Stripe (empieza por https://buy.stripe.com/...)
// 2) En Stripe, "Después del pago" debe redirigir a:
//    https://gonza0297.github.io/microapps/?gracias=pack-pro
window.PAGO_URL = "";
window.PRECIO_PRO = "5,99 €";

(function () {
  var KEY = "apps-pro";
  try {
    var params = new URLSearchParams(location.search);
    if (params.get("gracias") === "pack-pro") {
      localStorage.setItem(KEY, "1");
      history.replaceState(null, "", location.pathname);
      window.PRO_JUST_UNLOCKED = true;
    }
    window.PRO = localStorage.getItem(KEY) === "1";
  } catch (e) {
    window.PRO = false;
  }

  // Devuelve el HTML de un aviso Pro para colocar en cualquier app
  window.proBanner = function (texto) {
    if (window.PRO) return "";
    var btn = window.PAGO_URL
      ? '<a class="pro-buy" href="' + window.PAGO_URL + '">Desbloquear Pack Pro · ' + window.PRECIO_PRO + "</a>"
      : '<span class="pro-soon">Pack Pro disponible muy pronto</span>';
    return '<div class="pro-box"><span class="pro-tag">PRO</span><p>' + texto +
      ' Un solo pago de ' + window.PRECIO_PRO + ' desbloquea las 5 apps para siempre.</p>' + btn + "</div>";
  };

  var css = document.createElement("style");
  css.textContent =
    ".pro-box{display:grid;gap:8px;justify-items:start;border:1px dashed currentColor;border-radius:12px;padding:14px;margin:4px 0}" +
    ".pro-box p{margin:0}" +
    ".pro-tag{font-size:11px;font-weight:800;letter-spacing:.1em;background:#f2c230;color:#1c1c22;border-radius:4px;padding:2px 7px}" +
    ".pro-buy{display:inline-block;background:#f2c230;color:#1c1c22;font-weight:700;text-decoration:none;border-radius:8px;padding:9px 16px}" +
    ".pro-buy:focus-visible{outline:2px solid currentColor;outline-offset:2px}" +
    ".pro-soon{font-size:13px;opacity:.7}" +
    ".pro-lock{opacity:.55}";
  document.head.appendChild(css);
})();
