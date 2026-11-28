// ============================================================
// 누비 — основная логика приложения
// ============================================================

// ===== Хранилище на телефоне =====
const store = {
  get(k, d) { try { const v = localStorage.getItem("nubi_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("nubi_" + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem("nubi_" + k); } catch (e) {} }
};

// ===== Состояние =====
let visits  = store.get("visits", {});      // id места -> {t: время, test, server, day}
let mine    = store.get("mine", []);        // легенды, добавленные без сервера (старые)
let lang    = store.get("lang", DEFAULT_LANG);
let profile = store.get("profile", null);   // {nick, title}
let seen    = store.get("seenTitles", []);  // звания, о которых уже показали уведомление
let testMode = store.get("testMode", false);
let markMode = store.get("markMode", false); // режим разметки: записывать точки легенд
let pins    = store.get("pins", {});        // id места -> {lat, lng}: точки, записанные на месте
let finds   = store.get("finds", []);       // находки: фото табличек
let ascent  = store.get("ascent", null);    // {at, place}: начат пеший подъём
let sec     = store.get("sec", "walk");      // открытый раздел: walk (легенды), sport, fish, camp
if (!["walk", "sport", "fish", "camp"].includes(sec)) sec = "walk";

// Данные с сервера (не сохраняются — грузятся при запуске)
let srv = {
  ready: false,          // сервер доступен и профиль создан
  places: {},            // id -> {lat, lng, approx, difficulty}
  others: [],            // легенды игроков с сервера
  totals: null,          // {collection, hikes_month, visits}
  board: null,           // строки рейтинга
  boardKey: "coll-month",
  keeper: {}             // id места -> {nick, visits_count} | false
};

// Старый формат печатей (просто время) переводим в новый
for (const k in visits) if (typeof visits[k] === "number") visits[k] = { t: visits[k], test: true };

// Состояние экрана (не сохраняется)
let ui = { tab: sec === "walk" ? "walk" : "plist", openPlace: null, area: "all", kind: "all", bookOnly: false, ftype: "all", openId: null, adding: false, region: "all", editing: false, confirmReset: false,
           checkMsg: null, checking: false, draft: null, camMsg: null, mapFocus: null, busy: false, kakaoTaken: false };

const app = document.getElementById("app");
let map = null; // объект карты Leaflet

// ===== Помощники =====
// Склонение по числу. В строке перевода пишется {d:день|дня|дней} (ru) или {d:day|days} (en).
// Русский: 1 день, 2–4 дня, 5–20 дней, 21 день… Английский: 1 day, 2 days.
const plural = (n, forms) => {
  const f = forms.split("|"); n = Math.abs(Number(n)) || 0;
  if (lang === "ru") { const a = n % 100, b = n % 10; return f[a > 10 && a < 20 ? 2 : b === 1 ? 0 : b >= 2 && b <= 4 ? 1 : 2] ?? f[f.length - 1]; }
  return n === 1 ? f[0] : (f[1] ?? f[0]);
};
const t = (k, vars = {}) => String(I18N[lang][k] ?? I18N.ko[k] ?? k)
  .replace(/\{(\w)(?::([^}]+))?\}/g, (_, v, forms) => forms ? plural(vars[v], forms) : (vars[v] ?? ""));
const tr = obj => obj[lang] ?? obj.ko ?? Object.values(obj)[0];   // текст на нужном языке, иначе оригинал
const regionName = c => REGIONS[c] ? REGIONS[c][lang] : c;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const all = () => LEGENDS.concat(srv.others, mine);
// Всего легенд: во всех районах (даже не загруженных) + народные
const totalLegends = () => Math.max(all().length, (Data.index ? Data.total("legends") : LEGENDS.length) + srv.others.length + mine.length);
const byId = id => all().find(l => l.id === id);
const count = () => Object.keys(visits).length;
const titleById = id => TITLES.find(x => x.id === id);
const vTime = id => visits[id] && visits[id].t;
const dateFmt = ts => new Date(ts).toLocaleDateString(t("locale"));
const timeFmt = ts => new Date(ts).toLocaleTimeString(t("locale"), { hour: "2-digit", minute: "2-digit" });
const shortDate = s => new Date(s + "T00:00").toLocaleDateString(t("locale"), { month: "short", day: "numeric" });
// Дата по корейскому времени (сервер считает «сутки» так же)
const kstDay = ts => new Date(ts + 9 * 3600e3).toISOString().slice(0, 10);
const visitedToday = id => visits[id] && visits[id].day === kstDay(Date.now());
const difficulty = l => (srv.places[l.id] && srv.places[l.id].difficulty) || l.difficulty || 20;

// ===== Районы =====
// Выбор другого района: список районов, где есть места (kind: legends / sport / fish / camp)
function areaPicker(kind) {
  if (!Data.index) return "";
  const list = Data.areas().filter(a => Data.index.areas[a].n[kind] > 0)
    .sort((a, b) => (GG_CITIES.indexOf(a) + 1 || 99) - (GG_CITIES.indexOf(b) + 1 || 99) || regionName(a).localeCompare(regionName(b)));
  if (list.length < 2) return "";
  return `<label class="chip area-pick">📍 ${t("areaOther")}<select data-area-pick aria-label="${t("areaOther")}">
    <option value="">—</option>
    ${list.map(a => `<option value="${a}">${esc(regionName(a))} · ${Data.index.areas[a].n[kind]}</option>`).join("")}
  </select></label>`;
}
// ===== Выбор города: одна кнопка и панель снизу (поиск, недавние, по провинциям) =====
// Вместо длинной полоски районов — работает одинаково и для 2 городов, и для 300.
// field: "region" — легенды, "area" — спорт/рыбалка/кемпинг; kind — что считать в скобках.
const PROVINCES = [
  [GG_CITIES, { ko: "경기도", ru: "Кёнгидо", en: "Gyeonggi" }],
  [["se", "ic", "gw", "cc", "jl", "gb", "gn", "jj", "gg"], { ko: "다른 지역", ru: "Другие регионы", en: "Other regions" }]
];
function cityButton(kind, field) {
  const cur = ui[field];
  const label = cur && cur !== "all" && cur !== "wish" ? regionName(cur) : t("cityNear");
  return `<button class="chip city-btn ${cur && cur !== "all" && cur !== "wish" ? "on" : ""}" data-city-open="${kind}" data-field="${field}">📍 ${esc(label)} <span aria-hidden="true">▾</span></button>`;
}
function citySheet() {
  const s = ui.citySheet;
  if (!s || !Data.index) return "";
  const { kind, field } = s;
  const n = a => (Data.index.areas[a] && Data.index.areas[a].n[kind]) || 0;
  const have = Data.areas().filter(a => n(a) > 0);
  const names = a => REGIONS[a] ? [REGIONS[a].ko, REGIONS[a].ru, REGIONS[a].en, a].join(" ").toLowerCase() : a;
  const item = a => `<button class="city-item" data-city="${a}" data-names="${esc(names(a))}" aria-pressed="${ui[field] === a}">
      <span>${esc(regionName(a))}${lang !== "ko" && REGIONS[a] ? ` <small>${esc(REGIONS[a].ko)}</small>` : ""}</span><em>${n(a)}</em></button>`;
  const recent = store.get("areas", []).filter(a => have.includes(a)).slice(0, 5);
  const groups = PROVINCES.map(([codes, nm]) => {
    const l = codes.filter(a => have.includes(a));
    return l.length ? `<h4>${esc(nm[lang] || nm.ko)}</h4>${l.map(item).join("")}` : "";
  }).join("") + have.filter(a => !PROVINCES.some(([c]) => c.includes(a))).map(item).join("");
  return `<button class="sheet-bg" data-city-close aria-label="${esc(t("closeBtn"))}"></button>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(t("cityPick"))}">
    <div class="sheet-h"><b>${t("cityPick")}</b><button class="link" data-city-close>${t("closeBtn")}</button></div>
    <input id="city-q" type="search" placeholder="${esc(t("citySearch"))}" autocomplete="off">
    <button class="city-item near" data-city="all" aria-pressed="${ui[field] === "all" || ui[field] === "wish"}"><span>📍 ${t("cityNear")}</span></button>
    ${recent.length ? `<div class="city-recent"><h4>${t("cityRecent")}</h4>${recent.map(item).join("")}</div>` : ""}
    <div class="city-groups">${groups}</div>
    <p class="meta city-none" hidden>${t("cityNone")}</p>
  </div>`;
}
// Поиск в панели городов — без перерисовки, просто прячем лишнее
document.addEventListener("input", e => {
  if (e.target.id !== "city-q") return;
  const q = e.target.value.trim().toLowerCase();
  let shown = 0;
  document.querySelectorAll(".sheet .city-item[data-names]").forEach(b => { const ok = !q || b.dataset.names.includes(q); b.hidden = !ok; if (ok) shown++; });
  document.querySelectorAll(".sheet h4").forEach(h => {
    let el = h.nextElementSibling, any = false;
    while (el && el.tagName !== "H4") { if (!el.hidden) any = true; el = el.nextElementSibling; }
    h.hidden = !any;
  });
  const r = document.querySelector(".city-recent"); if (r) r.hidden = !!q;
  document.querySelector(".city-none").hidden = shown > 0;
});

// Районы, которые человек выбирал сам, — загружаем их и при следующем запуске
function rememberArea(a) {
  const keep = [a, ...store.get("areas", []).filter(x => x !== a)].slice(0, 5);
  store.set("areas", keep);
}
// Подгрузить районы и перерисовать, если появилось новое
async function loadAreas(list) {
  const got = await Data.loadMany(list);
  if (got.some(Boolean)) { if (ui.tab === "map" || ui.tab === "pmap") drawMarkers(); else render(); }
}
// Районы, где стоят мои печати (чтобы в «Книге печатей» были их названия)
const visitedAreas = () => [...new Set(Object.keys(visits).map(id => Data.areaOf(id)).filter(Boolean))];

function toast(s, long) {
  const el = document.getElementById("toast");
  el.textContent = s; el.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, long ? 4200 : 2600);
}

// ===== Челленджи и звания =====
function progress(c) {
  const times = Object.values(visits).map(v => v.t);
  if (c.type === "chain") {
    const ts = c.ids.map(vTime).filter(Boolean);
    const done = ts.length === c.ids.length && Math.max(...ts) - Math.min(...ts) <= c.days * 864e5;
    return { got: ts.length, total: c.ids.length, done };
  }
  if (c.type === "period") {
    const a = new Date(c.from + "T00:00").getTime(), b = new Date(c.to + "T23:59:59").getTime();
    const got = times.filter(x => x >= a && x <= b).length;
    return { got: Math.min(got, c.need), total: c.need, done: got >= c.need };
  }
  if (c.type === "weekend") {
    const got = times.filter(x => [0, 6].includes(new Date(x).getDay())).length;
    return { got: Math.min(got, c.need), total: c.need, done: got >= c.need };
  }
}
function regionIds(r) { return LEGENDS.filter(l => l.region === r).map(l => l.id); }
const myLegendsCount = () => mine.length + srv.others.filter(l => l.mine).length;
function hasTitle(x) {
  if (x.kind === "count") return count() >= x.need;
  if (x.kind === "region") { const ids = regionIds(x.region), n = ids.filter(i => visits[i]).length; return x.need ? n >= x.need : n === ids.length; }
  if (x.kind === "challenge") return progress(CHALLENGES.find(c => c.id === x.ch)).done;
  if (x.kind === "submit") return myLegendsCount() >= x.need;
  if (x.kind === "cheer") return (Wish.cheersGiven || 0) >= x.need;
}
function titleProg(x) {
  if (x.kind === "count") return `${Math.min(count(), x.need)}/${x.need}`;
  if (x.kind === "region") { const ids = regionIds(x.region), need = x.need || ids.length; return `${Math.min(ids.filter(i => visits[i]).length, need)}/${need}`; }
  if (x.kind === "challenge") { const p = progress(CHALLENGES.find(c => c.id === x.ch)); return `${p.got}/${p.total}`; }
  if (x.kind === "submit") return `${Math.min(myLegendsCount(), x.need)}/${x.need}`;
  if (x.kind === "cheer") return `${Math.min(Wish.cheersGiven || 0, x.need)}/${x.need}`;
}
const earned = () => TITLES.filter(hasTitle);
const wornName = () => profile && profile.title && titleById(profile.title) && hasTitle(titleById(profile.title))
  ? tr(titleById(profile.title).name) : t("noTitle");

// После печати или новой легенды проверяем новые звания. Первое звание надевается само.
function checkNewTitles(fallback) {
  const fresh = earned().filter(x => !seen.includes(x.id));
  if (fresh.length) {
    seen = seen.concat(fresh.map(x => x.id)); store.set("seenTitles", seen);
    if (profile && !profile.title) { profile.title = fresh[0].id; saveProfile(); }
    toast(t("toastTitle", { t: tr(fresh[fresh.length - 1].name) }));
    return true;
  } else if (fallback) toast(fallback, true);
  return false;
}
function saveProfile() {
  store.set("profile", profile);
  if (srv.ready) Server.updateProfile({ nick: profile.nick, title: profile.title, lang }).catch(() => {});
}

// ===== Отметка на месте =====
function stampLocal(id, flags) {
  const now = Date.now();
  const prev = visits[id];
  visits[id] = { t: prev && !prev.test ? prev.t : now, day: kstDay(now), ...flags };
  store.set("visits", visits);
}
async function tryCheckin(id) {
  const l = byId(id);
  if (testMode) { stampLocal(id, { test: true }); ui.checkMsg = null; checkNewTitles(t("toastStamp")); return render(); }
  const p = pos(l);
  if (!p) { ui.checkMsg = { err: true, text: t("noCoords") }; return render(); }
  ui.checking = true; ui.checkMsg = { text: t("locating") }; render();
  let here;
  try { here = await Geo.locate(); }
  catch (e) { ui.checking = false; ui.checkMsg = { err: true, text: e === "denied" ? t("gpsDenied") : t("gpsErr") }; return render(); }

  // Без сервера: проверяем на телефоне, но очков нет
  if (!srv.ready) {
    ui.checking = false;
    const d = Geo.distance(here, p);
    if (d > radius(l)) { ui.checkMsg = { err: true, text: t("tooFar", { d: Geo.format(d, lang), r: radius(l) }) }; return render(); }
    stampLocal(id, { offline: true }); ui.checkMsg = { err: true, text: t("offlineNote") };
    checkNewTitles(); return render();
  }

  try {
    const r = await Server.checkin(id, here);
    ui.checking = false;
    if (!r.ok) {
      ui.checkMsg = { err: true, text: ({
        too_far: t("tooFar", { d: Geo.format(r.dist, lang), r: r.radius }),
        low_accuracy: t("errAcc", { a: r.acc }),
        already_today: t("errAlready"),
        teleport: t("errTeleport"),
        no_coords: t("noCoords"),
        day_limit: t("errDayLimit")
      })[r.reason] || t("errServer") };
      return render();
    }
    stampLocal(id, { server: true });
    if (r.walked) { ascent = null; store.del("ascent"); }
    ui.checkMsg = null;
    const lines = [t("ptsToast", { c: r.pts_collection, h: r.pts_hikes })];
    if (r.walked) lines.unshift(t("walkedToast"));
    (r.bonuses || []).forEach(b => lines.push(t("bonusToast", { p: b.pts, r: bonusName(b) })));
    // Новое звание показываем вместе с очками, а не вместо них
    const fresh = earned().filter(x => !seen.includes(x.id));
    if (fresh.length) {
      seen = seen.concat(fresh.map(x => x.id)); store.set("seenTitles", seen);
      if (!profile.title) { profile.title = fresh[0].id; saveProfile(); }
      lines.push(t("toastTitle", { t: tr(fresh[fresh.length - 1].name) }));
    }
    toast(lines.join(" · "), true);
    srv.board = null; delete srv.keeper[id]; delete Wish.walls[id];
    refreshTotals();
  } catch (e) {
    ui.checking = false; ui.checkMsg = { err: true, text: t("errServer") };
  }
  render();
}
function bonusName(b) {
  if (b.kind === "challenge") { const c = CHALLENGES.find(x => x.id === b.ref); return c ? tr(c.name) : b.ref; }
  return b.ref;
}
async function startAscent(id) {
  ui.busy = true; render();
  try {
    const here = await Geo.locate();
    const l = byId(id), p = pos(l);
    if (p && Geo.distance(here, p) < 1000) { ui.busy = false; ui.checkMsg = { err: true, text: t("ascentFar") }; return render(); }
    const r = await Server.startAscent(here);
    if (!r.ok) ui.checkMsg = { err: true, text: r.reason === "low_accuracy" ? t("errAcc", { a: Math.round(here.acc) }) : t("errServer") };
    else { ascent = { at: Date.now(), place: id }; store.set("ascent", ascent); ui.checkMsg = null; toast(t("ascentOn", { t: timeFmt(ascent.at) })); }
  } catch (e) { ui.checkMsg = { err: true, text: e === "denied" ? t("gpsDenied") : e === "error" ? t("gpsErr") : t("errServer") }; }
  ui.busy = false; render();
}

// Координаты места: записанная на месте точка → сервер → данные из файла
function pos(l) {
  if (pins[l.id]) return pins[l.id];
  const s = srv.places[l.id];
  if (s && s.lat != null) return { lat: s.lat, lng: s.lng };
  return l.lat != null ? { lat: l.lat, lng: l.lng } : null;
}
function isApprox(l) { const s = srv.places[l.id]; return !pins[l.id] && (s ? s.approx : l.approx); }
function radius(l) { return isApprox(l) ? CHECKIN_RADIUS_APPROX : CHECKIN_RADIUS; }
function distTo(l) { const p = pos(l); return Geo.last && p ? Geo.distance(Geo.last, p) : null; }

// ===== Общие части экранов =====
function langSwitch() {
  return `<div class="lang" role="group" aria-label="Language">${LANGS.map(([c, s]) =>
    `<button data-lang="${c}" aria-pressed="${c === lang}">${s}</button>`).join("")}</div>`;
}
function topBar() {
  return `<div class="bar">
    <button class="who" data-tab="me"><span class="ava">${esc(profile.nick[0].toUpperCase())}</span>
      <span class="who-txt"><b>${esc(profile.nick)}</b><span class="ttl">${esc(wornName())}</span></span></button>
    ${langSwitch()}</div>`;
}
function chCard(c) {
  const p = progress(c);
  const label = c.type === "chain" ? t("chChain", { d: c.days })
    : c.type === "period" ? t("chPeriod", { a: shortDate(c.from), b: shortDate(c.to) }) : t("chWeekend");
  return `<section class="ch ${p.done ? "done" : ""}">
    <div class="eyebrow">${label}</div>
    <h2>${esc(tr(c.name))}</h2>
    <div class="steps">${Array.from({ length: p.total }, (_, i) => `<span class="${i < p.got ? "on" : ""}"></span>`).join("")}</div>
    <p>${p.done ? t("chDone") : esc(tr(c.desc)) + ` (${p.got}/${p.total})`}</p>
    <div class="reward">${t("reward", { t: esc(tr(titleById(c.reward).name)) })}</div>
  </section>`;
}

// ===== Первый запуск =====
// Картинка легенды. У народных легенд — нарисованная картинка (загружается в админке),
// пока её нет — заглушка в нашем стиле (фото автора показывается только внутри легенды)
function thumbHtml(l, cls) {
  if (l.artUrl) return `<img class="art ${cls}" src="${esc(l.artUrl)}" alt="" loading="lazy" decoding="async">`;
  if (l.user) return `<div class="art art-user ${cls}" aria-hidden="true"><span>📜</span></div>`;
  return Art.html(l.id, cls);
}

function welcomeView() {
  return `<div class="welcome">
    <div class="brand">누비</div>
    <h2>${t("wTitle")}</h2>
    <p>${t("wText")}</p>
    <div><div class="meta" style="margin-bottom:6px">${t("wLang")}</div>
      <div class="langbig">${LANGS.map(([c, , full]) => `<button data-lang="${c}" aria-pressed="${c === lang}">${full}</button>`).join("")}</div></div>
    ${Server.isKakao()
      ? `<div class="msg">${t("kakaoIn")}</div>`
      : `<button class="kakao-btn" data-kakao-start>${KAKAO_SVG}${t("kakaoStart")}</button>
         <div class="or"><span>${t("orNick")}</span></div>`}
    <form id="nickForm">
      <label for="w-nick">${t("wNick")}<input id="w-nick" maxlength="12" placeholder="${t("wNickPh")}" autocomplete="nickname" value="${esc(Server.kakaoName().slice(0, 12))}"></label>
      <button class="btn" type="submit" ${ui.busy ? "disabled" : ""}>${ui.busy ? t("sending") : t("wStart")}</button>
    </form>
    <p class="note">${t("privacyAgree")} <a href="privacy.html?lang=${lang}">${t("privacyLink")}</a></p>
  </div>`;
}

// ===== Вкладка «Легенды» =====
function walkView() {
  if (ui.finding) return findView();
  if (ui.adding) return addView();
  if (ui.openId) return detailView(byId(ui.openId));
  let list = all().filter(l => ui.region === "all" || (ui.region === "wish" ? Wish.is(l.id) : l.region === ui.region));
  if (Geo.last) list = list.slice().sort((a, b) => (distTo(a) ?? 1e9) - (distTo(b) ?? 1e9));
  const next = CHALLENGES.filter(c => !progress(c).done)
    .sort((a, b) => progress(b).got / progress(b).total - progress(a).got / progress(a).total)[0];
  return topBar() + `
  <div class="top"><div class="brand">누비<small>${t("sub")}</small></div>
    <div class="stampcount">${t("stamps")} <b>${count()}</b> / ${totalLegends()}</div></div>
  ${!srv.ready ? `<div class="msg">${t("offlineBanner")}</div>` : ""}
  ${next ? `<div class="mini">${chCard(next)}<button class="link" data-tab="chal">${t("seeAll")}</button></div>` : ""}
  <div class="filters">${cityButton("legends", "region")}
    <button class="chip lantern-chip" data-region="${ui.region === "wish" ? "all" : "wish"}" aria-pressed="${ui.region === "wish"}">🏮 ${t("wishChip")}</button></div>
  <div class="addrow"><button class="link" data-find>📋 ${t("findBtn")}</button><button class="link" data-add>${t("addBtn")}</button></div>
  <div class="list">${list.map(l => {
    const d = distTo(l);
    return `<button class="item" data-open="${esc(l.id)}">
      ${thumbHtml(l, "thumb")}
      <div><h3>${esc(tr(l.name))}${Wish.tag(l.id)}${lang !== "ko" && !l.user ? `<span class="orig">${esc(l.name.ko)}</span>` : ""}${l.user ? `<span class="user-tag">${l.status === "pending" ? t("pendingTag") : t("tagUser")}</span>` : ""}</h3>
      <div class="meta">${esc(regionName(l.region))} · ${esc(tr(l.place))}</div>
      ${d != null ? `<div class="dist">${t("distAway", { d: Geo.format(d, lang) })}</div>` : !pos(l) ? `<div class="meta">${t("noPin")}</div>` : ""}</div>
      <div class="seal ${visits[l.id] ? "got" : ""}">${visits[l.id] ? t("sealGot") : "?"}</div>
    </button>`;
  }).join("")}</div>`;
}

// Текст из нескольких абзацев (разделены пустой строкой)
const paras = txt => esc(txt).split(/\n\n+/).map(x => `<p>${x}</p>`).join("");

function detailView(l) {
  if (!l) { ui.openId = null; return walkView(); }
  const v = visits[l.id];
  const foreign = l.user && l.lang !== lang;
  const d = distTo(l), p = pos(l);
  const kakao = p ? `https://map.kakao.com/link/map/${encodeURIComponent(tr(l.name))},${p.lat},${p.lng}` : null;
  const diff = difficulty(l);
  const pending = l.status === "pending";
  const body = l.spot
    ? `<section class="part"><h3>${t("hWhy")}</h3>${paras(tr(l.why))}</section>
       <section class="part fact"><h3>${t("hSince")}</h3>${paras(tr(l.since))}</section>
       <section class="part find"><h3>${t("hHow")}</h3>${paras(tr(l.how))}</section>`
    : l.legend
    ? `<section class="part"><h3>${t("hLegend")}</h3>${paras(tr(l.legend))}</section>
       ${l.fact ? `<section class="part fact"><h3>${t("hFact")}</h3>${paras(tr(l.fact))}</section>` : ""}
       ${l.find ? `<section class="part find"><h3>${t("hFind")}</h3>${paras(tr(l.find))}</section>` : ""}`
    : `<section class="part">${paras(tr(l.story))}</section>`;
  // Кнопки отметки: первая печать, повторный поход, старт подъёма
  const canAscent = srv.ready && !testMode && diff >= 30 && p;
  const ascentHere = ascent && ascent.place === l.id && Date.now() - ascent.at < 4 * 3600e3;
  const checkBtn = pending ? `<div class="msg">${t("pendingNote")}</div>`
    : visitedToday(l.id) && !testMode ? `<p class="note">${t("visitedTodayNote")}</p>`
    : `<button class="btn" data-checkin="${esc(l.id)}" ${ui.checking ? "disabled" : ""}>${v ? t("checkinAgain") : t("checkin")}</button>`;
  return topBar() + `<button class="back" data-back>${t("back")}</button>
  ${l.artUrl ? `<img class="art hero" src="${esc(l.artUrl)}" alt="">` : Art.has(l.id) ? Art.html(l.id, "hero") : ""}
  <article class="detail">
    <div class="meta">${esc(regionName(l.region))}${l.user ? " · " + t("userLegend", { n: esc(l.author || "?") }) : ""}</div>
    ${Wish.is(l.id) ? `<div class="wishtag">🏮 ${t("wishPlace")}</div>` : ""}
    <h2>${esc(tr(l.name))}</h2>
    ${lang !== "ko" && !l.user ? `<div class="ko">${esc(l.name.ko)}</div>` : ""}
    <div class="place"><b>${t("where")}</b><span>${esc(tr(l.place))}</span>
      ${lang !== "ko" && !l.user ? `<span class="meta">${esc(l.place.ko)}</span>` : ""}
      ${d != null ? `<span class="dist">${t("distAway", { d: Geo.format(d, lang) })}</span>` : !p ? `<span class="meta">${t("noPin")}</span>` : ""}
      ${isApprox(l) ? `<span class="meta">${t("approxNote", { r: radius(l) })}</span>` : ""}
      ${!pending ? `<span class="meta">${t("diffLbl", { d: diff })}</span>` : ""}
      ${srv.ready && !pending ? `<span class="meta" id="keeper">${srv.keeper[l.id] === undefined ? "" : srv.keeper[l.id] ? "👑 " + t("keeperLbl", { n: esc(srv.keeper[l.id].nick), c: srv.keeper[l.id].visits_count }) : t("keeperNone")}</span>` : ""}</div>
    <div class="links">
      ${p ? `<button data-showmap="${esc(l.id)}">${t("showMap")}</button>` : ""}
      ${kakao ? `<a href="${kakao}" target="_blank" rel="noopener">${t("kakao")}</a>` : ""}
    </div>
    ${foreign ? `<div class="langnote">${t("origLang", { l: I18N[lang].langName[l.lang] || l.lang })}</div>` : ""}
    ${l.photoUrl ? `<img class="lphoto" src="${esc(l.photoUrl)}" alt="${esc(tr(l.name))}"><p class="note">${t("photoBy", { n: esc(l.author || "?"), d: dateFmt(l.photoTime) })}</p>`
      : l.hasPhoto ? `<img class="lphoto" id="lphoto" alt="${esc(tr(l.name))}"><p class="note">${t("photoBy", { n: esc(l.author || "?"), d: dateFmt(l.photoTime) })}</p>` : ""}
    <div class="story">${body}</div>
    ${v ? `<div class="bigseal">${esc(tr(l.name))}<br>${t("sealBig")}</div>
       <p class="note">${t("visited", { d: dateFmt(v.t) })}${v.test ? ` <span class="testtag">${t("testStamp")}</span>` : ""}${v.offline ? ` <span class="testtag">${t("offlineTag")}</span>` : ""}</p>
       <button class="btn ghost share-btn" data-share-pick>📸 ${t("shareBtn")}</button>
       <input type="file" id="share-pick" accept="image/*,video/*" hidden>
       <p class="note">${t("shareHint")}</p>` : ""}
    ${checkBtn}
    ${ui.checkMsg ? `<div class="msg ${ui.checkMsg.err ? "err" : ""}">${ui.checkMsg.text}</div>` : ""}
    ${!pending && !visitedToday(l.id) ? `<p class="note">${testMode ? t("testHint") : t("checkinHint", { r: radius(l) })}</p>` : ""}
    ${canAscent ? `<div class="card ascent">
        ${ascentHere ? `<b>🥾 ${t("ascentOn", { t: timeFmt(ascent.at) })}</b><span class="meta">${t("ascentGo")}</span>`
          : `<button class="ghostbtn" data-ascent="${esc(l.id)}" ${ui.busy ? "disabled" : ""}>🥾 ${t("ascentBtn")}</button><span class="meta">${t("ascentHint")}</span>`}
      </div>` : ""}
    ${Wish.card(l)}
    ${l.user && !l.mine && l.status === "approved" && srv.ready ? `<p class="note"><button class="link" data-lgreport="${esc(l.id)}">⚑ ${t("reportBtn")}</button></p>` : ""}
    ${markMode && !l.user ? `<div class="card markbox"><b>${t("markMode")}</b>
       <span class="meta">${pins[l.id] ? t("pinSaved", { c: pins[l.id].lat.toFixed(5) + ", " + pins[l.id].lng.toFixed(5) }) : t("markHint")}</span>
       <button class="ghostbtn" data-pin="${esc(l.id)}">${t("pinHere")}</button></div>` : ""}
  </article>`;
}

// Предупреждение о качестве снимка (не запрещает, только советует переснять)
function qualityNote(q) {
  if (!q || (!q.dark && !q.blurry)) return "";
  return `<div class="msg err">${q.dark ? t("qDark") : t("qBlurry")}</div>`;
}

// ===== Добавление легенды =====
function addView() {
  const c = ui.draft; // {photo, lat, lng, time} — снимок из камеры приложения
  return topBar() + `<button class="back" data-back>${t("back")}</button>
  <h2 class="sec-h">${t("addH")}</h2>
  <form id="addForm">
    <label for="f-name">${t("fName")}<input id="f-name" required maxlength="100" placeholder="${t("fNamePh")}"></label>
    <label for="f-region">${t("fRegion")}<select id="f-region">
      ${Object.keys(REGIONS).map(r => `<option value="${r}">${REGIONS[r][lang]}</option>`).join("")}
    </select></label>
    <label for="f-place">${t("fPlace")}<input id="f-place" required maxlength="200" placeholder="${t("fPlacePh")}"></label>
    <label for="f-story">${t("fStory")}<textarea id="f-story" required maxlength="10000" placeholder="${t("fStoryPh")}"></textarea></label>
    <div class="coordbox"><span style="font-size:13px;font-weight:500">${t("photoH")}</span>
      ${c ? `<img class="lphoto" src="${c.photo}" alt="">
        <span class="meta">${t("photoCoords", { d: dateFmt(c.time), c: c.lat.toFixed(5) + ", " + c.lng.toFixed(5) })}</span>
        ${qualityNote(c.quality)}
        <button type="button" class="ghostbtn" data-shoot>${t("retake")}</button>`
      : `<button type="button" class="ghostbtn" data-shoot>📷 ${t("takePhoto")}</button>
        <span class="meta">${t("photoNeed")}</span>`}
      ${ui.camMsg ? `<div class="msg err">${ui.camMsg}</div>` : ""}</div>
    <button class="btn" type="submit" ${ui.busy ? "disabled" : ""}>${ui.busy ? t("sending") : t("fSubmit")}</button>
    <p class="note">${srv.ready ? t("fNoteServer") : t("fNote")}</p>
  </form>`;
}

// ===== Находка: фото таблички =====
function findView() {
  const c = ui.findDraft;
  return topBar() + `<button class="back" data-back>${t("back")}</button>
  <h2 class="sec-h">${t("findH")}</h2>
  <p class="meta" style="margin-top:-6px">${t("findIntro")}</p>
  ${c ? `<img class="lphoto" src="${c.photo}" alt="">
     <span class="meta">${t("photoCoords", { d: dateFmt(c.time), c: c.lat.toFixed(5) + ", " + c.lng.toFixed(5) })}</span>
     ${qualityNote(c.quality)}
     <form id="findForm">
       <label for="fd-note">${t("findNote")}<textarea id="fd-note" maxlength="1000" placeholder="${t("findNotePh")}"></textarea></label>
       <div class="row"><button class="btn" type="submit" ${ui.busy ? "disabled" : ""}>${ui.busy ? t("sending") : t("save")}</button>
       <button class="btn ghost" type="button" data-shootfind>${t("retake")}</button></div>
     </form>`
   : `<button class="btn" data-shootfind>📷 ${t("findShoot")}</button>
      <ul class="tips"><li>${t("findTip1")}</li><li>${t("findTip2")}</li><li>${t("findTip3")}</li></ul>`}
  ${ui.camMsg ? `<div class="msg err">${ui.camMsg}</div>` : ""}`;
}

// Поделиться находкой через меню «Поделиться» телефона
async function shareFind(id) {
  const f = finds.find(x => x.id === id); if (!f) return;
  const src = await Photos.get(id);
  const text = `누비 · ${t("findH")}\n${f.lat.toFixed(6)}, ${f.lng.toFixed(6)}\n${new Date(f.time).toLocaleString(t("locale"))}${f.note ? "\n" + f.note : ""}`;
  try {
    const blob = await (await fetch(src)).blob();
    const file = new File([blob], `nubi-${id}.jpg`, { type: "image/jpeg" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text });
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      ui.viewFind = id; render(); toast(t("findCopied")); return;
    }
    f.sent = true; store.set("finds", finds); render(); toast(t("findSent"));
  } catch (e) { if (e && e.name !== "AbortError") toast(t("findShareErr")); }
}
// Загрузить находку на сервер (если ещё не загружена)
async function uploadFind(f) {
  if (!srv.ready || f.uploaded) return;
  const src = await Photos.get(f.id);
  if (!src) return;
  await Server.submitFind(f, src);
  f.uploaded = true; store.set("finds", finds);
}

