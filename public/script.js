const locationEl = document.querySelector('[data-location]'),
      timeEl = document.querySelector('[data-time]'),
      temperatureEl = document.querySelector('[data-temperature]'),
      precipitationEl = document.querySelector('[data-precipitation]'),
      humidityEl = document.querySelector('[data-humidity]'),
      windEl = document.querySelector('[data-wind]'),
      searchElement = document.querySelector('[data-city-search]')

const searchBox = new google.maps.places.SearchBox(searchElement)

searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0]
  if (place == null) return
  const latitude = place.geometry.location.lat()
  const longitude = place.geometry.location.lng()

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
  .then(data => {setWeather(data, place.formatted_address)})
})

const icon = new Skycons({
  color: '#263238'
})

icon.set('icon', 'clear-day')
icon.play()

function setWeather(data, place) {
  const date = new Date(data.time * 1000)
  const day = date.getDay()
  const weekDays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
  const hours = date.getHours()
  const minutes = `0${date.getMinutes()}`
  const seconds = `0${date.getSeconds()}`
  const formattedTime = `${weekDays[day]} ${hours}:${minutes.substr(-2)}`

  locationEl.textContent = place
  timeEl.textContent = formattedTime
  temperatureEl.innerHTML = data.temperature + '<span class="cels">°C</span>'
  precipitationEl.textContent = `${data.precipProbability * 100}%`
  humidityEl.textContent = `${data.humidity * 100}%`
  windEl.textContent = data.windSpeed + ' м/с'

  icon.set('icon', data.icon)
  icon.play()
}
