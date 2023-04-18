self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('flask-pwa-cache-v1').then(function(cache) {
        return cache.addAll([
          '/',
          '/static/manifest.json',
          // Add any other static assets you want to cache
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  });
  
  self.addEventListener('push', function(event) {
    if (event.data) {
      var data = event.data.json();
      var options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        vibrate: data.vibrate,
        data: data.data,
      };
      event.waitUntil(self.registration.showNotification(data.title, options));
    }
  });
  