// ===== Вкладка «Карта» =====
function mapView() {
  return topBar() + `<div class="mapwrap"><div id="map"></div>
    <button class="mapbtn mapadd" data-add-from-map>${t("addBtn")}</button>
    <button class="mapbtn" data-locate>${t("myLoc")}</button></div>`;
}
// Общая основа карты: подложка, группы-кружки для близких точек, подгрузка районов при сдвиге
function baseMap(center, zoom) {
  map = L.map("map", { zoomControl: false }).setView(center, zoom);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  // Близкие места собираются в кружок с числом (если библиотека кружков загрузилась)
  map._nubi = L.markerClusterGroup
    ? L.markerClusterGroup({ maxClusterRadius: 48, showCoverageOnHover: false, disableClusteringAtZoom: 15, spiderfyOnMaxZoom: false,
        iconCreateFunction: c => L.divIcon({ className: "", html: `<div class="cluster"><span>${c.getChildCount()}</span></div>`, iconSize: [40, 40] }) })
    : L.layerGroup();
  map._nubi.addTo(map);
  // Сдвинули карту в другой район — подгружаем его (только при достаточном приближении)
  map.on("moveend", () => {
    if (!map || map.getZoom() < 9 || !Data.index) return;
    const b = map.getBounds();
    const need = Data.areasIn(b.getSouth(), b.getWest(), b.getNorth(), b.getEast()).filter(a => !Data.loaded.has(a)).slice(0, 4);
    if (need.length) loadAreas(need);
  });
}
// Перерисовать точки на открытой карте (после подгрузки района), не сбрасывая её положение
function drawMarkers(focusId) {
  if (!map || !map._nubi) return;
  map._nubi.clearLayers();
  let focusMarker = null;
  const items = ui.tab === "pmap" ? placesMarkers() : legendMarkers();
  for (const [id, m] of items) { map._nubi.addLayer(m); if (id === focusId) focusMarker = m; }
  if (focusMarker) map._nubi.zoomToShowLayer ? map._nubi.zoomToShowLayer(focusMarker, () => focusMarker.openPopup()) : focusMarker.openPopup();
}
function legendMarkers() {
  return all().filter(l => pos(l)).map(l => {
    const icon = L.divIcon({ className: "", html: `<div class="pin ${visits[l.id] ? "got" : ""} ${Wish.is(l.id) ? "wish" : ""}"></div>`, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] });
    const p = pos(l);
    return [l.id, L.marker([p.lat, p.lng], { icon })
      .bindPopup(`<b>${esc(tr(l.name))}</b><br>${esc(tr(l.place))}<br><button class="popbtn" data-open-map="${esc(l.id)}">→</button>`)];
  });
}
function initMap() {
  if (typeof L === "undefined") return; // библиотека карты не загрузилась (нет интернета)
  const focus = ui.mapFocus && byId(ui.mapFocus);
  const fp = focus && pos(focus);
  const center = fp ? [fp.lat, fp.lng] : Geo.last ? [Geo.last.lat, Geo.last.lng] : [37.21, 126.99];
  baseMap(center, fp ? 15 : 10);
  drawMarkers(focus ? focus.id : null);
  if (Geo.last) drawMe();
  ui.mapFocus = null;
}
function drawMe() {
  if (!map || !Geo.last) return;
  const icon = L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [16, 16], iconAnchor: [8, 8] });
  if (drawMe.m) drawMe.m.remove();
  drawMe.m = L.marker([Geo.last.lat, Geo.last.lng], { icon }).addTo(map);
}

