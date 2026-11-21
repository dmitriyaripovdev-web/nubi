// ============================================================
// 누비 — АДМИНКА (admin.html)
// Вход через Kakao. Пускает только тех, у кого в профиле is_admin = true —
// это проверяет сервер (функция is_admin и права в 07_АДМИНКА_И_ЖЕЛАНИЯ.sql),
// поэтому чужой человек, даже зная адрес, ничего не увидит и не изменит.
// Разделы: Обзор · Легенды · Таблички · Точки · Желания
// ============================================================

// ---------- Языки админки: русский и корейский ----------
const ADM_TXT = {
  ru: {
    title: "Админка", stats: "Обзор", legends: "Легенды", finds: "Таблички", pins: "Точки", wishes: "Желания",
    login: "Войдите через Kakao, чтобы открыть админку.", kakao: "Войти через Kakao",
    noAccess: "У этого аккаунта нет прав администратора.", offline: "Нет связи с сервером.",
    users: "Игроков", kakaoUsers: "через Kakao", newWeek: "новых за 7 дней", visits: "Печатей всего",
    visitsWeek: "печатей за 7 дней", activeWeek: "активных за 7 дней", lanterns: "фонариков на стенах", fulfilled: "желаний сбылось",
    byDay: "Печати по дням (14 дней)", top: "Популярные места", waiting: "Ждут проверки",
    pending: "Новые", approved: "Одобренные", rejected: "Отклонённые", hidden: "Скрытые",
    empty: "Здесь пусто 👍", author: "Автор", name: "Название", place: "Где", story: "Текст легенды",
    searchPh: "Найти место в Kakao (например: 서봉산)", find: "Найти", drag: "Метку можно перетащить",
    approve: "Одобрить", reject: "Отклонить", reason: "Причина отказа (автор её увидит)",
    approveFind: "Одобрить (+30)", toLegend: "Сделать легендой", createLegend: "Создать легенду (+100 автору)",
    note: "Подпись", cur: "Сейчас", sugg: "Предложено", dist: "Разница",
    approvePin: "Принять точку (+20)", far: "Очень далеко от места — скорее всего ошибка, лучше отклонить", hide: "Скрыть", light: "Зажечь на стене",
    saved: "Сохранено", err: "Ошибка: ", needText: "Заполните название и текст", notFound: "Ничего не нашлось",
    lang: "Язык", logout: "Выйти", openApp: "Открыть приложение"
  },
  ko: {
    title: "관리자", stats: "개요", legends: "전설", finds: "안내판", pins: "위치", wishes: "소원",
    login: "카카오로 로그인하면 관리자 페이지가 열립니다.", kakao: "카카오로 로그인",
    noAccess: "이 계정은 관리자 권한이 없습니다.", offline: "서버에 연결할 수 없습니다.",
    users: "사용자", kakaoUsers: "카카오 연결", newWeek: "최근 7일 신규", visits: "전체 도장",
    visitsWeek: "최근 7일 도장", activeWeek: "최근 7일 활동", lanterns: "벽에 걸린 소원등", fulfilled: "이루어진 소원",
    byDay: "일별 도장 (14일)", top: "인기 장소", waiting: "확인 대기",
    pending: "새로운", approved: "승인됨", rejected: "거절됨", hidden: "숨김",
    empty: "확인할 것이 없습니다 👍", author: "작성자", name: "이름", place: "위치", story: "전설 내용",
    searchPh: "카카오에서 장소 찾기 (예: 서봉산)", find: "찾기", drag: "마커를 끌어서 옮길 수 있습니다",
    approve: "승인", reject: "거절", reason: "거절 사유 (작성자에게 보입니다)",
    approveFind: "승인 (+30)", toLegend: "전설로 만들기", createLegend: "전설 만들기 (작성자 +100)",
    note: "메모", cur: "현재", sugg: "제안", dist: "차이",
    approvePin: "위치 승인 (+20)", far: "장소에서 너무 멉니다 — 오류일 가능성이 높아 거절을 권합니다", hide: "숨기기", light: "벽에 불 켜기",
    saved: "저장했습니다", err: "오류: ", needText: "이름과 내용을 입력하세요", notFound: "찾지 못했습니다",
    lang: "언어", logout: "로그아웃", openApp: "앱 열기"
  }
};
let admLang = (() => { try { return localStorage.getItem("nubi_admin_lang") || "ru"; } catch (e) { return "ru"; } })();
const tx = k => ADM_TXT[admLang][k] || k;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const KAKAO_JS_KEY = "fd89d2754b520199da2095c73b142935";   // ключ для браузера, работает только на нашем адресе

