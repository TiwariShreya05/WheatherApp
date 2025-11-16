// Simulated day-part weather data for all cities
const weatherData = {
  delhi: generateDayParts(25, "Clear"),
  mumbai: generateDayParts(30, "Humid"),
  chennai: generateDayParts(32, "Hot"),
  london: generateDayParts(15, "Rainy"),
  paris: generateDayParts(20, "Cloudy"),
  tokyo: generateDayParts(25, "Windy"),
  newyork: generateDayParts(18, "Foggy")
};

const apiKey = "ce85d97d544a4a8ca3944322251710"; // ✅ your API key

// Function to generate 4 day-part weather data
function generateDayParts(tempStart, desc) {
  const parts = ["Morning", "Afternoon", "Evening", "Night"];
  const hours = [];

  parts.forEach(part => {
    const temp = tempStart + Math.floor(Math.random() * 3);
    hours.push({
      hour: part,
      temp,
      high: temp + 2, // ✅ add fake high
      low: temp - 2,  // ✅ add fake low
      desc: desc,
      humidity: 50 + Math.floor(Math.random() * 30)
    });
  });

  return hours;
}

// Map weather description to emoji
function getEmoji(desc) {
  desc = desc.toLowerCase();
  if (desc.includes("sun") || desc.includes("clear") || desc.includes("hot")) return "☀️";
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("wind")) return "🌬️";
  if (desc.includes("fog")) return "🌫️";
  if (desc.includes("humid")) return "💦";
  return "🌈";
}

// Map description to background gradient
function getBackground(desc) {
  desc = desc.toLowerCase();
  if (desc.includes("sun") || desc.includes("clear") || desc.includes("hot")) return "linear-gradient(135deg, #fddb92, #d1fdff)";
  if (desc.includes("rain")) return "linear-gradient(135deg, #74ebd5, #acb6e5)";
  if (desc.includes("cloud")) return "linear-gradient(135deg, #d7d2cc, #304352)";
  if (desc.includes("wind")) return "linear-gradient(135deg, #e0eafc, #cfdef3)";
  if (desc.includes("fog")) return "linear-gradient(135deg, #e0e0e0, #cfcfcf)";
  if (desc.includes("humid")) return "linear-gradient(135deg, #a8edea, #fed6e3)";
  return "linear-gradient(135deg, #a1c4fd, #c2e9fb)";
}

// Show day-part forecast
async function showWeather() {
  const cityInput = document.getElementById("cityInput").value.trim().toLowerCase().replace(/\s/g, "");
  const result = document.getElementById("weatherResult");

  if (!cityInput) {
    alert("Please enter a city name!");
    return;
  }

  const data = weatherData[cityInput];

  if (data) {
    displayLocalWeather(cityInput, data, result);
  } else {
    // ✅ Fallback: Fetch live data from OpenWeather API
    await fetchLiveWeather(cityInput, result);
  }
}

function displayLocalWeather(cityInput, data, result) {
  document.body.style.background = getBackground(data[0].desc);

  let html = `<h2>${cityInput.charAt(0).toUpperCase() + cityInput.slice(1)}</h2>`;
  html += `<div class="hourly-forecast">`;

  data.forEach(item => {
    const emoji = getEmoji(item.desc);
    html += `
      <div class="hour-box">
        <h4>${item.hour} ${emoji}</h4>
        <p>🌡 Temp: ${item.temp}°C</p>
        <p>🔺 High: ${item.high}°C</p>
        <p>🔻 Low: ${item.low}°C</p>
        <p>💧 Humidity: ${item.humidity}%</p>
        <p>${item.desc}</p>
      </div>
    `;
  });

  html += `</div>`;
  result.innerHTML = html;
  result.style.display = "block";
}

// ✅ Function to fetch live weather if not in local data
async function fetchLiveWeather(cityInput, result) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    const cityName = data.name;
    const temp = data.main.temp;
    const desc = data.weather[0].description;
    const humidity = data.main.humidity;
    const tempMax = data.main.temp_max || temp + 2; // ✅ fallback
    const tempMin = data.main.temp_min || temp - 2; // ✅ fallback

    document.body.style.background = getBackground(desc);

    result.innerHTML = `
      <h2>${cityName} ${getEmoji(desc)}</h2>
      <div class="hour-box">
        <h4>Now</h4>
        <p>🌡 Temp: ${Math.round(temp)}°C</p>
        <p>🔺 High: ${Math.round(tempMax)}°C</p>
        <p>🔻 Low: ${Math.round(tempMin)}°C</p>
        <p>💧 Humidity: ${humidity}%</p>
        <p>${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
      </div>
    `;
    result.style.display = "block";
  } catch (error) {
    result.innerHTML = `<p>Weather data not available for "${cityInput}".</p>`;
    document.body.style.background = getBackground("");
  }
}

// Trigger showWeather on Enter key
document.getElementById("cityInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") showWeather();
});







