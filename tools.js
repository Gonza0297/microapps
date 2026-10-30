// ===== Herramientas comunes: sin zoom, ejemplos y descargas =====
(function () {
  // --- Bloquear el zoom (pellizco y doble toque) ---
  var vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.setAttribute("content", "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover");
  ["gesturestart", "gesturechange", "gestureend"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false });
  });
  document.addEventListener("touchmove", function (e) { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
  var lastTouch = 0;
  document.addEventListener("touchend", function (e) {
    var now = Date.now();
    if (now - lastTouch < 300 && !(e.target.closest && e.target.closest("input,textarea,select"))) e.preventDefault();
    lastTouch = now;
  }, { passive: false });

  var X = {
    exH: ["Ejemplo de uso", "Exemple d’utilisation", "Example", "Esempio d’uso", "Exemplo de uso"],
    tryEx: ["▶ Probar con el ejemplo", "▶ Essayer l’exemple", "▶ Try the example", "▶ Prova l’esempio", "▶ Experimentar o exemplo"],
    blank: ["Empezar de cero", "Commencer de zéro", "Start from scratch", "Inizia da zero", "Começar do zero"],
    sure: ["¿Seguro? Se borrarán tus datos.", "Sûr ? Vos données seront effacées.", "Sure? Your data will be erased.", "Sicuro? I tuoi dati saranno cancellati.", "Tem a certeza? Os seus dados serão apagados."],
    yes: ["Sí, borrar", "Oui, effacer", "Yes, erase", "Sì, cancella", "Sim, apagar"],
    no: ["Cancelar", "Annuler", "Cancel", "Annulla", "Cancelar"],
    img: ["🖼 Descargar imagen", "🖼 Télécharger l’image", "🖼 Download image", "🖼 Scarica immagine", "🖼 Descarregar imagem"],
    pdf: ["📄 Descargar PDF", "📄 Télécharger le PDF", "📄 Download PDF", "📄 Scarica PDF", "📄 Descarregar PDF"],
    working: ["Preparando…", "Préparation…", "Preparing…", "Preparazione…", "A preparar…"],
    save: ["Descargar", "Télécharger", "Download", "Scarica", "Descarregar"],
    close: ["Cerrar", "Fermer", "Close", "Chiudi", "Fechar"],
    hold: ["Si no se descarga, mantén pulsada la imagen y elige «Guardar».", "Si rien ne se télécharge, appuyez longuement sur l’image et choisissez « Enregistrer ».", "If it doesn’t download, press and hold the image and choose “Save”.", "Se non si scarica, tieni premuta l’immagine e scegli «Salva».", "Se não descarregar, mantenha a imagem premida e escolha «Guardar»."],
    fail: ["No se pudo generar. Recarga la página e inténtalo de nuevo.", "Échec de la génération. Rechargez la page et réessayez.", "Couldn’t create it. Reload the page and try again.", "Impossibile generarlo. Ricarica la pagina e riprova.", "Não foi possível gerar. Recarregue a página e tente de novo."],
    exportH: ["Guardar o compartir", "Enregistrer ou partager", "Save or share", "Salva o condividi", "Guardar ou partilhar"]
  };
  var tr = function (a) { return window.T ? window.T(a) : a[0]; };

  // --- Tarjeta de ejemplo ---
  window.exampleCard = function (el, story, onExample, onBlank) {
    if (typeof el === "string") el = document.getElementById(el);
    if (!el) return;
    el.className = "card example";
    el.innerHTML = '<h2>💡 ' + tr(X.exH) + '</h2><div class="ex-story">' + tr(story) + '</div>' +
      '<div class="row"><button class="btn" data-ex>' + tr(X.tryEx) + '</button><button class="btn ghost" data-blank>' + tr(X.blank) + '</button></div>' +
      '<div class="ex-confirm" hidden><span>' + tr(X.sure) + '</span><button class="btn small" data-yes>' + tr(X.yes) + '</button><button class="btn small ghost" data-no>' + tr(X.no) + '</button></div>';
    var conf = el.querySelector(".ex-confirm");
    el.querySelector("[data-ex]").onclick = function () { onExample(); };
    el.querySelector("[data-blank]").onclick = function () { conf.hidden = false; };
    el.querySelector("[data-no]").onclick = function () { conf.hidden = true; };
    el.querySelector("[data-yes]").onclick = function () { conf.hidden = true; onBlank(); };
  };

  // --- Exportar a imagen y PDF ---
  function shot(nodes) {
    var bg = getComputedStyle(document.body).backgroundColor || "#ffffff";
    document.body.classList.add("exporting");
    return Promise.all(nodes.map(function (n) {
      return window.html2canvas(n, { scale: 2, backgroundColor: bg, useCORS: true, logging: false });
    })).then(function (cs) {
      document.body.classList.remove("exporting");
      var pad = 32, w = Math.max.apply(null, cs.map(function (c) { return c.width; })) + pad * 2;
      var h = cs.reduce(function (s, c) { return s + c.height + pad; }, pad) + 60;
      var out = document.createElement("canvas"); out.width = w; out.height = h;
      var ctx = out.getContext("2d"); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      var y = pad; cs.forEach(function (c) { ctx.drawImage(c, (w - c.width) / 2, y); y += c.height + pad; });
      ctx.fillStyle = "rgba(120,120,130,.9)"; ctx.font = "600 24px Figtree, Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Apps Útiles · gonza0297.github.io/microapps", w / 2, h - 28);
      return out;
    }, function (e) { document.body.classList.remove("exporting"); throw e; });
  }
  function preview(url, name) {
    var m = document.createElement("div"); m.className = "ex-modal";
    m.innerHTML = '<div class="ex-sheet"><img alt=""><p class="msg">' + tr(X.hold) + '</p><div class="row"><a class="btn" download>⬇ ' + tr(X.save) + '</a><button class="btn ghost">' + tr(X.close) + '</button></div></div>';
    m.querySelector("img").src = url; var a = m.querySelector("a"); a.href = url; a.download = name;
    m.querySelector("button").onclick = function () { m.remove(); };
    m.onclick = function (e) { if (e.target === m) m.remove(); };
    document.body.appendChild(m);
  }
  window.exportImage = function (nodes, name) {
    return shot(nodes).then(function (c) { var url = c.toDataURL("image/png"); preview(url, name + ".png"); });
  };
  window.exportPDF = function (nodes, name) {
    return shot(nodes).then(function (c) {
      var jsPDF = window.jspdf.jsPDF, pdf = new jsPDF({ unit: "mm", format: "a4" });
      var pw = 210, ph = 297, m = 8, iw = pw - m * 2, ih = c.height * iw / c.width;
      var img = c.toDataURL("image/jpeg", .92);
      if (ih <= ph - m * 2) pdf.addImage(img, "JPEG", m, m, iw, ih);
      else { var y = 0; while (y < ih) { if (y > 0) pdf.addPage(); pdf.addImage(img, "JPEG", m, m - y, iw, ih); y += ph - m * 2; } }
      pdf.save(name + ".pdf");
    });
  };
  // Barra con los dos botones. getNodes: función que devuelve los elementos a exportar
  window.exportBar = function (el, getNodes, name) {
    if (typeof el === "string") el = document.getElementById(el);
    if (!el) return;
    el.className = "card exportbar";
    el.innerHTML = '<h2>' + tr(X.exportH) + '</h2><div class="row"><button class="btn" data-img>' + tr(X.img) + '</button><button class="btn ghost" data-pdf>' + tr(X.pdf) + '</button></div><div class="msg" aria-live="polite"></div>';
    var msg = el.querySelector(".msg");
    function run(fn) {
      if (!window.html2canvas || (fn === window.exportPDF && !window.jspdf)) { msg.textContent = tr(X.fail); return; }
      msg.textContent = tr(X.working);
      fn(getNodes(), name).then(function () { msg.textContent = ""; }, function () { msg.textContent = tr(X.fail); });
    }
    el.querySelector("[data-img]").onclick = function () { run(window.exportImage); };
    el.querySelector("[data-pdf]").onclick = function () { run(window.exportPDF); };
  };

  var css = document.createElement("style");
  css.textContent =
    "html{touch-action:manipulation;-webkit-text-size-adjust:100%}" +
    ".example{background:var(--soft)!important;border-color:transparent!important}" +
    ".ex-story{display:grid;gap:8px;font-size:15px}.ex-story ol{margin:0;padding-left:20px;display:grid;gap:6px}" +
    ".ex-confirm{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-weight:700}" +
    ".ex-modal{position:fixed;inset:0;z-index:1000;background:rgb(0 0 0 / .7);display:grid;place-items:center;padding:16px}" +
    ".ex-sheet{background:var(--surface);color:var(--ink);border-radius:20px;padding:16px;max-width:520px;width:100%;max-height:92vh;overflow:auto;display:grid;gap:12px}" +
    ".ex-sheet img{width:100%;border-radius:12px;border:1px solid var(--line)}" +
    "body.exporting .x,body.exporting .no-export{display:none!important}";
  document.head.appendChild(css);
})();