function toast(s) {
  const el = document.getElementById("toast");
  el.textContent = s; el.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 3200);
}
const placeName = id => {
  const l = (window.LEGENDS || []).find(x => x.id === id);
  return l ? l.name.ko : id;
};
const dt = s => s ? new Date(s).toLocaleString(admLang === "ko" ? "ko-KR" : "ru-RU", { dateStyle: "short", timeStyle: "short" }) : "";
const distM = (a, b) => { const R = 6371e3, r = Math.PI / 180, x = (b.lng - a.lng) * r * Math.cos((a.lat + b.lat) / 2 * r), y = (b.lat - a.lat) * r; return Math.round(Math.hypot(x, y) * R); };

// ---------- Состояние ----------
const A = { tab: "stats", filter: "pending", rows: [], stats: null, places: {}, open: null, rejecting: null, maps: [] };
const db = () => Server.db;

// ---------- Загрузка данных раздела ----------
async function load() {
  A.rows = []; A.open = null; A.rejecting = null;
  try {
    if (A.tab === "stats") {
      const { data, error } = await db().rpc("admin_stats"); if (error) throw error;
      A.stats = data;
    } else if (A.tab === "legends") {
      const { data, error } = await db().from("user_legends").select("*").eq("status", A.filter)
        .order("created_at", { ascending: false }).limit(100);
      if (error) throw error; A.rows = data || [];
    } else if (A.tab === "finds") {
      const { data, error } = await db().from("finds").select("*, profiles(nick)").eq("status", A.filter)
        .order("created_at", { ascending: false }).limit(100);
      if (error) throw error; A.rows = data || [];
      // фото табличек лежат в закрытой папке — берём временные ссылки
      for (const r of A.rows) if (r.photo_path) {
        const s = await db().storage.from("finds").createSignedUrl(r.photo_path, 3600);
        r.url = s.data && s.data.signedUrl;
      }
    } else if (A.tab === "pins") {
      const { data, error } = await db().from("pin_suggestions").select("*, profiles(nick)").eq("status", A.filter)
        .order("created_at", { ascending: false }).limit(200);
      if (error) throw error; A.rows = data || [];
      const pl = await db().from("places").select("id, lat, lng, approx");
      A.places = Object.fromEntries((pl.data || []).map(p => [p.id, p]));
    } else if (A.tab === "wishes") {
      const st = A.filter === "rejected" ? "hidden" : A.filter;
      const { data, error } = await db().from("wishes").select("id, place_id, text, status, cheers, fulfilled_at, created_at")
        .eq("status", st).order("created_at", { ascending: false }).limit(200);
      if (error) throw error; A.rows = data || [];
    }
  } catch (e) { toast(tx("err") + (e.message || e)); }
  draw();
}

