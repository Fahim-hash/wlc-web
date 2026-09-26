self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "উইল্‌স সাহিত্য ক্লাব",
      body: event.data ? event.data.text() : "নতুন আপডেট এসেছে।",
    };
  }

  const title = data.title || "উইল্‌স সাহিত্য ক্লাব";
  const options = {
    body: data.body || "নতুন আপডেট এসেছে।",
    icon: data.icon || "/logo.png",
    badge: data.badge || "/logo.png",
    data: { url: data.url || "/" },
    tag: "wlc-global",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target = event.notification?.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(target);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(target);
        }

        return undefined;
      })
  );
});