// ===== Вкладка «Челленджи» =====
function chalView() {
  const act = CHALLENGES.filter(c => !progress(c).done), done = CHALLENGES.filter(c => progress(c).done);
  return topBar() + `<h2 class="sec-h">${t("chH")}</h2>
    ${act.length ? `<h3 class="sub-h" style="margin-top:0">${t("chActive")}</h3>${act.map(chCard).join("")}` : ""}
    ${done.length ? `<h3 class="sub-h">${t("chDoneH")}</h3>${done.map(chCard).join("")}` : ""}`;
}

// ===== Вкладка «Профиль» =====
const BOARDS = { "coll-month": ["collection", true], "hikes-month": ["hikes", true], "coll-all": ["collection", false] };
function boardView() {
  if (!srv.ready) return `<p class="sample">${t("offlineBanner")}</p>`;
  const tabs = `<div class="filters">${[["coll-month", "boardColl"], ["hikes-month", "boardHikes"], ["coll-all", "boardAll"]]
    .map(([k, lbl]) => `<button class="chip" data-board="${k}" aria-pressed="${srv.boardKey === k}">${t(lbl)}</button>`).join("")}</div>`;
  if (!srv.board) return tabs + `<p class="meta">${t("boardLoading")}</p>`;
  if (!srv.board.length) return tabs + `<p class="meta">${t("boardEmpty")}</p>`;
  return tabs + `<div class="rankbox">${srv.board.map(p => `<div class="rk ${p.is_me ? "me" : ""}"><span class="n">${p.pos}</span>
    <div><b>${esc(p.nick)}</b>${p.is_me ? ` <span class="meta">(${t("you")})</span>` : ""}<span class="ttl">${p.title && titleById(p.title) ? esc(tr(titleById(p.title).name)) : ""}</span></div>
    <span class="s">${p.pts}</span></div>`).join("")}</div>
    <p class="sample">${t("rankNoteServer")}</p>`;
}
async function loadBoard() {
  if (!srv.ready) return;
  const [kind, month] = BOARDS[srv.boardKey];
  try { srv.board = await Server.leaderboard(kind, month); } catch (e) { srv.board = []; }
  if (ui.tab === "me") render();
}
async function refreshTotals() {
  if (!srv.ready) return;
  try { srv.totals = await Server.totals(); if (ui.tab === "me") render(); } catch (e) {}
}

