// ---------------------- EVENTO DE FETCH (ESTRATEGIA NETWORK-FIRST) ----------------------
// Usamos "Network-first, luego Cache-fallback": intentamos la red primero, si falla, usamos la caché.
self.addEventListener('fetch', event => {
  // Ignoramos las peticiones que no sean GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // 1. Intentamos obtener el recurso de la red.
    fetch(event.request)
      .then(networkResponse => {
        // Si la respuesta es válida, la guardamos en caché y la devolvemos.
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(error => {
        // 2. Si la red falla (no hay conexión), buscamos el recurso en la caché.
        console.error('[Service Worker] Fetch failed, sirviendo desde caché:', error);
        return caches.match(event.request);
      })
  );
});