// ---------- Отрисовка ----------
function draw() {
  A.maps.forEach(m => m.remove()); A.maps = [];
  const root = document.getElementById("adm");
  const p = (A.stats && A.stats.pending) || {};
  const tabs = [["stats", ""], ["legends", p.legends], ["finds", p.finds], ["pins", p.pins], ["wishes", p.wishes]];
  root.innerHTML = `
    <div class="adm-top"><h1>누비<small>${tx("title")}</small></h1>
      <div class="lang"><button data-alang="ru" aria-pressed="${admLang === "ru"}">RU</button><button data-alang="ko" aria-pressed="${admLang === "ko"}">한</button></div></div>
    <div class="adm-tabs">${tabs.map(([k, n]) => `<button data-atab="${k}" aria-pressed="${A.tab === k}">${tx(k)}${n ? `<span class="badge">${n}</span>` : ""}</button>`).join("")}</div>
    ${A.tab !== "stats" ? `<div class="sub-tabs">${["pending", "approved", "rejected"].map(f =>
      `<button data-afilter="${f}" aria-pressed="${A.filter === f}">${tx(A.tab === "wishes" && f === "rejected" ? "hidden" : f)}</button>`).join("")}</div>` : ""}
    <div id="body">${A.tab === "stats" ? statsView() : A.rows.length ? A.rows.map(cardView).join("") : `<p class="center ameta">${tx("empty")}</p>`}</div>
    <p class="ameta center"><a href="./">${tx("openApp")}</a> · <button class="link" data-logout>${tx("logout")}</button></p>`;
  // мини-карты у карточек
  document.querySelectorAll("[data-amap]").forEach(el => initCardMap(el));
}

function statsView() {
  const s = A.stats; if (!s) return `<p class="ameta">…</p>`;
  const k = (n, l) => `<div class="kpi"><b>${n ?? 0}</b><span>${l}</span></div>`;
  const days = s.by_day || [], max = Math.max(1, ...days.map(d => d.n));
  return `<div class="kpis">
      ${k(s.users, tx("users"))}${k(s.kakao, tx("kakaoUsers"))}${k(s.new_week, tx("newWeek"))}${k(s.active_week, tx("activeWeek"))}
      ${k(s.visits, tx("visits"))}${k(s.visits_week, tx("visitsWeek"))}${k(s.lanterns, "🏮 " + tx("lanterns"))}${k(s.fulfilled, "✨ " + tx("fulfilled"))}
    </div>
    <h3 class="sub-h">${tx("waiting")}</h3>
    <div class="kpis">${k(s.pending.legends, tx("legends"))}${k(s.pending.finds, tx("finds"))}${k(s.pending.pins, tx("pins"))}${k(s.pending.wishes, tx("wishes"))}</div>
    <h3 class="sub-h">${tx("byDay")}</h3>
    <div class="card" style="padding-bottom:26px"><div class="bars">${days.length ? days.map(d =>
      `<div style="height:${Math.round(d.n / max * 100)}%" title="${d.d}: ${d.n}"><span>${String(d.d).slice(5)}</span></div>`).join("") : `<span class="ameta">—</span>`}</div></div>
    <h3 class="sub-h">${tx("top")}</h3>
    <div class="card">${(s.top_places || []).map((t, i) => `<div>${i + 1}. ${esc(placeName(t.id))} — <b>${t.n}</b></div>`).join("") || "—"}</div>`;
}

