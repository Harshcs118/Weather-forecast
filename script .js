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

function positionSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeatherByCoordinates(lat, lon);
}

function positionError(error) {
    alert(`Unable to retrieve your location. Error code: ${error.code}, Message: ${error.message}`);
}

function fetchWeatherByCity(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
                storeRecentSearch(city);
                fetchExtendedForecast(city);
                document.getElementById('today-details').removeAttribute('hidden');
            } else {
                alert('City not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data by city:', error);
            alert('Error fetching weather data. Please try again later.');
        });
}

function fetchWeatherByCoordinates(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                console.log(`Latitude: ${lat}, Longitude: ${lon}`);
                displayWeather(data);
                fetchExtendedForecastByCoordinates(lat, lon);
                document.getElementById('today-details').removeAttribute('hidden');
            } else {
                alert('Location not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data by coordinates:', error);
            alert('Error fetching weather data. Please try again later.');
        });
}