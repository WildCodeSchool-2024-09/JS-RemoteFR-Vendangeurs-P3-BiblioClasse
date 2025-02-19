// service-worker.js

self.addEventListener("install", (event) => {
  console.info("Service worker installed");
  event.waitUntil(
    caches.open("my-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/icon-192x192.png",
        "/icon-512x512.png",
        "/assets/index.css",
        "/assets/index.js",
      ]);
    }),
  );
});

self.addEventListener("activate", (event) => {
  console.info("Service worker activated");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});
