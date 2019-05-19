const searchElement = document.querySelector('[data-city-search]');
const searchBox = new google.maps.places.SearchBox(searchElement);

searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0];
  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();

  if (place == null) return;

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
    .then(data => {
      setWeather(data, place.formatted_address);
    });
});

const locationEl = document.querySelector('[data-location]');
const timeEl = document.querySelector('[data-time]');
const temperatureEl = document.querySelector('[data-temperature]');
const precipitationEl = document.querySelector('[data-precipitation]');
const humidityEl = document.querySelector('[data-humidity]');
const windEl = document.querySelector('[data-wind]');
const skycons = new Skycons({color: '#263238'});

skycons.set('icon', 'clear-day');
skycons.play();

function setWeather(data, place) {
  const date = new Date(data.time * 1000);
  const day = date.getDay();
  const weekDays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const hours = date.getHours();
  const minutes = `0${date.getMinutes()}`;
  const formattedTime = `${weekDays[day]} ${hours}:${minutes.substr(-2)}`;

  locationEl.textContent = place;
  timeEl.textContent = formattedTime;
  temperatureEl.innerHTML = data.temperature.toFixed(0) + '<span class="cels">°C</span>';
  precipitationEl.textContent = `${data.precipProbability * 100}%`;
  humidityEl.textContent = `${data.humidity.toFixed(1) * 100}%`;
  windEl.textContent = data.windSpeed.toFixed(1) + ' м/с';

  skycons.set('icon', data.icon);
  skycons.play();
}
