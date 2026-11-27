// ============================================================
// 누비 — разделы «Спорт», «Рыбалка», «Кемпинг» (на открытых данных)
// У каждого раздела своя нижняя панель: Места · Карта · Общение · Профиль · Нуби
// Данные мест — в data/<район>/places.js (загружает js/datastore.js)
// ============================================================

// Какие разделы есть и какие из них уже открываются
const SECTIONS = ["walk", "sport", "fish", "camp", "cult"];
const SEC_LIVE = { walk: true, sport: true, fish: true, camp: true, cult: false };
const SEC_ICON = { walk: "📜", sport: "⚽", fish: "🎣", camp: "⛺", cult: "🏆" };

// Порядок видов спорта в фильтре и картинка для каждого
const KIND_ORDER = ["soccer", "futsal", "tennis", "basket", "badm", "base", "pool", "indoor", "center", "pgolf",
  "jokgu", "gate", "inline", "xgame", "archery", "multi", "etc"];
const KIND_ICON = { soccer: "⚽", futsal: "⚽", tennis: "🎾", basket: "🏀", badm: "🏸", base: "⚾", pool: "🏊",
  indoor: "🏟️", center: "🏋️", pgolf: "⛳", jokgu: "🏐", gate: "🏑", inline: "🛼", xgame: "🛹", archery: "🏹", multi: "🏟️", etc: "🤸" };
// Главная картинка места: сначала самое «заметное»
const KIND_MAIN = ["pool", "center", "soccer", "base", "tennis", "futsal", "basket", "badm", "indoor", "pgolf",
  "archery", "jokgu", "gate", "inline", "xgame", "multi", "etc"];

// Списки мест по разделам (только загруженные районы)
const secPlaces = s => s === "sport" ? SPORT : s === "fish" ? FISH : s === "camp" ? CAMP : [];
// Район места — по началу id («hs_s12» → hs)
const placeArea = p => Data.areaOf(p.id);
const placeById = id => SPORT.find(p => p.id === id) || FISH.find(p => p.id === id) || CAMP.find(p => p.id === id);
const placeDist = p => Geo.last && p.lat != null ? Geo.distance(Geo.last, p) : null;
const num = n => Number(n).toLocaleString(t("locale"));
const kindName = k => (I18N[lang].kinds || I18N.ko.kinds)[k] || k;
const mainKind = p => KIND_MAIN.find(k => p.kinds[k]) || "etc";
const kakaoLink = p => p.lat != null
  ? `https://map.kakao.com/link/map/${encodeURIComponent(p.name)},${p.lat},${p.lng}`
  : `https://map.kakao.com/link/search/${encodeURIComponent(p.addr.replace(/\s*\(.*\)$/, ""))}`;

// Шапка раздела: «누비 / Спорт» и сколько мест
function secTop(s) {
  const n = Data.index ? Data.total(s) : secPlaces(s).length;
  return `<div class="top"><div class="brand">누비<small>${esc(I18N[lang].secs[s][0])}</small></div>
    <div class="stampcount">${t("placesN", { n })}</div></div>`;
}

// ===== Вкладка «Места» =====
function placesView() {
  if (ui.openPlace) return placeView(placeById(ui.openPlace));
  const s = sec;
  let list = secPlaces(s).slice();
  // Районы: загруженные + выбор другого
  const areas = [...new Set(list.map(placeArea).filter(Boolean))];
  if (ui.area !== "all" && !areas.includes(ui.area)) ui.area = "all";
  if (ui.area !== "all") list = list.filter(p => placeArea(p) === ui.area);
  const pick = areaPicker(s);
  const areaChips = areas.length < 2 && !pick ? "" : `<div class="filters">
    <button class="chip" data-parea="all" aria-pressed="${ui.area === "all"}">${t("all")}</button>
    ${areas.length > 1 ? areas.map(a => `<button class="chip" data-parea="${a}" aria-pressed="${ui.area === a}">${esc(regionName(a))}</button>`).join("") : ""}
    ${pick}</div>`;
  let chips = "";
  if (s === "sport") {
    const kinds = KIND_ORDER.filter(k => list.some(p => p.kinds[k]));
    if (ui.kind !== "all") list = list.filter(p => p.kinds[ui.kind]);
    if (ui.bookOnly) list = list.filter(p => p.book);
    chips = `<div class="filters">
      <button class="chip" data-kind="all" aria-pressed="${ui.kind === "all"}">${t("all")}</button>
      <button class="chip book" data-bookonly aria-pressed="${!!ui.bookOnly}">${t("bookOnly")}</button>
      ${kinds.map(k => `<button class="chip" data-kind="${k}" aria-pressed="${ui.kind === k}">${KIND_ICON[k]} ${esc(kindName(k))}</button>`).join("")}
    </div>`;
  }
  if (s === "fish") {
    if (ui.ftype !== "all") list = list.filter(p => p.type === ui.ftype);
    chips = `<div class="filters">${["all", "r", "s", "i"].map(k =>
      `<button class="chip" data-ftype="${k}" aria-pressed="${ui.ftype === k}">${k === "all" ? t("all") : esc(I18N[lang].fishTypes[k])}</button>`).join("")}</div>`;
  }
  // Сортировка: если знаем, где человек, — ближние сверху; иначе сначала места с точкой на карте и бронью
  if (Geo.last) list.sort((a, b) => (placeDist(a) ?? 1e9) - (placeDist(b) ?? 1e9));
  else list.sort((a, b) => (b.lat != null) - (a.lat != null) || (b.book ? 1 : 0) - (a.book ? 1 : 0));

  return topBar() + secTop(s) + `
  <div class="msg">${t(s === "camp" ? "campNote" : "srcNote")}</div>
  <div class="addrow">${Geo.last ? "" : `<button class="link" data-near>${t("nearMe")}</button>`}</div>
  ${areaChips}
  ${chips}
  <div class="list">${list.length ? list.map(placeItem).join("") : `<p class="meta">${t("noneHere")}</p>`}</div>`;
}

