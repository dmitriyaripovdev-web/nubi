// ============================================================
// 누비 — «Загадать желание» и «Стена фонариков» (소원의 벽)
// Желание можно загадать только там, где стоит твоя печать (проверяет сервер).
// По умолчанию желание видит только автор. Если повесить фонарик на стену —
// он сразу загорится на небе без имени (если автофильтр нашёл ссылку, телефон
// или грубое слово — сначала проверка в админке).
// Для больших мест (сотни желаний в день): на небе до 300 огней, «Поймать» и «Листать»
// берут случайные фонарики с сервера, сбывшиеся уходят в «Созвездие сбывшихся».
// Четыре способа загадать (пока бесплатно): 🏮 фонарик — на небо, 🎀 ленточка — на верёвку,
// 🔒 замочек (для двоих) — на решётку, 🪙 монетка — в колодец (тайное желание, текст видит только автор).
// ============================================================

const WISH_KINDS = ["lantern", "ribbon", "lock", "coin"];
const WISH_ICON = { lantern: "🏮", ribbon: "🎀", lock: "🔒", coin: "🪙" };
// Цвета ленточек и замочков — из нашей палитры (киноварь, индиго, сосна, охра, слива, небелёный холст)
const RIBBON_COLORS = ["#C8402F", "#2B4C86", "#2D7A66", "#D9962B", "#7E4A8E", "#E9DFC8"];
const LOCK_COLORS = ["#C9A24A", "#B8B8B8", "#C8402F", "#2B4C86", "#2D7A66"];

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
  async makeWish(place, text, isPublic, kind) {
    const { data, error } = await this.db.rpc("make_wish", { p_place: place, p_text: text, p_public: isPublic, p_kind: kind || "lantern" });
    if (error) throw error.message;
    return data;
  },
  async wishWall(place) {
    const { data, error } = await this.db.rpc("wish_wall", { p_place: place });
    if (error) throw error.message;
    return data || [];
  },
  // Случайные фонарики с сервера (чаще те, кого мало поддержали), кроме уже показанных
  async wishPick(place, n, skip) {
    const { data, error } = await this.db.rpc("wish_pick", { p_place: place, p_n: n, p_skip: skip || [] });
    if (error) throw error.message;
    return data || [];
  },
  async wishStars(place) {
    const { data, error } = await this.db.rpc("wish_stars", { p_place: place });
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
      .select("id, place_id, text, is_public, status, cheers, fulfilled_at, created_at, kind")
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
  pool: new Map(),  // все фонарики, которые уже приходили с сервера: id -> фонарик
  stars: {},        // id места -> сбывшиеся (созвездие)
  consty: null,     // id места, где открыто «Созвездие сбывшихся»
  kindSel: {},      // id места -> выбранный способ (lantern | ribbon | lock | coin)

  // Запоминаем фонарики в общем списке (чтобы открыть любой по id)
  keep(list) { return list.map(w => { const old = this.pool.get(w.id); if (old) return Object.assign(old, w); this.pool.set(w.id, w); return w; }); },

  // Обрабатывает ли Wish это нажатие
  handles(d) {
    return !!(d.wishSend || d.wkind || d.cheer || d.fulfill || d.lopen || d.lcatch || d.lbrowse || d.lstars || d.lreport)
      || ["wishGoto", "lclose", "lnext", "lstop", "lstarsOff"].some(k => d[k] !== undefined);
  },

  // Место для желаний: из списка выше или легенда с пометкой wish:true в файле района
  is(id) { return WISH_IDS.has(id) || !!LEGENDS.find(l => l.id === id && l.wish); },

  // Значок в списке легенд (у места желаний — значок его обычая)
  tag(id) {
    if (!this.is(id)) return "";
    const l = LEGENDS.find(x => x.id === id);
    return `<span class="lantern-tag" title="${esc(t("wishPlace"))}">${WISH_ICON[l && l.wk] || "🏮"}</span>`;
  },
  // Выбранный способ: сначала выбор человека, потом обычай места
  kindOf(l) { return this.kindSel[l.id] || (WISH_KINDS.includes(l.wk) ? l.wk : "lantern"); },

  // Блок на странице легенды
  card(l) {
    if (!this.is(l.id)) return "";
    const v = visits[l.id], k = this.kindOf(l), id = esc(l.id);
    // Выбор способа: фонарик · ленточка · замочек · монетка
    const kinds = `<div class="wkinds">${WISH_KINDS.map(x => `<button class="wkind" data-wkind="${x}" data-place="${id}" aria-pressed="${x === k}">
        <span aria-hidden="true">${WISH_ICON[x]}</span>${t("k_" + x)}</button>`).join("")}</div>`;
    let form;
    if (!srv.ready) form = `<p class="meta">${t("offlineBanner")}</p>`;
    else if (!v || v.test || v.offline) form = `<ol class="wsteps">
        <li>${t("wishStep1")}</li><li>${t("wishStep2")}</li><li>${t("wishStep3")}</li></ol>
      <button class="btn lantern-btn" data-wish-goto>📍 ${t("wishGoStamp")}</button>`;
    else {
      const fields = k === "lock"
        ? `<div class="lockrow"><input id="wish-a" maxlength="12" placeholder="${esc(t("lockA"))}"><span aria-hidden="true">♥</span>
             <input id="wish-b" maxlength="12" placeholder="${esc(t("lockB"))}"></div>
           <textarea id="wish-text" maxlength="60" rows="2" placeholder="${esc(t("lockPh"))}"></textarea>`
        : `<textarea id="wish-text" maxlength="120" rows="2" placeholder="${esc(t(k === "coin" ? "coinPh" : k === "ribbon" ? "ribbonPh" : "wishPh"))}"></textarea>`;
      const pub = k === "coin" ? `<p class="note">🤫 ${t("coinPrivate")}</p>`
        : `<label class="wcheck"><input type="checkbox" id="wish-public"> <span>${t(k === "lantern" ? "wishPublic" : k === "ribbon" ? "ribbonPublic" : "lockPublic")}</span></label>`;
      form = `${fields}${pub}
      <button class="btn lantern-btn k-${k}" data-wish-send="${id}" data-kind="${k}" ${ui.busy ? "disabled" : ""}>${WISH_ICON[k]} ${t("send_" + k)}</button>
      <p class="note">${t("wishRules")}</p>`;
    }
    const wall = this.walls[l.id];
    const fly = this.fly && this.fly.place === l.id ? this.fly.kind : null;
    return `<section class="wishbox">
      ${fly && fly !== "coin" ? `<div class="fly fly-${fly}">${WISH_ICON[fly]}</div>` : ""}
      <h3>✨ ${t("wishH")}</h3>
      <p class="meta" style="margin:0 0 10px">${t("hint_" + k)}</p>
      ${kinds}
      ${form}
      ${wall == null ? `<h3 class="wall-h">${t("skyH")}</h3><p class="meta">…</p>` : this.places(l.id, wall, k, fly === "coin")}
    </section>`;
  },

  // Что висит у места: небо фонариков, верёвка с ленточками, решётка замочков, колодец монеток.
  // Пустые блоки не показываем — кроме того, куда сейчас собираются повесить.
  places(place, wall, k, coinFly) {
    const of = kind => wall.filter(w => (w.kind || "lantern") === kind);
    const lan = of("lantern"), rib = of("ribbon"), loc = of("lock");
    const coins = (this.stats[place] || {}).coins || 0;
    const blocks = {};
    if (lan.length || k === "lantern" || !(rib.length || loc.length || coins))
      blocks.lantern = `<h3 class="wall-h">${t("skyH")}</h3>` + this.skyBlock(place, lan, rib.length + loc.length);
    if (rib.length || k === "ribbon")
      blocks.ribbon = `<h3 class="wall-h">🎀 ${t("ropeH")}</h3>` + (rib.length ? this.rope(place, rib) : `<p class="meta">${t("ropeEmpty")}</p>`) + this.openedHere(place, "ribbon");
    if (loc.length || k === "lock")
      blocks.lock = `<h3 class="wall-h">🔒 ${t("fenceH")}</h3>` + (loc.length ? this.fence(place, loc) : `<p class="meta">${t("fenceEmpty")}</p>`) + this.openedHere(place, "lock");
    if (coins || k === "coin" || coinFly)
      blocks.coin = `<h3 class="wall-h">🪙 ${t("wellH")}</h3>
        <div class="well ${coinFly ? "splash" : ""}"><div class="water" aria-hidden="true">${coinFly ? `<span class="coin-drop">🪙</span><i></i><i></i>` : ""}</div>
        <p class="meta">${coins ? t("coinsN", { n: coins }) : t("wellEmpty")}</p></div>`;
    // сначала то, что выбрано сейчас, потом остальное
    return [k, ...WISH_KINDS.filter(x => x !== k)].map(x => blocks[x] || "").join("");
  },

  // Открытая ленточка или замочек — крупно под своим блоком
  openedHere(place, kind) {
    const o = this.open && this.open.place === place ? this.pool.get(this.open.id) : null;
    if (!o || (o.kind || "lantern") !== kind) return "";
    return `<div class="opened">${this.lantern(o, true)}${this.reportLink(o)}<button class="link" data-lclose>${t("closeBtn")}</button></div>`;
  },

  // Верёвка с ленточками: цвет, длина и наклон — из id, у каждой ленточки своё место
  rope(place, list) {
    return `<div class="rope">${list.slice(0, 80).map(w => {
      const h = this.hash(w.id);
      return `<button class="ribbon ${w.mine ? "mine" : ""} ${this.open && this.open.id === w.id ? "sel" : ""}" data-lopen="${w.id}" data-place="${esc(place)}"
        aria-label="${esc(w.text)}" style="--rc:${RIBBON_COLORS[h % RIBBON_COLORS.length]};--rl:${30 + (h >>> 4) % 24}px;--rt:${((h >>> 9) % 13) - 6}deg;animation-delay:-${(h % 30) / 10}s"></button>`;
    }).join("")}</div>`;
  },

  // Решётка с замочками
  fence(place, list) {
    return `<div class="fence">${list.slice(0, 80).map(w => {
      const h = this.hash(w.id);
      return `<button class="lockpin ${w.mine ? "mine" : ""} ${this.open && this.open.id === w.id ? "sel" : ""}" data-lopen="${w.id}" data-place="${esc(place)}"
        aria-label="${esc(w.text)}" style="--lc:${LOCK_COLORS[h % LOCK_COLORS.length]};--lt:${((h >>> 7) % 17) - 8}deg"></button>`;
    }).join("")}</div>`;
  },

  // ===== Небо фонариков =====
  // Место огонька на небе считаем из id — у каждого фонарика своё постоянное место
  hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; },

  // others — сколько ленточек и замочков в общем счёте сервера (на небе их не считаем)
  skyBlock(place, wall, others) {
    const st = this.stats[place] || {};
    const lit = st.lit == null ? wall.length : Math.max(wall.length, st.lit - (others || 0));
    const line = `<p class="meta sky-stats">${t("skyStats", { a: lit, b: st.today ?? 0, c: st.flown ?? 0 })}</p>`;
    const starsBtn = st.stars ? `<button class="btn ghost stars-btn" data-lstars="${esc(place)}">✨ ${t("starsBtn", { n: st.stars })}</button>` : "";
    let opened = this.open && this.open.place === place ? this.pool.get(this.open.id) : null;
    if (opened && this.consty !== place && (opened.kind || "lantern") !== "lantern") opened = null;
    const openedHtml = opened ? `<div class="opened">${this.lantern(opened, true)}${this.reportLink(opened)}<button class="link" data-lclose>${t("closeBtn")}</button></div>` : "";
    // «Созвездие сбывшихся»
    if (this.consty === place) {
      const list = this.stars[place];
      return line + `<h3 class="wall-h">✨ ${t("starsH")}</h3><p class="meta">${t("starsText")}</p>
        ${list == null ? `<p class="meta">…</p>` : `<div class="sky stars-sky">${this.dots(place, list)}</div>`}
        ${openedHtml}
        <button class="btn ghost" data-lstars-off>${t("starsBack")}</button>`;
    }
    if (!wall.length) return line + `<p class="meta">${t("wallEmpty")}</p>` + starsBtn;
    // Режим «Листать фонарики»: по одному, крупно
    if (this.browse && this.browse.place === place) {
      const b = this.browse, w = this.pool.get(b.order[b.i]);
      if (!w) return line + `<div class="browse"><p>${b.loading ? "…" : t("browseDone")}</p>
        <button class="btn lantern-btn" data-lstop>${t("closeBtn")}</button></div>`;
      return line + `<div class="browse">
        <div class="bcount meta">${b.i + 1}${st.lit ? " / " + st.lit : ""}</div>
        ${this.lantern(w, true, true)}
        <div class="row brow">
          ${w.mine || w.cheered ? "" : `<button class="btn lantern-btn" data-cheer="${w.id}" data-auto="1">🙏 ${t("cheerBtn")}</button>`}
          <button class="btn ghost" data-lnext>${t("nextBtn")} ›</button>
        </div>
        ${this.reportLink(w)}
        <button class="link" data-lstop>${t("closeBtn")}</button></div>`;
    }
    return line + `<div class="sky">${this.dots(place, wall)}</div>
      ${openedHtml}
      <div class="row sky-btns">
        <button class="btn ghost" data-lcatch="${esc(place)}">🎐 ${t("catchBtn")}</button>
        <button class="btn ghost" data-lbrowse="${esc(place)}">🙏 ${t("browseBtn")}</button>
      </div>
      ${starsBtn}
      <div class="wall">${this.pick(place, wall).map(w => this.lantern(w)).join("")}</div>`;
  },

  // Огоньки на небе. Место каждого считаем из id — у фонарика своё постоянное место
  dots(place, list) {
    const maxC = Math.max(1, ...list.map(w => w.cheers));
    return list.map(w => {
      const h = this.hash(w.id), x = 4 + (h % 920) / 10, y = 8 + ((h >>> 10) % 820) / 10;
      const size = 7 + Math.round(9 * Math.sqrt(w.cheers / maxC));
      const cls = `${w.fulfilled ? "done" : ""} ${w.mine ? "mine" : ""} ${w.cheered ? "on" : ""} ${this.open && this.open.id === w.id ? "sel" : ""}`;
      return `<button class="star ${cls}" data-lopen="${w.id}" data-place="${esc(place)}" aria-label="${esc(w.text)}"
        style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;animation-delay:-${(h % 40) / 10}s"></button>`;
    }).join("");
  },

  // «Пожаловаться» — у чужих фонариков
  reportLink(w) {
    if (!w || w.mine || !Server.user) return "";
    return w.reported ? `<p class="note">${t("reportOk")}</p>` : `<button class="link report" data-lreport="${w.id}">⚑ ${t("reportBtn")}</button>`;
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
    const k = w.kind || "lantern";
    return `<div class="lantern k-${k} ${big ? "big" : ""} ${w.fulfilled ? "done" : ""} ${w.mine ? "mine" : ""}">
      <span class="lglow" aria-hidden="true"></span>
      <p>${k !== "lantern" ? `<span class="lkind" aria-hidden="true">${WISH_ICON[k]}</span> ` : ""}${esc(w.text)}</p>
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
        <div><b>${WISH_ICON[w.kind] || "🏮"} ${esc(w.text)}</b>
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
        .then(([w, st]) => { this.walls[id] = this.keep(w); this.stats[id] = st; if (ui.openId === id) render(); })
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

  // «Дальше» в режиме листания: кончились — догружаем ещё с сервера
  async next(quiet) {
    const b = this.browse; if (!b) return;
    b.i++;
    if (b.i >= b.order.length) {
      b.loading = true; if (!quiet) render();
      const more = await Server.wishPick(b.place, 30, b.order).catch(() => []);
      b.order.push(...this.keep(more).map(w => w.id)); b.loading = false;
    }
    render();
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
    if (d.wkind) { this.kindSel[d.place] = d.wkind; this.open = null; render(); return true; }
    if (d.wishSend) {
      const place = d.wishSend, kind = d.kind || "lantern";
      const val = id => ((document.getElementById(id) || {}).value || "").trim();
      let text = val("wish-text");
      // Замочек: «Имя ♥ Имя» и, если есть, короткая надпись
      if (kind === "lock") {
        const a = val("wish-a"), c = val("wish-b");
        if (!a || !c) { toast(t("lockNeedNames")); return true; }
        text = `${a} ♥ ${c}` + (text ? " · " + text : "");
      }
      const pubBox = document.getElementById("wish-public");
      const pub = kind !== "coin" && !!(pubBox && pubBox.checked);
      if (!text) { toast(t("wishEmptyText")); return true; }
      ui.busy = true; b.disabled = true;
      try {
        const r = await Server.makeWish(place, text, pub, kind);
        if (!r || !r.ok) { toast((I18N[lang].wishErr || I18N.ko.wishErr)[r && r.reason] || t("wishErrAny"), true); }
        else {
          this.mine = undefined; delete this.walls[place];
          this.fly = { place, kind }; setTimeout(() => { this.fly = null; }, 2600);
          toast(kind === "coin" ? t("coinOk") : r.status === "approved" ? t("ok_" + kind) : r.status === "pending" ? t("wishOkPublic") : t("wishOkPrivate"), true);
        }
      } catch (e) { toast(t("wishErrAny"), true); }
      ui.busy = false; render();
      return true;
    }
    // Небо: открыть огонёк, закрыть, поймать случайный, листать
    if (d.lopen) { this.open = { place: d.place, id: d.lopen }; render(); this.scrollTo(".opened"); return true; }
    if (d.lclose !== undefined) { this.open = null; render(); return true; }
    if (d.lcatch) {
      const place = d.lcatch;
      b.disabled = true;
      let w = null;
      try { [w] = this.keep(await Server.wishPick(place, 1, this.open ? [this.open.id] : [])); } catch (e) {}
      // всё уже поддержали — берём любой огонёк с неба
      if (!w) { const wall = (this.walls[place] || []).filter(x => !this.open || x.id !== this.open.id); w = wall[Math.floor(Math.random() * wall.length)]; }
      b.disabled = false;
      if (w) { this.open = { place, id: w.id }; render(); this.scrollTo(".opened"); }
      return true;
    }
    if (d.lbrowse) {
      // сначала те, кого я ещё не поддержал (с сервера, по 30 штук)
      this.browse = { place: d.lbrowse, order: [], i: 0, loading: true }; this.open = null; render();
      const list = await Server.wishPick(d.lbrowse, 30, []).catch(() => []);
      if (!this.browse) return true;
      this.browse.order = this.keep(list).map(w => w.id); this.browse.loading = false;
      render(); this.scrollTo(".browse"); return true;
    }
    if (d.lnext !== undefined) { await this.next(); return true; }
    if (d.lstars) {
      const place = d.lstars;
      this.consty = place; this.open = null; this.browse = null; render();
      if (this.stars[place] == null) {
        this.stars[place] = await Server.wishStars(place).then(l => this.keep(l)).catch(() => []);
        render();
      }
      this.scrollTo(".stars-sky"); return true;
    }
    if (d.lstarsOff !== undefined) { this.consty = null; this.open = null; render(); return true; }
    if (d.lreport) {
      b.disabled = true;
      try { await Server.report("wish", d.lreport); const w = this.pool.get(d.lreport); if (w) w.reported = true; toast(t("reportOk"), true); }
      catch (e) { b.disabled = false; toast(t("errServer")); }
      render(); return true;
    }
    if (d.lstop !== undefined) { this.browse = null; render(); return true; }
    if (d.cheer) {
      b.disabled = true;
      try {
        const n = await Server.cheerWish(d.cheer);
        if (n === -1) toast(t("cheerLimit"), true);
        else {
          const w = this.pool.get(d.cheer); if (w) { w.cheers = n ?? w.cheers; w.cheered = true; }
          if (typeof this.cheersGiven === "number") this.cheersGiven++;
          if (d.auto && this.browse) { render(); await new Promise(r => setTimeout(r, 450)); if (this.browse) await this.next(true); }
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
        this.stars = {};
        toast(t("fulfilledOk"), true);
      } catch (e) { b.disabled = false; }
      render();
      return true;
    }
    return false;
  }
};
