// ============================================================
// Камера внутри приложения и хранение фото.
// Фото можно сделать ТОЛЬКО камерой приложения (галереи нет),
// и в момент снимка автоматически записываются GPS-координаты.
// ============================================================

// ----- Хранилище фото на телефоне (IndexedDB: фото слишком большие для localStorage) -----
window.Photos = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      const r = indexedDB.open("nubi-photos", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("photos");
      r.onsuccess = () => { this.db = r.result; res(this.db); };
      r.onerror = () => rej(r.error);
    });
  },
  async put(id, dataUrl) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction("photos", "readwrite");
      tx.objectStore("photos").put(dataUrl, id);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  },
  async get(id) {
    const db = await this.open();
    return new Promise(res => {
      const r = db.transaction("photos").objectStore("photos").get(id);
      r.onsuccess = () => res(r.result || null); r.onerror = () => res(null);
    });
  },
  async clear() {
    const db = await this.open();
    return new Promise(res => { const tx = db.transaction("photos", "readwrite"); tx.objectStore("photos").clear(); tx.oncomplete = res; });
  }
};

// ----- Камера -----
// Camera.shoot() открывает камеру на весь экран и возвращает Promise:
//   {photo: dataURL, lat, lng, acc, time} — снимок с координатами
//   null — пользователь нажал «Отмена»
// Ошибки: "camDenied" — нет доступа к камере, "camErr" — камера не открылась,
//         "gpsDenied"/"gpsErr" — снимок сделан, но координаты не получены (снимок не принимается)
window.Camera = {
  shoot(texts) {
    return new Promise(async (resolve, reject) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return reject("camErr");
      // Датчик наклона: узнаём, держат ли телефон горизонтально (экран приложения всегда вертикальный)
      Camera.tiltStart();
      // Камера: задняя (environment) или передняя для селфи (user)
      let facing = "environment", stream;
      const open = f => navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: f }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false
      });
      try { stream = await open(facing); }
      catch (e) { return reject(e && e.name === "NotAllowedError" ? "camDenied" : "camErr"); }

      // Сразу начинаем определять координаты, пока человек наводит камеру
      const gps = Geo.locate();
      gps.catch(() => {});

      // Полноэкранный слой с видео и кнопками
      const box = document.createElement("div");
      box.className = "cam";
      box.innerHTML = `<video playsinline autoplay muted></video>
        <div class="cam-bar">
          <button type="button" class="cam-cancel">${texts.cancel}</button>
          <button type="button" class="cam-shutter" aria-label="${texts.shutter}"></button>
          <span class="cam-right"><button type="button" class="cam-flip" aria-label="Selfie">🔄</button><span class="cam-status">${texts.locating}</span></span>
        </div>`;
      document.body.appendChild(box);
      const video = box.querySelector("video");
      video.srcObject = stream;
      const status = box.querySelector(".cam-status");
      gps.then(() => status.textContent = "📍 GPS ✓").catch(() => status.textContent = "📍 GPS ✗");

      const close = () => { stream.getTracks().forEach(t => t.stop()); box.remove(); Camera.tiltStop(); };
      // Переворот камеры (селфи). Передняя показывается зеркально — как в обычной камере телефона.
      box.querySelector(".cam-flip").onclick = async () => {
        const next = facing === "environment" ? "user" : "environment";
        stream.getTracks().forEach(t => t.stop());
        try { stream = await open(next); facing = next; }
        catch (e) { try { stream = await open(facing); } catch (e2) { close(); return reject("camErr"); } }
        video.srcObject = stream;
        video.classList.toggle("mirror", facing === "user");
      };

      box.querySelector(".cam-cancel").onclick = () => { close(); resolve(null); };
      box.querySelector(".cam-shutter").onclick = async () => {
        // Кадр с видео -> картинка не больше 1280 px по длинной стороне (экономим место)
        const w = video.videoWidth, h = video.videoHeight;
        if (!w) return;
        const k = Math.min(1, 1280 / Math.max(w, h));
        const fw = Math.round(w * k), fh = Math.round(h * k);
        // Кадр как на экране (селфи — зеркально)
        const f = document.createElement("canvas"); f.width = fw; f.height = fh;
        const fx = f.getContext("2d");
        if (facing === "user") { fx.translate(fw, 0); fx.scale(-1, 1); }
        fx.drawImage(video, 0, 0, fw, fh);
        // Телефон держат горизонтально — поворачиваем снимок, чтобы он лёг ровно.
        // rot: +1 — верх телефона смотрит влево, -1 — вправо, 0 — вертикально.
        const rot = Camera.tilt();
        const c = document.createElement("canvas");
        if (rot) {
          c.width = fh; c.height = fw;
          const cx = c.getContext("2d");
          cx.translate(fh / 2, fw / 2);
          cx.rotate(rot > 0 ? -Math.PI / 2 : Math.PI / 2);
          cx.drawImage(f, -fw / 2, -fh / 2);
        } else { c.width = fw; c.height = fh; c.getContext("2d").drawImage(f, 0, 0); }
        const photo = c.toDataURL("image/jpeg", 0.75);
        const quality = Camera.quality(c);
        const time = Date.now();
        close();
        try {
          const p = await gps;
          resolve({ photo, lat: p.lat, lng: p.lng, acc: p.acc, time, quality });
        } catch (e) { reject(e); }
      };
    });
  },

  // ----- Наклон телефона (акселерометр) -----
  g: null,
  tiltStart() {
    this.g = null;
    const on = () => {
      this._h = e => { const a = e.accelerationIncludingGravity; if (a && a.x != null) this.g = { x: a.x, y: a.y }; };
      window.addEventListener("devicemotion", this._h);
    };
    // iPhone спрашивает разрешение на датчики (вызов должен быть сразу после нажатия)
    if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().then(r => { if (r === "granted") on(); }).catch(() => {});
    } else on();
  },
  tiltStop() { if (this._h) window.removeEventListener("devicemotion", this._h); this._h = null; },
  // +1 — повернули против часовой (верх влево), -1 — по часовой (верх вправо), 0 — вертикально
  tilt() {
    const g = this.g; if (!g) return 0;
    // На iPhone знаки у датчика противоположные
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const x = ios ? -g.x : g.x, y = ios ? -g.y : g.y;
    if (Math.abs(x) < 5 || Math.abs(x) < Math.abs(y) * 1.3) return 0;
    return x > 0 ? 1 : -1;
  },

  // Простая проверка качества прямо на телефоне:
  //   dark   — слишком темно (средняя яркость ниже порога)
  //   blurry — смазано (мало резких перепадов яркости, «дисперсия лапласиана»)
  // Пороги подобраны с запасом; если будут ложные срабатывания — поправим.
  quality(canvas) {
    const W = 320, H = Math.round(canvas.height * W / canvas.width);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const ctx = c.getContext("2d"); ctx.drawImage(canvas, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H).data;
    const g = new Float32Array(W * H);
    let sum = 0;
    for (let i = 0; i < W * H; i++) { g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]; sum += g[i]; }
    const mean = sum / (W * H);
    let n = 0, m = 0, m2 = 0;
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const lap = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - W] - g[i + W];
      n++; const dl = lap - m; m += dl / n; m2 += dl * (lap - m);
    }
    const sharp = m2 / n;
    return { dark: mean < 45, blurry: sharp < 30, mean: Math.round(mean), sharp: Math.round(sharp) };
  }
};