// Значок Kakao (облачко) для кнопки входа
const KAKAO_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.5.1 1 .1 1.5.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/></svg>';

// Блок «Аккаунт» в профиле: временный аккаунт → предложить Kakao; уже Kakao → галочка
function accountCard() {
  if (!srv.ready) return `<p class="meta">${t("offlineBanner")}</p>`;
  if (Server.isKakao()) return (srv.role === "owner" || srv.role === "admin" ? `<h3 class="sub-h">${t("adminH")}</h3>
    <div class="card"><p class="meta" style="margin:0">${t(srv.role === "owner" ? "adminOwnerNote" : "adminNote")}</p>
      <a class="btn" href="admin.html">🛠 ${t("adminOpen")}</a></div>` : "") + `<h3 class="sub-h">${t("accountH")}</h3>
    <div class="card"><p style="margin:0"><b>✅ ${t("kakaoLinked")}</b></p><p class="meta" style="margin:0">${t("accountKakao")}</p>
    ${ui.confirmLogout
      ? `<p class="meta" style="margin:0">${t("logoutQ")}</p>
         <div class="row"><button class="btn" data-logout-yes>${t("logoutYes")}</button><button class="btn ghost" data-logout-no>${t("cancel")}</button></div>`
      : `<button class="btn ghost" data-logout>${t("logout")}</button>`}</div>`;
  return `<h3 class="sub-h">${t("accountH")}</h3>
  <div class="card">
    <p class="meta" style="margin:0">${t("accountAnon")}</p>
    <button class="kakao-btn" data-kakao-link>${KAKAO_SVG}${t("kakaoLink")}</button>
    ${ui.kakaoTaken ? `<div class="msg" style="margin:0">${t("kakaoTaken")}</div>
      <button class="btn ghost" data-kakao-switch>${t("kakaoSwitch")}</button>` : ""}
  </div>`;
}

