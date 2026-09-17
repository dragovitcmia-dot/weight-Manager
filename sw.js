const CACHE_NAME = "weight-tracker-v1";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => {
            // tolerate a single failed resource (e.g. CDN briefly unreachable) rather than
            // aborting the whole install, so the app shell still gets cached for offline use
          })
        )
      )
    )
  );
  // Deliberately no self.skipWaiting() here: a freshly installed worker should sit in
  // "waiting" until the page's update banner asks for it (via the SKIP_WAITING message
  // below), so an update never silently swaps the app out from under an open tab.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

// Stale-while-revalidate: serve from cache immediately when available (fast + works offline),
// refresh the cache in the background on every online request so updates still arrive.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(req).then((cached) => {
        const networkFetch = fetch(req)
          .then((response) => {
            if (response && response.ok) cache.put(req, response.clone());
            return response;
          })
          .catch(() => null);

        if (cached) {
          networkFetch; // refresh in background, ignore result
          return cached;
        }

        return networkFetch.then((response) => {
          if (response) return response;
          if (req.mode === "navigate") return cache.match("./index.html");
          return new Response("", { status: 504, statusText: "Offline" });
        });
      })
    )
  );
});
