// ===== RECOMENDACIONES DE AMAZON (afiliados) =====
// Pega aquí tu ID de afiliado de Amazon.es (lo ves arriba en afiliados.amazon.es, termina en -21)
window.AMAZON_TAG = "appsutiles-21";
window.AMAZON_HOST = "https://www.amazon.es";

(function () {
  function link(q) {
    var url = window.AMAZON_HOST + "/s?k=" + encodeURIComponent(q);
    if (window.AMAZON_TAG) url += "&tag=" + encodeURIComponent(window.AMAZON_TAG);
    return url;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  // items: [{name, desc, q, hot?}]  hot = destacado para este usuario
  window.renderAmazon = function (el, titulo, items) {
    if (typeof el === "string") el = document.getElementById(el);
    if (!el) return;
    var sorted = items.slice().sort(function (a, b) { return (b.hot ? 1 : 0) - (a.hot ? 1 : 0); });
    el.innerHTML =
      '<div class="amz">' +
      '<div class="amz-head"><span class="amz-tag">RECOMENDADO</span><b>' + esc(titulo) + "</b></div>" +
      '<div class="amz-grid">' +
      sorted.map(function (it) {
        return '<a class="amz-item' + (it.hot ? " amz-hot" : "") + '" href="' + link(it.q) +
          '" target="_blank" rel="sponsored nofollow noopener">' +
          (it.hot ? '<span class="amz-for">Para ti</span>' : "") +
          "<b>" + esc(it.name) + "</b><span>" + esc(it.desc) + '</span><i>Ver en Amazon →</i></a>';
      }).join("") +
      "</div>" +
      '<p class="amz-legal">En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables. A ti no te cuesta nada más.</p>' +
      "</div>";
  };

  var css = document.createElement("style");
  css.textContent =
    ".amz{display:grid;gap:12px;border-top:1px solid currentColor;border-color:rgb(127 127 127 / .25);padding-top:18px}" +
    ".amz-head{display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:16px}" +
    ".amz-tag{font-size:11px;font-weight:800;letter-spacing:.1em;background:#ff9900;color:#111;border-radius:4px;padding:2px 7px}" +
    ".amz-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}" +
    ".amz-item{display:grid;gap:4px;align-content:start;text-decoration:none;color:inherit;border:1px solid rgb(127 127 127 / .3);border-radius:12px;padding:12px;position:relative;min-width:0}" +
    ".amz-item:hover,.amz-item:focus-visible{border-color:#ff9900;outline:none}" +
    ".amz-item span{font-size:13px;opacity:.75}" +
    ".amz-item i{font-style:normal;font-weight:700;font-size:13px;color:#c45500;margin-top:4px}" +
    "@media (prefers-color-scheme:dark){.amz-item i{color:#ffb84d}}" +
    ".amz-hot{border-color:#ff9900;border-width:2px}" +
    ".amz-for{font-size:11px!important;font-weight:800;opacity:1!important;color:#c45500}" +
    "@media (prefers-color-scheme:dark){.amz-for{color:#ffb84d}}" +
    ".amz-legal{font-size:12px;opacity:.6;margin:0}";
  document.head.appendChild(css);
})();
