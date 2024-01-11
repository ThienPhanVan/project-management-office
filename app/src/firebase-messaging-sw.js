importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDd7zrO0BZFc4SdfTfuwZnE-L0FQTPjIkY",
  authDomain: "push-notification-20bcb.firebaseapp.com",
  projectId: "push-notification-20bcb",
  storageBucket: "push-notification-20bcb.appspot.com",
  messagingSenderId: "58476564987",
  appId: "1:58476564987:web:73a49beba1d29860e47b5e",
  measurementId: "G-TGGRQXFYB6",
});

var messaging = firebase.messaging();
