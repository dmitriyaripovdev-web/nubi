// ============================================================
// 누비 — ВЛАДЕЛЬЦЫ МЕСТ («Это моё место») и сведения о месте
// Для разделов «Спорт», «Рыбалка», «Кемпинг».
// 1) Владелец входит через Kakao и подаёт заявку с фото-доказательством.
// 2) Админ подтверждает её в админке (вкладка «Владельцы»).
// 3) Владелец сам ведёт объявление, описание, часы, цены, контакты и способ записи.
// Люди видят значок «Подтверждено владельцем». Правила доступа проверяет сервер (10_…sql).
// ============================================================

Object.assign(Server, {
  // Сведения о всех местах (таблица маленькая — грузим целиком)
  async placeInfoAll() {
    const { data, error } = await this.db.from("place_info").select("*").limit(2000);
    if (error) throw error.message;
    return data || [];
  },
  async savePlaceInfo(placeId, fields) {
    const { data, error } = await this.db.from("place_info").update({ ...fields, updated_at: new Date().toISOString() })
      .eq("place_id", placeId).select().maybeSingle();
    if (error) throw error.message;
    return data;
  },
  async myClaims() {
    const { data, error } = await this.db.from("place_claims").select("place_id, status, reject_reason, created_at")
      .eq("user_id", this.user.id).order("created_at", { ascending: false }).limit(50);
    if (error) throw error.message;
    return data || [];
  },
  // Загрузить файл (Blob) в свою папку закрытого хранилища. Возвращает путь.
  async uploadBlob(bucket, name, blob) {
    const path = `${this.user.id}/${name}.jpg`;
    const { error } = await this.db.storage.from(bucket).upload(path, blob, { contentType: "image/jpeg", upsert: true });
    if (error) throw error.message;
    return path;
  },
  async claimPlace(place, f, proofPath) {
    const { data, error } = await this.db.rpc("claim_place",
      { p_place: place, p_biz: f.biz, p_contact: f.contact, p_note: f.note, p_proof: proofPath });
    if (error) throw error.message;
    return data;
  },
  // Пожаловаться на фонарик или народную легенду
  async report(kind, target, reason) {
    const { data, error } = await this.db.rpc("report_item", { p_kind: kind, p_target: target, p_reason: reason || null });
    if (error) throw error.message;
    return data;
  }
});

// Уменьшаем фото до 1600 px — быстрее загрузка, меньше места на сервере
async function shrinkPhoto(file, max = 1600) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return await new Promise(ok => c.toBlob(ok, "image/jpeg", 0.85));
  } finally { URL.revokeObjectURL(url); }
}