// Карточка одной записи
function cardView(r) {
  const pend = r.status === "pending";
  const rej = A.rejecting === r.id
    ? `<label>${tx("reason")}<input id="rs-${r.id}" maxlength="200"></label>
       <div class="arow"><button class="btn no" data-areject-go="${r.id}">${tx("reject")}</button></div>` : "";
  if (A.tab === "legends") return `<div class="acard">
    ${r.photo_path ? `<img src="${esc(Server.photoUrl(r.photo_path))}" alt="">` : ""}
    <div class="ameta">${tx("author")}: ${esc(r.author_nick || "?")} · ${dt(r.created_at)} · ${esc(r.lang)}</div>
    ${pend ? `<label>${tx("name")}<input id="n-${r.id}" value="${esc(r.name)}" maxlength="100"></label>
      <label>${tx("place")}<input id="p-${r.id}" value="${esc(r.place || "")}" maxlength="200"></label>
      <label>${tx("story")}<textarea id="s-${r.id}" maxlength="10000">${esc(r.story)}</textarea></label>`
      : `<h3>${esc(r.name)}</h3><div class="ameta">${esc(r.place || "")}</div><p style="margin:0;white-space:pre-wrap">${esc(r.story)}</p>
         ${r.reject_reason ? `<div class="msg err">${esc(r.reject_reason)}</div>` : ""}`}
    ${mapBlock(r, pend)}
    ${pend ? `<div class="arow"><button class="btn ok" data-aok-legend="${r.id}">${tx("approve")}</button>
      <button class="btn no" data-areject="${r.id}">${tx("reject")}</button></div>${rej}` : ""}
  </div>`;

  if (A.tab === "finds") return `<div class="acard">
    ${r.url ? `<img src="${esc(r.url)}" alt="">` : ""}
    <div class="ameta">${tx("author")}: ${esc(r.profiles ? r.profiles.nick : "?")} · ${dt(r.shot_at || r.created_at)}</div>
    ${r.note ? `<div>${tx("note")}: ${esc(r.note)}</div>` : ""}
    ${r.reject_reason ? `<div class="msg err">${esc(r.reject_reason)}</div>` : ""}
    ${mapBlock(r, pend && A.open === r.id)}
    ${pend ? (A.open === r.id
      ? `<label>${tx("name")}<input id="n-${r.id}" maxlength="100"></label>
         <label>${tx("place")}<input id="p-${r.id}" maxlength="200"></label>
         <label>${tx("story")}<textarea id="s-${r.id}" maxlength="10000"></textarea></label>
         <div class="arow"><button class="btn ok" data-amake-legend="${r.id}">${tx("createLegend")}</button></div>`
      : `<div class="arow"><button class="btn ok" data-aok-find="${r.id}">${tx("approveFind")}</button>
         <button class="btn" data-aopen="${r.id}">${tx("toLegend")}</button>
         <button class="btn no" data-areject="${r.id}">${tx("reject")}</button></div>${rej}`) : ""}
  </div>`;

  if (A.tab === "pins") {
    const cur = A.places[r.place_id];
    const d = cur && cur.lat != null ? distM(cur, r) : null;
    return `<div class="acard">
      <h3>${esc(placeName(r.place_id))}</h3>
      <div class="ameta">${tx("author")}: ${esc(r.profiles ? r.profiles.nick : "?")} · ${dt(r.created_at)} · ±${Math.round(r.acc || 0)} м</div>
      <div class="ameta">${tx("cur")}: ${cur && cur.lat != null ? cur.lat.toFixed(5) + ", " + cur.lng.toFixed(5) + (cur.approx ? " (≈)" : "") : "—"}
        · ${tx("sugg")}: ${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}${d != null ? ` · ${tx("dist")}: ${d} м` : ""}</div>
      ${d != null && d > 1000 ? `<div class="warn">⚠ ${tx("far")}</div>` : ""}
      <div class="amap" data-amap="${r.id}" data-cur="${cur && cur.lat != null ? cur.lat + "," + cur.lng : ""}"></div>
      ${pend ? `<div class="arow"><button class="btn ok" data-aok-pin="${r.id}">${tx("approvePin")}</button>
        <button class="btn no" data-areject-pin="${r.id}">${tx("reject")}</button></div>` : ""}
    </div>`;
  }

  // желания
  return `<div class="acard">
    <div class="wishtxt">🏮 ${esc(r.text)}</div>
    <div class="ameta">${esc(placeName(r.place_id))} · ${dt(r.created_at)}${r.status === "approved" ? " · 🙏 " + r.cheers : ""}${r.fulfilled_at ? " · ✨" : ""}</div>
    <div class="arow">
      ${r.status !== "approved" ? `<button class="btn ok" data-awish="${r.id}" data-st="approved">${tx("light")}</button>` : ""}
      ${r.status !== "hidden" ? `<button class="btn no" data-awish="${r.id}" data-st="hidden">${tx("hide")}</button>` : ""}
    </div>
  </div>`;
}

