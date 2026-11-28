// ============================================================
// 누비 — АДМИНКА (admin.html)
// Вход через Kakao. Пускает только владельца (owner) и админов (admin) —
// это проверяет сервер (функции is_admin / is_owner, 14_РОЛИ_И_ЖУРНАЛ.sql),
// поэтому чужой человек, даже зная адрес, ничего не увидит и не изменит.
// Разделы: Обзор · Легенды · Таблички · Точки · Желания · Игроки · Владельцы · Жалобы · Места · Команда · Журнал
// Назначать и снимать админов может только владелец (кнопки в «Команде» и «Игроках»).
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
    uploadArt: "Загрузить рисунок", changeArt: "Заменить рисунок", noArt: "Рисунка пока нет — в приложении стоит заглушка", approvePin: "Принять точку (+20)", far: "Очень далеко от места — скорее всего ошибка, лучше отклонить", hide: "Скрыть", light: "Зажечь на стене",
    saved: "Сохранено", err: "Ошибка: ", needText: "Заполните название и текст", notFound: "Ничего не нашлось",
    lang: "Язык", logout: "Выйти", openApp: "Открыть приложение",
    people: "Игроки", claims: "Владельцы", reports: "Жалобы", places: "Места",
    userSearch: "Поиск по нику", regAt: "регистрация", lastAt: "был", anon: "без Kakao", adminTag: "админ",
    stampsN: "печатей", legendsN: "легенд", wishesN: "желаний", ban: "Заблокировать", unban: "Разблокировать", bannedTag: "заблокирован",
    owners: "владельцев мест", bizName: "Название", contact: "Контакт", proof: "Доказательство",
    approveClaim: "Сделать владельцем", reportsN: "жалоб", hideIt: "Скрыть", keepIt: "Оставить", reasons: "Причины",
    placeSearch: "Найти место (спорт, рыбалка, кемпинг)", access: "Вход", accNone: "— не указано —",
    accFree: "Свободный вход", accBooking: "По записи", accResidents: "Только для жильцов", owner: "Владелец",
    removeOwner: "Снять владельца", flag: "Автофильтр", flags: { link: "ссылка", phone: "телефон", email: "почта", bad: "мат", harm: "смерть / угрозы — проверить, не нужна ли помощь", reports: "жалобы" },
    typeMore: "Введите хотя бы 2 буквы",
    team: "Команда", log: "Журнал", roleOwner: "владелец", roleAdmin: "админ", roleMod: "модератор",
    makeAdmin: "Сделать админом", makeOwner: "Сделать владельцем", toAdmin: "Понизить до админа", removeRole: "Снять роль",
    sure: "Точно?", yes: "Да", no: "Нет", you: "это вы",
    teamNote: "Админы проверяют легенды, таблички, точки, фонарики и жалобы. Владелец ещё назначает и снимает админов. Роль работает только при входе через Kakao.",
    addHint: "Добавить человека: откройте «Игроки», найдите ник и нажмите «Сделать админом».",
    needKakao: "нужен вход через Kakao",
    roleRes: { ok: "Готово", not_kakao: "Сначала человек должен войти через Kakao", banned: "Человек заблокирован", last_owner: "Нельзя снять последнего владельца", no_user: "Игрок не найден", bad_role: "Неизвестная роль", need_region: "Укажите город" },
    act: { role: "Роль", "user_legends.update": "Легенда", "finds.update": "Табличка", "pin_suggestions.update": "Точка",
      "wishes.update": "Фонарик", "wishes.delete": "Фонарик удалён", "reports.update": "Жалоба", "places.update": "Место",
      "place_claims.update": "Заявка владельца", "place_info.update": "Инфо места", "profiles.update": "Блокировка" },
    logEmpty: "Пока записей нет",
    mergeBtn: "Перенести в другой аккаунт", delBtn: "Удалить аккаунт",
    mergeTo: "Ник аккаунта Kakao, куда перенести", mergeFind: "Найти",
    mergeQ: "Перенести всё из «{a}» в «{b}»? Печати, очки, легенды, таблички и фонарики перейдут, а «{a}» будет удалён.",
    delQ: "Удалить аккаунт «{a}»? Его одобренные легенды останутся на карте, остальное удалится. Отменить нельзя.",
    noKakaoNick: "Аккаунт Kakao с таким ником не найден",
    userRes: { ok: "Готово", self: "Себя нельзя", same: "Это тот же аккаунт", no_user: "Игрок не найден", no_target: "Аккаунт не найден", target_not_kakao: "Переносить можно только в аккаунт с Kakao", has_role: "Сначала снимите с него роль в «Команде»" },
    actMerge: "Перенос аккаунта", actDel: "Аккаунт удалён"
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
    uploadArt: "그림 올리기", changeArt: "그림 바꾸기", noArt: "아직 그림이 없습니다 — 앱에는 기본 이미지가 보입니다", approvePin: "위치 승인 (+20)", far: "장소에서 너무 멉니다 — 오류일 가능성이 높아 거절을 권합니다", hide: "숨기기", light: "벽에 불 켜기",
    saved: "저장했습니다", err: "오류: ", needText: "이름과 내용을 입력하세요", notFound: "찾지 못했습니다",
    lang: "언어", logout: "로그아웃", openApp: "앱 열기",
    people: "사용자", claims: "장소 주인", reports: "신고", places: "장소",
    userSearch: "닉네임 검색", regAt: "가입", lastAt: "최근", anon: "카카오 없음", adminTag: "관리자",
    stampsN: "도장", legendsN: "전설", wishesN: "소원", ban: "차단", unban: "차단 해제", bannedTag: "차단됨",
    owners: "인증된 장소 주인", bizName: "상호", contact: "연락처", proof: "증빙",
    approveClaim: "주인으로 인증", reportsN: "신고", hideIt: "숨기기", keepIt: "유지", reasons: "사유",
    placeSearch: "장소 찾기 (운동, 낚시, 캠핑)", access: "이용", accNone: "— 미정 —",
    accFree: "자유 이용", accBooking: "예약제", accResidents: "주민 전용", owner: "주인",
    removeOwner: "주인 해제", flag: "자동 필터", flags: { link: "링크", phone: "전화번호", email: "이메일", bad: "욕설", harm: "죽음·위협 — 도움이 필요한지 확인", reports: "신고" },
    typeMore: "2글자 이상 입력하세요",
    team: "팀", log: "기록", roleOwner: "소유자", roleAdmin: "관리자", roleMod: "지역 관리자",
    makeAdmin: "관리자로 지정", makeOwner: "소유자로 지정", toAdmin: "관리자로 변경", removeRole: "권한 해제",
    sure: "확실한가요?", yes: "예", no: "아니요", you: "나",
    teamNote: "관리자는 전설, 안내판, 위치, 소원등, 신고를 확인합니다. 소유자는 관리자를 지정하고 해제할 수도 있습니다. 권한은 카카오 로그인 상태에서만 작동합니다.",
    addHint: "사람 추가: '사용자'에서 닉네임을 찾아 '관리자로 지정'을 누르세요.",
    needKakao: "카카오 로그인 필요",
    roleRes: { ok: "완료", not_kakao: "먼저 카카오로 로그인해야 합니다", banned: "차단된 사용자입니다", last_owner: "마지막 소유자는 해제할 수 없습니다", no_user: "사용자를 찾을 수 없습니다", bad_role: "알 수 없는 권한", need_region: "지역을 입력하세요" },
    act: { role: "권한", "user_legends.update": "전설", "finds.update": "안내판", "pin_suggestions.update": "위치",
      "wishes.update": "소원등", "wishes.delete": "소원등 삭제", "reports.update": "신고", "places.update": "장소",
      "place_claims.update": "장소 주인 신청", "place_info.update": "장소 정보", "profiles.update": "차단" },
    logEmpty: "아직 기록이 없습니다",
    mergeBtn: "다른 계정으로 옮기기", delBtn: "계정 삭제",
    mergeTo: "옮길 카카오 계정의 닉네임", mergeFind: "찾기",
    mergeQ: "'{a}'의 모든 기록을 '{b}'(으)로 옮길까요? 도장, 점수, 전설, 안내판, 소원등이 옮겨지고 '{a}'는 삭제됩니다.",
    delQ: "'{a}' 계정을 삭제할까요? 승인된 전설은 지도에 남고 나머지는 삭제됩니다. 되돌릴 수 없습니다.",
    noKakaoNick: "그 닉네임의 카카오 계정을 찾지 못했습니다",
    userRes: { ok: "완료", self: "자신은 안 됩니다", same: "같은 계정입니다", no_user: "사용자를 찾을 수 없습니다", no_target: "계정을 찾을 수 없습니다", target_not_kakao: "카카오 계정으로만 옮길 수 있습니다", has_role: "먼저 '팀'에서 권한을 해제하세요" },
    actMerge: "계정 이전", actDel: "계정 삭제됨"
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
  if (l) return l.name.ko;
  const p = sportPlace(id);
  return p ? p.name : id;
};
// Места разделов «Спорт», «Рыбалка», «Кемпинг» (из data/<район>/places.js)
const sportPlaces = () => [...(window.SPORT || []), ...(window.FISH || []), ...(window.CAMP || [])];
const sportPlace = id => sportPlaces().find(p => p.id === id);
const flagTag = f => f ? `<div class="warn">⚠ ${tx("flag")}: ${esc((ADM_TXT[admLang].flags || {})[f] || f)}</div>` : "";
const dt = s => s ? new Date(s).toLocaleString(admLang === "ko" ? "ko-KR" : "ru-RU", { dateStyle: "short", timeStyle: "short" }) : "";
const distM = (a, b) => { const R = 6371e3, r = Math.PI / 180, x = (b.lng - a.lng) * r * Math.cos((a.lat + b.lat) / 2 * r), y = (b.lat - a.lat) * r; return Math.round(Math.hypot(x, y) * R); };

