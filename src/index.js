import './reset.css';
import './style.css';
import Logo from './images/logo.png';
import Sunny from './images/sunny.jpg';
import 'boxicons';

const logoImage = document.querySelector('.logo-image');
logoImage.src = Logo;
logoImage.alt = 'Logo with a cloud, sun, and rain.';

// TODO: Add error checking
// Try one of these solutions: https://stackoverflow.com/questions/54163952/async-await-in-fetch-how-to-handle-errors

let weatherJson; // cache results

// Example json, saved locally
// import london from './london.json'; // FIXME: DELETE ME
// weatherJson = london; // FIXME: DELETE ME
// console.log(london); // FIXME: DELETE ME
import seattle from './seattle.json';
weatherJson = seattle;
console.log(seattle);

async function fetchWeather(city) {
  const request = new Request(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=4JADYSQFJBLV5TNHBEPMXVB9Y`,
  );

  try {
    const response = await fetch(request, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}

const inputCity = document.getElementById('input-city');
const buttonCity = document.getElementById('button-city');

buttonCity.addEventListener('click', (e) => {
  e.preventDefault();

  const city = inputCity.value;
  fetchWeather(city)
    .then((json) => (weatherJson = json))
    .then(() => updateDisplay());
});

const capitalizeCity = (string) => {
  const capitalized = string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return capitalized;
};

const updateSectionTop = () => {
  const current = weatherJson.days[0];
  const sectionTop = document.querySelector('.section-top');
  const city = sectionTop.querySelector('.city');
  const temp = sectionTop.querySelector('.temp');
  const high = sectionTop.querySelector('.high');
  const low = sectionTop.querySelector('.low');
  const conditions = sectionTop.querySelector('.conditions');
  const capitalizedCity = capitalizeCity(weatherJson.address);

  document.body.className = `${current.icon}`;
  city.textContent = capitalizedCity;
  temp.textContent = `${current.temp}°`;
  conditions.textContent = current.conditions.split(', ')[0]; // Take first condition
  high.textContent = `H: ${current.tempmax}°`;
  low.textContent = `L: ${current.tempmin}°`;
};

const oneHourIcon = (iconName) => {
  const sunnyArr = ['sunny', 'clear-day', 'clear-night', 'wind'];

  const rainyArr = [
    'rain',
    'rain-snow-showers-day',
    'rain-snow-showers-night',
    'rain-snow',
    'rain',
    'showers-day',
    'showers-night',
    'sleet',
  ];

  const cloudyArr = [
    'cloudy',
    'fog',
    'hail',
    'partly-cloudy-day',
    'partly-cloudy-night',
  ];

  const snowyArr = ['snow-showers-day', 'snow-showers-night', 'snow'];

  const thunderArr = [
    'thunder-rain',
    'thunder-showers-day',
    'thunder-showers-night',
    'thunder',
  ];
};

const updateSectionMiddle = () => {
  const current = weatherJson.days[9];
  const sectionMiddle = document.querySelector('.section-middle');
  const description = sectionMiddle.querySelector('.description');
  description.textContent = current.description;

  const hourlyForecastWrapper = sectionMiddle.querySelector(
    '.hourly-forecast-wrapper',
  );
  const oneHourTemplate = sectionMiddle.querySelector('.one-hour-template');
  const clone = oneHourTemplate.content.cloneNode(true).children[0];
  const label = clone.querySelector('.one-hour-label');
  const icon = clone.querySelector('.one-hour-icon');
  const precipprob = clone.querySelector('.one-hour-precipprob');
  const temp = clone.querySelector('.one-hour-temp');

  label.textContent = 'Now';
  // icon.textContent = weatherJson.days[0].icon;
  icon.innerHTML = '<box-icon name="rocket"></box-icon>';
  precipprob.textContent = `${Math.round(current.precipprob)}%`;
  temp.textContent = `${Math.round(current.temp)}°`;

  hourlyForecastWrapper.appendChild(clone);
};

const updateSectionBottom = () => {};

const updateDisplay = () => {
  updateSectionTop();
  updateSectionMiddle();
};

setTimeout(updateDisplay, 500); // FIXME: DELETE ME (development only)
