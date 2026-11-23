// ============================================================
// 누비 — «Поделиться»: фотокарточка с печатью места
// Человек выбирает своё фото (или видео) — приложение рисует карточку:
// фото, сверху красная печать места с датой, внизу название и ссылка на 누비.
// Всё делается на телефоне: фото никуда не загружается.
// ============================================================

window.Share = {
  W: 1080, H: 1350,
  base() { return location.origin + location.pathname.replace(/[^/]*$/, ""); },
  link(id) { return this.base() + "?l=" + encodeURIComponent(id); },

  // Перенос строки по ширине (для корейского — по символам, иначе по словам)
  wrap(ctx, text, maxW, maxLines) {
    const parts = /\s/.test(text) ? text.split(/(\s+)/) : [...text];
    const lines = []; let cur = "";
    for (const w of parts) {
      const next = cur + w;
      if (ctx.measureText(next).width > maxW && cur.trim()) { lines.push(cur.trim()); cur = w.trimStart(); }
      else cur = next;
    }
    if (cur.trim()) lines.push(cur.trim());
    if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/.?$/, "…"); }
    return lines;
  },

  async loadImage(file) {
    const url = URL.createObjectURL(file);
    try { return await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; }); }
    finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
  },

  // Рисуем карточку и возвращаем файл JPEG
  async draw(l, file) {
    const { W, H } = this, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    try { await document.fonts.load("700 40px 'Gowun Batang'"); } catch (e) {}
    const img = await this.loadImage(file);
    // фото на весь кадр (обрезаем лишнее по краям)
    const k = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const iw = img.naturalWidth * k, ih = img.naturalHeight * k;
    ctx.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih);
    // затемнение снизу для текста
    const g = ctx.createLinearGradient(0, H * 0.5, 0, H);
    g.addColorStop(0, "rgba(10,14,30,0)"); g.addColorStop(1, "rgba(10,14,30,0.85)");
    ctx.fillStyle = g; ctx.fillRect(0, H * 0.5, W, H * 0.5);

    const name = tr(l.name), v = visits[l.id];
    const date = new Date(v ? v.t : Date.now()).toLocaleDateString(t("locale"));
    const serif = "'Gowun Batang', 'Noto Serif KR', serif", sans = "'IBM Plex Sans KR', system-ui, sans-serif";

    // ── Печать (красная, слегка повёрнута, как настоящий штамп) ──
    ctx.save();
    ctx.translate(W - 210, 230); ctx.rotate(-0.12);
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "rgba(255,248,240,0.82)";
    ctx.beginPath(); ctx.roundRect(-160, -160, 320, 320, 26); ctx.fill();
    ctx.strokeStyle = "#C0392B"; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.roundRect(-150, -150, 300, 300, 22); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-132, -132, 264, 264, 16); ctx.stroke();
    ctx.fillStyle = "#C0392B"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `700 44px ${serif}`;
    const sl = this.wrap(ctx, name, 230, 3);
    const top = -((sl.length - 1) * 50) / 2 - 30;
    sl.forEach((s, i) => ctx.fillText(s, 0, top + i * 50));
    ctx.font = `700 30px ${sans}`; ctx.fillText(date, 0, 66);
    ctx.font = `700 34px ${serif}`; ctx.fillText("누비 · 도장", 0, 116);
    ctx.restore();

    // ── Название и подпись внизу ──
    ctx.fillStyle = "#fff"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 12;
    ctx.font = `700 76px ${serif}`;
    const nl = this.wrap(ctx, name, W - 120, 2);
    let y = H - 210 - (nl.length - 1) * 86;
    nl.forEach(s => { ctx.fillText(s, 60, y); y += 86; });
    ctx.font = `500 34px ${sans}`; ctx.globalAlpha = 0.9;
    ctx.fillText(`📍 ${regionName(l.region)} · ${date}`, 60, H - 140);
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    // полоса с логотипом и адресом
    ctx.fillStyle = "rgba(255,255,255,.14)"; ctx.fillRect(0, H - 96, W, 96);
    ctx.fillStyle = "#fff"; ctx.font = `700 40px ${serif}`; ctx.fillText("누비", 60, H - 34);
    ctx.font = `400 28px ${sans}`; ctx.textAlign = "right"; ctx.globalAlpha = 0.85;
    ctx.fillText(this.base().replace(/^https?:\/\//, "").replace(/\/$/, ""), W - 60, H - 38);
    ctx.globalAlpha = 1;

    const blob = await new Promise(ok => c.toBlob(ok, "image/jpeg", 0.9));
    return new File([blob], `nubi-${String(l.id).replace(/[^\w-]/g, "")}.jpg`, { type: "image/jpeg" });
  },

  // Выбран файл: фото → карточка, видео → как есть, с текстом и ссылкой
  async make(id, file) {
    const l = byId(id); if (!l || !file) return;
    const text = t("shareText", { n: tr(l.name) }) + "\n" + this.link(id);
    toast(t("shareMaking"));
    let out;
    try { out = file.type.startsWith("video/") ? file : await this.draw(l, file); }
    catch (e) { return toast(t("shareErr")); }
    try {
      if (navigator.canShare && navigator.canShare({ files: [out] })) {
        await navigator.share({ files: [out], text, title: "누비" });
        return;
      }
    } catch (e) { if (e && e.name === "AbortError") return; }
    // Телефон не умеет делиться файлом — сохраняем карточку, текст копируем
    const a = document.createElement("a");
    a.href = URL.createObjectURL(out); a.download = out.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    toast(t("shareSaved"), true);
  }
};