// ---------- Состояние ----------
const A = { tab: "stats", filter: "pending", rows: [], stats: null, places: {}, open: null, rejecting: null, maps: [], q: "", info: {},
  role: null,        // моя роль: owner | admin
  confirmRole: null, // "id:роль" — ждём подтверждения смены роли
  merging: null,     // id аккаунта, который переносим (открыто поле ника)
  mergeTo: null,     // {id, nick} — найденный аккаунт Kakao, ждём подтверждения
  confirmDel: null   // id аккаунта, ждём подтверждения удаления
};
const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => o[k] ?? m);
const isOwner = () => A.role === "owner";
const roleName = r => tx(r === "owner" ? "roleOwner" : r === "admin" ? "roleAdmin" : "roleMod");
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
    } else if (A.tab === "people") {
      const { data, error } = await db().rpc("admin_users", { p_q: A.q || null, p_limit: 300 });
      if (error) throw error; A.rows = data || [];
    } else if (A.tab === "claims") {
      const { data, error } = await db().from("place_claims").select("*, profiles(nick)").eq("status", A.filter)
        .order("created_at", { ascending: false }).limit(100);
      if (error) throw error; A.rows = data || [];
      for (const r of A.rows) if (r.proof_path) {
        const s = await db().storage.from("finds").createSignedUrl(r.proof_path, 3600);
        r.url = s.data && s.data.signedUrl;
      }
    } else if (A.tab === "reports") {
      const { data, error } = await db().from("reports").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      // одна карточка на один фонарик/легенду: сколько жалоб и какие причины
      const groups = {};
      for (const r of data || []) {
        const k = r.kind + ":" + r.target;
        (groups[k] = groups[k] || { id: k, kind: r.kind, target: r.target, n: 0, reasons: [] }).n++;
        if (r.reason) groups[k].reasons.push(r.reason);
      }
      A.rows = Object.values(groups).sort((a, b) => b.n - a.n);
      const wIds = A.rows.filter(g => g.kind === "wish").map(g => g.target);
      const lIds = A.rows.filter(g => g.kind === "legend").map(g => g.target);
      const w = wIds.length ? await db().from("wishes").select("id, text, place_id, status, flag").in("id", wIds) : { data: [] };
      const l = lIds.length ? await db().from("user_legends").select("id, name, story, status").in("id", lIds) : { data: [] };
      for (const g of A.rows) g.item = (g.kind === "wish" ? w.data : l.data).find(x => x.id === g.target) || null;
    } else if (A.tab === "team") {
      const { data, error } = await db().rpc("admin_staff");
      if (error) throw error; A.rows = data || [];
    } else if (A.tab === "log") {
      const { data, error } = await db().from("admin_log").select("*").order("at", { ascending: false }).limit(200);
      if (error) throw error; A.rows = data || [];
    } else if (A.tab === "places") {
      const { data, error } = await db().from("place_info").select("*, profiles(nick)").limit(2000);
      if (error) throw error;
      A.info = Object.fromEntries((data || []).map(r => [r.place_id, r]));
      const q = A.q.trim().toLowerCase();
      // без поиска показываем места, где уже что-то указано (владелец или «вход»)
      A.rows = q.length >= 2 ? sportPlaces().filter(p => (p.name + " " + p.addr).toLowerCase().includes(q)).slice(0, 40)
        : sportPlaces().filter(p => A.info[p.id]);
    }
  } catch (e) { toast(tx("err") + (e.message || e)); }
  draw();
}

