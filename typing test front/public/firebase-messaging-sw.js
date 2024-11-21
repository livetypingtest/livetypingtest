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
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./aasets/images/logo 2.svg"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
