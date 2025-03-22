// Graz Audio Guide Application Logic

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupAudioControls();
    setupTourCards();
});

// Audio locations data - these would typically come from a backend API
const audioLocations = [
    {
        id: 1,
        name: "Hauptplatz",
        coordinates: [47.0707, 15.4382],
        description: "The bustling main square of Graz, where you can hear the sounds of street performers, tourists, and the famous clocktower bell.",
        audioFile: "audio/hauptplatz.mp3",
        tour: ["historical", "cultural"]
    },
    {
        id: 2,
        name: "Schlossberg",
        coordinates: [47.0763, 15.4379],
        description: "The iconic hill in the center of Graz with panoramic views. Listen to birds chirping and the sounds of the outdoor cafés.",
        audioFile: "audio/schlossberg.mp3",
        tour: ["historical", "nature"]
    },
    {
        id: 3,
        name: "Kunsthaus (Art Museum)",
        coordinates: [47.0716, 15.4350],
        description: "The modern 'Friendly Alien' art museum. Hear the unique acoustics inside this architectural marvel and the river Mur flowing nearby.",
        audioFile: "audio/kunsthaus.mp3",
        tour: ["cultural"]
    },
    {
        id: 4,
        name: "Mur Island",
        coordinates: [47.0730, 15.4321],
        description: "The floating platform on the Mur river with its café and amphitheater. Experience the calming sounds of water flowing around you.",
        audioFile: "audio/murinsel.mp3",
        tour: ["cultural", "nature"]
    },
    {
        id: 5,
        name: "Farmers Market (Kaiser-Josef-Platz)",
        coordinates: [47.0766, 15.4405],
        description: "The lively farmers market where locals shop for fresh produce. Immerse yourself in the sounds of vendors and customers haggling.",
        audioFile: "audio/farmersmarket.mp3",
        tour: ["culinary"]
    },
    {
        id: 6,
        name: "Stadtpark (City Park)",
        coordinates: [47.0721, 15.4476],
        description: "The green heart of Graz. Listen to the peaceful sounds of nature, children playing, and street musicians.",
        audioFile: "audio/stadtpark.mp3",
        tour: ["nature"]
    },
    {
        id: 7,
        name: "University of Graz",
        coordinates: [47.0780, 15.4490],
        description: "The historic campus buzzing with student life. Experience the ambiance of knowledge and academic discourse.",
        audioFile: "audio/university.mp3",
        tour: ["historical"]
    }
];

// Map variables
let map;
let audioMarkers = [];
let activeTour = null;
let currentAudio = null;
let audioContext;

// Initialize the map
function initializeMap() {
    // Center on Graz
    map = L.map('map-container').setView([47.0707, 15.4382], 14);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add audio location markers
    addMarkers();
}

// Add markers for audio locations
function addMarkers() {
    // Clear existing markers
    audioMarkers.forEach(marker => map.removeLayer(marker));
    audioMarkers = [];
    
    // Add markers for each location
    audioLocations.forEach(location => {
        // Only show markers for the active tour, or all if no tour is selected
        if (!activeTour || location.tour.includes(activeTour)) {
            const marker = L.marker(location.coordinates)
                .addTo(map)
                .bindPopup(createPopupContent(location));
                
            marker.on('click', () => {
                displayLocationInfo(location);
            });
            
            audioMarkers.push(marker);
        }
    });
}

// Create popup content for markers
function createPopupContent(location) {
    const popupContent = document.createElement('div');
    popupContent.className = 'location-popup';
    
    const title = document.createElement('h3');
    title.textContent = location.name;
    
    const listenButton = document.createElement('button');
    listenButton.textContent = '🎧 Listen';
    listenButton.onclick = () => {
        playAudio(location);
    };
    
    popupContent.appendChild(title);
    popupContent.appendChild(listenButton);
    
    return popupContent;
}

// Display location information in the sidebar
function displayLocationInfo(location) {
    const infoContainer = document.getElementById('location-info-content');
    infoContainer.innerHTML = '';
    
    const title = document.createElement('h4');
    title.textContent = location.name;
    
    const description = document.createElement('p');
    description.textContent = location.description;
    
    const listenButton = document.createElement('button');
    listenButton.className = 'controls';
    listenButton.textContent = '🎧 Listen to this location';
    listenButton.onclick = () => {
        playAudio(location);
    };
    
    infoContainer.appendChild(title);
    infoContainer.appendChild(description);
    infoContainer.appendChild(listenButton);
}

// Set up audio controls
function setupAudioControls() {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const volumeControl = document.getElementById('volume');
    
    // Initialize Web Audio API
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    } catch (e) {
        alert('Web Audio API is not supported in this browser');
    }
    
    playBtn.addEventListener('click', () => {
        if (currentAudio) {
            currentAudio.play();
            playBtn.disabled = true;
            pauseBtn.disabled = false;
        }
    });
    
    pauseBtn.addEventListener('click', () => {
        if (currentAudio) {
            currentAudio.pause();
            playBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    });
    
    volumeControl.addEventListener('input', (e) => {
        if (currentAudio) {
            currentAudio.volume = e.target.value;
        }
    });
}

// Play audio for a location
function playAudio(location) {
    // For demo purposes, we're simulating audio playback
    // In a real app, this would load and play actual audio files
    
    // Stop current audio if playing
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    // In a real implementation, we would load the audio file:
    // const audio = new Audio(location.audioFile);
    
    // For this demo, we'll create a simulated audio object
    const audio = {
        play: function() {
            console.log(`Playing audio for ${location.name}`);
            document.getElementById('play-btn').disabled = true;
            document.getElementById('pause-btn').disabled = false;
        },
        pause: function() {
            console.log(`Paused audio for ${location.name}`);
            document.getElementById('play-btn').disabled = false;
            document.getElementById('pause-btn').disabled = true;
        },
        volume: document.getElementById('volume').value
    };
    
    // Update UI
    document.getElementById('location-title').textContent = location.name;
    document.getElementById('play-btn').disabled = false;
    document.getElementById('pause-btn').disabled = true;
    
    // Store current audio
    currentAudio = audio;
    
    // Automatically play
    audio.play();
}

// Set up tour card functionality
function setupTourCards() {
    const tourCards = document.querySelectorAll('.tour-card');
    
    tourCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get tour type
            const tourType = card.getAttribute('data-tour');
            
            // Deactivate all cards
            tourCards.forEach(c => c.classList.remove('active-tour'));
            
            // If clicking the active tour, deselect it
            if (activeTour === tourType) {
                activeTour = null;
            } else {
                // Activate selected tour
                card.classList.add('active-tour');
                activeTour = tourType;
            }
            
            // Update markers
            addMarkers();
        });
    });
}

// Function to create folder for audio files (in a real implementation)
function createAudioDirectory() {
    // This would typically be done on the server side
    console.log('Creating audio directory...');
}