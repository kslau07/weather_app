import "./style.css";

// TODO: Add error checking
// Try one of these solutions: https://stackoverflow.com/questions/54163952/async-await-in-fetch-how-to-handle-errors

async function fetchData(query) {
  // "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=4JADYSQFJBLV5TNHBEPMXVB9Y";
  const request = new Request(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=4JADYSQFJBLV5TNHBEPMXVB9Y`,
  );

  try {
    const response = await fetch(request, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}

const inputCity = document.getElementById("input-city");
const buttonCity = document.getElementById("button-city");
const display = document.querySelector(".display");

let london;

buttonCity.addEventListener("click", (e) => {
  e.preventDefault();

  const city = inputCity.value;
  fetchData(city).then((data) => {
    console.log(data.currentConditions);
    // display.textContent = json;
  });
});
