const API_KEY = "c9ac18ab850157ba837c5cf01b5f8cd5";
let city = localStorage.getItem("city") || "Tbilisi";
let unit = localStorage.getItem("unit") || "metric";

async function fetchJSON(url) {
  const loader = document.getElementById("loader");
  const errorMsg = document.getElementById("errorMsg");

  if (loader) loader.style.display = "block";
  if (errorMsg) errorMsg.textContent = "";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    
    if (loader) loader.style.display = "none";
    return data;

  } catch (error) {
    console.error(error);
    if (loader) loader.style.display = "none";
    if (errorMsg) errorMsg.textContent = "City not found. Please try again.";
    return null;
  }
}

async function loadToday() {
  const data = await fetchJSON(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`
  );
  if(!data) return;

  document.getElementById("city").textContent = data.name;
  document.getElementById("temp").textContent = Math.round(data.main.temp);
  document.getElementById("humidity").textContent = data.main.humidity + "%";
  document.getElementById("pressure").textContent = data.main.pressure + " hPa";
  document.getElementById("wind").textContent = data.wind.speed + " m/s";
  document.getElementById("visibility").textContent = (data.visibility / 1000) + " km";
  document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  document.getElementById("date").textContent = new Date().toDateString();

  loadHourly();
}

async function loadHourly() {
  const data = await fetchJSON(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
  );
  if(!data) return;

  const hourlyContainer = document.getElementById("hourly");
  if(hourlyContainer) {
    hourlyContainer.innerHTML = data.list.slice(0, 8).map(item => `
      <div>
        <p>${item.dt_txt.slice(11,16)}</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
        <b>${Math.round(item.main.temp)}°</b>
      </div>
    `).join("");
  }
}

async function loadTomorrow() {
  const data = await fetchJSON(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
  );
  if(!data) return;

  const today = new Date().getDate();
  
  const tomorrowList = data.list.filter(item => {
    const itemDate = new Date(item.dt_txt).getDate();
    return itemDate !== today;
  });

  let tomorrow = tomorrowList.find(item => item.dt_txt.includes("12:00:00"));
  if (!tomorrow && tomorrowList.length > 0) tomorrow = tomorrowList[0];

  if (tomorrow) {
    document.getElementById("t-city").textContent = city;
    document.getElementById("t-date").textContent = new Date(tomorrow.dt_txt).toDateString();
    document.getElementById("t-temp").textContent = Math.round(tomorrow.main.temp);
    document.getElementById("t-humidity").textContent = tomorrow.main.humidity + "%";
    document.getElementById("t-pressure").textContent = tomorrow.main.pressure + " hPa";
    document.getElementById("t-wind").textContent = tomorrow.wind.speed + " m/s";
    document.getElementById("t-desc").textContent = tomorrow.weather[0].description;
    document.getElementById("t-icon").src = `https://openweathermap.org/img/wn/${tomorrow.weather[0].icon}@4x.png`;
  }
}

async function loadMonthly() {
  const data = await fetchJSON(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
  );
  if(!data) return;

  const days = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  document.getElementById("monthly").innerHTML = days.map(d => `
      <article class="forecast-card">
        <h3>${new Date(d.dt_txt).toLocaleDateString(undefined, {weekday: 'long'})}</h3>
        <p>${new Date(d.dt_txt).toLocaleDateString()}</p>
        <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png">
        <h2>${Math.round(d.main.temp)}°</h2>
        <p>${d.weather[0].description}</p>
      </article>
    `).join("");
}