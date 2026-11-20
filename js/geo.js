// ============================================================
// Геолокация: получить координаты телефона и посчитать расстояние
// ============================================================
window.Geo = {
  last: null, // последнее известное местоположение {lat, lng, acc, time}

  // Получить текущее местоположение. Возвращает Promise.
  // Ошибки: "denied" — пользователь запретил доступ, "error" — не удалось определить.
  locate() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject("error");
      navigator.geolocation.getCurrentPosition(
        p => {
          Geo.last = { lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy, time: Date.now() };
          resolve(Geo.last);
        },
        err => reject(err.code === 1 ? "denied" : "error"),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  },

  // Расстояние между двумя точками в метрах (формула гаверсинуса)
  distance(a, b) {
    const R = 6371000, rad = x => x * Math.PI / 180;
    const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  },

  // Красивая запись расстояния: 850 m / 2.3 km (ko, en) или 850 м / 2,3 км (ru)
  format(m, lang) {
    const ru = lang === "ru";
    if (m < 1000) return Math.round(m) + (ru ? " м" : " m");
    let km = (m / 1000).toFixed(m < 10000 ? 1 : 0);
    if (ru) km = km.replace(".", ",");          // в русском десятичная запятая
    return km + (ru ? " км" : " km");
  }
};
