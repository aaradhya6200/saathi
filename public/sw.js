// Saathi service worker: always uses the network (bookings and tracking must be live),
// and shows a friendly offline screen for pages when there is no connection.
const CACHE = "saathi-v1";
const OFFLINE = "/offline.html";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return; // APIs, images, scripts: browser default
  e.respondWith(fetch(e.request).catch(() => caches.match(OFFLINE)));
});
