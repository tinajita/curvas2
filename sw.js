const CACHE_NAME = 'motonav-app-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/maplibre-gl@4.3.2/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@4.3.2/dist/maplibre-gl.js',
  'https://unpkg.com/pmtiles@3.2.0/dist/pmtiles.js'
];

// Instalación: Guardar la estructura de la app en caché permanente
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Interceptador: Si no hay cobertura, saca los archivos de la caché directamente
self.addEventListener('fetch', (e) => {
  // Ignoramos el mapa binario pmtiles largo aquí, ya que tiene su propio gestor interno en index.html
  if (e.request.url.includes('catbox.moe') || e.request.url.includes('nominatim') || e.request.url.includes('project-osrm')) {
    return; 
  }
  
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