function meView() {
  const visited = all().filter(l => visits[l.id]).sort((a, b) => vTime(b.id) - vTime(a.id));
  if (srv.ready && !srv.board) loadBoard();
  return `<div class="bar"><span></span>${langSwitch()}</div>
  <h2 class="sec-h">${t("meH")}</h2>
  <div class="card">
    ${ui.editing
      ? `<form id="editForm"><label for="e-nick">${t("wNick")}<input id="e-nick" maxlength="12" value="${esc(profile.nick)}"></label>
         <div class="row"><button class="btn" type="submit">${t("save")}</button><button class="btn ghost" type="button" data-cancel>${t("cancel")}</button></div></form>`
      : `<div class="prof"><span class="ava">${esc(profile.nick[0].toUpperCase())}</span>
          <div style="min-width:0"><h2>${esc(profile.nick)}</h2><div class="ttl">${esc(wornName())}</div>
          <button class="link" data-edit>${t("edit")}</button></div></div>`}
    <div class="stats">
      <div><b>${count()}</b><span>${t("stStamps")}</span></div>
      <div><b>${srv.totals ? srv.totals.collection : "—"}</b><span>${t("stColl")}</span></div>
      <div><b>${srv.totals ? srv.totals.hikes_month : "—"}</b><span>${t("stHikes")}</span></div>
    </div>
  </div>

  <h3 class="sub-h">${t("rankH")}</h3>
  ${boardView()}

  ${finds.length ? `<h3 class="sub-h">${t("findsH", { n: finds.length })}</h3>
  <p class="meta" style="margin:-4px 0 10px">${srv.ready ? t("findsHintServer") : t("findsHint")}</p>
  <div class="finds">${finds.slice().reverse().map(f => `<div class="fitem">
    <img data-fimg="${f.id}" alt="">
    <div><b>${dateFmt(f.time)}</b><span class="meta">${f.lat.toFixed(5)}, ${f.lng.toFixed(5)}</span>
      ${f.note ? `<span class="meta">${esc(f.note)}</span>` : ""}
      <span class="${f.uploaded || f.sent ? "dist" : "meta"}">${f.uploaded ? t("findOnServer") : f.sent ? t("findSentTag") : t("findWaitTag")}</span></div>
    <div class="factions"><button class="wear" data-sharefind="${f.id}">${t("findSend")}</button>
      <button class="link" data-delfind="${f.id}" aria-label="✕">✕</button></div></div>`).join("")}</div>
  ${ui.viewFind ? `<img class="lphoto" id="fbig" alt=""><p class="note">${t("findLongPress")}</p>` : ""}` : ""}

  <h3 class="sub-h">${t("titlesH")}</h3>
  <p class="meta" style="margin:-4px 0 10px">${t("titlesHint")}</p>
  <div class="titles">${TITLES.map(x => {
    const on = hasTitle(x), worn = on && profile.title === x.id;
    return `<div class="title ${on ? "on" : ""} ${worn ? "worn" : ""}"><div class="rank">${on ? "✓" : titleProg(x)}</div>
      <div><h3>${esc(tr(x.name))}</h3><p>${esc(tr(x.desc))}</p></div>
      ${on ? (worn ? `<button class="wear" disabled>${t("worn")}</button>` : `<button class="wear" data-wear="${x.id}">${t("wear")}</button>`) : "<span></span>"}</div>`;
  }).join("")}</div>

  <h3 class="sub-h">${t("bookH")}</h3>
  <div class="book">${visited.length
    ? visited.map(l => `<button data-open-from-me="${esc(l.id)}">${l.user || Art.has(l.id) ? thumbHtml(l, "stamp-art") : ""}<span>${esc(tr(l.name))}</span></button>`).join("")
    : `<button class="empty" disabled>${t("bookEmpty")}</button>`}</div>

  ${Wish.profileBlock()}

  <h3 class="sub-h">${t("settingsH")}</h3>
  <div class="card">
    <label class="switch" for="s-test"><span>${t("testMode")}<br><span class="meta" style="font-weight:400">${t("testHint")}</span></span>
      <input type="checkbox" id="s-test" ${testMode ? "checked" : ""}></label>
    <label class="switch" for="s-mark"><span>${t("markMode")}<br><span class="meta" style="font-weight:400">${t("markHint")}</span></span>
      <input type="checkbox" id="s-mark" ${markMode ? "checked" : ""}></label>
    ${Object.keys(pins).length ? `<div class="coordbox"><b>${t("pinsH", { n: Object.keys(pins).length })}</b>
      <textarea id="pins-out" readonly rows="4">${esc(pinsText())}</textarea>
      <button type="button" class="ghostbtn" data-copypins>${t("pinsCopy")}</button></div>` : ""}
  </div>
  ${accountCard()}
  ${ui.confirmReset
    ? `<div class="card" style="margin-top:16px"><p style="margin:0">${t("resetQ")}</p>
       <div class="row"><button class="btn danger" data-reset-yes>${t("resetYes")}</button><button class="btn ghost" data-reset-no>${t("cancel")}</button></div></div>`
    : `<button class="btn ghost" style="margin-top:16px" data-reset>${t("reset")}</button>`}
  <p class="note" style="text-align:center"><a href="privacy.html?lang=${lang}">${t("privacyLink")}</a></p>`;
}