// ---------- Отрисовка ----------
function draw() {
  A.maps.forEach(m => m.remove()); A.maps = [];
  const root = document.getElementById("adm");
  const p = (A.stats && A.stats.pending) || {};
  const tabs = [["stats", ""], ["legends", p.legends], ["finds", p.finds], ["pins", p.pins], ["wishes", p.wishes],
    ["claims", p.claims], ["reports", p.reports], ["people", ""], ["places", ""], ["team", ""], ["log", ""]];
  const withFilter = ["legends", "finds", "pins", "wishes", "claims"].includes(A.tab);
  root.innerHTML = `
    <div class="adm-top"><h1><a href="./" style="color:inherit;text-decoration:none">← 누비</a><small>${tx("title")}</small></h1>
      <div class="lang"><button data-alang="ru" aria-pressed="${admLang === "ru"}">RU</button><button data-alang="ko" aria-pressed="${admLang === "ko"}">한</button></div></div>
    <div class="adm-tabs">${tabs.map(([k, n]) => `<button data-atab="${k}" aria-pressed="${A.tab === k}">${tx(k)}${n ? `<span class="badge">${n}</span>` : ""}</button>`).join("")}</div>
    ${A.tab === "people" || A.tab === "places" ? `<div class="search"><input id="aq" value="${esc(A.q)}" placeholder="${esc(tx(A.tab === "people" ? "userSearch" : "placeSearch"))}"><button data-aq>${tx("find")}</button></div>` : ""}
    ${withFilter ? `<div class="sub-tabs">${["pending", "approved", "rejected"].map(f =>
      `<button data-afilter="${f}" aria-pressed="${A.filter === f}">${tx(A.tab === "wishes" && f === "rejected" ? "hidden" : f)}</button>`).join("")}</div>` : ""}
    ${A.tab === "team" ? `<p class="ameta">${tx("teamNote")}${isOwner() ? " " + tx("addHint") : ""}</p>` : ""}
    <div id="body">${A.tab === "stats" ? statsView() : A.rows.length ? A.rows.map(cardView).join("")
      : `<p class="center ameta">${A.tab === "log" ? tx("logEmpty") : A.tab === "places" && A.q.trim().length < 2 && A.q ? tx("typeMore") : tx("empty")}</p>`}</div>
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
      ${k(s.owners, "🏠 " + tx("owners"))}
    </div>
    <h3 class="sub-h">${tx("waiting")}</h3>
    <div class="kpis">${k(s.pending.legends, tx("legends"))}${k(s.pending.finds, tx("finds"))}${k(s.pending.pins, tx("pins"))}${k(s.pending.wishes, tx("wishes"))}
      ${k(s.pending.claims, tx("claims"))}${k(s.pending.reports, tx("reports"))}</div>
    <h3 class="sub-h">${tx("byDay")}</h3>
    <div class="card" style="padding-bottom:26px"><div class="bars">${days.length ? days.map(d =>
      `<div style="height:${Math.round(d.n / max * 100)}%" title="${d.d}: ${d.n}"><span>${String(d.d).slice(5)}</span></div>`).join("") : `<span class="ameta">—</span>`}</div></div>
    <h3 class="sub-h">${tx("top")}</h3>
    <div class="card">${(s.top_places || []).map((t, i) => `<div>${i + 1}. ${esc(placeName(t.id))} — <b>${t.n}</b></div>`).join("") || "—"}</div>`;
}

