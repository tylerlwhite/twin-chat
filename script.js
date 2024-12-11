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

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('send-btn').addEventListener('click', function () {
        const messageInput = document.getElementById('message-input');
        const dataDisplay = document.getElementById('dataDisplay');

        // Ensure the input value is not empty
        const message = messageInput.value.trim();
        if (!message) return;

        // Create a name bubble (if it doesn't already exist for this session)
        if (!document.querySelector('.name-bubble')) {
            const nameBubble = document.createElement('div');
            nameBubble.className = 'name-bubble'; // Add the name bubble class
            nameBubble.textContent = 'SMitty'; // Replace with dynamic name if needed
            dataDisplay.appendChild(nameBubble);
        }

        // Create a new div element for the chat bubble
        const messageBubble = document.createElement('div');
        messageBubble.className = 'message-bubble'; // Add the chat bubble class
        messageBubble.textContent = message;

        // Append the new message to the dataDisplay container
        dataDisplay.appendChild(messageBubble);

        // Clear the input field
        messageInput.value = '';
    });
});

function checkOnlineStatus() {
    if (navigator.onLine) {
        document.getElementById('offline-world').style.display = 'none';
        document.getElementById('online-world').style.display = 'flex';
    } else {
        document.getElementById('offline-world').style.display = 'flex';
        document.getElementById('online-world').style.display = 'none';
    }
}

window.addEventListener('load', checkOnlineStatus);

window.addEventListener('online', checkOnlineStatus);
window.addEventListener('offline', checkOnlineStatus);