// Точки в виде текста, который удобно отправить разработчику
function pinsText() {
  return Object.entries(pins).map(([id, p]) => {
    const l = byId(id); return `${id} | ${l ? (l.name.ko || tr(l.name)) : "?"} | ${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`;
  }).join("\n");
}

// ===== Вкладка «Нуби» — выбор раздела (код в js/sections.js) =====
const moreView = () => sectionsView();

// ===== Отрисовка =====
function render() {
  document.documentElement.lang = lang;
  if (map) { map.remove(); map = null; drawMe.m = null; }
  const nav = document.getElementById("nav");
  if (!profile) { nav.hidden = true; app.innerHTML = welcomeView(); return; }
  nav.hidden = false;
  // Нижняя панель своя для каждого раздела
  nav.querySelector(".in").innerHTML = navHtml();
  const views = { walk: walkView, map: mapView, chal: chalView, me: meView, more: moreView,
                  plist: placesView, pmap: placesMapView, talk: talkView };
  app.innerHTML = (views[ui.tab] || views.more)() + citySheet();
  document.querySelectorAll("[data-i]").forEach(el => el.textContent = t(el.dataset.i));
  if (ui.tab === "map") initMap();
  if (ui.tab === "pmap") initPlacesMap();
  document.querySelectorAll("[data-fimg]").forEach(im => Photos.get(im.dataset.fimg).then(src => { if (src) im.src = src; }));
  const big = document.getElementById("fbig");
  if (big && ui.viewFind) Photos.get(ui.viewFind).then(src => { if (src) big.src = src; });
  const img = document.getElementById("lphoto");
  if (img && ui.openId) Photos.get(ui.openId).then(src => { if (src) img.src = src; else img.remove(); });
  // Стена фонариков и мои желания подгружаются отдельно
  Wish.load();
  Owner.load();
  // Хранитель места подгружается отдельно
  if (ui.openId && srv.ready && srv.keeper[ui.openId] === undefined) {
    const id = ui.openId;
    Server.keeper(id).then(k => { srv.keeper[id] = k || false; if (ui.openId === id) render(); }).catch(() => {});
  }
}
function go(tab) {
  ui = { ...ui, tab, openId: null, openPlace: null, adding: false, finding: false, viewFind: null, editing: false, confirmReset: false, checkMsg: null };
  if (tab === "me") { srv.board = null; refreshTotals(); }
  render(); window.scrollTo(0, 0);
}
function openLegend(id) { ui = { ...ui, tab: "walk", openId: id, adding: false, checkMsg: null }; render(); window.scrollTo(0, 0); }

