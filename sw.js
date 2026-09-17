const CACHE_NAME = "weight-tracker-v2";
const META_DB_NAME = "weightTrackerMeta";
const META_DB_STORE = "kv";

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

// ---------- best-effort background reminder ----------
// Periodic Background Sync only exists on Chrome/Android for installed PWAs (not iOS Safari,
// not desktop), and even there the browser decides when/if it actually fires — this is a bonus
// on top of the reliable in-app check in index.html, never the only path to a reminder.
function openMetaDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(META_DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(META_DB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function getMeta(db, key) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(META_DB_STORE, "readonly").objectStore(META_DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function checkAndNotify() {
  try {
    const db = await openMetaDB();
    const reminder = await getMeta(db, "reminder");
    const lastLoggedDate = await getMeta(db, "lastLoggedDate");
    if (!reminder || !reminder.enabled) return;

    const now = new Date();
    const pad = (n) => (n < 10 ? "0" + n : "" + n);
    const todayISO = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    if (lastLoggedDate === todayISO) return;

    const nowHM = pad(now.getHours()) + ":" + pad(now.getMinutes());
    if (nowHM < (reminder.time || "09:00")) return;

    await self.registration.showNotification("Log today's weight", {
      body: "You haven't logged your weight yet today.",
      icon: "icons/icon-192.png",
      badge: "icons/icon-192.png",
      tag: "daily-weight-reminder"
    });
  } catch (e) {
    // best effort only
  }
}

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "daily-weight-reminder") event.waitUntil(checkAndNotify());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("./index.html");
    })
  );
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
