const apiKey = 'afb74f18960edf1f35f054ff1666ef17';

document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        alert('Please enter a city name.');
    }
});

document.getElementById('current-location-button').addEventListener('click', function() {
    getCurrentLocation();
});

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionSuccess, positionError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}