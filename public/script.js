const searchElement = document.querySelector('[data-city-search]');
const searchBox = new google.maps.places.SearchBox(searchElement);

searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0];
  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();

  if (!place) return;

  fetch('/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        latitude,
        longitude
      })
    })
    .then(res => res.json())
    .then(data => setWeather(data, place.formatted_address));
});

const skycons = new Skycons({color: '#263238'});

const setIcon = () => {
  // set default icon
  skycons.set('icon', 'clear-day');
  skycons.play();
}
  
setIcon();

const setWeather = (data, place) => {
  // set place
  const locationEl = document.querySelector('[data-location]');

  locationEl.textContent = place;

  // set current time
  const date = new Date(data.currently.time * 1000);
  const day = date.getDay();
  const weekDays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const hours = date.getHours();
  const minutes = `0${date.getMinutes()}`;
  const formattedTime = `${weekDays[day]} ${hours}:${minutes.substr(-2)}`;
  const timeEl = document.querySelector('[data-time]');
  
  timeEl.textContent = formattedTime;

  // set current weather
  const temperatureEl = document.querySelector('[data-temperature]');
  const precipitationEl = document.querySelector('[data-precipitation]');
  const humidityEl = document.querySelector('[data-humidity]');
  const windEl = document.querySelector('[data-wind]');

  temperatureEl.innerHTML = data.currently.temperature.toFixed(0) + '<span class="cels">°C</span>';
  precipitationEl.textContent = `${data.currently.precipProbability.toFixed(1) * 100}%`;
  humidityEl.textContent = `${data.currently.humidity.toFixed(1) * 100}%`;
  windEl.textContent = data.currently.windSpeed.toFixed(1) + ' м/с';

  // set weather for next 2 days
  const temperatureEl_1 = document.querySelector('[data-temperature-1]');
  const temperatureEl_2 = document.querySelector('[data-temperature-2]');

  temperatureEl_1.innerHTML = data.daily.data[1].temperatureMax.toFixed(0) + '°/';
  temperatureEl_1.innerHTML += data.daily.data[1].temperatureMin.toFixed(0) + '°';
  temperatureEl_2.innerHTML = data.daily.data[2].temperatureMax.toFixed(0) + '°/';
  temperatureEl_2.innerHTML += data.daily.data[2].temperatureMin.toFixed(0) + '°';

  // set icon for current weather
  skycons.set('icon', data.currently.icon);
  skycons.play();
}

const setBackgroundImg = () => {
  // set background img depending on the time of day
  const date = new Date();
  const time = date.getHours();

  if (time >= 4 && time < 6) {
    document.body.style.backgroundImage = 'url("https://i.imgur.com/LDrziA8.png")';
  } else if (time >= 6 && time < 17) {
    document.body.style.backgroundImage = 'url("https://i.imgur.com/NmEbOyt.png")';
  } else if (time >= 17 && time < 23) {
    document.body.style.backgroundImage = 'url("https://i.imgur.com/gb6EyHk.png")';
  } else {
    document.body.style.backgroundImage = 'url("https://i.imgur.com/K5PvLLE.png")';
  }
}

setBackgroundImg();
