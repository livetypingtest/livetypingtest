importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBvM_3e34UQ0GwbhMYRrizQQxM2VPp8GKs",
  authDomain: "typingtest-87d01.firebaseapp.com",
  projectId: "typingtest-87d01",
  storageBucket: "typingtest-87d01.firebasestorage.app",
  messagingSenderId: "277248962397",
  appId: "1:277248962397:web:0821e2f0de86abca81c2b4",
  measurementId: "G-0T80Y7WHJG"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./assets/images/favicon.png",
    data: {
      url: payload.data?.url || "/", // Ensure the URL is retrieved from payload.data
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Close the notification when clicked

  // Extract the URL from the notification data
  const urlToOpen = event.notification.data?.url;

  // Log the URL for debugging purposes
  // console.log("URL extracted from notification data:", urlToOpen);

  if (urlToOpen) {
    // Ensure the URL is absolute
    const absoluteUrl = urlToOpen.startsWith("http")
      ? urlToOpen // If already absolute, use it directly
      : new URL(urlToOpen, self.location.origin).href; // Convert relative to absolute

    // console.log("Absolute URL to open:", absoluteUrl);

    // Open the URL in a new tab or focus an existing one
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        for (const client of windowClients) {
          // If the URL is already open in a tab, focus it
          if (client.url === absoluteUrl && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new tab with the URL
        if (clients.openWindow) {
          return clients.openWindow(absoluteUrl);
        }
      })
    );
  } else {
    console.error("No URL found in notification data.");
  }
});


