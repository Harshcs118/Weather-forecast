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

function displayWeather(data) {
    const cityName = data.name;
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const weatherDetails = `
        <h2 class="citydate">${cityName} - ${currentDate}</h2>
        <div class="weather-icon">
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
            <p>${data.weather[0].description}</p>
        </div>
        <div class="weather-info">
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        </div>
    `;
    document.getElementById('today-details').innerHTML = weatherDetails;
}

function fetchExtendedForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                displayExtendedForecast(data);
                document.getElementById('forecast').removeAttribute('hidden');
            } else {
                alert('City not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching extended forecast data:', error);
            alert('Error fetching extended forecast data. Please try again later.');
        });
}

function fetchExtendedForecastByCoordinates(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                displayExtendedForecast(data);
                document.getElementById('forecast').removeAttribute('hidden');
            } else {
                alert('Location not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching extended forecast data:', error);
            alert('Error fetching extended forecast data. Please try again later.');
        });
}

function displayExtendedForecast(data) {
    let forecastHTML = '';
    const forecastDays = [];
    
    // Filter to get 6 days of forecast data
    const filteredList = data.list.filter(item => {
        const forecastDate = item.dt_txt.split(' ')[0];
        if (!forecastDays.includes(forecastDate)) {
            forecastDays.push(forecastDate);
            return true;
        }
        return false;
    }).slice(0, 6); // Ensure we only get the first 6 days

    filteredList.forEach(forecast => {
        const forecastDate = forecast.dt_txt.split(' ')[0];
        forecastHTML += `
            <div class="forecast-card">
                <p>${forecastDate}</p>
                <p><img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}"></p>
                <p>Temp: ${forecast.main.temp}°C</p>
                <p>Wind: ${forecast.wind.speed} m/s</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
            </div>
        `;
    });

    const forecastContainer = document.getElementById('forecast');
    const forecastDetails = document.getElementById('forecast-details');
    forecastDetails.innerHTML = forecastHTML;

    forecastContainer.removeAttribute('hidden');
}

function storeRecentSearch(city) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (!recentSearches.includes(city)) {
        recentSearches.push(city);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
    displayRecentSearches();
}