window.Owner = {
  info: null,     // id места -> сведения (null = ещё не загружали)
  claims: null,   // мои заявки
  edit: null,     // id места, которое я сейчас правлю
  claim: null,    // id места, на которое подаю заявку
  proof: null,    // выбранное фото-доказательство (Blob)

  handles(d) {
    return !!(d.oedit || d.osave || d.oclaim || d.oclaimSend) || ["ocancel", "oproofPick"].some(k => d[k] !== undefined);
  },

  load() {
    if (!srv.ready || this.info) return;
    this.info = {};
    Server.placeInfoAll().then(rows => {
      this.info = Object.fromEntries(rows.map(r => [r.place_id, r]));
      if (["plist", "pmap"].includes(ui.tab)) render();
    }).catch(() => {});
    if (Server.user) Server.myClaims().then(c => { this.claims = c; if (ui.openPlace) render(); }).catch(() => { this.claims = []; });
  },

  get(id) { return (this.info && this.info[id]) || null; },
  isMine(id) { const i = this.get(id); return !!(i && Server.user && i.owner_id === Server.user.id); },

  // Пометка в списке мест: «✔» у подтверждённых и вид входа
  tags(p) {
    const i = this.get(p.id); if (!i) return "";
    return `${i.owner_id ? `<span class="verified-tag" title="${esc(t("ownerVerified"))}">✔</span>` : ""}${i.access ? `<span class="acc-tag ${i.access}">${esc(t("acc_" + i.access))}</span>` : ""}`;
  },

  // Что показываем людям в карточке места
  block(p) {
    const i = this.get(p.id); if (!i) return "";
    const prices = Array.isArray(i.prices) ? i.prices.filter(x => x && x.n) : [];
    const out = [];
    if (i.notice) out.push(`<div class="notice">📢 ${esc(i.notice)}</div>`);
    if (i.owner_id) out.push(`<div class="verified">✔ ${t("ownerVerified")} <span class="meta">· ${t("ownerUpdated", { d: dateFmt(i.updated_at) })}</span></div>`);
    if (i.access) out.push(`<div class="acc ${i.access}"><b>${t("accLbl")}:</b> ${esc(t("acc_" + i.access))}<span class="meta">${esc(t("accHint_" + i.access))}</span></div>`);
    if (i.about) out.push(`<div class="part"><p style="white-space:pre-wrap;margin:0">${esc(i.about)}</p></div>`);
    if (i.hours || prices.length) out.push(`<div class="place info">
      ${i.hours ? `<div><span class="meta">${t("hoursLbl")}</span><br>${esc(i.hours)}</div>` : ""}
      ${prices.length ? `<div><span class="meta">${t("pricesLbl")}</span><table class="prices">${prices.map(x =>
        `<tr><td>${esc(x.n)}</td><td>${esc(x.p || "")}</td></tr>`).join("")}</table></div>` : ""}</div>`);
    const links = [];
    if (i.phone) links.push(`<a href="tel:${esc(i.phone.replace(/[^\d+]/g, ""))}">📞 ${t("call")}</a>`);
    if (i.kakao) links.push(`<a href="${esc(i.kakao)}" target="_blank" rel="noopener">💬 ${t("kakaoCh")}</a>`);
    if (i.book_url) links.push(`<a href="${esc(i.book_url)}" target="_blank" rel="noopener">📅 ${t("bookOwner")}</a>`);
    if (links.length) out.push(`<div class="links">${links.join("")}</div>`);
    return out.join("");
  },

  // Карточка «Это ваше место?» / «Вы владелец» внизу страницы места
  card(p) {
    const i = this.get(p.id);
    if (this.isMine(p.id)) {
      if (this.edit === p.id) return this.editForm(p, i);
      return `<div class="card soft"><h3>🏠 ${t("ownerYou")}</h3><p class="meta">${t("ownerYouText")}</p>
        <button class="btn" data-oedit="${esc(p.id)}">${t("ownerManage")}</button></div>`;
    }
    if (i && i.owner_id) return "";   // у места уже есть владелец
    const head = `<div class="card soft"><h3>${t("ownerH")}</h3>`;
    if (!srv.ready) return head + `<p class="meta">${t("offlineBanner")}</p></div>`;
    const my = (this.claims || []).find(c => c.place_id === p.id);
    if (my && my.status === "pending") return head + `<div class="msg">⏳ ${t("claimPending")}</div></div>`;
    const rejected = my && my.status === "rejected"
      ? `<div class="msg err">${t("claimRejected")}${my.reject_reason && my.reject_reason !== "owner_set" ? ": " + esc(my.reject_reason) : ""}</div>` : "";
    if (!Server.isKakao()) return head + `<p class="meta">${t("ownerText")}</p>${rejected}
      <p class="meta">${t("claimNeedKakao")}</p><button class="btn ghost" data-tab="me">${t("claimToProfile")}</button></div>`;
    if (this.claim !== p.id) return head + `<p class="meta">${t("ownerText")}</p>${rejected}
      <button class="btn ghost" data-oclaim="${esc(p.id)}">${t("ownerBtn")}</button></div>`;
    return head + `<p class="meta">${t("claimIntro")}</p>
      <div class="oform">
        <label>${t("claimBiz")}<input id="o-biz" maxlength="100" placeholder="${esc(p.name)}"></label>
        <label>${t("claimContact")}<input id="o-contact" maxlength="100" inputmode="tel" placeholder="010-0000-0000"></label>
        <label>${t("claimNote")}<textarea id="o-note" maxlength="500" rows="3" placeholder="${esc(t("claimNotePh"))}"></textarea></label>
        <div class="coordbox"><b style="font-size:13px">${t("claimProof")}</b>
          <span class="meta">${t("claimProofHint")}</span>
          <img id="o-proof-img" class="lphoto" alt="" hidden>
          <button type="button" class="ghostbtn" data-oproof-pick>📷 ${t("claimProofBtn")}</button>
          <input type="file" id="o-proof" accept="image/*" hidden></div>
        <div class="row"><button class="btn" data-oclaim-send="${esc(p.id)}" ${ui.busy ? "disabled" : ""}>${ui.busy ? t("sending") : t("claimSend")}</button>
          <button class="btn ghost" data-ocancel>${t("cancel")}</button></div>
      </div></div>`;
  },

  // Форма владельца
  editForm(p, i) {
    const prices = (Array.isArray(i.prices) ? i.prices : []).map(x => `${x.n} — ${x.p || ""}`).join("\n");
    const acc = ["", "free", "booking", "residents"];
    return `<div class="card soft"><h3>🏠 ${t("ownerManage")}</h3><div class="oform">
      <label>${t("noticeLbl")}<input id="o-notice" maxlength="200" value="${esc(i.notice || "")}" placeholder="${esc(t("noticePh"))}"></label>
      <label>${t("accLbl")}<select id="o-access">${acc.map(a => `<option value="${a}" ${(i.access || "") === a ? "selected" : ""}>${esc(a ? t("acc_" + a) : "—")}</option>`).join("")}</select></label>
      <label>${t("aboutLbl")}<textarea id="o-about" maxlength="1000" rows="4">${esc(i.about || "")}</textarea></label>
      <label>${t("hoursLbl")}<input id="o-hours" maxlength="200" value="${esc(i.hours || "")}" placeholder="${esc(t("hoursPh"))}"></label>
      <label>${t("pricesLbl")}<textarea id="o-prices" rows="4" placeholder="${esc(t("pricesPh"))}">${esc(prices)}</textarea></label>
      <label>${t("telLbl")}<input id="o-phone" maxlength="30" inputmode="tel" value="${esc(i.phone || "")}"></label>
      <label>${t("kakaoChLbl")}<input id="o-kakao" maxlength="200" value="${esc(i.kakao || "")}" placeholder="https://pf.kakao.com/..."></label>
      <label>${t("bookUrlLbl")}<input id="o-book" maxlength="300" value="${esc(i.book_url || "")}" placeholder="https://booking.naver.com/..."></label>
      <div class="row"><button class="btn" data-osave="${esc(p.id)}" ${ui.busy ? "disabled" : ""}>${t("save")}</button>
        <button class="btn ghost" data-ocancel>${t("cancel")}</button></div>
      <p class="note">${t("ownerRules")}</p></div></div>`;
  },

  async click(b) {
    const d = b.dataset;
    const v = id => ((document.getElementById(id) || {}).value || "").trim();
    if (d.oedit) { this.edit = d.oedit; render(); return; }
    if (d.ocancel !== undefined) { this.edit = null; this.claim = null; this.proof = null; render(); return; }
    if (d.oclaim) { this.claim = d.oclaim; this.proof = null; render(); return; }
    if (d.oproofPick !== undefined) { const f = document.getElementById("o-proof"); if (f) f.click(); return; }
    if (d.osave) {
      const url = s => !s ? null : /^https:\/\//i.test(s) ? s : "https://" + s.replace(/^http:\/\//i, "");
      const prices = v("o-prices").split("\n").map(s => s.trim()).filter(Boolean).slice(0, 20).map(s => {
        const m = s.split(/\s+[—–-]\s+|\s*\|\s*/);
        return { n: m[0].slice(0, 60), p: m.slice(1).join(" ").slice(0, 60) };
      });
      ui.busy = true; b.disabled = true;
      try {
        const row = await Server.savePlaceInfo(d.osave, { notice: v("o-notice") || null, access: v("o-access") || null,
          about: v("o-about") || null, hours: v("o-hours") || null, prices, phone: v("o-phone") || null,
          kakao: url(v("o-kakao")), book_url: url(v("o-book")) });
        if (row) this.info[d.osave] = row;
        this.edit = null; toast(t("toastSaved"));
      } catch (e) { toast(t("errServer")); }
      ui.busy = false; render(); return;
    }
    if (d.oclaimSend) {
      const f = { biz: v("o-biz"), contact: v("o-contact"), note: v("o-note") };
      if (!f.contact) return toast(t("claimNeedContact"));
      if (!this.proof) return toast(t("claimNeedProof"));
      ui.busy = true; b.disabled = true; b.textContent = t("sending");
      try {
        const path = await Server.uploadBlob("finds", "claim_" + crypto.randomUUID(), this.proof);
        const r = await Server.claimPlace(d.oclaimSend, f, path);
        if (r && r.ok) {
          this.claim = null; this.proof = null;
          this.claims = [{ place_id: d.oclaimSend, status: "pending" }, ...(this.claims || [])];
          toast(t("claimSent"), true);
        } else toast((I18N[lang].claimErr || I18N.ko.claimErr)[r && r.reason] || t("errServer"), true);
      } catch (e) { toast(t("errServer")); }
      ui.busy = false; render();
    }
  },

  // Выбрали фото-доказательство: показываем превью, форму не перерисовываем (чтобы не стереть введённое)
  async pickProof(file) {
    if (!file) return;
    try {
      this.proof = await shrinkPhoto(file);
      const img = document.getElementById("o-proof-img");
      if (img) { img.src = URL.createObjectURL(this.proof); img.hidden = false; }
    } catch (e) { toast(t("camErr")); }
  }
};
