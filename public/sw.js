self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url || '/'
      },
      actions: [
        {
          action: 'taken',
          title: 'Mark as Taken',
          icon: '/check-mark.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/x-mark.png'
        },
      ]
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  if (event.action === 'taken') {
    // Logic to mark as taken via API
    event.waitUntil(
      clients.openWindow(event.notification.data.url + '?action=taken')
    );
  } else {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
