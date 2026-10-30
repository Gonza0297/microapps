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
    share: ["📤 Guardar / Compartir", "📤 Enregistrer / Partager", "📤 Save / Share", "📤 Salva / Condividi", "📤 Guardar / Partilhar"],
    open: ["👁 Abrir", "👁 Ouvrir", "👁 Open", "👁 Apri", "👁 Abrir"],
    ready: ["¡Listo! Elige cómo guardarlo:", "C’est prêt ! Choisissez comment l’enregistrer :", "Ready! Choose how to save it:", "Pronto! Scegli come salvarlo:", "Pronto! Escolha como guardar:"],
    inapp: ["Estás dentro de Instagram/TikTok y aquí no se pueden descargar archivos. Toca <b>···</b> arriba a la derecha → <b>Abrir en el navegador</b> (Safari o Chrome) y descarga desde ahí.", "Vous êtes dans Instagram/TikTok, qui bloque les téléchargements. Touchez <b>···</b> en haut à droite → <b>Ouvrir dans le navigateur</b> (Safari ou Chrome) et téléchargez depuis là.", "You’re inside Instagram/TikTok, which blocks downloads. Tap <b>···</b> at the top right → <b>Open in browser</b> (Safari or Chrome) and download from there.", "Sei dentro Instagram/TikTok, che blocca i download. Tocca <b>···</b> in alto a destra → <b>Apri nel browser</b> (Safari o Chrome) e scarica da lì.", "Está dentro do Instagram/TikTok, que bloqueia transferências. Toque em <b>···</b> no canto superior direito → <b>Abrir no navegador</b> (Safari ou Chrome) e descarregue a partir daí."],
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
  var UA = navigator.userAgent || "";
  window.IN_APP = /Instagram|FBAN|FBAV|FB_IAB|musical_ly|TikTok|Bytedance|Snapchat|Line\//i.test(UA);
  // Entrega un archivo: Compartir (menú del móvil), Descargar y Abrir
  window.deliverFile = function (blob, name, previewUrl) {
    var file = null; try { file = new File([blob], name, { type: blob.type }); } catch (e) {}
    var canShare = !!(file && navigator.canShare && navigator.share && navigator.canShare({ files: [file] }));
    var url = URL.createObjectURL(blob);
    var m = document.createElement("div"); m.className = "ex-modal";
    m.innerHTML = '<div class="ex-sheet">' + (previewUrl ? '<img alt="">' : '<div class="ex-file">📄 ' + name.replace(/[<>&"]/g, "") + '</div>') +
      '<p style="margin:0;font-weight:700">' + tr(X.ready) + '</p>' +
      (window.IN_APP ? '<p class="ex-warn">' + tr(X.inapp) + '</p>' : '') +
      '<div class="ex-btns">' + (canShare ? '<button class="btn" data-share>' + tr(X.share) + '</button>' : '') +
      '<a class="btn' + (canShare ? ' ghost' : '') + '" data-dl>⬇ ' + tr(X.save) + '</a><a class="btn ghost" data-open target="_blank" rel="noopener">' + tr(X.open) + '</a>' +
      '<button class="btn ghost" data-close>' + tr(X.close) + '</button></div>' +
      (previewUrl ? '<p class="msg">' + tr(X.hold) + '</p>' : '') + '</div>';
    if (previewUrl) m.querySelector("img").src = previewUrl;
    var a = m.querySelector("[data-dl]"); a.href = url; a.download = name;
    m.querySelector("[data-open]").href = url;
    var sh = m.querySelector("[data-share]");
    if (sh) sh.onclick = function () { navigator.share({ files: [file], title: name }).catch(function () {}); };
    m.querySelector("[data-close]").onclick = function () { m.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000); };
    m.onclick = function (e) { if (e.target === m) m.querySelector("[data-close]").click(); };
    document.body.appendChild(m);
  };
  function preview(url, name) {
    var m = document.createElement("div"); m.className = "ex-modal";
    m.innerHTML = '<div class="ex-sheet"><img alt=""><p class="msg">' + tr(X.hold) + '</p><div class="row"><a class="btn" download>⬇ ' + tr(X.save) + '</a><button class="btn ghost">' + tr(X.close) + '</button></div></div>';
    m.querySelector("img").src = url; var a = m.querySelector("a"); a.href = url; a.download = name;
    m.querySelector("button").onclick = function () { m.remove(); };
    m.onclick = function (e) { if (e.target === m) m.remove(); };
    document.body.appendChild(m);
  }
  window.exportImage = function (nodes, name) {
    return shot(nodes).then(function (c) {
      var url = c.toDataURL("image/png");
      return new Promise(function (res) { c.toBlob(function (b) { window.deliverFile(b, name + ".png", url); res(); }, "image/png"); });
    });
  };
  window.exportPDF = function (nodes, name) {
    return shot(nodes).then(function (c) {
      var jsPDF = window.jspdf.jsPDF, pdf = new jsPDF({ unit: "mm", format: "a4" });
      var pw = 210, ph = 297, m = 8, iw = pw - m * 2, ih = c.height * iw / c.width;
      var img = c.toDataURL("image/jpeg", .92);
      if (ih <= ph - m * 2) pdf.addImage(img, "JPEG", m, m, iw, ih);
      else { var y = 0; while (y < ih) { if (y > 0) pdf.addPage(); pdf.addImage(img, "JPEG", m, m - y, iw, ih); y += ph - m * 2; } }
      window.deliverFile(pdf.output("blob"), name + ".pdf", null);
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
    ".ex-btns{display:flex;flex-wrap:wrap;gap:8px}.ex-btns .btn{flex:1 1 140px}" +
    ".ex-warn{margin:0;background:#fff4cc;color:#3a2e00;border-radius:12px;padding:10px 12px;font-size:14px}" +
    ".ex-file{font-size:20px;font-weight:800;padding:24px;text-align:center;border:2px dashed var(--line);border-radius:14px;overflow-wrap:anywhere}" +
    "body.exporting .x,body.exporting .no-export{display:none!important}";
  document.head.appendChild(css);
})();
