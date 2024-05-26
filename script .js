const apiKey = 'afb74f18960edf1f35f054ff1666ef17'; // Replace with your actual OpenWeatherMap API key

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

function displayRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    const recentSearchesContainer = document.getElementById('recent-searches');
    recentSearchesContainer.innerHTML = '<option value="">Select a recent city</option>';
    recentSearches.forEach(city => {
        const optionElement = document.createElement('option');
        optionElement.textContent = city;
        optionElement.value = city;
        recentSearchesContainer.appendChild(optionElement);
    });// user api key from openweatherapp
    const apiKey = 'afb74f18960edf1f35f054ff1666ef17'; 
    
    // fuction for task to do for search button on click
    document.getElementById('search-button').addEventListener('click', function() {
        const city = document.getElementById('city-input').value.trim();
        if (city) {
            fetchWeatherByCity(city);
        } else {
            alert('Please enter a city name.');
        }
    });
    
    // fuction for task to do for current location button
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
    
    
    //fuction for taking latitudes and longitudes
    function positionSuccess(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoordinates(lat, lon);
    }
    
    //fuction for display alert message, if location not retrieve through latitudes and longitudes
    function positionError(error) {
        alert(`Unable to retrieve your location. Error code: ${error.code}, Message: ${error.message}`);
    }
    
    //function to display weather data by cityname and to display error if city not found
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
    
    //function to display data fetch by longitudes and latitudes for user location button and to display error if location not found
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
    
    //display the weather data like temp, humidity, wind speed 
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
    
    
    //fuction to fetch 5 days weather forecast by searching city name
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
    
    //fuction to fetch 5 days weather forecast by searching for user location
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
    
    
    //fuction to display extended forecast data
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
        }).slice(0, 6); // Ensure we only get the first 6 days including today
    
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
    
    
    //fuction to store the recent searched cities name in dropdown menu
    function storeRecentSearch(city) {
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        if (!recentSearches.includes(city)) {
            recentSearches.push(city);
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        }
        displayRecentSearches();
    }
    
    //function to display recent searched cities name in dropdown menu
    function displayRecentSearches() {
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        const recentSearchesContainer = document.getElementById('recent-searches');
        recentSearchesContainer.innerHTML = '<option value="">Select a recent city</option>';
        recentSearches.forEach(city => {
            const optionElement = document.createElement('option');
            optionElement.textContent = city;
            optionElement.value = city;
            recentSearchesContainer.appendChild(optionElement);
        });
    }
    
    
    //function to handle the selection of recent searched cities name
    function handleRecentSearchSelection(event) {
        const city = event.target.value;
        if (city) {
            fetchWeatherByCity(city);
        }
    }
    
    displayRecentSearches();
}

function handleRecentSearchSelection(event) {
    const city = event.target.value;
    if (city) {
        fetchWeatherByCity(city);
    }
}

displayRecentSearches();