// Блок с картой и поиском Kakao (редактируемая метка)
function mapBlock(r, editable) {
  return `${editable ? `<div class="search"><input id="q-${r.id}" placeholder="${esc(tx("searchPh"))}"><button data-asearch="${r.id}">${tx("find")}</button></div>` : ""}
    <div class="amap" data-amap="${r.id}" data-edit="${editable ? 1 : ""}"></div>
    <div class="ameta" id="c-${r.id}">${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}${editable ? " · " + tx("drag") : ""}</div>`;
}

// Мини-карта: метка записи (её можно тащить) + для точек — текущее место
const marks = {};
function initCardMap(el) {
  if (typeof L === "undefined") return;
  const r = A.rows.find(x => x.id === el.dataset.amap); if (!r) return;
  const m = L.map(el, { zoomControl: false, attributionControl: false }).setView([r.lat, r.lng], 16);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(m);
  const mk = L.marker([r.lat, r.lng], { draggable: !!el.dataset.edit }).addTo(m);
  mk.on("dragend", () => { const p = mk.getLatLng(); setPoint(r.id, p.lat, p.lng, false); });
  marks[r.id] = { map: m, mk };
  if (el.dataset.cur) {
    const [la, ln] = el.dataset.cur.split(",").map(Number);
    L.circleMarker([la, ln], { radius: 8, color: "#C0392B" }).addTo(m);
    // карта видна целиком только после отрисовки — подгоняем обе точки чуть позже
    const fit = () => { m.invalidateSize(); m.fitBounds([[la, ln], [r.lat, r.lng]], { padding: [30, 30], maxZoom: 17 }); };
    fit(); setTimeout(fit, 150);
  }
  A.maps.push(m);
}
function setPoint(id, lat, lng, move) {
  const r = A.rows.find(x => x.id === id); if (!r) return;
  r.lat = lat; r.lng = lng;
  if (move && marks[id]) { marks[id].mk.setLatLng([lat, lng]); marks[id].map.setView([lat, lng], 16); }
  const c = document.getElementById("c-" + id); if (c) c.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)} · ${tx("drag")}`;
}

// ---------- Поиск места в Kakao (загружаем библиотеку только по нажатию) ----------
let kakaoReady = null;
function kakaoLoad() {
  if (kakaoReady) return kakaoReady;
  kakaoReady = new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services&autoload=false`;
    s.onload = () => kakao.maps.load(() => res(new kakao.maps.services.Places()));
    s.onerror = () => { kakaoReady = null; rej("kakao"); };
    document.head.appendChild(s);
  });
  return kakaoReady;
}
async function kakaoSearch(id) {
  const q = (document.getElementById("q-" + id).value || "").trim(); if (!q) return;
  try {
    const places = await kakaoLoad();
    const r = A.rows.find(x => x.id === id);
    const res = await new Promise(ok => places.keywordSearch(q, (d, st) => ok(st === "OK" ? d : []),
      r ? { location: new kakao.maps.LatLng(r.lat, r.lng), sort: kakao.maps.services.SortBy.DISTANCE } : {}));
    if (!res.length) return toast(tx("notFound"));
    setPoint(id, +res[0].y, +res[0].x, true);
    toast(res[0].place_name + " · " + (res[0].road_address_name || res[0].address_name));
  } catch (e) { toast(tx("err") + e); }
}

// ---------- Действия ----------
async function act(fn) {
  try { await fn(); toast(tx("saved")); await refreshStats(); await load(); }
  catch (e) { toast(tx("err") + (e.message || e)); }
}
async function refreshStats() { const { data } = await db().rpc("admin_stats"); if (data) A.stats = data; }
const val = id => (document.getElementById(id) || {}).value || "";

