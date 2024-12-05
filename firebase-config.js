// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpH4kmqA5HL6c-fC1FEX2UGi38yCAbeBc",
    authDomain: "user-intake-form.firebaseapp.com",
    projectId: "user-intake-form",
    storageBucket: "user-intake-form.appspot.com",
    messagingSenderId: "549360486551",
    appId: "1:549360486551:web:f9877946385fa8198c01d2"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

console.log('Firebase Initialized', firebase.apps.length > 0);