// Кнопка смены роли: первое нажатие — «Точно?», второе — меняем
function roleBtn(id, role, label) {
  const key = id + ":" + role;
  if (A.confirmRole === key) return `<span class="ameta">${tx("sure")}</span>
    <button class="btn ${role ? "ok" : "no"}" data-arole="${id}" data-to="${role}" data-go="1">${tx("yes")}</button>
    <button class="btn" data-arole-no>${tx("no")}</button>`;
  return `<button class="btn ${role ? "ok" : "no"}" data-arole="${id}" data-to="${role}">${tx(label)}</button>`;
}

// Перенос и удаление аккаунта (только владелец; сервер проверяет ещё раз)
function ownerUserTools(r) {
  if (A.confirmDel === r.id) return `<div class="warn">${esc(fill(tx("delQ"), { a: r.nick }))}</div>
    <div class="arow"><button class="btn no" data-adel="${r.id}" data-go="1">${tx("yes")}</button><button class="btn" data-acancel>${tx("no")}</button></div>`;
  if (A.merging === r.id && A.mergeTo) return `<div class="warn">${esc(fill(tx("mergeQ"), { a: r.nick, b: A.mergeTo.nick }))}</div>
    <div class="arow"><button class="btn ok" data-amerge-go="${r.id}">${tx("yes")}</button><button class="btn" data-acancel>${tx("no")}</button></div>`;
  if (A.merging === r.id) return `<label>${tx("mergeTo")}<input id="mt-${r.id}" maxlength="20"></label>
    <div class="arow"><button class="btn ok" data-amerge-find="${r.id}">${tx("mergeFind")}</button><button class="btn" data-acancel>${tx("no")}</button></div>`;
  return `<div class="arow"><button class="btn" data-amerge="${r.id}">${tx("mergeBtn")}</button><button class="btn no" data-adel="${r.id}">${tx("delBtn")}</button></div>`;
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
    ${flagTag(r.flag)}
    ${pend ? `<label>${tx("name")}<input id="n-${r.id}" value="${esc(r.name)}" maxlength="100"></label>
      <label>${tx("place")}<input id="p-${r.id}" value="${esc(r.place || "")}" maxlength="200"></label>
      <label>${tx("story")}<textarea id="s-${r.id}" maxlength="10000">${esc(r.story)}</textarea></label>`
      : `<h3>${esc(r.name)}</h3><div class="ameta">${esc(r.place || "")}</div><p style="margin:0;white-space:pre-wrap">${esc(r.story)}</p>
         ${r.reject_reason ? `<div class="msg err">${esc(r.reject_reason)}</div>` : ""}`}
    <div class="artrow">${r.art_path ? `<img class="artprev" src="${esc(Server.photoUrl(r.art_path))}" alt="">` : `<span class="ameta">${tx("noArt")}</span>`}
      <label class="btn">🎨 ${tx(r.art_path ? "changeArt" : "uploadArt")}<input type="file" accept="image/*" data-aart="${r.id}" hidden></label></div>
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

  if (A.tab === "people") return `<div class="acard">
    <h3>${esc(r.nick)} ${r.role ? `<span class="badge">${roleName(r.role)}</span>` : ""} ${r.banned ? `<span class="warn">${tx("bannedTag")}</span>` : ""}</h3>
    <div class="ameta">${r.kakao ? "Kakao" : tx("anon")} · ${tx("regAt")} ${dt(r.created_at)} · ${tx("lastAt")} ${dt(r.last_at)}</div>
    <div class="ameta">${tx("stampsN")}: <b>${r.stamps}</b> · ${tx("legendsN")}: <b>${r.legends}</b> · ${tx("wishesN")}: <b>${r.wishes}</b></div>
    ${r.role ? "" : `<div class="arow"><button class="btn ${r.banned ? "ok" : "no"}" data-aban="${r.id}" data-on="${r.banned ? "" : 1}">${tx(r.banned ? "unban" : "ban")}</button>
      ${isOwner() && !r.banned ? (r.kakao ? roleBtn(r.id, "admin", "makeAdmin") : `<span class="ameta">${tx("needKakao")}</span>`) : ""}</div>`}
    ${isOwner() && !r.role && r.id !== (Server.user && Server.user.id) ? ownerUserTools(r) : ""}
  </div>`;

  if (A.tab === "team") {
    const me = r.id === (Server.user && Server.user.id);
    return `<div class="acard">
    <h3>${esc(r.nick)} <span class="badge">${roleName(r.role)}</span>${r.role_region ? ` <span class="ameta">${esc(r.role_region)}</span>` : ""}${me ? ` <span class="ameta">(${tx("you")})</span>` : ""}</h3>
    <div class="ameta">${r.kakao ? "Kakao" : tx("needKakao")} · ${tx("lastAt")} ${dt(r.last_at)}</div>
    ${isOwner() ? `<div class="arow">${r.role === "admin" ? roleBtn(r.id, "owner", "makeOwner") : ""}${r.role === "owner" && !me ? roleBtn(r.id, "admin", "toAdmin") : ""}${roleBtn(r.id, "", "removeRole")}</div>` : ""}
  </div>`;
  }

  if (A.tab === "log") {
    const d = r.details || {};
    const what = r.action === "role"
      ? `${esc(d.nick || "")}: ${d.from ? roleName(d.from) : "—"} → ${d.to ? roleName(d.to) : "—"}`
      : r.action === "merge" ? `${esc(d.from)} → ${esc(d.to)} (${tx("stampsN")} ${d.visits ?? 0}, ${tx("legendsN")} ${d.legends ?? 0}, ${tx("wishesN")} ${d.wishes ?? 0})`
      : r.action === "delete_user" ? `${esc(d.nick || "—")}${d.kakao ? " · Kakao" : ""}`
      : Object.entries(d).map(([k, v]) => `${esc(k)}: ${esc(typeof v === "string" ? v : JSON.stringify(v))}`).join(" · ");
    return `<div class="acard">
    <div class="ameta">${dt(r.at)} · <b>${esc(r.actor_nick || "—")}</b></div>
    <div><b>${esc(r.action === "merge" ? tx("actMerge") : r.action === "delete_user" ? tx("actDel") : (tx("act") || {})[r.action] || r.action)}</b>${!["role", "merge", "delete_user"].includes(r.action) && r.target ? ` <span class="ameta">${esc(r.target)}</span>` : ""}</div>
    <div class="ameta" style="overflow-wrap:anywhere">${what}</div>
  </div>`;
  }

  if (A.tab === "claims") {
    const pl = sportPlace(r.place_id);
    return `<div class="acard">
    <h3>🏠 ${esc(placeName(r.place_id))}</h3>
    ${pl ? `<div class="ameta">${esc(pl.addr)}${pl.tel ? " · ☎ " + esc(pl.tel) : ""}</div>` : ""}
    <div class="ameta">${tx("author")}: ${esc(r.profiles ? r.profiles.nick : "?")} · ${dt(r.created_at)}</div>
    ${r.biz_name ? `<div>${tx("bizName")}: <b>${esc(r.biz_name)}</b></div>` : ""}
    <div>${tx("contact")}: <b>${esc(r.contact || "")}</b></div>
    ${r.note ? `<p style="margin:0;white-space:pre-wrap">${esc(r.note)}</p>` : ""}
    ${r.url ? `<div class="ameta">${tx("proof")}:</div><img src="${esc(r.url)}" alt="">` : ""}
    ${r.reject_reason ? `<div class="msg err">${esc(r.reject_reason)}</div>` : ""}
    ${pend ? `<div class="arow"><button class="btn ok" data-aclaim="${r.id}" data-ok="1">${tx("approveClaim")}</button>
      <button class="btn no" data-areject="${r.id}">${tx("reject")}</button></div>${rej}` : ""}
  </div>`;
  }

  if (A.tab === "reports") {
    const it = r.item;
    return `<div class="acard">
    <div class="wishtxt">${r.kind === "wish" ? "🏮 " + esc(it ? it.text : "—") : "📜 " + esc(it ? it.name : "—")}</div>
    ${r.kind === "legend" && it ? `<p class="ameta" style="margin:0">${esc(String(it.story || "").slice(0, 300))}</p>` : ""}
    <div class="ameta">${r.kind === "wish" && it ? esc(placeName(it.place_id)) + " · " : ""}${tx("reportsN")}: <b>${r.n}</b></div>
    ${r.reasons.length ? `<div class="ameta">${tx("reasons")}: ${r.reasons.map(esc).join(" · ")}</div>` : ""}
    <div class="arow"><button class="btn no" data-arep="${esc(r.id)}" data-act="hide">${tx("hideIt")}</button>
      <button class="btn ok" data-arep="${esc(r.id)}" data-act="keep">${tx("keepIt")}</button></div>
  </div>`;
  }

  if (A.tab === "places") {
    const inf = A.info[r.id] || {};
    const acc = ["", "free", "booking", "residents"];
    const accName = { "": "accNone", free: "accFree", booking: "accBooking", residents: "accResidents" };
    return `<div class="acard">
    <h3>${esc(r.name)}</h3>
    <div class="ameta">${esc(r.addr)}</div>
    <label>${tx("access")}<select data-aacc="${r.id}">${acc.map(a => `<option value="${a}" ${(inf.access || "") === a ? "selected" : ""}>${tx(accName[a])}</option>`).join("")}</select></label>
    ${inf.owner_id ? `<div>🏠 ${tx("owner")}: <b>${esc(inf.profiles ? inf.profiles.nick : "?")}</b></div>
      <div class="arow"><button class="btn no" data-aunown="${r.id}">${tx("removeOwner")}</button></div>` : ""}
  </div>`;
  }

  // желания
  return `<div class="acard">
    <div class="wishtxt">🏮 ${esc(r.text)}</div>
    ${flagTag(r.flag)}
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
  // своя метка (картинки Leaflet по умолчанию не нужны)
  const icon = L.divIcon({ className: "", html: '<div class="pin"></div>', iconSize: [30, 30], iconAnchor: [15, 30] });
  const mk = L.marker([r.lat, r.lng], { icon, draggable: !!el.dataset.edit }).addTo(m);
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
  else if (d.atab) { A.tab = d.atab; A.filter = "pending"; A.q = ""; await load(); }
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
  else if (d.arejectGo && A.tab === "claims") act(async () => {
    const { error } = await db().rpc("admin_claim", { p_id: d.arejectGo, p_ok: false, p_reason: val("rs-" + d.arejectGo).trim() || null });
    if (error) throw error;
  });
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
      const { data: newId, error } = await db().rpc("admin_find_to_legend", { p_find: id, p_name: name, p_place: val("p-" + id).trim(),
        p_story: story, p_lang: /[가-힣]/.test(story) ? "ko" : /[а-яё]/i.test(story) ? "ru" : "en",   // язык — по тексту легенды
        p_lat: r.lat, p_lng: r.lng });
      if (error) throw error;
      await copyFindPhoto(r.photo_path, newId);   // фото таблички становится картинкой легенды
    });
  }
  else if (d.aokPin || d.arejectPin) act(async () => {
    const { error } = await db().from("pin_suggestions").update({ status: d.aokPin ? "approved" : "rejected",
      reviewed_at: new Date().toISOString() }).eq("id", d.aokPin || d.arejectPin);
    if (error) throw error;
  });
  else if (d.aq !== undefined) { A.q = val("aq"); await load(); }
  else if (b.hasAttribute("data-arole-no")) { A.confirmRole = null; draw(); }
  // --- Перенос и удаление аккаунтов (владелец) ---
  else if (b.hasAttribute("data-acancel")) { A.merging = null; A.mergeTo = null; A.confirmDel = null; draw(); }
  else if (d.amerge) { A.merging = d.amerge; A.mergeTo = null; A.confirmDel = null; draw(); }
  else if (d.amergeFind) {
    const nick = val("mt-" + d.amergeFind).trim();
    if (!nick) return;
    const { data } = await db().rpc("admin_users", { p_q: nick, p_limit: 20 });
    const hit = (data || []).find(u => u.kakao && u.nick.toLowerCase() === nick.toLowerCase() && u.id !== d.amergeFind);
    if (!hit) return toast(tx("noKakaoNick"));
    A.mergeTo = { id: hit.id, nick: hit.nick }; draw();
  }
  else if (d.amergeGo) {
    const to = A.mergeTo; A.merging = null; A.mergeTo = null;
    try {
      const { data, error } = await db().rpc("owner_merge_users", { p_from: d.amergeGo, p_to: to.id });
      if (error) throw error; toast((tx("userRes") || {})[data] || data); await load();
    } catch (e) { toast(tx("err") + (e.message || e)); }
  }
  else if (d.adel) {
    if (!d.go) { A.confirmDel = d.adel; A.merging = null; draw(); return; }
    A.confirmDel = null;
    try {
      const { data, error } = await db().rpc("owner_delete_user", { p_user: d.adel });
      if (error) throw error; toast((tx("userRes") || {})[data] || data); await load();
    } catch (e) { toast(tx("err") + (e.message || e)); }
  }
  else if (d.arole !== undefined) {
    if (!d.go) { A.confirmRole = d.arole + ":" + (d.to || ""); draw(); return; }
    A.confirmRole = null;
    try {
      const { data, error } = await db().rpc("owner_set_role", { p_user: d.arole, p_role: d.to || null, p_region: null });
      if (error) throw error;
      toast((tx("roleRes") || {})[data] || data);
      // сняли роль с себя — дальше админка закрыта
      if (data === "ok" && d.arole === (Server.user && Server.user.id)) return location.reload();
      await load();
    } catch (e) { toast(tx("err") + (e.message || e)); }
  }
  else if (d.aban) act(async () => {
    const { error } = await db().rpc("admin_set_ban", { p_user: d.aban, p_ban: !!d.on });
    if (error) throw error;
  });
  else if (d.aclaim) act(async () => {
    const { error } = await db().rpc("admin_claim", { p_id: d.aclaim, p_ok: true });
    if (error) throw error;
  });
  else if (d.arep) act(async () => {
    const g = A.rows.find(x => x.id === d.arep); if (!g) return;
    if (d.act === "hide") {
      const q = g.kind === "wish" ? db().from("wishes").update({ status: "hidden" }).eq("id", g.target)
        : db().from("user_legends").update({ status: "rejected", reject_reason: "reports", reviewed_at: new Date().toISOString() }).eq("id", g.target);
      const { error } = await q; if (error) throw error;
    } else if (g.kind === "wish" && g.item && g.item.status === "pending" && g.item.flag === "reports") {
      // фонарик погас из-за жалоб — зажигаем обратно
      const { error } = await db().from("wishes").update({ status: "approved", flag: null }).eq("id", g.target);
      if (error) throw error;
    }
    const { error } = await db().from("reports").update({ status: "done" }).eq("kind", g.kind).eq("target", g.target).eq("status", "open");
    if (error) throw error;
  });
  else if (d.aunown) act(async () => {
    const { error } = await db().rpc("admin_set_owner", { p_place: d.aunown, p_user: null });
    if (error) throw error;
  });
  else if (d.awish) act(async () => {
    const { error } = await db().from("wishes").update({ status: d.st }).eq("id", d.awish);
    if (error) throw error;
  });
});
// Рисунок для народной легенды: файл кладём в открытую папку легенд под новым именем
document.addEventListener("change", async e => {
  // «Вход» у места: свободный / по записи / только жильцы
  if (e.target.dataset && e.target.dataset.aacc) {
    const place = e.target.dataset.aacc, access = e.target.value || null;
    return act(async () => {
      const q = A.info[place] ? db().from("place_info").update({ access, updated_at: new Date().toISOString() }).eq("place_id", place)
        : db().from("place_info").insert({ place_id: place, access });
      const { error } = await q; if (error) throw error;
    });
  }
  const id = e.target.dataset && e.target.dataset.aart, file = e.target.files && e.target.files[0];
  if (!id || !file) return;
  act(async () => {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${Server.user.id}/art_${id}_${Date.now()}.${ext}`;
    const up = await db().storage.from("legends").upload(path, file, { contentType: file.type || "image/jpeg" });
    if (up.error) throw up.error;
    const { error } = await db().from("user_legends").update({ art_path: path }).eq("id", id);
    if (error) throw error;
  });
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.id && e.target.id.startsWith("q-")) { e.preventDefault(); kakaoSearch(e.target.id.slice(2)); }
  if (e.key === "Enter" && e.target.id === "aq") { e.preventDefault(); A.q = e.target.value; load(); }
});