// ===== Нажатия =====
document.addEventListener("click", async e => {
  const b = e.target.closest("button"); if (!b) return;
  const d = b.dataset;
  if (d.lang) { lang = d.lang; store.set("lang", lang); if (profile) saveProfile(); render(); }
  else if (d.tab) go(d.tab);
  // --- Разделы спорт / рыбалка / кемпинг ---
  else if (d.sec) {
    sec = d.sec; store.set("sec", sec);
    ui = { ...ui, kind: "all", bookOnly: false, ftype: "all" };
    go(sec === "walk" ? "walk" : "plist");
  }
  else if (d.place) { ui = { ...ui, tab: "plist", openPlace: d.place }; render(); window.scrollTo(0, 0); }
  else if (b.hasAttribute("data-back-place")) { ui.openPlace = null; render(); }
  else if (d.placemap) { ui.mapFocus = d.placemap; go("pmap"); }
  else if (d.kind) { ui.kind = d.kind; render(); }
  else if (b.hasAttribute("data-bookonly")) { ui.bookOnly = !ui.bookOnly; render(); }
  else if (d.ftype) { ui.ftype = d.ftype; render(); }
  else if (b.hasAttribute("data-near")) {
    b.disabled = true; b.textContent = t("locating");
    try { await Geo.locate(); await Data.loadMany(Data.areasAt(Geo.last)); } catch (err) { toast(err === "denied" ? t("gpsDenied") : t("gpsErr")); }
    render();
  }
  else if (d.region) { ui.region = d.region; render(); }
  // --- Выбор города ---
  else if (d.cityOpen) { ui.citySheet = { kind: d.cityOpen, field: d.field }; render(); const q = document.getElementById("city-q"); if (q && matchMedia("(pointer:fine)").matches) q.focus(); }
  else if (b.hasAttribute("data-city-close")) { ui.citySheet = null; render(); }
  else if (d.city) {
    const { field } = ui.citySheet || { field: sec === "walk" ? "region" : "area" };
    const a = d.city; ui.citySheet = null;
    if (a === "all") {
      ui[field] = "all"; render();
      // «Рядом со мной»: находим себя и подгружаем ближние районы
      Geo.locate().then(() => loadAreas(Data.areasAt(Geo.last))).catch(() => {});
    } else {
      rememberArea(a);
      Data.load(a).then(() => { ui[field] = a; render(); window.scrollTo(0, 0); });
    }
  }
  else if (d.parea) { ui.area = d.parea; render(); }
  else if (d.board) { srv.boardKey = d.board; srv.board = null; render(); }
  else if (d.open) openLegend(d.open);
  else if (d.openFromMe) openLegend(d.openFromMe);
  else if (d.openMap) openLegend(d.openMap);
  else if (d.showmap) { ui.mapFocus = d.showmap; go("map"); }
  else if (b.hasAttribute("data-back")) { ui.openId = null; ui.adding = false; ui.finding = false; ui.checkMsg = null; render(); }
  else if (b.hasAttribute("data-find")) { ui.finding = true; ui.findDraft = null; ui.camMsg = null; render(); window.scrollTo(0, 0); }
  else if (b.hasAttribute("data-shootfind")) {
    ui.camMsg = null;
    try { const shot = await Camera.shoot({ cancel: t("cancel"), shutter: t("shutter"), locating: t("locating") }); if (shot) ui.findDraft = shot; }
    catch (err) { ui.camMsg = { camDenied: t("camDenied"), camErr: t("camErr"), gpsDenied: t("gpsDenied"), gpsErr: t("photoGpsFail") }[err] || t("camErr"); }
    render();
  }
  else if (d.sharefind) shareFind(d.sharefind);
  else if (d.delfind) { finds = finds.filter(f => f.id !== d.delfind); store.set("finds", finds); if (ui.viewFind === d.delfind) ui.viewFind = null; render(); }
  else if (b.hasAttribute("data-add")) { ui.adding = true; ui.draft = null; ui.camMsg = null; render(); window.scrollTo(0, 0); }
  else if (b.hasAttribute("data-add-from-map")) {
    ui = { ...ui, tab: "walk", openId: null, adding: true, draft: null, camMsg: null };
    render(); window.scrollTo(0, 0);
  }
  else if (d.checkin) tryCheckin(d.checkin);
  else if (d.ascent) startAscent(d.ascent);
  else if (b.hasAttribute("data-locate")) {
    try { await Geo.locate(); drawMe(); map && map.setView([Geo.last.lat, Geo.last.lng], 15); loadAreas(Data.areasAt(Geo.last)); }
    catch (err) { toast(err === "denied" ? t("gpsDenied") : t("gpsErr")); }
  }
  else if (b.hasAttribute("data-shoot")) {
    const keep = ["f-name", "f-region", "f-place", "f-story"].map(id => [id, document.getElementById(id).value]);
    ui.camMsg = null;
    try {
      const shot = await Camera.shoot({ cancel: t("cancel"), shutter: t("shutter"), locating: t("locating") });
      if (shot) ui.draft = shot;
    } catch (err) {
      ui.camMsg = { camDenied: t("camDenied"), camErr: t("camErr"), gpsDenied: t("gpsDenied"), gpsErr: t("photoGpsFail") }[err] || t("camErr");
    }
    render(); keep.forEach(([id, v]) => { const el = document.getElementById(id); if (el) el.value = v; });
  }
  else if (d.pin) {
    b.disabled = true; b.textContent = t("locating");
    try {
      const p = await Geo.locate();
      pins[d.pin] = { lat: p.lat, lng: p.lng }; store.set("pins", pins);
      if (srv.ready) await Server.submitPin(d.pin, p).catch(() => {});
      toast(srv.ready ? t("pinOkServer") : t("pinOk"));
    }
    catch (err) { toast(err === "denied" ? t("gpsDenied") : t("gpsErr")); }
    render();
  }
  else if (b.hasAttribute("data-copypins")) {
    const txt = pinsText();
    try { await navigator.clipboard.writeText(txt); toast(t("pinsCopied")); }
    catch (err) { const ta = document.getElementById("pins-out"); ta.focus(); ta.select(); }
  }
  else if (d.wear) { profile.title = d.wear; saveProfile(); render(); toast(t("toastWorn", { t: tr(titleById(d.wear).name) })); }
  else if (b.hasAttribute("data-edit")) { ui.editing = true; render(); }
  else if (b.hasAttribute("data-cancel")) { ui.editing = false; render(); }
  // --- Желания и стена фонариков ---
  else if (Wish.handles(d)) await Wish.click(b);
  // --- Владельцы мест ---
  else if (Owner.handles(d)) await Owner.click(b);
  // --- Поделиться фотокарточкой ---
  else if (b.hasAttribute("data-share-pick")) { const f = document.getElementById("share-pick"); if (f) f.click(); }
  // --- Жалоба на народную легенду ---
  else if (d.lgreport) {
    b.disabled = true;
    try { await Server.report("legend", d.lgreport.replace(/^u_/, "")); toast(t("reportOk"), true); }
    catch (err) { b.disabled = false; toast(t("errServer")); }
  }
  // --- Вход через Kakao ---
  else if (b.hasAttribute("data-kakao-start") || b.hasAttribute("data-kakao-link") || b.hasAttribute("data-kakao-switch")) {
    if (!Server.db) return toast(t("offlineBanner"));
    b.disabled = true;
    try {
      sessionStorage.setItem("nubi_kakao", "1");
      if (b.hasAttribute("data-kakao-link") && Server.user) await Server.linkKakao();
      else {
        // Переход в другой (уже существующий) профиль: местные записи этого телефона убираем,
        // после входа всё загрузится с сервера из того профиля
        if (b.hasAttribute("data-kakao-switch")) {
          ["visits", "mine", "profile", "seenTitles", "finds", "ascent"].forEach(store.del);
          await Server.db.auth.signOut().catch(() => {});
        }
        await Server.signInKakao();
      }
    } catch (err) { b.disabled = false; toast(t("kakaoErr", { e: String(err) }), true); }
  }
  // --- Выход из аккаунта Kakao: печати остаются на сервере, с телефона убираем ---
  else if (b.hasAttribute("data-logout")) { ui.confirmLogout = true; render(); }
  else if (b.hasAttribute("data-logout-no")) { ui.confirmLogout = false; render(); }
  else if (b.hasAttribute("data-logout-yes")) {
    ["visits", "mine", "profile", "seenTitles", "testMode", "markMode", "finds", "ascent"].forEach(store.del);
    Photos.clear().catch(() => {});
    if (Server.db) await Server.db.auth.signOut({ scope: "local" }).catch(() => {});
    Server.user = null; srv = { ...srv, ready: false, others: [], totals: null, board: null, keeper: {} };
    Owner.info = null; Owner.claims = null;
    finds = []; visits = {}; mine = []; profile = null; seen = []; testMode = false; markMode = false; ascent = null;
    srv.role = null; ui.confirmLogout = false; toast(t("loggedOut"), true);
    go("walk");
  }
  else if (b.hasAttribute("data-reset")) { ui.confirmReset = true; render(); }
  else if (b.hasAttribute("data-reset-no")) { ui.confirmReset = false; render(); }
  else if (b.hasAttribute("data-reset-yes")) {
    ["visits", "mine", "profile", "seenTitles", "testMode", "markMode", "finds", "ascent"].forEach(store.del);
    Photos.clear().catch(() => {});
    if (Server.db) await Server.db.auth.signOut().catch(() => {});
    Server.user = null; srv = { ...srv, ready: false, others: [], totals: null, board: null, keeper: {} };
    Owner.info = null; Owner.claims = null;
    finds = []; visits = {}; mine = []; profile = null; seen = []; testMode = false; markMode = false; ascent = null;
    go("walk");
  }
});

// Переключатели
document.addEventListener("change", e => {
  // Выбрали другой район: загружаем и показываем только его
  if (e.target.hasAttribute("data-area-pick") && e.target.value) {
    const a = e.target.value; rememberArea(a);
    Data.load(a).then(() => { if (sec === "walk") ui.region = a; else ui.area = a; render(); });
    return;
  }
  // Фото для карточки «Поделиться» и фото-доказательство владельца
  if (e.target.id === "share-pick" && e.target.files[0]) { Share.make(ui.openId, e.target.files[0]); e.target.value = ""; }
  if (e.target.id === "o-proof" && e.target.files[0]) Owner.pickProof(e.target.files[0]);
  if (e.target.id === "s-mark") {
    markMode = e.target.checked; store.set("markMode", markMode);
    toast(markMode ? t("markOn") : t("markOff"));
  }
  if (e.target.id === "s-test") {
    testMode = e.target.checked; store.set("testMode", testMode);
    toast(testMode ? t("testOn") : t("testOff"));
  }
});

