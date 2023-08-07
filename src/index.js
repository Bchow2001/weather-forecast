import "./style.css";

const submitBtn = document.querySelector("#submit");
const input = document.querySelector("#location");
const form = document.querySelector("#form");

function fetchForecast(location) {
	fetch(
		`http://api.weatherapi.com/v1/forecast.json?key=7ed75af930ca4051994152454232007&q=${location}&days=5`,
		{
			mode: "cors",
		},
	)
		.then((response) => {
			const data = response.json();
			return data;
		})
		.then((data) => {
			const forecastData = data.forecast.forecastday;
			console.log(forecastData);
		})
		.catch((error) => {
			console.log(error);
		});
}

submitBtn.addEventListener("click", () => {
	if (input.value.length > 3) {
		fetchForecast(input.value);
	} else {
		form.reportValidity();
	}
});
