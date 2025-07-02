importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyBhunb_qTKGq0rdsdlcwETvrpQsThU6Ju8',
  authDomain: 'faste-shop-1a9a5.firebaseapp.com',
  projectId: 'faste-shop-1a9a5',
  storageBucket: 'faste-shop-1a9a5.firebasestorage.app',
  messagingSenderId: '405911548102',
  appId: '1:405911548102:web:c130811a3b97e6a3e127c7',
  measurementId: 'G-EWH8FSF4C7'
}
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig)
// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png'
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})
