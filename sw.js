// Service worker: делает приложение устанавливаемым и позволяет открывать его без интернета.
// Стратегия «сначала сеть»: если интернет есть — всегда берём свежие файлы (обновления видны сразу),
// если нет — показываем сохранённую копию.
const CACHE = "nubi-v46";

self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Кэшируем только файлы приложения (включая данные районов из data/), библиотеку карты и шрифты.
  // Запросы к серверу (Supabase) и картинки карты идут мимо кэша — там всегда нужны свежие данные.
  const host = new URL(req.url).host;
  const ok = host === location.host || host === "unpkg.com" || host.endsWith("fonts.googleapis.com") || host.endsWith("fonts.gstatic.com");
  if (!ok) return;
  // Свои файлы всегда сверяем с сервером (cache: "no-cache"), чтобы браузер не отдавал
  // старую копию из своего кэша ещё 10 минут после обновления сайта.
  e.respondWith(
    // (для страниц-переходов нельзя передать настройки в сам req, поэтому берём по адресу)
    (host === location.host ? fetch(req.url, { cache: "no-cache" }) : fetch(req)).then(res => {
      // В кэш кладём только удачные ответы (ошибку 404 не запоминаем)
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{}); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: req.url.includes("/data/") }))
  );
});