function placeItem(p) {
  const d = placeDist(p);
  let icon = "", meta = "";
  if (sec === "sport") {
    icon = KIND_ICON[mainKind(p)];
    meta = KIND_ORDER.filter(k => p.kinds[k]).map(k => kindName(k) + (p.kinds[k] > 1 ? " " + p.kinds[k] : "")).join(" · ");
  } else if (sec === "fish") {
    icon = "🎣";
    meta = `${I18N[lang].fishTypes[p.type]} · ${p.fish} · ${t("feeV", { p: num(p.fee) })}`;
  } else { icon = "⛺"; meta = t("guests", { n: num(p.guests) }); }
  return `<button class="item" data-place="${esc(p.id)}">
    <span class="kthumb ${sec}">${icon}</span>
    <div><h3>${esc(p.name)}${p.book ? `<span class="book-tag">${t("bookTag")}</span>` : ""}${Owner.tags(p)}</h3>
      <div class="meta">${esc(meta)}</div>
      <div class="meta">${esc(p.addr)}</div>
      ${d != null ? `<div class="dist">${t("distAway", { d: Geo.format(d, lang) })}</div>` : p.lat == null ? `<div class="meta faint">${t("noMapPin")}</div>` : ""}
    </div><span></span>
  </button>`;
}

// ===== Карточка места =====
function placeView(p) {
  if (!p) { ui.openPlace = null; return placesView(); }
  const d = placeDist(p);
  const rows = [];
  if (sec === "sport") {
    rows.push(`<div class="facs">${KIND_ORDER.filter(k => p.kinds[k]).map(k =>
      `<span class="fac">${KIND_ICON[k]} ${esc(kindName(k))}${p.kinds[k] > 1 ? ` <b>${p.kinds[k]}</b>` : ""}</span>`).join("")}</div>`);
  }
  const info = [`<div><span class="meta">${t("where")}</span><br>${esc(p.addr)}</div>`];
  if (sec === "fish") info.push(
    `<div><span class="meta">${t("fishLbl")}</span><br>${esc(p.fish)} · ${esc(I18N[lang].fishTypes[p.type])}</div>`,
    `<div><span class="meta">${t("feeLbl")}</span><br>${t("feeV", { p: num(p.fee) })} · ${t("capV", { n: p.cap })}</div>`,
    `<div><span class="meta">${t("nearLbl")}</span><br>${esc(p.near)}</div>`);
  if (sec === "camp") info.push(`<div><span class="meta">${t("guestsLbl")}</span><br>${t("guests", { n: num(p.guests) })}</div>`);
  if (p.off) info.push(`<div><span class="meta">${t("offLbl")}</span><br>${esc(I18N[lang].off[p.off] || p.off)}</div>`);
  if (p.tel) info.push(`<div><span class="meta">${t("telLbl")}</span><br><a href="tel:${esc(String(p.tel).replace(/[^\d+\-]/g, ""))}">${esc(p.tel)}</a></div>`);

  return topBar() + `<button class="back" data-back-place>${t("back")}</button>
  <div class="detail">
    <div class="phero ${sec}">${sec === "sport" ? KIND_ICON[mainKind(p)] : sec === "fish" ? "🎣" : "⛺"}</div>
    <h2>${esc(p.name)}</h2>
    ${d != null ? `<div class="dist">${t("distAway", { d: Geo.format(d, lang) })}</div>` : ""}
    ${rows.join("")}
    ${Owner.block(p)}
    <div class="place info">${info.join("")}</div>
    <div class="links">
      <a href="${kakaoLink(p)}" target="_blank" rel="noopener">${t("kakao")}</a>
      ${p.lat != null ? `<button data-placemap="${esc(p.id)}">${t("showMap")}</button>` : ""}
      ${p.tel ? `<a href="tel:${esc(String(p.tel).replace(/[^\d+\-]/g, ""))}">${t("call")}</a>` : ""}
    </div>
    ${p.book ? `<div class="card soft"><h3>${t("bookingH")}</h3><p class="meta">${t("bookText")}</p>
      <a class="btn linkbtn" href="https://www.eshare.go.kr/" target="_blank" rel="noopener">${t("bookBtn")}</a></div>` : ""}
    <div class="card soft"><h3>${t(sec === "sport" ? "gameH" : sec === "fish" ? "fishGoH" : "campGoH")}</h3>
      <p class="meta">${t(sec === "sport" ? "gameText" : "goText")}</p>
      <button class="btn ghost" data-tab="talk">${t("toTalk")}</button></div>
    ${Owner.card(p)}
    <p class="note">${t("srcShort")}</p>
  </div>`;
}

