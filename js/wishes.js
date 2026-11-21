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

  is(id) { return WISH_IDS.has(id); },

  // Значок в списке легенд
  tag(id) { return this.is(id) ? `<span class="lantern-tag" title="${esc(t("wishPlace"))}">🏮</span>` : ""; },

  // Блок на странице легенды
  card(l) {
    if (!this.is(l.id)) return "";
    const v = visits[l.id];
    let form;
    if (!srv.ready) form = `<p class="meta">${t("offlineBanner")}</p>`;
    else if (!v || v.test || v.offline) form = `<p class="meta">${t("wishNeedStamp")}</p>`;
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
      <h3 class="wall-h">${t("wallH", { n: wall ? wall.length : 0 })}</h3>
      ${wall == null ? `<p class="meta">…</p>`
        : wall.length ? `<div class="wall">${wall.map(w => this.lantern(w)).join("")}</div>`
        : `<p class="meta">${t("wallEmpty")}</p>`}
    </section>`;
  },

  // Один фонарик на стене
  lantern(w) {
    return `<div class="lantern ${w.fulfilled ? "done" : ""} ${w.mine ? "mine" : ""}">
      <span class="lglow" aria-hidden="true"></span>
      <p>${esc(w.text)}</p>
      <div class="lfoot">
        ${w.fulfilled ? `<span class="ldone">${t("fulfilledTag")}</span>` : w.mine ? `<span class="meta">${t("mineTag")}</span>` : ""}
        ${w.mine ? `<span class="meta">🙏 ${w.cheers}</span>`
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
      Server.wishWall(id).then(w => { this.walls[id] = w; if (ui.openId === id) render(); })
        .catch(() => { this.walls[id] = []; });
    }
    if (ui.tab === "me" && this.mine === undefined) {
      this.mine = null;
      Server.myWishes().then(w => { this.mine = w; if (ui.tab === "me") render(); }).catch(() => { this.mine = []; });
    }
  },

  // Нажатия на кнопки желаний. Возвращает true, если нажатие обработано.
  async click(b) {
    const d = b.dataset;
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
    if (d.cheer) {
      b.disabled = true;
      try {
        const n = await Server.cheerWish(d.cheer);
        for (const k in this.walls) for (const w of this.walls[k] || []) if (w.id === d.cheer) { w.cheers = n ?? w.cheers; w.cheered = true; }
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
