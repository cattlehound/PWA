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
    event.respondWith(self.addEventListener('install', function(event) {
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
  
  self.addEventListener('push', (event) => {
    const data = event.data.json();
    const { title, message } = data;
  
    const options = {
      body: message,
      icon: 'images/icon.png', // Add an icon image if you want
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  
    // Send a message to the page with the received data
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage(data);
      });
    });
  });
  
  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        }).then(function (clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
  
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
  
