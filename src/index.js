import './reset.css';
import './style.css';
import Logo from './images/logo.png';
import Sunny from './images/sunny.jpg';

const logoImage = document.querySelector('.logo-image');
logoImage.src = Logo;
logoImage.alt = 'Logo with a cloud, sun, and rain.';

// TODO: Add error checking
// Try one of these solutions: https://stackoverflow.com/questions/54163952/async-await-in-fetch-how-to-handle-errors

// TODO: Fetch city's data and store it in a variable, which we can access without fetching again.
let weatherJson;

// Example json, saved locally
import london from './london.json'; // FIXME: DELETE ME
weatherJson = london; // FIXME: DELETE ME
console.log(london); // FIXME: DELETE ME

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

const updateDisplay = () => {
  console.log(weatherJson);
  const display = document.querySelector('.display');
  const current = weatherJson.days[0];
  const city = display.querySelector('.city');
  const temp = display.querySelector('.temp');
  const high = display.querySelector('.high');
  const low = display.querySelector('.low');
  const conditions = display.querySelector('.conditions');
  const description = display.querySelector('.description');
  const capitalizedCity = capitalizeCity(weatherJson.address);

  console.log(`icon name: ${current.icon}`);
  document.body.className = `${current.icon}`;
  city.textContent = capitalizedCity;
  temp.textContent = current.temp;
  conditions.textContent = current.conditions.split(', ')[0]; // Take first condition
  high.textContent = current.tempmax;
  low.textContent = current.tempmin;
  description.textContent = current.description;
};

setTimeout(updateDisplay, 1000); // FIXME: DELETE ME (development only)
