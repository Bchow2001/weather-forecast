import "./style.css";

const submitBtn = document.querySelector("#submit");
const input = document.querySelector("#location");
const form = document.querySelector("#form");

function fetchForecast(location) {
	fetch(
		`http://api.weatherapi.com/v1/forecast.json?key=7ed75af930ca4051994152454232007&q=${location}&days=7`,
		{
			mode: "cors",
		},
	)
		.then((response) => {
			const data = response.json();
			return data;
		})
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.log(error);
		});
}

submitBtn.addEventListener("click", (e) => {
	e.preventDefault();
	if (input.value.length > 3) {
		fetchForecast(input.value);
	} else {
		form.reportValidity();
	}
});

input.addEventListener("keyup", (e) => {
	e.preventDefault();
	if (e.keyCode === 13) {
		submitBtn.click();
	}
});

function displayData(data) {
	if (Object.prototype.hasOwnProperty.call(data, "error")) {
		alert(data.error.message);
	}
}
