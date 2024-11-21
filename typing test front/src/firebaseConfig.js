//firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvM_3e34UQ0GwbhMYRrizQQxM2VPp8GKs",
  authDomain: "typingtest-87d01.firebaseapp.com",
  projectId: "typingtest-87d01",
  storageBucket: "typingtest-87d01.firebasestorage.app",
  messagingSenderId: "277248962397",
  appId: "1:277248962397:web:0821e2f0de86abca81c2b4",
  measurementId: "G-0T80Y7WHJG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app); // Initialize Cloud Messaging

export { app, analytics, messaging };
