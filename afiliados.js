// ===== RECOMENDACIONES DE AMAZON (afiliados) =====
// Pega aquí tu ID de afiliado de Amazon.es (lo ves arriba en afiliados.amazon.es, termina en -21)
window.AMAZON_TAG = "appsutiles-21";
window.AMAZON_HOST = "https://www.amazon.es";

(function () {
  var A = {
    tag: ["RECOMENDADO", "RECOMMANDÉ", "RECOMMENDED", "CONSIGLIATO", "RECOMENDADO"],
    forYou: ["Para ti", "Pour vous", "For you", "Per te", "Para si"],
    see: ["Ver en Amazon →", "Voir sur Amazon →", "See on Amazon →", "Vedi su Amazon →", "Ver na Amazon →"],
    legal: ["En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables. A ti no te cuesta nada más.",
      "En tant que Partenaire Amazon, je perçois une commission sur les achats éligibles. Cela ne vous coûte rien de plus.",
      "As an Amazon Associate I earn from qualifying purchases. It costs you nothing extra.",
      "In qualità di Affiliato Amazon, ricevo un guadagno dagli acquisti idonei. Per te non cambia nulla.",
      "Como Afiliado da Amazon, recebo uma comissão pelas compras elegíveis. Não lhe custa nada a mais."]
  };
  var tr = function (a) { return window.T ? window.T(a) : (Array.isArray(a) ? a[0] : a); };
  window.amazonLink = function (q) {
    var url = window.AMAZON_HOST + "/s?k=" + encodeURIComponent(q);
    if (window.AMAZON_TAG) url += "&tag=" + encodeURIComponent(window.AMAZON_TAG);
    return url;
  };
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  // items: [{name, desc, q, hot?, badge?}] — name/desc/badge pueden ser arrays de traducción
  window.renderAmazon = function (el, titulo, items) {
    if (typeof el === "string") el = document.getElementById(el);
    if (!el) return;
    var sorted = items.slice().sort(function (a, b) { return (b.hot ? 1 : 0) - (a.hot ? 1 : 0); });
    el.innerHTML =
      '<div class="amz">' +
      '<div class="amz-head"><span class="amz-tag">' + tr(A.tag) + "</span><h2>" + esc(tr(titulo)) + "</h2></div>" +
      '<div class="amz-grid">' +
      sorted.map(function (it) {
        return '<a class="amz-item' + (it.hot ? " amz-hot" : "") + '" href="' + window.amazonLink(it.q) +
          '" target="_blank" rel="sponsored nofollow noopener">' +
          (it.hot ? '<span class="amz-for">' + tr(A.forYou) + "</span>" : (it.badge ? '<span class="amz-badge">' + esc(tr(it.badge)) + "</span>" : "")) +
          "<b>" + esc(tr(it.name)) + "</b><span>" + esc(tr(it.desc)) + "</span><i>" + tr(A.see) + "</i></a>";
      }).join("") +
      "</div>" +
      '<p class="amz-legal">' + tr(A.legal) + "</p>" +
      "</div>";
  };

  var css = document.createElement("style");
  css.textContent =
    ".amz{display:grid;gap:14px}" +
    ".amz-head{display:grid;gap:8px;justify-items:start}" +
    ".amz-head h2{margin:0}" +
    ".amz-tag{font-size:12px;font-weight:900;letter-spacing:.1em;background:#ff9900;color:#111;border-radius:6px;padding:3px 8px}" +
    ".amz-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}" +
    ".amz-item{display:grid;gap:4px;align-content:start;text-decoration:none;color:inherit;border:1.5px solid rgb(127 127 127 / .3);border-radius:16px;padding:14px;min-width:0}" +
    ".amz-item:hover,.amz-item:focus-visible{border-color:#ff9900;outline:none}" +
    ".amz-item b{font-size:16px}" +
    ".amz-item span{font-size:14px;opacity:.75}" +
    ".amz-item i{font-style:normal;font-weight:800;font-size:14px;color:#c45500;margin-top:6px}" +
    "@media (prefers-color-scheme:dark){.amz-item i,.amz-for,.amz-badge{color:#ffb84d!important}}" +
    ".amz-hot{border-color:#ff9900;border-width:2.5px}" +
    ".amz-for,.amz-badge{font-size:12px!important;font-weight:800;opacity:1!important;color:#c45500}" +
    ".amz-legal{font-size:12px;opacity:.65;margin:0}";
  document.head.appendChild(css);
})();
