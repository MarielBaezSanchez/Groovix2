// =====================================================
// sw.js - Manual (sin Workbox) - con manejo de imágenes
// =====================================================

// Nombres de caches
const CACHE_NAME = "groovix-cache-v1";
const IMAGES_CACHE = "groovix-images-cache-v1";

// Archivos que quieres tener listos offline (precache)
const PRECACHE = [
    "/",
    "/index.html",
    "/offline", // tu ruta React; si no está disponible, considera /offline.html
    "/icon/icon-192x192.png",
    "/icon/icon-512x512.png",
    "/groovix.png",
    "/vite.svg",
];

// Rutas que deben forzar a la página offline cuando NO haya internet
const FORCE_OFFLINE_ROUTES = ["/events", "/bookings", "/users"];

// Página offline (asegúrate está en PRECACHE)
const OFFLINE_URL = "/offline";

// Duraciones / límites
const IMAGE_MAX_ENTRIES = 200;
const IMAGE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 días

// =====================================================
// INSTALL → precache
// =====================================================
self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
    );
});

// =====================================================
// ACTIVATE
// =====================================================
self.addEventListener("activate", (event) => {
    // limpiar caches antiguos si fuera necesario (simple)
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter((k) => k !== CACHE_NAME && k !== IMAGES_CACHE)
                    .map((k) => caches.delete(k))
            );
            await clients.claim();
        })()
    );
});

// =====================================================
// UTIL: limpiar un cache (limit entries por URL timestamp simplificado)
// =====================================================
async function enforceCacheLimits(cacheName, maxEntries) {
    try {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        if (requests.length > maxEntries) {
            // borrar los más antiguos (FIFO)
            const removeCount = requests.length - maxEntries;
            for (let i = 0; i < removeCount; i++) {
                await cache.delete(requests[i]);
            }
        }
    } catch (err) {
        // no crítico
        console.warn("enforceCacheLimits error", err);
    }
}

// =====================================================
// FETCH HANDLER
// =====================================================
self.addEventListener("fetch", (event) => {
    const req = event.request;
    const url = new URL(req.url);

    // 1) Navegaciones (HTML)
    if (req.mode === "navigate") {
        const mustGoOffline = FORCE_OFFLINE_ROUTES.some((p) =>
            url.pathname.startsWith(p)
        );

        if (mustGoOffline) {
            // Si la navegación falla (offline), devolver la página offline precacheada
            event.respondWith(
                fetch(req)
                    .then((res) => {
                        // actualizar cache de páginas (opcional)
                        const copy = res.clone();
                        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
                        return res;
                    })
                    .catch(async () => {
                        const cache = await caches.open(CACHE_NAME);
                        const offlineResp = await cache.match(OFFLINE_URL);
                        return offlineResp || (await cache.match("/index.html")) || new Response("Offline", { status: 503, statusText: "Offline" });
                    })
            );
            return;
        }

        // Network-first para páginas normales (intenta red, si falla usar cache)
        event.respondWith(
            fetch(req)
                .then((res) => {
                    // cachear la respuesta para futuro
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                    return res;
                })
                .catch(async () => {
                    const cache = await caches.open(CACHE_NAME);
                    return (await cache.match(req)) || (await cache.match("/index.html")) || new Response("Offline", { status: 503 });
                })
        );
        return;
    }

    // 2) Imágenes → Cache First (mejor UX)
    if (req.destination === "image" || /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname)) {
        event.respondWith(
            caches.match(req).then((cached) => {
                if (cached) return cached;
                return fetch(req)
                    .then((res) => {
                        // solo cachear respuestas OK
                        if (!res || res.status !== 200) return res;
                        const clone = res.clone();
                        caches.open(IMAGES_CACHE).then(async (cache) => {
                            await cache.put(req, clone);
                            // aplicar límite simple
                            enforceCacheLimits(IMAGES_CACHE, IMAGE_MAX_ENTRIES);
                        });
                        return res;
                    })
                    .catch(async () => {
                        // si no hay nada, intentar devolver un placeholder si lo tienes (opcional)
                        const fallback = await caches.open(CACHE_NAME).then((c) => c.match("/icon/icon-192x192.png"));
                        return fallback || Response.error();
                    });
            })
        );
        return;
    }

    // 3) API requests → NetworkFirst with cache fallback (GET only)
    if (req.method === "GET" && url.pathname.startsWith("/api")) {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    // cachear respuesta si es válida
                    if (res && (res.status === 200 || res.status === 0)) {
                        const clone = res.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                    }
                    return res;
                })
                .catch(async () => {
                    const cache = await caches.open(CACHE_NAME);
                    const cached = await cache.match(req);
                    return cached || new Response(null, { status: 504, statusText: "Gateway Timeout" });
                })
        );
        return;
    }

    // 4) Recursos estáticos (JS/CSS/Fonts) → CacheFirst with network update
    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;
            return fetch(req)
                .then((res) => {
                    // cachear para siguiente vez
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                    return res;
                })
                .catch(() => {
                    // si falla y no hay cache, devolver un fallback vacío
                    return cached || new Response(null, { status: 504 });
                });
        })
    );
});
