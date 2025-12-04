// =============================================
//  Rutas que deben redirigir a OFFLINE cuando
//  NO hay conexión
// =============================================
const FORCE_OFFLINE_ROUTES = ["/events", "/bookings", "/users"];

// Página offline
const OFFLINE_URL = "/offline";

self.addEventListener("fetch", (event) => {
    // Solo queremos interceptar navegaciones
    if (event.request.mode !== "navigate") return;

    const url = new URL(event.request.url);

    // Si coincide con las rutas que deben ir a OFFLINE
    const mustGoOffline = FORCE_OFFLINE_ROUTES.some((path) =>
        url.pathname.startsWith(path)
    );

    if (!mustGoOffline) return;

    event.respondWith(
        fetch(event.request).catch(async () => {
            const cache = await caches.open("groovix-pages-cache");
            const offlinePage = await cache.match(OFFLINE_URL);
            return offlinePage || Response.error();
        })
    );
});
