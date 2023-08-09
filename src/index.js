import "./style.css";
import { format, formatDistance } from "date-fns";

const submitBtn = document.querySelector("#submit");
const input = document.querySelector("#location");
const form = document.querySelector("#form");

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
			displayData(data);
		})
		.catch((error) => {
			console.log(error);
		});
}

function currentData(data) {
	const condition = data.current.condition.text;
	const tempC = data.current.temp_c;
	const feelLike = data.current.feelslike_c;
	const { humidity } = data.current;
	const wind = data.current.wind_kph;
	const isDay = data.current.is_day;
	const { cloud } = data.current;
	const chanceRain = data.forecast.forecastday[0].day.daily_chance_of_rain;
	const lastDate = format(
		new Date(data.current.last_updated),
		"EEEE, do MMM ''yy",
	);
	const lastTime = format(new Date(data.current.last_updated), "h:mm a");
	const currentDate = format(
		new Date(data.location.localtime),
		"EEEE, do MMM ''yy",
	);
	const currentTime = format(new Date(data.location.localtime), "h:mm a");
	const lastUpdated = formatDistance(
		new Date(data.location.localtime),
		new Date(data.current.last_updated),
	);
	const location = data.location.name;
	return {
		condition,
		tempC,
		feelLike,
		humidity,
		wind,
		isDay,
		cloud,
		chanceRain,
		lastDate,
		lastTime,
		currentDate,
		currentTime,
		lastUpdated,
		location,
	};
}

function forecastData(data) {
	let array = data.forecast.forecastday;
	array = array.map((item) => ({
		avgTemp: item.day.avgtemp_c,
		maxTemp: item.day.maxtemp_c,
		minTemp: item.day.mintemp_c,
		chanceRain: item.day.daily_chance_of_rain,
		condition: item.day.condition.text,
	}));
	return { array };
}

function displayHero(data) {
	const current = currentData(data);
	const weatherDiv = document.querySelector(".weather");
	const locationDiv = document.querySelector(".location");
	const dateDiv = document.querySelector(".date");
	const timeDiv = document.querySelector(".time");
	const tempDiv = document.querySelector(".temperature");
	const iconDiv = document.querySelector(".icon");

	weatherDiv.innerText = current.condition;
	locationDiv.innerText = current.location;
	dateDiv.innerText = current.currentDate;
	timeDiv.innerText = current.currentTime;
	tempDiv.innerText = current.tempC;
}

function displayData(data) {
	if (Object.prototype.hasOwnProperty.call(data, "error")) {
		alert(data.error.message);
	} else {
		displayHero(data);
	}
}