// ===== Вкладка «Карта» раздела =====
function placesMapView() {
  const all = secPlaces(sec), on = all.filter(p => p.lat != null).length;
  // (на карте видны загруженные районы; сдвиньте карту — подгрузятся соседние)
  return topBar() + `<div class="mapwrap"><div id="map"></div>
    ${on < all.length ? `<div class="mapnote">${t("noCoordsN", { n: all.length - on })}</div>` : ""}
    <button class="mapbtn" data-locate>${t("myLoc")}</button></div>`;
}
// Точки мест раздела для карты (рисует drawMarkers из app.js)
function placesMarkers() {
  return secPlaces(sec).filter(p => p.lat != null).map(p => {
    const ic = sec === "sport" ? KIND_ICON[mainKind(p)] : sec === "fish" ? "🎣" : "⛺";
    const icon = L.divIcon({ className: "", html: `<div class="kpin ${sec}${p.book ? " book" : ""}"><span>${ic}</span></div>`,
      iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -30] });
    return [p.id, L.marker([p.lat, p.lng], { icon })
      .bindPopup(`<b>${esc(p.name)}</b><br>${esc(p.addr)}<br><button class="popbtn" data-place="${esc(p.id)}">→</button>`)];
  });
}
function initPlacesMap() {
  if (typeof L === "undefined") return;
  const focus = ui.mapFocus && placeById(ui.mapFocus);
  const center = focus && focus.lat != null ? [focus.lat, focus.lng] : Geo.last ? [Geo.last.lat, Geo.last.lng] : [37.17, 126.92];
  baseMap(center, focus ? 16 : 11);
  drawMarkers(focus ? focus.id : null);
  if (Geo.last) drawMe();
  ui.mapFocus = null;
}

// ===== Вкладка «Общение» =====
// Пока демо: показываем, как будет устроено. Писать можно будет после входа через Kakao.
function talkView() {
  const topics = I18N[lang].talkTopics[sec] || [];
  return topBar() + secTop(sec) + `<h2 class="sec-h">${t("talkH")}</h2>
  <div class="filters">${topics.map((x, i) => `<button class="chip" aria-pressed="${i === 0}" disabled>${esc(x)}</button>`).join("")}</div>
  <div class="card">
    <p style="margin:0">${t("talkText")}</p>
    <textarea placeholder="${t("talkPh")}" disabled></textarea>
    <button class="btn" disabled>${t("talkSoon")}</button>
  </div>
  <div class="empty-feed"><span>💬</span><p class="meta">${t("talkEmpty")}</p></div>`;
}

// ===== Вкладка «Нуби»: выбор раздела =====
function sectionsView() {
  const s = I18N[lang].secs;
  const cnt = k => k === "walk" ? t("legendsN", { n: all().length }) : k === "cult" ? "" : t("placesN", { n: secPlaces(k).length });
  return topBar() + `<h2 class="sec-h">${t("moreH")}</h2>
  <div class="secs">${SECTIONS.map(k => `<button class="secbtn ${k === sec ? "on" : ""}" ${SEC_LIVE[k] ? `data-sec="${k}"` : "disabled"}>
      <span class="sicon ${k}">${SEC_ICON[k]}</span>
      <span class="stxt"><b>${esc(s[k][0])}</b><span class="meta">${esc(s[k][1])}</span>${cnt(k) ? `<span class="meta">${cnt(k)}</span>` : ""}</span>
      <em>${k === sec ? t("nubiNow") : !SEC_LIVE[k] ? t("soon") : k === "walk" ? t("inUse") : t("demo")}</em>
    </button>`).join("")}</div>
  <p class="note">${t("secDemoNote")}</p>`;
}

// ===== Нижняя панель: своя для каждого раздела =====
const NAV_SVG = {
  walk: '<path d="M4 5h16M4 12h16M4 19h10"/>',
  map: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  chal: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  me: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  more: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  talk: '<path d="M4 5h16v11H9l-5 4z"/>'
};
function navHtml() {
  const tabs = sec === "walk"
    ? [["walk", "navWalk", "walk"], ["map", "navMap", "map"], ["chal", "navChal", "chal"], ["me", "navMe", "me"], ["more", "navMore", "more"]]
    : [["plist", "navPlaces", "walk"], ["pmap", "navMap", "map"], ["talk", "navTalk", "talk"], ["me", "navMe", "me"], ["more", "navMore", "more"]];
  return tabs.map(([tab, label, svg]) =>
    `<button data-tab="${tab}" aria-current="${ui.tab === tab}"><svg viewBox="0 0 24 24">${NAV_SVG[svg]}</svg><span>${t(label)}</span></button>`).join("");
}