// ---------- Фото таблички → картинка легенды ----------
// Фото находок лежат в закрытой папке, а картинки легенд — в открытой.
// Копируем файл: скачиваем по временной ссылке и кладём в папку легенд.
async function copyFindPhoto(findPath, legendId) {
  if (!findPath || !legendId) return;
  const sig = await db().storage.from("finds").createSignedUrl(findPath, 600);
  if (!sig.data) return;
  const blob = await (await fetch(sig.data.signedUrl)).blob();
  const path = `${Server.user.id}/${legendId}.jpg`;
  // без перезаписи: у админа нет права менять файлы, а имя файла новое (если файл уже есть — просто используем его)
  const up = await db().storage.from("legends").upload(path, blob, { contentType: "image/jpeg" });
  if (up.error && !/exist|duplicate/i.test(up.error.message || "")) throw up.error;
  const { error } = await db().from("user_legends").update({ photo_path: path }).eq("id", legendId);
  if (error) throw error;
}
// Легенды, сделанные из табличек раньше, — без картинки. Находим их табличку (тот же автор и время снимка)
async function fixMissingPhotos() {
  const { data: ls } = await db().from("user_legends").select("id, author, photo_at").eq("status", "approved").is("photo_path", null);
  for (const l of ls || []) {
    if (!l.photo_at) continue;
    const { data: fs } = await db().from("finds").select("photo_path, shot_at").eq("author", l.author).not("photo_path", "is", null);
    const f = (fs || []).find(x => x.shot_at && new Date(x.shot_at).getTime() === new Date(l.photo_at).getTime());
    if (f) await copyFindPhoto(f.photo_path, l.id).catch(() => {});
  }
}

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
  const { data: mr } = await db().rpc("my_role");
  A.role = mr && mr.role;
  // Названия мест: в админке загружаем все районы
  await Data.init([]); await Data.loadMany(Data.areas());
  await load();
  fixMissingPhotos().catch(() => {});
})();
