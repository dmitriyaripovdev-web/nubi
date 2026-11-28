// ============================================================
// 누비 — «Мой альбом»: фото на месте легенды с фильтром и печатью
// 1) В карточке места — «📷 Фото на месте»: камера приложения, проверка, что ты рядом.
// 2) Выбор фильтра (старая бумага, тушь, рамка минхва, без фильтра) — всё рисует телефон.
// 3) Сохранить в телефон / поделиться / просто оставить в альбоме.
// Фото хранится на телефоне (IndexedDB). У вошедших через Kakao копия тихо уходит
// на сервер (закрытое хранилище «album») — видна только владельцу, с любого телефона.
// ============================================================

// ----- Сервер: свои фото альбома -----
Object.assign(Server, {
  async albumUpload(item, dataUrl) {
    const path = await this.uploadPhoto("album", item.id, dataUrl);
    const { error } = await this.db.from("album").insert({
      id: item.id, place_id: item.place, filter: item.filter, lat: item.lat, lng: item.lng,
      shot_at: new Date(item.t).toISOString(), path
    });
    if (error && !/duplicate/.test(error.message || "")) throw error.message;
    return path;
  },
  async albumList() {
    const { data, error } = await this.db.from("album")
      .select("id, place_id, filter, lat, lng, shot_at, path").order("shot_at", { ascending: false }).limit(500);
    if (error) throw error.message;
    return data || [];
  },
  async albumUrl(path) {
    const { data } = await this.db.storage.from("album").createSignedUrl(path, 3600);
    return data && data.signedUrl;
  },
  async albumDelete(id, path) {
    if (path) await this.db.storage.from("album").remove([path]);
    await this.db.from("album").delete().eq("id", id);
  }
});