document.addEventListener("click", async e => {
  const b = e.target.closest("button"); if (!b) return;
  const d = b.dataset;
  if (d.alang) { admLang = d.alang; try { localStorage.setItem("nubi_admin_lang", admLang); } catch (e) {} draw(); }
  else if (d.atab) { A.tab = d.atab; A.filter = "pending"; await load(); }
  else if (d.afilter) { A.filter = d.afilter; await load(); }
  else if (d.akakao !== undefined) { try { await Server.signInKakao(); } catch (err) { toast(tx("err") + err); } }
  else if (b.hasAttribute("data-logout")) { await db().auth.signOut(); location.reload(); }
  else if (d.asearch) kakaoSearch(d.asearch);
  else if (d.areject) { A.rejecting = d.areject; draw(); }
  else if (d.aopen) { A.open = d.aopen; draw(); }
  else if (d.aokLegend) {
    const id = d.aokLegend, r = A.rows.find(x => x.id === id);
    const name = val("n-" + id).trim(), story = val("s-" + id).trim();
    if (!name || !story) return toast(tx("needText"));
    act(async () => {
      const { error } = await db().from("user_legends").update({ name, place: val("p-" + id).trim(), story,
        lat: r.lat, lng: r.lng, status: "approved", reviewed_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    });
  }
  else if (d.arejectGo) {
    const id = d.arejectGo, table = A.tab === "finds" ? "finds" : "user_legends";
    act(async () => {
      const { error } = await db().from(table).update({ status: "rejected", reject_reason: val("rs-" + id).trim() || null,
        reviewed_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    });
  }
  else if (d.aokFind) act(async () => {
    const { error } = await db().from("finds").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", d.aokFind);
    if (error) throw error;
  });
  else if (d.amakeLegend) {
    const id = d.amakeLegend, r = A.rows.find(x => x.id === id);
    const name = val("n-" + id).trim(), story = val("s-" + id).trim();
    if (!name || !story) return toast(tx("needText"));
    act(async () => {
      const { error } = await db().rpc("admin_find_to_legend", { p_find: id, p_name: name, p_place: val("p-" + id).trim(),
        p_story: story, p_lang: admLang === "ru" ? "ru" : "ko", p_lat: r.lat, p_lng: r.lng });
      if (error) throw error;
    });
  }
  else if (d.aokPin || d.arejectPin) act(async () => {
    const { error } = await db().from("pin_suggestions").update({ status: d.aokPin ? "approved" : "rejected",
      reviewed_at: new Date().toISOString() }).eq("id", d.aokPin || d.arejectPin);
    if (error) throw error;
  });
  else if (d.awish) act(async () => {
    const { error } = await db().from("wishes").update({ status: d.st }).eq("id", d.awish);
    if (error) throw error;
  });
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.id && e.target.id.startsWith("q-")) { e.preventDefault(); kakaoSearch(e.target.id.slice(2)); }
});

// ---------- Запуск ----------
function gate(msg, withLogin) {
  document.getElementById("adm").innerHTML = `<div class="adm-top"><h1>누비<small>${tx("title")}</small></h1>
    <div class="lang"><button data-alang="ru" aria-pressed="${admLang === "ru"}">RU</button><button data-alang="ko" aria-pressed="${admLang === "ko"}">한</button></div></div>
    <div class="center"><p>${msg}</p>
    ${withLogin ? `<button class="kakao-btn" data-akakao>${tx("kakao")}</button>` : ""}
    <p class="ameta" style="margin-top:20px"><a href="./">${tx("openApp")}</a></p></div>`;
}
(async function boot() {
  const ok = await Server.init();
  if (!ok) return gate(tx("offline"));
  // ошибка после возврата с Kakao — просто убираем её из адреса
  if (/error/.test(location.hash + location.search)) history.replaceState(null, "", location.pathname);
  if (!Server.user || !Server.isKakao()) return gate(tx("login"), true);
  const { data: isAdm } = await db().rpc("is_admin");
  if (!isAdm) return gate(tx("noAccess"));
  await load();
})();
