// ============================================================
// 누비 — «Загадать желание» и «Стена фонариков» (소원의 벽)
// Желание можно загадать только там, где стоит твоя печать (проверяет сервер).
// По умолчанию желание видит только автор. Если повесить фонарик на стену —
// он загорится после проверки в админке и будет висеть без имени.
// ============================================================

// Места, где по традиции загадывают желания (храмы, алтари, деревья-хранители, рассветы)
const WISH_IDS = new Set([
  "yongju",        // 용주사 — храм сыновней молитвы
  "chamseong",     // 마니산 참성단 — алтарь небу
  "swingil",       // 쉰길바위 — камень, у которого молились
  "jeunggeo",      // 증거리 느티나무 — дерево-хранитель деревни (당산나무)
  "bonghyeol",     // 봉림사
  "mubongsan",     // 만의사 на горе 무봉산
  "hongnang",      // 홍법사 — святилище 홍랑각시
  "cheondeungsan", // 천등사 터 — место молитв
  "ssangbongsan",  // 쌍봉산 — молитвы на вершине
  "jebudo",        // 제부도 — море и закаты
  "geumbul"        // 황금불상과 절골 우물 — колодец золотого Будды
]);

// ===== Запросы к серверу =====
Object.assign(Server, {
  async makeWish(place, text, isPublic) {
    const { data, error } = await this.db.rpc("make_wish", { p_place: place, p_text: text, p_public: isPublic });
    if (error) throw error.message;
    return data;
  },
  async wishWall(place) {
    const { data, error } = await this.db.rpc("wish_wall", { p_place: place });
    if (error) throw error.message;
    return data || [];
  },
  async wishStats(place) {
    const { data, error } = await this.db.rpc("wish_place_stats", { p_place: place });
    if (error) throw error.message;
    return data || {};
  },
  async myCheersCount() {
    const { data, error } = await this.db.rpc("my_cheers_count");
    if (error) throw error.message;
    return data || 0;
  },
  async cheerWish(id) {
    const { data, error } = await this.db.rpc("cheer_wish", { p_wish: id });
    if (error) throw error.message;
    return data;
  },
  async fulfillWish(id) {
    const { data, error } = await this.db.rpc("fulfill_wish", { p_wish: id });
    if (error) throw error.message;
    return data;
  },
  async myWishes() {
    const { data, error } = await this.db.from("wishes")
      .select("id, place_id, text, is_public, status, cheers, fulfilled_at, created_at")
      .eq("user_id", this.user.id).order("created_at", { ascending: false }).limit(200);
    if (error) throw error.message;
    return data || [];
  }
});