window.Album = {
  list: [],        // фото на этом телефоне: {id, place, filter, t, lat, lng, path?, synced?}
  remote: null,    // фото с сервера, которых нет на этом телефоне (null — ещё не загружали)
  urls: {},        // id -> временная ссылка на фото с сервера
  FILTERS: ["paper", "ink", "frame", "plain"],
  W: 1080, H: 1350,

  init() { this.list = store.get("album", []); },
  saveList() { store.set("album", this.list); },
  key(id) { return "al_" + id; },
  // Все мои фото: с телефона и с сервера, новые сверху
  all() {
    const local = new Set(this.list.map(x => x.id));
    const rem = (this.remote || []).filter(r => !local.has(r.id))
      .map(r => ({ id: r.id, place: r.place_id, filter: r.filter, t: new Date(r.shot_at).getTime(), lat: r.lat, lng: r.lng, path: r.path, remote: true }));
    return this.list.concat(rem).sort((a, b) => b.t - a.t);
  },
  of(place) { return this.all().filter(x => x.place === place); },
  async src(item) {
    if (!item.remote) { const s = await Photos.get(this.key(item.id)); if (s) return s; }
    if (item.path && srv.ready && Server.user) {
      if (!this.urls[item.id]) this.urls[item.id] = await Server.albumUrl(item.path).catch(() => null);
      return this.urls[item.id];
    }
    return null;
  },

  // ===== Кнопки и блоки для экранов =====
  // Кнопка в карточке места + мои фото этого места
  placeBlock(l) {
    const mine = this.of(l.id);
    return `<div class="albox">
      <button class="btn ghost share-btn" data-album-shoot="${esc(l.id)}">📷 ${t("albShoot")}</button>
      ${mine.length ? `<div class="alstrip">${mine.slice(0, 8).map(x => `<button class="alth" data-album-view="${x.id}"><img data-alimg="${x.id}" alt=""></button>`).join("")}</div>` : ""}
      <p class="note">${t("albHint")}</p></div>`;
  },
  // Блок «Мой альбом» в профиле
  profileBlock() {
    const items = this.all();
    return `<h3 class="sub-h">${t("albH")}${items.length ? ` · ${items.length}` : ""}</h3>
      ${items.length ? `<div class="algrid">${items.map(x => `<button class="alth" data-album-view="${x.id}"><img data-alimg="${x.id}" alt="" loading="lazy"></button>`).join("")}</div>`
        : `<p class="meta">${t("albEmpty")}</p>`}
      ${items.length && !Server.isKakao() ? `<p class="note">${t("albKakaoNote")}</p>` : ""}`;
  },
  // После отрисовки: подставляем картинки, тянем список с сервера, досылаем неотправленное
  load() {
    document.querySelectorAll("[data-alimg]").forEach(im => {
      const it = this.all().find(x => x.id === im.dataset.alimg);
      if (it) this.src(it).then(s => { if (s) im.src = s; });
    });
    if (srv.ready && Server.isKakao()) {
      if (this.remote === null && ui.tab === "me") {
        this.remote = [];
        Server.albumList().then(r => { this.remote = r; if (ui.tab === "me") render(); }).catch(() => {});
      }
      this.sync();
    }
  },
  // Отправляем на сервер фото, которые ещё не отправлены (только вход через Kakao)
  async sync() {
    if (this.syncing || !srv.ready || !Server.isKakao()) return;
    const todo = this.list.filter(x => !x.synced);
    if (!todo.length) return;
    this.syncing = true;
    for (const it of todo) {
      try {
        const src = await Photos.get(this.key(it.id));
        if (!src) { it.synced = true; continue; }
        it.path = await Server.albumUpload(it, src);
        it.synced = true; this.saveList();
      } catch (e) { break; }   // нет сети или лимит — попробуем в следующий раз
    }
    this.syncing = false;
  },

  // ===== Съёмка =====
  async shoot(id) {
    const l = byId(id); if (!l) return;
    let shot;
    try { shot = await Camera.shoot({ cancel: t("cancel"), shutter: t("shutter"), locating: t("locating") }); }
    catch (err) { return toast({ camDenied: t("camDenied"), camErr: t("camErr"), gpsDenied: t("gpsDenied"), gpsErr: t("photoGpsFail") }[err] || t("camErr"), true); }
    if (!shot) return;
    const p = pos(l);
    if (p && !testMode) {
      const d = Geo.distance(shot, p);
      if (d > radius(l)) return toast(t("albTooFar", { d: Geo.format(d, lang), r: radius(l) }), true);
    }
    this.editor(l, shot);
  },

  // ===== Фильтры (рисует телефон, без интернета) =====
  async compose(img, l, filter, scale, date) {
    const W = Math.round(this.W * scale), H = Math.round(this.H * scale), k = scale;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    const name = tr(l.name);
    if (filter === "frame") {
      // Фото в рамке на бумаге, подпись снизу — как наши иллюстрации
      ctx.fillStyle = "#f3ead6"; ctx.fillRect(0, 0, W, H);
      this.noise(ctx, W, H, 0.05);
      const x = 60 * k, y = 60 * k, w = W - 120 * k, h = 1000 * k;
      Share.cover(ctx, img, x, y, w, h);
      this.tone(ctx, x, y, w, h, "paper", 0.6);
      ctx.strokeStyle = "#2b3a63"; ctx.lineWidth = 6 * k; ctx.strokeRect(x - 14 * k, y - 14 * k, w + 28 * k, h + 28 * k);
      ctx.lineWidth = 2 * k; ctx.strokeRect(x - 24 * k, y - 24 * k, w + 48 * k, h + 48 * k);
      ctx.fillStyle = "#1f2a44"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = `700 ${58 * k}px ${Share.serif}`;
      const nl = Share.wrap(ctx, name, W - 420 * k, 2);
      let ty = y + h + 100 * k;
      nl.forEach(s => { ctx.fillText(s, x, ty); ty += 66 * k; });
      ctx.font = `500 ${30 * k}px ${Share.sans}`; ctx.fillStyle = "#5c6378";
      ctx.fillText(`📍 ${regionName(l.region)} · ${date} · 누비`, x, H - 50 * k);
      Share.seal(ctx, W - 190 * k, y + h + 120 * k, 250 * k, Share.sealName(l), date);
      return c;
    }
    Share.cover(ctx, img, 0, 0, W, H);
    if (filter !== "plain") this.tone(ctx, 0, 0, W, H, filter, 1);
    if (filter === "paper") this.noise(ctx, W, H, 0.07);
    // виньетка
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, filter === "paper" ? "rgba(90,60,20,.35)" : "rgba(0,0,0,.35)");
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    // низ: название и дата
    const g = ctx.createLinearGradient(0, H * 0.6, 0, H);
    g.addColorStop(0, "rgba(10,14,30,0)"); g.addColorStop(1, "rgba(10,14,30,.8)");
    ctx.fillStyle = g; ctx.fillRect(0, H * 0.6, W, H * 0.4);
    ctx.fillStyle = "#fff"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 10 * k;
    ctx.font = `700 ${64 * k}px ${Share.serif}`;
    const nl = Share.wrap(ctx, name, W - 120 * k, 2);
    let y = H - 150 * k - (nl.length - 1) * 74 * k;
    nl.forEach(s => { ctx.fillText(s, 60 * k, y); y += 74 * k; });
    ctx.font = `500 ${30 * k}px ${Share.sans}`;
    ctx.fillText(`📍 ${regionName(l.region)} · ${date}`, 60 * k, H - 90 * k);
    ctx.font = `700 ${34 * k}px ${Share.serif}`; ctx.fillText("누비", 60 * k, H - 40 * k);
    ctx.shadowBlur = 0;
    Share.seal(ctx, W - 170 * k, 180 * k, 260 * k, Share.sealName(l), date);
    return c;
  },
  // Цветовая обработка пикселей (работает во всех браузерах, без ctx.filter)
  tone(ctx, x, y, w, h, filter, amt) {
    x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
    const im = ctx.getImageData(x, y, w, h), d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], g = d[i + 1], b = d[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      let nr, ng, nb;
      if (filter === "ink") {
        // тушь: чёрно-белое с контрастом и лёгким синим
        const v = Math.max(0, Math.min(255, (lum - 128) * 1.2 + 128));
        nr = v * 0.93 + 4; ng = v * 0.97 + 6; nb = v * 1.02 + 14;
      } else {
        // старая бумага: тёплая сепия, приглушённые цвета, светлые тени
        const sr = 0.393 * r + 0.769 * g + 0.189 * b, sg = 0.349 * r + 0.686 * g + 0.168 * b, sb = 0.272 * r + 0.534 * g + 0.131 * b;
        nr = r * 0.55 + sr * 0.45; ng = g * 0.55 + sg * 0.45; nb = b * 0.55 + sb * 0.45;
        nr = nr * 0.88 + 26; ng = ng * 0.88 + 20; nb = nb * 0.86 + 10;
      }
      d[i] = r + (nr - r) * amt; d[i + 1] = g + (ng - g) * amt; d[i + 2] = b + (nb - b) * amt;
    }
    ctx.putImageData(im, x, y);
  },
  // Зерно старой бумаги
  noise(ctx, W, H, a) {
    const n = Math.round(W * H / 900);
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? `rgba(80,55,20,${a})` : `rgba(255,250,235,${a})`;
      ctx.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2.5, 1 + Math.random() * 2.5);
    }
  },

  // ===== Экран выбора фильтра (поверх приложения) =====
  async editor(l, shot) {
    const img = await Share.img(shot.photo);
    await Share.fonts();
    const date = Share.dateStr(shot.time);
    let filter = store.get("albFilter", "paper");
    if (!this.FILTERS.includes(filter)) filter = "paper";
    const box = document.createElement("div");
    box.className = "aled";
    box.innerHTML = `<div class="aled-top"><b>${esc(tr(l.name))}</b><button class="aled-x" data-a="cancel" aria-label="✕">✕</button></div>
      <div class="aled-pic"><img alt=""></div>
      <div class="aled-f">${this.FILTERS.map(f => `<button data-f="${f}"><img alt=""><span>${t("albF_" + f)}</span></button>`).join("")}</div>
      <div class="aled-b">
        <button class="btn ghost" data-a="save">💾 ${t("albSave")}</button>
        <button class="btn ghost" data-a="share">📤 ${t("shareMini")}</button>
        <button class="btn" data-a="done">✓ ${t("albDone")}</button>
      </div>`;
    document.body.appendChild(box);
    const big = box.querySelector(".aled-pic img");
    const show = async () => {
      box.querySelectorAll("[data-f]").forEach(b => b.classList.toggle("on", b.dataset.f === filter));
      big.src = (await this.compose(img, l, filter, 0.5, date)).toDataURL("image/jpeg", 0.8);
    };
    // маленькие образцы фильтров
    for (const f of this.FILTERS) {
      const c = await this.compose(img, l, f, 0.16, date);
      box.querySelector(`[data-f="${f}"] img`).src = c.toDataURL("image/jpeg", 0.7);
    }
    show();
    box.onclick = async e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.f) { filter = b.dataset.f; store.set("albFilter", filter); return show(); }
      const a = b.dataset.a; if (!a) return;
      if (a === "cancel") { box.remove(); return; }
      box.querySelectorAll("button").forEach(x => x.disabled = true);
      // итоговое фото в полном размере → в альбом
      const out = (await this.compose(img, l, filter, 1, date)).toDataURL("image/jpeg", 0.85);
      const item = { id: crypto.randomUUID(), place: l.id, filter, t: shot.time, lat: shot.lat, lng: shot.lng, synced: false };
      try { await Photos.put(this.key(item.id), out); } catch (err) { toast(t("albErr"), true); box.remove(); return; }
      this.list.unshift(item); this.saveList();
      box.remove();
      if (a === "save") await this.download(item, out);
      if (a === "share") await this.share(item, out);
      if (a === "done") toast(t("albSaved"), true);
      render();
      this.sync();
    };
  },

  async fileOf(item, src) {
    const blob = await (await fetch(src)).blob();
    return new File([blob], `nubi-${item.place}-${new Date(item.t).toISOString().slice(0, 10)}.jpg`, { type: "image/jpeg" });
  },
  // Сохранить в телефон: на Android — в «Загрузки» (видно в галерее), на iPhone — через меню «Сохранить изображение»
  async download(item, src) {
    const file = await this.fileOf(item, src);
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (ios && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file] }); } catch (e) {}
      return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(t("albDownloaded"), true);
  },
  async share(item, src) {
    const l = byId(item.place);
    const file = await this.fileOf(item, src);
    await Share.send(file, t("albShareText", { n: l ? tr(l.name) : "" }) + "\n" + Share.link(item.place));
  },

  // ===== Просмотр фото из альбома =====
  async view(id) {
    const item = this.all().find(x => x.id === id); if (!item) return;
    const l = byId(item.place);
    const box = document.createElement("div");
    box.className = "aled alview";
    box.innerHTML = `<div class="aled-top"><b>${l ? esc(tr(l.name)) : esc(item.place)}</b><button class="aled-x" data-a="close" aria-label="✕">✕</button></div>
      <div class="aled-pic"><img alt=""></div>
      <p class="meta aled-d">${new Date(item.t).toLocaleString(t("locale"))}</p>
      <div class="aled-b">
        <button class="btn ghost" data-a="save">💾 ${t("albSave")}</button>
        <button class="btn ghost" data-a="share">📤 ${t("shareMini")}</button>
        ${l ? `<button class="btn ghost" data-a="place">📍 ${t("albToPlace")}</button>` : ""}
        <button class="btn ghost danger" data-a="del">🗑 ${t("albDel")}</button>
      </div>`;
    document.body.appendChild(box);
    const src = await this.src(item);
    if (src) box.querySelector(".aled-pic img").src = src;
    let confirmDel = false;
    box.onclick = async e => {
      const b = e.target.closest("button"); if (!b) return;
      const a = b.dataset.a;
      if (a === "close") return box.remove();
      if (a === "place") { box.remove(); return openLegend(item.place); }
      if (!src) return toast(t("albErr"), true);
      if (a === "save") return this.download(item, src);
      if (a === "share") return this.share(item, src);
      if (a === "del") {
        if (!confirmDel) { confirmDel = true; b.textContent = "🗑 " + t("albDelSure"); return; }
        box.remove();
        await this.remove(item);
        render();
      }
    };
  },
  async remove(item) {
    this.list = this.list.filter(x => x.id !== item.id); this.saveList();
    if (this.remote) this.remote = this.remote.filter(x => x.id !== item.id);
    try { await Photos.put(this.key(item.id), null); } catch (e) {}
    if ((item.synced || item.remote) && srv.ready && Server.user) {
      try { await Server.albumDelete(item.id, item.path || `${Server.user.id}/${item.id}.jpg`); } catch (e) {}
    }
    toast(t("albDeleted"));
  },

  handles(d) { return !!(d.albumShoot || d.albumView); },
  click(b) {
    const d = b.dataset;
    if (d.albumShoot) this.shoot(d.albumShoot);
    else if (d.albumView) this.view(d.albumView);
  }
};
