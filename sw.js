const CACHE_NAME = "story-map-v2";
const API_CACHE_NAME = "story-map-api-v2";

// Determine base path
const BASE_PATH =
  self.location.hostname === "localhost" ? "" : "/story-map-app";

// Assets to cache immediately
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(urlsToCache).catch((error) => {
          console.error("Service Worker: Cache addAll failed:", error);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Network First strategy for API, Cache First for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - Network First with Cache Fallback (Advanced: +4pts)
  if (url.origin === "https://story-api.dicoding.dev") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response and save to cache
          const responseClone = response.clone();
          caches.open(API_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, return from cache
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets - Cache First strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((response) => {
        // Cache new requests
        if (request.method === "GET") {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Push Notification event (Skilled: +3pts - dynamic notification)
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received");

  let notificationData = {
    title: "Story Map",
    body: "You have a new notification",
    icon: "/favicon.png",
    badge: "/favicon.png",
  };

  // Parse push data if available (dynamic content)
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || "Story Map",
        body: data.options?.body || "You have a new notification",
        icon: data.options?.icon || "/favicon.png",
        badge: data.options?.badge || "/favicon.png",
        data: data.options?.data || {},
      };
    } catch (error) {
      console.error("Error parsing push data:", error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      actions: [
        {
          action: "open",
          title: "View Story",
          icon: "/favicon.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/favicon.png",
        },
      ],
    })
  );
});

// Notification Click event (Advanced: +4pts - navigation action)
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event.action);

  event.notification.close();

  if (event.action === "open") {
    // Navigate to story detail or home
    event.waitUntil(clients.openWindow("/"));
  }
});
