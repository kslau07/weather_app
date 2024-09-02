import './reset.css';
import './style.css';
import Logo from './images/logo.png';

const logoImage = document.querySelector('.logo-image');
logoImage.src = Logo;
logoImage.alt = 'Logo with a cloud, sun, and rain.';

// TODO: Add error checking
// Try one of these solutions: https://stackoverflow.com/questions/54163952/async-await-in-fetch-how-to-handle-errors

// TODO: Fetch city's data and store it in a variable, which we can access without fetching again.
let weatherJson;

async function fetchWeather(city) {
  // "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=4JADYSQFJBLV5TNHBEPMXVB9Y";
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
const displayCityName = document.querySelector('.display-city-name');

buttonCity.addEventListener('click', (e) => {
  e.preventDefault();

  const city = inputCity.value;
  fetchWeather(city).then((json) => {
    const {
      currentConditions: {
        conditions: cond,
        temp,
        humidity,
        precip,
        precipprob,
      },
    } = json;
    // console.log(cond, temp, humidity, precip, precipprob);
    // display.textContent = `${cond} ${temp} ${humidity} ${precip} ${precipprob}}`;
    // console.log(data);
    // console.log(data.currentConditions);
    // display.textContent = json;
    weatherJson = json;
  });
});

const timeFrameButtonsIterable = document.querySelectorAll('.timeframe-button');
const timeFrameButtons = [...timeFrameButtonsIterable];
timeFrameButtons.forEach((button) => {
  button.addEventListener('click', function () {
    console.log(this);
    console.log(weatherJson);
  });
});
