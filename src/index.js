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

async function fetchWeather(city) {
  const request = new Request(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=4JADYSQFJBLV5TNHBEPMXVB9Y`,
  );

  try {
    const response = await fetch(request, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error(error);
  }
}

const inputCity = document.getElementById('input-city');
const buttonCity = document.getElementById('button-city');

let weatherData;
const extractData = (json) => {
  const keys = Object.keys(json);

  const relevantData = keys.reduce((obj, key) => {
    const relevantKeys = ['address', 'description', 'days'];
    const relevantDays = Array.from({ length: 10 }, (_, i) => i);
    if (relevantKeys.includes(key)) {
      if (key === 'days') {
        // ---( Extract current data )---

        obj['current'] = {};
        obj['current']['conditions'] = json['days'][0]['conditions'];
        obj['current']['temp'] = json['days'][0]['temp'];
        obj['current']['icon'] = json['days'][0]['icon'];
        obj['current']['tempmax'] = json['days'][0]['tempmax'];
        obj['current']['tempmin'] = json['days'][0]['tempmin'];

        // ---( Extract hourly data )---

        const currHour = new Date().getHours(); // Only extract hours that are after the current hour
        const totalHours = 10; // Extract data for each of next 10 hours only
        obj['hours'] = [];

        let nthHour = 0;
        while (nthHour < totalHours) {
          // For the hourly forecast, forecast the next 10 hours. If that crosses into tomorrow, use tomorrow's data, which will be index: 1.
          const daysIndex = currHour + nthHour < 24 ? 0 : 1;
          const hourIndex = (currHour + nthHour) % 24; // Start back at 0 if more than 24
          const hour = {};
          hour['datetime'] = json.days[daysIndex].hours[hourIndex]['datetime'];
          hour['icon'] = json.days[daysIndex].hours[hourIndex]['icon'];
          hour['precipprob'] =
            json.days[daysIndex].hours[hourIndex]['precipprob'];
          hour['temp'] = json.days[daysIndex].hours[hourIndex]['temp'];
          obj['hours'].push(hour);

          nthHour = nthHour + 1;
        }

        // ---( Extract daily data )---

        obj['days'] = [];
        relevantDays.forEach((i) => {
          obj['days'][i] = {};
          obj['days'][i]['datetime'] = json['days'][i]['datetime'];
          obj['days'][i]['icon'] = json['days'][i]['icon'];
          obj['days'][i]['precipprob'] = json['days'][i]['precipprob'];
          obj['days'][i]['tempmax'] = json['days'][i]['tempmax'];
          obj['days'][i]['tempmin'] = json['days'][i]['tempmin'];
          obj['days'][i]['temp'] = json['days'][i]['temp'];
        });
      } else {
        // Top level keys: 'address', 'description', etc.
        obj[key] = json[key];
      }
    }

    return obj;
  }, {});

  console.log(relevantData); // FIXME: DELETE ME
  weatherData = relevantData;
};

buttonCity.addEventListener('click', (e) => {
  e.preventDefault();

  const city = inputCity.value;
  fetchWeather(city)
    .then((response) => response.json())
    .then((json) => {
      extractData(json);
    })
    .then(() => {
      updateDisplay();
    })
    .catch((error) => console.error(error));
});

const capitalizeCity = (string) => {
  const capitalized = string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return capitalized;
};

const updateSectionTop = () => {
  const { current } = weatherData;
  const sectionTop = document.querySelector('.section-top');
  const city = sectionTop.querySelector('.city');
  const temp = sectionTop.querySelector('.temp');
  const high = sectionTop.querySelector('.high');
  const low = sectionTop.querySelector('.low');
  const conditions = sectionTop.querySelector('.conditions');
  const capitalizedCity = capitalizeCity(weatherData.address);

  document.body.className = `${current.icon}`; // Update bg image
  city.textContent = capitalizedCity;
  temp.textContent = `${current.temp}°`;
  conditions.textContent = current.conditions.split(', ')[0]; // Take first condition
  high.textContent = `H: ${current.tempmax}°`;
  low.textContent = `L: ${current.tempmin}°`;
};

const getIconMarkup = (iconName) => {
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

  if (sunnyArr.includes(iconName)) {
    return "<box-icon name='sun' type='solid' color='white'></box-icon>";
  } else if (rainyArr.includes(iconName)) {
    return "<box-icon name='cloud-rain' type='solid' color='white'></box-icon>";
  } else if (cloudyArr.includes(iconName)) {
    return "<box-icon name='cloud' type='solid' color='white'></box-icon>";
  } else if (snowyArr.includes(iconName)) {
    return "<box-icon name='cloud-snow' color='white'></box-icon>";
  } else if (thunderArr.includes(iconName)) {
    return "<box-icon name='cloud-lightning' type='solid' color='white'></box-icon>";
  }
};

function getDayName(dateStr, locale) {
  var date = new Date(dateStr);
  return date.toLocaleDateString(locale, { weekday: 'short' });
}

function getTimeSimple(timeStr, locale) {
  // Time example is unix epoch: '1970-01-01T00:00:00Z'
  const timeString12hr = new Date(
    '1970-01-01T' + timeStr + 'Z',
  ).toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });

  const hour = timeString12hr.slice(0, -6);
  const period = timeString12hr.slice(-2);
  return String.prototype.concat(hour, period);
}

const populateHourClone = (clone, hoursIdx) => {
  const json = weatherData;
  const label = clone.querySelector('.one-hour-label');
  const icon = clone.querySelector('.one-hour-icon');
  const precipprob = clone.querySelector('.one-hour-precipprob');
  const temp = clone.querySelector('.one-hour-temp');

  // hours[0].datetime
  const timeStr = json.hours[hoursIdx].datetime;
  const time = hoursIdx === 0 ? 'Now' : getTimeSimple(timeStr, 'en-US');
  label.textContent = time;
  const iconHtml = getIconMarkup(json.days[hoursIdx].icon);
  icon.innerHTML = iconHtml;
  precipprob.textContent = `${Math.round(json.days[hoursIdx].precipprob)}%`;
  temp.textContent = `${Math.round(json.days[hoursIdx].temp)}°`;
  return clone;
};

const populateDayClone = (clone, daysIdx) => {
  const json = weatherData;
  const targetDay = json.days[daysIdx];
  const label = clone.querySelector('.one-day-label');
  const icon = clone.querySelector('.one-day-icon');
  const precipprob = clone.querySelector('.one-day-precipprob');
  const high = clone.querySelector('.one-day-high');
  const low = clone.querySelector('.one-day-low');

  const date = targetDay.datetime;
  const dayName = daysIdx === 0 ? 'Now' : getDayName(date, 'en-US');
  label.textContent = dayName;
  const iconHtml = getIconMarkup(targetDay.icon);
  icon.innerHTML = iconHtml;
  precipprob.textContent = `${Math.round(targetDay.precipprob)}%`;
  high.textContent = `High: ${Math.round(targetDay.tempmax)}°`;
  low.textContent = `Low: ${Math.round(targetDay.tempmin)}°`;
  return clone;
};

const updateSectionMiddle = () => {
  const json = weatherData;
  const sectionMiddle = document.querySelector('.section-middle');
  const description = sectionMiddle.querySelector('.description');
  description.textContent = json.description;

  const hourlyForecastWrapper = sectionMiddle.querySelector(
    '.hourly-forecast-wrapper',
  );
  hourlyForecastWrapper.innerHTML = '';

  json.hours.forEach((item, hoursIdx) => {
    const oneHourTemplate = sectionMiddle.querySelector('.one-hour-template');
    const clone = oneHourTemplate.content.cloneNode(true).children[0];
    const populatedClone = populateHourClone(clone, hoursIdx);
    hourlyForecastWrapper.appendChild(populatedClone);
  });
};

const updateSectionBottom = () => {
  const json = weatherData;
  const sectionBottom = document.querySelector('.section-bottom');
  const label = sectionBottom.querySelector('.extended-forecast-label');

  const extendedForecastWrapper = sectionBottom.querySelector(
    '.extended-forecast-wrapper',
  );
  extendedForecastWrapper.innerHTML = '';

  json.days.forEach((item, daysIdx) => {
    const oneDayTemplate = sectionBottom.querySelector('.one-day-template');
    const clone = oneDayTemplate.content.cloneNode(true).children[0];
    const populatedClone = populateDayClone(clone, daysIdx);
    extendedForecastWrapper.appendChild(populatedClone);
  });
};

const updateDisplay = () => {
  updateSectionTop();
  updateSectionMiddle();
  updateSectionBottom();
};

// setTimeout(updateDisplay, 500); // FIXME: DELETE ME (development only)
