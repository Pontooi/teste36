// DualDev Mobile PWA - Service Worker de Cache e Suporte Offline
const CACHE_NAME = 'dualdev-mobile-v1';

// Recursos estáticos básicos cacheados para abertura instantânea no celular
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icons/app-icon-192.svg',
  './assets/icons/app-icon-512.svg'
];

// Instalação do Service Worker e pré-cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Falha no pré-cache de alguns assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// Limpeza de versões anteriores do cache ao ativar
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interceptador de requisições: tenta a rede primeiro; se estiver offline, busca do cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Ignora requisições de extensões de navegador
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se a resposta for válida, armazena uma cópia no cache dinâmico
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Em caso de falha de conexão (offline), busca do cache local
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Se for uma requisição de página HTML, entrega a página principal
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
          return new Response('Sem conexão', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
