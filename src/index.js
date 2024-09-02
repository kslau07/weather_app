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
  fetchWeather(city)
    .then((json) => (weatherJson = json))
    .then((json) => (displayCityName.textContent = json.resolvedAddress));
});

const updateTimeframeButtons = (forecastPeriod) => {
  const timeFrameButtonsIterable =
    document.querySelectorAll('.timeframe-button');
  const timeFrameButtons = [...timeFrameButtonsIterable];
  timeFrameButtons.forEach((button) => {
    button.classList.remove('active');
  });

  const button = document.querySelector(`.tf-${forecastPeriod}-button`);
  button.classList.add('active');
};

const updateCardsWrapper = (forecastPeriod) => {
  const cardsWrapper = document.querySelector('.cards-wrapper');
  const template = document.querySelector(`.tf-${forecastPeriod}-template`);
  const clone = template.content.cloneNode(true);

  cardsWrapper.innerHTML = '';
  cardsWrapper.appendChild(clone);
};

const updateDisplay = (timeframeButton) => {
  const textContent = timeframeButton.textContent;
  const pattern = /^\d+/; // Match from beginning of string, 1 or more digits
  const forecastPeriod = textContent.match(pattern)[0];
  updateTimeframeButtons(forecastPeriod);
  updateCardsWrapper(forecastPeriod);
};

const timeFrameButtonsIterable = document.querySelectorAll('.timeframe-button');
const timeFrameButtons = [...timeFrameButtonsIterable];
timeFrameButtons.forEach((button) => {
  button.addEventListener('click', function () {
    updateDisplay(this);
  });
});
