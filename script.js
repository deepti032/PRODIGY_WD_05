const apiKey = "YOUR_API_KEY_HERE";

const loading = document.getElementById("loading");
const errorText = document.getElementById("error");

function showLoading(show) {
  loading.classList.toggle("hidden", !show);
}

function showError(message) {
  errorText.innerText = message;
  errorText.classList.remove("hidden");
}

function clearError() {
  errorText.classList.add("hidden");
}

function displayWeather(data) {
  document.getElementById("weatherResult").classList.remove("hidden");

  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temperature").innerText =
    `${Math.round(data.main.temp)}°C`;

  document.getElementById("condition").innerText =
    data.weather[0].description;

  document.getElementById("humidity").innerText =
    `💧 ${data.main.humidity}%`;

  document.getElementById("wind").innerText =
    `🌬 ${data.wind.speed} m/s`;

  const icon = data.weather[0].icon;
  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

async function fetchWeather(url) {
  try {
    showLoading(true);
    clearError();

    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      showError("City not found ❌");
      return;
    }

    displayWeather(data);
  } catch (err) {
    showError("Something went wrong ⚠️");
  } finally {
    showLoading(false);
  }
}

function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();

  if (!city) {
    showError("Enter a city name");
    return;
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetchWeather(url);
}

function getWeatherByLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;

    const url =
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    fetchWeather(url);
  });
}

// 🔥 Press Enter to search
document
  .getElementById("cityInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      getWeatherByCity();
    }
  });