window.Wish = {
  walls: {},      // id места -> список фонариков (undefined = ещё не загружали)
  mine: undefined,
  fly: null,      // id места, над которым только что улетел фонарик (анимация)
  stats: {},      // id места -> {lit, today, flown}
  picks: {},      // id места -> 6 фонариков под небом (не меняются, пока открыт экран)
  open: null,     // открытый фонарик {place, id}
  browse: null,   // режим «Листать фонарики» {place, order:[id], i}
  cheersGiven: undefined,   // сколько желаний я поддержал (звание «Хранитель огней»)

  // Обрабатывает ли Wish это нажатие
  handles(d) {
    return !!(d.wishSend || d.cheer || d.fulfill || d.lopen || d.lcatch || d.lbrowse)
      || ["wishGoto", "lclose", "lnext", "lstop"].some(k => d[k] !== undefined);
  },

  is(id) { return WISH_IDS.has(id); },

  // Значок в списке легенд
  tag(id) { return this.is(id) ? `<span class="lantern-tag" title="${esc(t("wishPlace"))}">🏮</span>` : ""; },

  // Блок на странице легенды
  card(l) {
    if (!this.is(l.id)) return "";
    const v = visits[l.id];
    let form;
    if (!srv.ready) form = `<p class="meta">${t("offlineBanner")}</p>`;
    else if (!v || v.test || v.offline) form = `<ol class="wsteps">
        <li>${t("wishStep1")}</li><li>${t("wishStep2")}</li><li>${t("wishStep3")}</li></ol>
      <button class="btn lantern-btn" data-wish-goto>📍 ${t("wishGoStamp")}</button>`;
    else form = `<textarea id="wish-text" maxlength="120" rows="2" placeholder="${esc(t("wishPh"))}"></textarea>
      <label class="wcheck"><input type="checkbox" id="wish-public"> <span>${t("wishPublic")}</span></label>
      <button class="btn lantern-btn" data-wish-send="${esc(l.id)}" ${ui.busy ? "disabled" : ""}>🏮 ${t("wishSend")}</button>
      <p class="note">${t("wishRules")}</p>`;
    const wall = this.walls[l.id];
    return `<section class="wishbox">
      ${this.fly === l.id ? `<div class="fly">🏮</div>` : ""}
      <h3>🏮 ${t("wishH")}</h3>
      <p class="meta" style="margin:0 0 10px">${t("wishIntro")}</p>
      ${form}
      <h3 class="wall-h">${t("skyH")}</h3>
      ${wall == null ? `<p class="meta">…</p>` : this.skyBlock(l.id, wall)}
    </section>`;
  },

  // ===== Небо фонариков =====
  // Место огонька на небе считаем из id — у каждого фонарика своё постоянное место
  hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; },

  skyBlock(place, wall) {
    const st = this.stats[place] || {};
    const line = `<p class="meta sky-stats">${t("skyStats", { a: st.lit ?? wall.length, b: st.today ?? 0, c: st.flown ?? 0 })}</p>`;
    if (!wall.length) return line + `<p class="meta">${t("wallEmpty")}</p>`;
    // Режим «Листать фонарики»: по одному, крупно
    if (this.browse && this.browse.place === place) {
      const b = this.browse, w = wall.find(x => x.id === b.order[b.i]);
      if (!w) return line + `<div class="browse"><p>${t("browseDone")}</p>
        <button class="btn lantern-btn" data-lstop>${t("closeBtn")}</button></div>`;
      return line + `<div class="browse">
        <div class="bcount meta">${b.i + 1} / ${b.order.length}</div>
        ${this.lantern(w, true, true)}
        <div class="row brow">
          ${w.mine || w.cheered ? "" : `<button class="btn lantern-btn" data-cheer="${w.id}" data-auto="1">🙏 ${t("cheerBtn")}</button>`}
          <button class="btn ghost" data-lnext>${t("nextBtn")} ›</button>
        </div>
        <button class="link" data-lstop>${t("closeBtn")}</button></div>`;
    }
    const maxC = Math.max(1, ...wall.map(w => w.cheers));
    const dots = wall.map(w => {
      const h = this.hash(w.id), x = 4 + (h % 920) / 10, y = 8 + ((h >>> 10) % 820) / 10;
      const size = 7 + Math.round(9 * Math.sqrt(w.cheers / maxC));
      const cls = `${w.fulfilled ? "done" : ""} ${w.mine ? "mine" : ""} ${w.cheered ? "on" : ""} ${this.open && this.open.id === w.id ? "sel" : ""}`;
      return `<button class="star ${cls}" data-lopen="${w.id}" data-place="${esc(place)}" aria-label="${esc(w.text)}"
        style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;animation-delay:-${(h % 40) / 10}s"></button>`;
    }).join("");
    const opened = this.open && this.open.place === place ? wall.find(w => w.id === this.open.id) : null;
    return line + `<div class="sky">${dots}</div>
      ${opened ? `<div class="opened">${this.lantern(opened, true)}<button class="link" data-lclose>${t("closeBtn")}</button></div>` : ""}
      <div class="row sky-btns">
        <button class="btn ghost" data-lcatch="${esc(place)}">🎐 ${t("catchBtn")}</button>
        <button class="btn ghost" data-lbrowse="${esc(place)}">🙏 ${t("browseBtn")}</button>
      </div>
      <div class="wall">${this.pick(place, wall).map(w => this.lantern(w)).join("")}</div>`;
  },

  // 6 фонариков под небом: 2 самых ярких, 2 «ещё никто не поддержал», 2 случайных
  pick(place, wall) {
    const byId = new Map(wall.map(w => [w.id, w]));
    const old = this.picks[place];
    if (old && old.every(id => byId.has(id))) return old.map(id => byId.get(id));
    const chosen = [], take = (list, n) => { for (const w of list) { if (n <= 0) break; if (!chosen.includes(w)) { chosen.push(w); n--; } } };
    take(wall.slice().sort((a, b) => (b.fulfilled - a.fulfilled) || (b.cheers - a.cheers)), 2);
    take(wall.filter(w => !w.mine && !w.cheered).sort((a, b) => (a.cheers - b.cheers) || (new Date(b.created_at) - new Date(a.created_at))), 2);
    take(this.shuffle(wall.slice()), 6 - chosen.length);
    this.picks[place] = chosen.map(w => w.id);
    return chosen;
  },
  shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },

  // Один фонарик на стене
  lantern(w, big, countOnly) {
    return `<div class="lantern ${big ? "big" : ""} ${w.fulfilled ? "done" : ""} ${w.mine ? "mine" : ""}">
      <span class="lglow" aria-hidden="true"></span>
      <p>${esc(w.text)}</p>
      <div class="lfoot">
        ${w.fulfilled ? `<span class="ldone">${t("fulfilledTag")}</span>` : w.mine ? `<span class="meta">${t("mineTag")}</span>` : ""}
        ${w.mine || countOnly ? `<span class="meta">🙏 ${w.cheers}</span>`
          : `<button class="cheer ${w.cheered ? "on" : ""}" data-cheer="${w.id}" ${w.cheered ? "disabled" : ""}>🙏 ${w.cheers}</button>`}
      </div></div>`;
  },

  // Блок «Мои желания» в профиле
  profileBlock() {
    if (!srv.ready) return "";
    if (this.mine == null) return "";
    const st = I18N[lang].wishStatus || I18N.ko.wishStatus;
    const old = Date.now() - 30 * 864e5;
    return `<h3 class="sub-h">${t("myWishesH")}</h3>
    ${this.cheersGiven ? `<p class="meta">🙏 ${t("cheersGiven", { n: this.cheersGiven })}</p>` : ""}
    ${this.mine.length ? `<div class="mywishes">${this.mine.map(w => {
      const l = byId(w.place_id);
      const ask = !w.fulfilled_at && new Date(w.created_at).getTime() < old;
      return `<div class="mywish ${w.fulfilled_at ? "done" : ""}">
        <div><b>${esc(w.text)}</b>
          <span class="meta">${l ? esc(tr(l.name)) : esc(w.place_id)} · ${dateFmt(w.created_at)} · ${esc(st[w.status] || w.status)}${w.status === "approved" ? " · 🙏 " + w.cheers : ""}</span>
          ${ask ? `<span class="dist">${t("fulfillAsk")}</span>` : ""}</div>
        ${w.fulfilled_at ? `<span class="ldone">${t("fulfilledTag")}</span>` : `<button class="wear" data-fulfill="${w.id}">${t("fulfillBtn")}</button>`}
      </div>`; }).join("")}</div>` : `<p class="meta">${t("noWishes")}</p>`}`;
  },

  // Подгрузка данных после отрисовки (вызывается из render)
  load() {
    if (!srv.ready) return;
    const id = ui.openId;
    if (ui.tab === "walk" && id && this.is(id) && this.walls[id] === undefined) {
      this.walls[id] = null;   // уже загружаем
      Promise.all([Server.wishWall(id), Server.wishStats(id).catch(() => ({}))])
        .then(([w, st]) => { this.walls[id] = w; this.stats[id] = st; if (ui.openId === id) render(); })
        .catch(() => { this.walls[id] = []; });
    }
    if (this.cheersGiven === undefined && Server.user) {
      this.cheersGiven = null;
      Server.myCheersCount().then(n => { this.cheersGiven = n; if (ui.tab === "me") render(); }).catch(() => { this.cheersGiven = 0; });
    }
    if (ui.tab === "me" && this.mine === undefined) {
      this.mine = null;
      Server.myWishes().then(w => { this.mine = w; if (ui.tab === "me") render(); }).catch(() => { this.mine = []; });
    }
  },

  scrollTo(sel) { const el = document.querySelector(sel); if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" }); },

  // Нажатия на кнопки желаний. Возвращает true, если нажатие обработано.
  async click(b) {
    const d = b.dataset;
    // Кнопка «К печати» — прокручиваем к кнопке «Поставить печать»
    if (d.wishGoto !== undefined) {
      const c = document.querySelector("[data-checkin]");
      if (c) { c.scrollIntoView({ behavior: "smooth", block: "center" }); c.classList.add("pulse"); setTimeout(() => c.classList.remove("pulse"), 1800); }
      return true;
    }
    if (d.wishSend) {
      const place = d.wishSend;
      const text = (document.getElementById("wish-text").value || "").trim();
      const pub = document.getElementById("wish-public").checked;
      if (!text) { toast(t("wishEmptyText")); return true; }
      ui.busy = true; b.disabled = true;
      try {
        const r = await Server.makeWish(place, text, pub);
        if (!r || !r.ok) { toast((I18N[lang].wishErr || I18N.ko.wishErr)[r && r.reason] || t("wishErrAny"), true); }
        else {
          this.mine = undefined; delete this.walls[place];
          this.fly = place; setTimeout(() => { this.fly = null; }, 2600);
          toast(r.status === "pending" ? t("wishOkPublic") : t("wishOkPrivate"), true);
        }
      } catch (e) { toast(t("wishErrAny"), true); }
      ui.busy = false; render();
      return true;
    }
    // Небо: открыть огонёк, закрыть, поймать случайный, листать
    if (d.lopen) { this.open = { place: d.place, id: d.lopen }; render(); this.scrollTo(".opened"); return true; }
    if (d.lclose !== undefined) { this.open = null; render(); return true; }
    if (d.lcatch) {
      const wall = this.walls[d.lcatch] || [];
      const pool = wall.filter(w => !this.open || w.id !== this.open.id);
      if (pool.length) { this.open = { place: d.lcatch, id: pool[Math.floor(Math.random() * pool.length)].id }; render(); this.scrollTo(".opened"); }
      return true;
    }
    if (d.lbrowse) {
      const wall = this.walls[d.lbrowse] || [];
      // сначала те, кого я ещё не поддержал
      const fresh = this.shuffle(wall.filter(w => !w.mine && !w.cheered)), rest = this.shuffle(wall.filter(w => w.mine || w.cheered));
      this.browse = { place: d.lbrowse, order: [...fresh, ...rest].map(w => w.id), i: 0 }; this.open = null;
      render(); this.scrollTo(".browse"); return true;
    }
    if (d.lnext !== undefined) { if (this.browse) this.browse.i++; render(); return true; }
    if (d.lstop !== undefined) { this.browse = null; render(); return true; }
    if (d.cheer) {
      b.disabled = true;
      try {
        const n = await Server.cheerWish(d.cheer);
        if (n === -1) toast(t("cheerLimit"), true);
        else {
          for (const k in this.walls) for (const w of this.walls[k] || []) if (w.id === d.cheer) { w.cheers = n ?? w.cheers; w.cheered = true; }
          if (typeof this.cheersGiven === "number") this.cheersGiven++;
          if (d.auto && this.browse) { render(); await new Promise(r => setTimeout(r, 450)); this.browse && this.browse.i++; }
        }
      } catch (e) { b.disabled = false; }
      render();
      return true;
    }
    if (d.fulfill) {
      b.disabled = true;
      try {
        await Server.fulfillWish(d.fulfill);
        for (const w of this.mine || []) if (w.id === d.fulfill) w.fulfilled_at = new Date().toISOString();
        for (const k in this.walls) delete this.walls[k];
        toast(t("fulfilledOk"), true);
      } catch (e) { b.disabled = false; }
      render();
      return true;
    }
    return false;
  }
};
