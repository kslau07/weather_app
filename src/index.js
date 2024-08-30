import './style.css';
import Logo from './images/logo.png';

const logo = document.querySelector('.logo');
logo.src = Logo;
logo.alt = 'Logo with a cloud, sun, and rain.';

// TODO: Add error checking
// Try one of these solutions: https://stackoverflow.com/questions/54163952/async-await-in-fetch-how-to-handle-errors

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
const display = document.querySelector('.display');

buttonCity.addEventListener('click', (e) => {
  e.preventDefault();

  const city = inputCity.value;
  fetchWeather(city).then((data) => {
    const {
      currentConditions: {
        conditions: cond,
        temp,
        humidity,
        precip,
        precipprob,
      },
    } = data;
    // console.log(cond, temp, humidity, precip, precipprob);
    // display.textContent = `${cond} ${temp} ${humidity} ${precip} ${precipprob}}`;
    console.log(data);
    // console.log(data.currentConditions);
    // display.textContent = json;
  });
});
