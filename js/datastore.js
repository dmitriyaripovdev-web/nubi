// ============================================================
// 누비 — данные мест по районам (Хвасон, Сувон, Пхаджу …)
// Данные лежат в папке data/<район>/ — файлы .js, каждый вызывает Data.put(…):
//   Data.put("legends", [...])  — легенды
//   Data.put("places", {...})   — спорт, рыбалка, кемпинг
// data/index.json — оглавление: границы районов, файлы, сколько мест, где какая легенда.
// Телефон загружает только нужные районы: где человек сейчас, что он выбрал,
// где у него стоят печати. Так приложение остаётся лёгким даже с тысячами мест.
// Загруженное складывается в общие списки LEGENDS / SPORT / FISH / CAMP.
// ============================================================
window.LEGENDS = [];
window.SPORT = [];
window.FISH = [];
window.CAMP = [];

window.Data = {
  index: null,          // оглавление {v, areas: {код: {bb, c, n, files: [имена файлов]}}, where: {id легенды: код}}
  loaded: new Set(),    // районы, которые уже загружены
  loading: new Map(),   // районы, которые грузятся сейчас (код -> Promise)
  failed: false,        // оглавление не загрузилось (нет интернета и нет копии)

  // Оглавление: всегда свежее (service worker сначала идёт в сеть)
  async json(path) {
    const r = await fetch(`data/${path}`, { cache: "no-cache" });
    if (!r.ok) throw new Error(path + " " + r.status);
    return r.json();
  },
  // Файл района — обычный скрипт. Версия из оглавления в адресе — чтобы телефон не взял старую копию.
  script(path) {
    return new Promise((ok, no) => {
      const s = document.createElement("script");
      s.src = `data/${path}?v=${this.index.v}`;
      s.onload = () => { s.remove(); ok(); };
      s.onerror = () => { s.remove(); no(new Error(path)); };
      document.head.appendChild(s);
    });
  },
  // Вызывается из файлов районов
  put(kind, d) { kind === "legends" ? this.addLegends(d) : this.addPlaces(d); },

  // Запуск: оглавление + районы, которые нужны сразу
  async init(want) {
    try { this.index = await this.json("index.json"); }
    catch (e) { this.failed = true; return; }
    const need = new Set((want || []).filter(a => this.has(a)));
    if (!need.size) need.add(this.has("hs") ? "hs" : Object.keys(this.index.areas)[0]);
    await this.loadMany([...need]);
  },

  has(a) { return !!(this.index && this.index.areas[a]); },
  areas() { return this.index ? Object.keys(this.index.areas) : []; },

  // В каком районе место: легенды — по оглавлению, остальные — по началу id («hs_s12» → hs)
  areaOf(id) {
    if (!this.index || !id) return null;
    if (this.index.where[id]) return this.index.where[id];
    const m = /^([a-z]+)_/.exec(id);
    return m && this.has(m[1]) ? m[1] : null;
  },

  // Районы, в границы которых попадает точка; если ни одного — ближайший в пределах 30 км
  areasAt(p) {
    if (!this.index || !p) return [];
    const inside = this.areas().filter(a => { const b = this.index.areas[a].bb; return p.lat >= b[0] && p.lat <= b[2] && p.lng >= b[1] && p.lng <= b[3]; });
    if (inside.length) return inside;
    let best = null, bd = 30000;
    for (const a of this.areas()) { const c = this.index.areas[a].c, d = Geo.distance(p, { lat: c[0], lng: c[1] }); if (d < bd) { bd = d; best = a; } }
    return best ? [best] : [];
  },

  // Районы, которые видны в окне карты (границы карты: юг, запад, север, восток)
  areasIn(s, w, n, e) {
    return this.areas().filter(a => { const b = this.index.areas[a].bb; return b[0] <= n && b[2] >= s && b[1] <= e && b[3] >= w; });
  },

  // Всего мест во всех районах (а не только загруженных) — для счётчиков
  total(kind) { return this.areas().reduce((s, a) => s + (this.index.areas[a].n[kind] || 0), 0); },

  loadMany(list) { return Promise.all(list.map(a => this.load(a))); },

  // Загрузить район (один раз). Возвращает true, если появились новые данные.
  load(a) {
    if (!this.has(a) || this.loaded.has(a)) return Promise.resolve(false);
    if (this.loading.has(a)) return this.loading.get(a);
    const files = this.index.areas[a].files;
    const p = Promise.all(files.map(f => this.script(`${a}/${f}.js`)))
      .then(() => { this.loaded.add(a); return true; })
      .catch(() => false)
      .finally(() => this.loading.delete(a));
    this.loading.set(a, p);
    return p;
  },

  addLegends(list) {
    const have = new Set(LEGENDS.map(l => l.id));
    for (const l of list) if (l && l.id && !have.has(l.id)) LEGENDS.push(l);
  },

  // Строки мест → удобные объекты (формат строк описан в nubi-tools/README)
  addPlaces(d) {
    const city = d.city ? d.city + " " : "", tel = d.tel || {};
    const have = new Set([...SPORT, ...FISH, ...CAMP].map(p => p.id));
    const kinds = s => Object.fromEntries(String(s || "").split(" ").filter(Boolean)
      .map(x => { const m = x.match(/^([a-z]+)(\d+)$/); return m ? [m[1], +m[2]] : [x, 1]; }));
    for (const [id, name, k, addr, lat, lng, t, book, off] of d.sport || [])
      if (!have.has(id)) SPORT.push({ id, name, addr: city + addr, lat, lng, book: !!book, off, tel: tel[t] || t, kinds: kinds(k) });
    for (const [id, name, type, fish, fee, cap, near, addr, lat, lng] of d.fish || [])
      if (!have.has(id)) FISH.push({ id, name, type, fish, fee, cap, near, addr: city + addr, lat, lng });
    for (const [id, name, addr, t, guests, lat, lng] of d.camp || [])
      if (!have.has(id)) CAMP.push({ id, name, addr: city + addr, tel: tel[t] || t, guests, lat: lat ?? null, lng: lng ?? null });
  }
};
