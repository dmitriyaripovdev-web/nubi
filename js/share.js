// ============================================================
// 누비 — «Поделиться»: карточки для соцсетей и мессенджеров
// 1) Печать: карточка с картинкой легенды и красной печатью (или со своим фото).
// 2) Желание: фонарик / ленточка / замочек / монетка у места желаний.
// 3) Челлендж пройден и новое звание.
// Карточка рисуется на телефоне (canvas 1080×1350), никуда не загружается.
// Дальше — меню «Поделиться» телефона (KakaoTalk, Instagram, Telegram…),
// а если телефон так не умеет — картинка сохраняется, текст со ссылкой копируется.
// ============================================================

window.Share = {
  W: 1080, H: 1350,
  serif: "'Gowun Batang', 'Noto Serif KR', serif",
  sans: "'IBM Plex Sans KR', system-ui, sans-serif",
  base() { return location.origin + location.pathname.replace(/[^/]*$/, ""); },
  link(id) { return this.base() + (id ? "?l=" + encodeURIComponent(id) : ""); },
  host() { return this.base().replace(/^https?:\/\//, "").replace(/\/$/, ""); },

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

  img(src) {
    return new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
  },
  async loadImage(file) {
    const url = URL.createObjectURL(file);
    try { return await this.img(url); } finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
  },
  // Картинка места: нарисованная иллюстрация, фото пользовательской легенды или SVG-рисунок
  async artOf(l) {
    if (!l) return null;
    const tries = [];
    if (l.artUrl) tries.push(l.artUrl);
    if (l.photoUrl) tries.push(l.photoUrl);
    tries.push(`img/legends/${l.id}.webp`);
    for (const src of tries) { try { return await this.img(src); } catch (e) {} }
    if (Art.SCENES && Art.SCENES[l.id]) {
      try { return await this.img("data:image/svg+xml;charset=utf-8," + encodeURIComponent(Art.svg(l.id))); } catch (e) {}
    }
    return null;
  },
  async fonts() {
    try { await Promise.all([document.fonts.load(`700 40px ${this.serif}`), document.fonts.load(`500 30px ${this.sans}`)]); } catch (e) {}
  },
  // Картинка «по размеру рамки» (обрезаем лишнее по краям)
  cover(ctx, img, x, y, w, h) {
    const nw = img.naturalWidth || img.width, nh = img.naturalHeight || img.height;
    const k = Math.max(w / nw, h / nh);
    const iw = nw * k, ih = nh * k;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
    ctx.restore();
  },
  // Красная печать (как штамп, слегка повёрнута)
  seal(ctx, cx, cy, size, name, date, foot) {
    const s = size / 320;
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(-0.12); ctx.scale(s, s);
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = "rgba(255,248,240,0.9)";
    ctx.beginPath(); ctx.roundRect(-160, -160, 320, 320, 26); ctx.fill();
    ctx.strokeStyle = "#C0392B"; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.roundRect(-150, -150, 300, 300, 22); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-132, -132, 264, 264, 16); ctx.stroke();
    ctx.fillStyle = "#C0392B"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `700 44px ${this.serif}`;
    const sl = this.wrap(ctx, name, 230, 3);
    const top = -((sl.length - 1) * 50) / 2 - 30;
    sl.forEach((x, i) => ctx.fillText(x, 0, top + i * 50));
    ctx.font = `700 30px ${this.sans}`; ctx.fillText(date, 0, 66);
    ctx.font = `700 34px ${this.serif}`; ctx.fillText(foot || "누비 · 도장", 0, 116);
    ctx.restore();
  },
  // Полоса внизу: логотип и адрес
  footer(ctx, dark) {
    const { W, H } = this;
    ctx.save();
    ctx.fillStyle = dark ? "#1f2a44" : "rgba(255,255,255,.14)"; ctx.fillRect(0, H - 96, W, 96);
    ctx.fillStyle = "#fff"; ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left"; ctx.font = `700 40px ${this.serif}`; ctx.fillText("누비", 60, H - 34);
    ctx.font = `400 28px ${this.sans}`; ctx.textAlign = "right"; ctx.globalAlpha = 0.85;
    ctx.fillText(this.host(), W - 60, H - 38);
    ctx.restore();
  },
  async toFile(c, name) {
    const blob = await new Promise(ok => c.toBlob(ok, "image/jpeg", 0.9));
    return new File([blob], `nubi-${String(name).replace(/[^\w-]/g, "")}.jpg`, { type: "image/jpeg" });
  },
  // На печати — короткое корейское имя места (как на настоящем штампе)
  sealName(l) { return String((l.name && l.name.ko) || tr(l.name)).split(/\s+[—–-]\s+/)[0]; },
  fileFromDataUrl(url, name) {
    const [head, b64] = url.split(",");
    const bin = atob(b64), arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new File([arr], name, { type: (head.match(/data:([^;]+)/) || [])[1] || "image/jpeg" });
  },
  dateStr(d) { return new Date(d || Date.now()).toLocaleDateString(t("locale")); },

  // ── Карточка без своего фото: сверху картинка места, снизу «бумага» с текстом ──
  // o: {art, eyebrow, title, lines[], quote, seal:{name,date,foot}, badge, name}
  async card(o) {
    const { W, H } = this, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    await this.fonts();
    const artH = 760;
    // фон-бумага
    ctx.fillStyle = "#f3ead6"; ctx.fillRect(0, 0, W, H);
    if (o.art) this.cover(ctx, o.art, 0, 0, W, artH);
    else { const g = ctx.createLinearGradient(0, 0, 0, artH); g.addColorStop(0, "#2b3a63"); g.addColorStop(1, "#c9a86a"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, artH); }
    // мягкий переход картинки в бумагу
    const g = ctx.createLinearGradient(0, artH - 120, 0, artH);
    g.addColorStop(0, "rgba(243,234,214,0)"); g.addColorStop(1, "rgba(243,234,214,1)");
    ctx.fillStyle = g; ctx.fillRect(0, artH - 120, W, 120);

    // значок (фонарик, ленточка…) или печать поверх картинки
    if (o.seal) this.seal(ctx, W - 220, artH - 150, 330, o.seal.name, o.seal.date, o.seal.foot);
    if (o.badgeImg) {
      // значок в стиле минхва — круглый медальон
      ctx.save();
      ctx.beginPath(); ctx.arc(W - 190, artH - 130, 120, 0, Math.PI * 2); ctx.closePath();
      ctx.save(); ctx.clip(); ctx.drawImage(o.badgeImg, W - 190 - 140, artH - 130 - 140, 280, 280); ctx.restore();
      ctx.lineWidth = 8; ctx.strokeStyle = "#C0392B"; ctx.stroke();
      ctx.restore();
    } else if (o.badge) {
      ctx.save();
      ctx.beginPath(); ctx.arc(W - 190, artH - 130, 120, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,248,240,.94)"; ctx.fill();
      ctx.lineWidth = 8; ctx.strokeStyle = "#C0392B"; ctx.stroke();
      ctx.font = `120px system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.badge, W - 190, artH - 122);
      ctx.restore();
    }

    // текст
    let y = artH + 40;
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    if (o.eyebrow) { ctx.fillStyle = "#C0392B"; ctx.font = `700 32px ${this.sans}`; ctx.fillText(o.eyebrow.toUpperCase(), 60, y + 10); y += 30; }
    ctx.fillStyle = "#1f2a44"; ctx.font = `700 70px ${this.serif}`;
    const tl = this.wrap(ctx, o.title, W - 120, 2);
    tl.forEach(s => { y += 80; ctx.fillText(s, 60, y); });
    if (o.quote) {
      y += 30;
      ctx.font = `500 42px ${this.serif}`; ctx.fillStyle = "#5b4a2e";
      const ql = this.wrap(ctx, "“" + o.quote + "”", W - 160, 3);
      ctx.fillStyle = "#C0392B"; ctx.fillRect(60, y + 4, 6, ql.length * 54);
      ctx.fillStyle = "#5b4a2e";
      ql.forEach(s => { y += 54; ctx.fillText(s, 84, y); });
    }
    ctx.font = `500 34px ${this.sans}`; ctx.fillStyle = "#5c6378";
    for (const line of (o.lines || [])) {
      if (y > H - 150) break;
      const ll = this.wrap(ctx, line, W - 120, 2);
      ll.forEach(s => { y += 50; ctx.fillText(s, 60, y); });
    }
    this.footer(ctx, true);
    return this.toFile(c, o.name || "card");
  },

  // ── Отправка: окно с готовой карточкой и выбором — KakaoTalk или другие приложения ──
  // KakaoTalk получает «карточку-ссылку» (картинка + кнопка «누비에서 보기»), по ней открывается место.
  // Меню телефона (navigator.share) в Kakao передаёт только картинку, без ссылки, поэтому Kakao — отдельно.
  async send(file, text) {
    const lines = String(text || "").split("\n");
    const link = lines.find(x => /^https?:\/\//.test(x)) || this.link();
    const title = lines.filter(x => x && !/^https?:\/\//.test(x)).join(" ") || "누비";
    this.sheet(file, text, { title, link });
  },
  fallback(file, text) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    toast(t("shareSaved"), true);
  },
  // Kakao JavaScript SDK (загружается только когда нужен)
  KAKAO_KEY: "fd89d2754b520199da2095c73b142935",
  kakao() {
    if (this._kakao) return this._kakao;
    this._kakao = new Promise((ok, no) => {
      if (window.Kakao && Kakao.Share) return ok(Kakao);
      const sc = document.createElement("script");
      sc.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
      sc.integrity = "sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka";
      sc.crossOrigin = "anonymous";
      sc.onload = () => ok(Kakao); sc.onerror = no;
      document.head.appendChild(sc);
    }).then(K => { if (!K.isInitialized()) K.init(this.KAKAO_KEY); return K; });
    this._kakao.catch(() => { this._kakao = null; });
    return this._kakao;
  },
  // Окно: карточка + «KakaoTalk» / «Другие приложения» / «Сохранить»
  sheet(file, text, meta) {
    const url = URL.createObjectURL(file);
    const isImg = file.type.startsWith("image/");
    const box = document.createElement("div");
    box.className = "aled";
    box.innerHTML = `<div class="aled-top"><b>${t("shareMini")}</b><button class="aled-x" data-a="close" aria-label="✕">✕</button></div>
      <div class="aled-pic">${isImg ? `<img alt="" src="${url}">` : `<video src="${url}" controls playsinline></video>`}</div>
      <div class="aled-b">
        ${isImg ? `<button class="btn kakao-btn" data-a="kakao" disabled>💬 ${t("shareKakao")}</button>` : ""}
        <button class="btn ghost" data-a="go">📤 ${t("shareOther")}</button>
        <button class="btn ghost" data-a="save">💾 ${t("albSave")}</button>
      </div>`;
    document.body.appendChild(box);
    const done = () => { box.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
    // Картинку заранее загружаем на сервер Kakao — тогда кнопка откроет KakaoTalk сразу
    let kimg = null;
    const kb = box.querySelector("[data-a=kakao]");
    if (kb) {
      kb.textContent = "💬 …";
      this.kakao().then(K => K.Share.uploadImage({ file: [file] }))
        .then(r => { kimg = r.infos.original; kb.disabled = false; kb.textContent = "💬 " + t("shareKakao"); })
        .catch(() => { kb.remove(); });
    }
    box.onclick = async e => {
      const b = e.target.closest("button"); if (!b) return;
      const a = b.dataset.a;
      if (a === "close") return done();
      if (a === "kakao" && kimg) {
        try {
          Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: meta.title, description: t("shareKakaoDesc"),
              imageUrl: kimg.url.replace(/^http:/, "https:"), imageWidth: kimg.width, imageHeight: kimg.height,
              link: { mobileWebUrl: meta.link, webUrl: meta.link }
            },
            buttons: [{ title: t("shareKakaoBtn"), link: { mobileWebUrl: meta.link, webUrl: meta.link } }]
          });
          done();
        } catch (err) { toast(t("shareErr2"), true); }
        return;
      }
      if (a === "go") {
        // KakaoTalk и некоторые другие приложения берут из меню только картинку —
        // поэтому ссылку на всякий случай кладём в буфер обмена
        if (navigator.clipboard) navigator.clipboard.writeText(meta.link).then(() => toast(t("shareLinkCopied"), true)).catch(() => {});
        try {
          if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text, title: "누비" }); done(); return; }
        } catch (err) { if (err && err.name === "AbortError") return; }
        done(); this.fallback(file, text);
        return;
      }
      if (a === "save") { done(); this.fallback(file, text); }
    };
  },
  async run(make, text) {
    toast(t("shareMaking"));
    let file;
    try { file = await make(); } catch (e) { return toast(t("shareErr2"), true); }
    await this.send(file, text);
  },

  // ===== 1. Печать =====
  stamp(id) {
    const l = byId(id); if (!l) return;
    const v = visits[l.id], date = this.dateStr(v && v.t);
    const name = tr(l.name);
    return this.run(async () => this.card({
      art: await this.artOf(l), eyebrow: t("cardStamp"), title: name,
      lines: [`📍 ${regionName(l.region)} · ${date}`, t("cardStampTotal", { n: count() })],
      seal: { name: this.sealName(l), date }, name: l.id
    }), t("shareText", { n: name }) + "\n" + this.link(l.id));
  },

  // Печать на своём фото (или видео как есть)
  async drawPhoto(l, file) {
    const { W, H } = this, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    await this.fonts();
    const img = await this.loadImage(file);
    this.cover(ctx, img, 0, 0, W, H);
    const g = ctx.createLinearGradient(0, H * 0.5, 0, H);
    g.addColorStop(0, "rgba(10,14,30,0)"); g.addColorStop(1, "rgba(10,14,30,0.85)");
    ctx.fillStyle = g; ctx.fillRect(0, H * 0.5, W, H * 0.5);
    const name = tr(l.name), v = visits[l.id], date = this.dateStr(v && v.t);
    this.seal(ctx, W - 210, 230, 320, this.sealName(l), date);
    ctx.fillStyle = "#fff"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 12;
    ctx.font = `700 76px ${this.serif}`;
    const nl = this.wrap(ctx, name, W - 120, 2);
    let y = H - 210 - (nl.length - 1) * 86;
    nl.forEach(s => { ctx.fillText(s, 60, y); y += 86; });
    ctx.font = `500 34px ${this.sans}`; ctx.globalAlpha = 0.9;
    ctx.fillText(`📍 ${regionName(l.region)} · ${date}`, 60, H - 140);
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    this.footer(ctx, false);
    return this.toFile(c, l.id);
  },
  async make(id, file) {
    const l = byId(id); if (!l || !file) return;
    const text = t("shareText", { n: tr(l.name) }) + "\n" + this.link(id);
    toast(t("shareMaking"));
    let out;
    try { out = file.type.startsWith("video/") ? file : await this.drawPhoto(l, file); }
    catch (e) { return toast(t("shareErr")); }
    await this.send(out, text);
  },

  // ===== 2. Желание =====
  // w: {place_id, kind, text, is_public, created_at}
  wish(w) {
    const l = byId(w.place_id); if (!l) return;
    const kind = w.kind || "lantern", name = tr(l.name);
    // Текст желания показываем, только если оно открытое (монетка — всегда секрет)
    const quote = kind !== "coin" && w.is_public ? w.text : null;
    return this.run(async () => this.card({
      art: await this.artOf(l), eyebrow: t("cardWish_" + kind), title: name, quote,
      lines: [quote ? `📍 ${regionName(l.region)} · ${this.dateStr(w.created_at)}` : t("cardWishSecret"),
              ...(quote ? [] : [`📍 ${regionName(l.region)} · ${this.dateStr(w.created_at)}`]), t("cardWishJoin")],
      badgeImg: await this.img(`img/ui/wish-${kind}.webp`).catch(() => null), badge: WISH_ICON[kind] || "🏮", name: "wish-" + l.id
    }), t("wishShareText_" + kind, { n: name }) + "\n" + this.link(l.id));
  },

  // ===== 3. Челлендж и звание =====
  challenge(cid) {
    const c = CHALLENGES.find(x => x.id === cid); if (!c) return;
    const ids = c.ids || [], first = ids.map(byId).find(Boolean);
    const title = titleById(c.reward);
    const places = ids.map(byId).filter(Boolean).map(l => "✓ " + tr(l.name));
    return this.run(async () => this.card({
      art: await this.artOf(first), eyebrow: t("cardCh"), title: tr(c.name),
      lines: [...places.slice(0, 4), title ? t("cardChTitle", { t: tr(title.name) }) : ""].filter(Boolean),
      badge: "🏆", name: "ch-" + c.id
    }), t("chShareText", { n: tr(c.name) }) + "\n" + this.link());
  },
  title(tid) {
    const x = titleById(tid); if (!x) return;
    const ch = x.kind === "challenge" && CHALLENGES.find(c => c.id === x.ch);
    const l = ch ? (ch.ids || []).map(byId).find(Boolean)
      : all().filter(v => visits[v.id]).sort((a, b) => (visits[b.id].t || 0) - (visits[a.id].t || 0))[0];
    return this.run(async () => this.card({
      art: await this.artOf(l), eyebrow: t("cardTitle"), title: tr(x.name),
      lines: [tr(x.desc), t("cardStampTotal", { n: count() })],
      badge: "🎖️", name: "title-" + x.id
    }), t("titleShareText", { n: tr(x.name) }) + "\n" + this.link());
  }
};
