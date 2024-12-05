document.addEventListener('DOMContentLoaded', function () {
    const firebaseConfig = {
        apiKey: "AIzaSyBpH4kmqA5HL6c-fC1FEX2UGi38yCAbeBc",
        authDomain: "user-intake-form.firebaseapp.com",
        projectId: "user-intake-form",
        storageBucket: "user-intake-form.appspot.com",
        messagingSenderId: "549360486551",
        appId: "1:549360486551:web:f9877946385fa8198c01d2"
    };

    firebase.initializeApp(firebaseConfig);

    const messagesRef = firebase.database().ref('Collected Data');

    document.getElementById('contactForm').addEventListener('submit', submitForm);

    function submitForm(e) {
        e.preventDefault();
    
        // Get form values
        const name = getInputVal('name');
        const color = getInputVal('color');
        const city = getInputVal('city');
        const enjoyment = getInputVal('current-enjoyment');
        const memory = getInputVal('memory');
    
        // Save to Firebase
        saveMessage(name, color, city, enjoyment, memory);
    
        // Update chat dynamically
        updateChat(name, color, city, enjoyment, memory);
    
        // Update the "Digital Twin" header with the submitted name
        updateDigitalTwinHeader(name);

        updateBackgroundColor(color);
    
        // Clear form
        document.getElementById('contactForm').reset();
    }
    
    function updateDigitalTwinHeader(name) {
        const header = document.querySelector('.profile-section h1');
        header.textContent = name || 'Digital Twin'; // Fallback to "Digital Twin" if no name is provided
    }

    function updateBackgroundColor(color) {
        document.body.style.backgroundColor = color; // Set the background color of the body
    }

    function getInputVal(id) {
        return document.getElementById(id).value;
    }

    function saveMessage(name, color, city, enjoyment, memory) {
        const newMessageRef = messagesRef.push();
        newMessageRef.set({
            name,
            color,
            city,
            enjoyment,
            memory
        });
    }

    function updateChat(name, color, city, enjoyment, memory) {
        const dataDisplay = document.getElementById('dataDisplay');
        dataDisplay.innerHTML = `
            <p>
                <strong>${name}</strong><br><br>
                Hello! I am ${name}.
                My favorite color is ${color} 
                and my favorite city is ${city}.
                Right now I'd give my life enjoyment a ${enjoyment}/10.
                I've recently been thinking about a time in my chilhood where ${memory}
            </p>`;
    }

    // Display the most recent data on page load
    messagesRef.limitToLast(1).on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            const data = childSnapshot.val();
            updateChat(data.name, data.color, data.city, data.enjoyment, data.memory);
        });
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
            (registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            },
            (err) => {
                console.error('Service Worker registration failed:', err);
            }
        );
    });
}

const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching offline resources...');
            return cache.addAll([
                OFFLINE_URL,
                '/patrick.gif'
            ]);
        })
    );
    self.skipWaiting(); // Activate the new service worker immediately
});

self.addEventListener('fetch', (event) => {
    // Handle requests
    event.respondWith(
        fetch(event.request).catch(() => {
            // Fallback to the offline page when fetch fails
            return caches.match(event.request).then((response) => {
                return response || caches.match(OFFLINE_URL);
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    // Clear old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Immediately take control of open clients
});