// Формы: ник при первом запуске, смена ника, находка, новая легенда
document.addEventListener("submit", async e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();

  if (e.target.id === "nickForm") {
    const nick = v("w-nick");
    if (nick.length < 2 || nick.length > 12) return toast(t("nickErr"));
    ui.busy = true; render();
    if (Server.online) {
      try { await Server.createProfile(nick, lang); srv.ready = true; }
      catch (err) {
        ui.busy = false; render();
        if (err === "taken" || err === "bad") { document.getElementById("w-nick").value = nick; return toast(t(err === "bad" ? "nickBad" : "nickTaken")); }
        // Сервер недоступен — продолжаем без него, подключимся при следующем запуске
      }
    }
    ui.busy = false;
    profile = { nick, title: null };
    const got = earned(); seen = got.map(x => x.id); store.set("seenTitles", seen);
    if (got.length) profile.title = got[got.length - 1].id;
    store.set("profile", profile);
    if (srv.ready) { await loadServerData(); refreshTotals(); }
    render(); return;
  }

  if (e.target.id === "editForm") {
    const nick = v("e-nick");
    if (nick.length < 2 || nick.length > 12) return toast(t("nickErr"));
    if (srv.ready) {
      try { await Server.updateProfile({ nick }); }
      catch (err) { return toast(err === "taken" ? t("nickTaken") : err === "bad" ? t("nickBad") : t("errServer")); }
    }
    profile.nick = nick; store.set("profile", profile);
    ui.editing = false; srv.board = null; toast(t("toastSaved")); render(); return;
  }

  if (e.target.id === "findForm") {
    const c = ui.findDraft; if (!c) return;
    const id = "f" + Date.now();
    await Photos.put(id, c.photo).catch(() => {});
    const f = { id, lat: c.lat, lng: c.lng, acc: c.acc, time: c.time, note: v("fd-note"), sent: false, uploaded: false };
    finds.push(f); store.set("finds", finds);
    if (srv.ready) {
      ui.busy = true; render();
      try { await uploadFind(f); toast(t("findUploaded")); } catch (err) { toast(t("findSaved")); }
      ui.busy = false;
    } else toast(t("findSaved"));
    ui.finding = false; ui.findDraft = null;
    go("me"); return;
  }

  if (e.target.id === "addForm") {
    const c = ui.draft;
    const keepForm = () => { const keep = ["f-name", "f-region", "f-place", "f-story"].map(id => [id, v(id)]);
      render(); keep.forEach(([id, x]) => document.getElementById(id).value = x); };
    if (!c) { ui.camMsg = t("photoNeed"); return keepForm(); }
    const data = { lang, region: v("f-region"), name: v("f-name"), place: v("f-place"), story: v("f-story") };
    if (srv.ready) {
      ui.busy = true; keepForm();
      try {
        await Server.submitLegend(data, c);
        await loadServerData();
        ui.busy = false; ui.adding = false; ui.draft = null; ui.camMsg = null;
        checkNewTitles(t("toastSubmitted")); go("walk");
      } catch (err) { ui.busy = false; ui.camMsg = err === "day_limit" ? t("errDayLimitAdd") : t("errServer"); keepForm(); }
      return;
    }
    // Без сервера — сохраняем на телефоне, как раньше
    const one = s => ({ [lang]: s });
    const id = "u" + Date.now();
    await Photos.put(id, c.photo).catch(() => {});
    mine.push({ id, user: true, lang, author: profile.nick, region: data.region,
      lat: c.lat, lng: c.lng, hasPhoto: true, photoTime: c.time,
      name: one(data.name), place: one(data.place), story: one(data.story) });
    store.set("mine", mine);
    ui.region = "all"; ui.draft = null; ui.camMsg = null;
    checkNewTitles(t("toastAdded")); go("walk");
  }
});

// ===== Загрузка данных с сервера =====
async function loadServerData() {
  // Координаты и сложность мест
  try { for (const p of await Server.places()) srv.places[p.id] = p; } catch (e) {}
  // Мои печати с сервера (тестовые и офлайн-печати с телефона остаются как есть)
  try {
    const sv = await Server.myVisits();
    for (const id in sv) {
      const loc = visits[id];
      visits[id] = { ...sv[id], day: loc && loc.server ? loc.day : kstDay(sv[id].t) };
    }
    store.set("visits", visits);
  } catch (e) {}
  // Легенды игроков
  try {
    const me = Server.user && Server.user.id;
    srv.others = (await Server.userLegends()).map(r => ({
      id: "u_" + r.id, user: true, lang: r.lang, region: r.region, author: r.author_nick,
      lat: r.lat, lng: r.lng, status: r.status, mine: r.author === me,
      photoUrl: r.photo_path && r.status === "approved" ? Server.photoUrl(r.photo_path) : null,
      photoTime: r.photo_at,
      artUrl: r.art_path && r.status === "approved" ? Server.photoUrl(r.art_path) : null,
      name: { [r.lang]: r.name }, place: { [r.lang]: r.place || "" }, story: { [r.lang]: r.story }
    })).filter(l => l.status === "approved" || l.mine);
  } catch (e) {}
  // Находки, которые не успели загрузиться
  for (const f of finds) if (!f.uploaded) uploadFind(f).catch(() => {});
  // Печати с сервера могут быть в районах, которые ещё не загружены
  await Data.loadMany(visitedAreas());
}

// ===== Запуск =====
// После возврата с Kakao в адресе может быть ошибка — читаем её
function readAuthError() {
  const q = new URLSearchParams(location.search), h = new URLSearchParams(location.hash.slice(1));
  const code = q.get("error_code") || h.get("error_code");
  const desc = q.get("error_description") || h.get("error_description") || q.get("error") || h.get("error");
  return code || desc ? { code: code || "", desc: (desc || "").replace(/\+/g, " ") } : null;
}

async function boot() {
  // Сначала данные мест: оглавление и нужные районы (мои печати, выбранные раньше, ссылка ?l=)
  const deepId = new URLSearchParams(location.search).get("l");
  await Data.init(store.get("areas", []))
    .then(() => Data.loadMany([...visitedAreas(), Data.areaOf(deepId)].filter(Boolean)));
  // Первый запуск: запоминаем район по умолчанию, чтобы он грузился и дальше
  if (!store.get("areas", []).length && Data.loaded.size) store.set("areas", [...Data.loaded].slice(0, 5));
  render();
  const authErr = readAuthError();
  const ok = await Server.init();
  if (authErr) history.replaceState(null, "", location.pathname);   // убираем ошибку из адреса
  // Профиль есть на сервере, а на этом телефоне нет (вход через Kakao на новом телефоне)
  if (ok && !profile && Server.user) {
    try { const sp = await Server.getProfile(); if (sp) { profile = { nick: sp.nick, title: sp.title || null }; store.set("profile", profile); } } catch (e) {}
  }
  // Итог входа через Kakao
  const kakaoTry = sessionStorage.getItem("nubi_kakao"); sessionStorage.removeItem("nubi_kakao");
  if (authErr) {
    if (/identity_already_exists|already/i.test(authErr.code + authErr.desc)) { ui.kakaoTaken = true; ui.tab = "me"; }
    else toast(t("kakaoErr", { e: authErr.desc || authErr.code }), true);
  } else if (kakaoTry && Server.isKakao()) toast(t("kakaoOk"), true);
  // Роль в команде (владелец/админ) — показать кнопку админ-панели в профиле
  if (ok && Server.isKakao()) Server.db.rpc("my_role").then(r => { srv.role = r.data && r.data.role; if (srv.role && ui.tab === "me") render(); }).catch(() => {});
  if (ok && profile) {
    try {
      // Старый игрок без аккаунта на сервере — создаём аккаунт с тем же ником
      let sp = Server.user ? await Server.getProfile() : null;
      if (!sp) {
        let nick = profile.nick;
        for (let i = 0; i < 5; i++) {
          try { await Server.createProfile(nick, lang); break; }
          catch (err) {
            if (err !== "taken") throw err;
            nick = (profile.nick.slice(0, 9) + Math.floor(100 + Math.random() * 900)).slice(0, 12);
          }
        }
        if (nick !== profile.nick) { profile.nick = nick; store.set("profile", profile); toast(t("nickChanged", { n: nick }), true); }
        await Server.updateProfile({ title: profile.title }).catch(() => {});
        sp = await Server.getProfile();
      }
      if (sp) {
        profile = { nick: sp.nick, title: sp.title || profile.title };
        store.set("profile", profile);
        srv.ready = true;
        await loadServerData();
        refreshTotals();
      }
    } catch (e) { srv.ready = false; }
  }
  // Ссылка из соцсетей вида ?l=<id места> — сразу открываем это место
  const deep = new URLSearchParams(location.search).get("l");
  if (deep) {
    history.replaceState(null, "", location.pathname);
    if (profile && byId(deep)) { ui = { ...ui, tab: "walk", openId: deep }; if (sec !== "walk") { sec = "walk"; store.set("sec", sec); } }
  }
  render();
  // Тихо узнаём местоположение, если доступ уже разрешён, — чтобы показать расстояния
  if (profile && navigator.permissions) {
    navigator.permissions.query({ name: "geolocation" }).then(p => {
      if (p.state === "granted") Geo.locate().then(async () => {
        await Data.loadMany(Data.areasAt(Geo.last));          // район, где человек сейчас
        if (ui.tab !== "map" && ui.tab !== "pmap") render(); else { drawMarkers(); drawMe(); }
      }).catch(() => {});
    }).catch(() => {});
  }
}
boot();

// Service worker — нужен, чтобы приложение можно было установить на телефон и открывать без интернета
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
