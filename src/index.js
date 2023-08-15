import "./style.css";
import { format, formatDistance } from "date-fns";

const submitBtn = document.querySelector("#submit");
const input = document.querySelector("#location");
const form = document.querySelector("#form");

submitBtn.addEventListener("click", (e) => {
	e.preventDefault();
	if (input.value.length >= 3) {
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

form.addEventListener("submit", (e) => {
	e.preventDefault();
	form.reportValidity();
});

function fetchForecast(location) {
	fetch(
		`http://api.weatherapi.com/v1/forecast.json?key=7ed75af930ca4051994152454232007&q=${location}&days=8`,
		{
			mode: "cors",
		},
	)
		.then((response) => {
			const data = response.json();
			return data;
		})
		.then((data) => {
			displayData(data);
		})
		.catch((error) => {
			console.log(error);
		});
}

function fetchIcon(processed) {
	let icon;
	const { conditionCode } = processed;
	const { isDay } = processed;
	const sunny = [1000];
	const cloudy = [1006, 1009];
	const partCloud = [1003];
	const rain = [
		1246, 1153, 1168, 1171, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240,
		1243, 1063, 1072, 1150, 1180,
	];
	const rainThunder = [1087, 1273, 1276];
	const snow = [
		1252, 1255, 1114, 1117, 1204, 1207, 1213, 1219, 1258, 1261, 1264, 1225,
		1237, 1249, 1066, 1069, 1210, 1216, 1222, 1279, 1282,
	];
	const mist = [1030, 1135, 1147];

	if (sunny.includes(conditionCode)) {
		if (isDay) {
			icon = "./assets/sunny.svg";
		} else {
			icon = "./assets/moon.svg";
		}
	} else if (cloudy.includes(conditionCode)) {
		icon = "./assets/cloud.svg";
	} else if (partCloud.includes(conditionCode)) {
		icon = "./assets/part-cloud.svg";
	} else if (rain.includes(conditionCode)) {
		icon = "./assets/rain.svg";
	} else if (rainThunder.includes(conditionCode)) {
		icon = "./assets/rain-thunder.svg";
	} else if (snow.includes(conditionCode)) {
		icon = "./assets/snow.svg";
	} else if (mist.includes(conditionCode)) {
		icon = "./assets/mist.svg";
	}

	return { icon };
}

function currentData(data) {
	const condition = data.current.condition.text;
	const conditionCode = data.current.condition.code;
	const tempC = data.current.temp_c;
	const feelLike = data.current.feelslike_c;
	const { humidity } = data.current;
	const wind = data.current.wind_kph;
	const isDay = data.current.is_day;
	const { cloud } = data.current;
	const chanceRain = data.forecast.forecastday[0].day.daily_chance_of_rain;

	const currentDate = format(
		new Date(data.location.localtime),
		"EEEE, do MMM yy",
	);
	const currentTime = format(new Date(data.location.localtime), "h:mm a");
	const lastUpdated = formatDistance(
		new Date(data.location.localtime),
		new Date(data.current.last_updated),
	);
	const location = data.location.name;
	const { region } = data.location;
	return {
		condition,
		conditionCode,
		tempC,
		feelLike,
		humidity,
		wind,
		isDay,
		cloud,
		chanceRain,
		currentDate,
		currentTime,
		lastUpdated,
		location,
		region,
	};
}

function forecastData(data) {
	let array = data.forecast.forecastday;
	array = array.map((item) => ({
		date: item.date,
		avgTemp: item.day.avgtemp_c,
		maxTemp: item.day.maxtemp_c,
		minTemp: item.day.mintemp_c,
		chanceRain: item.day.daily_chance_of_rain,
		conditionCode: item.day.condition.code,
	}));
	return array;
}

function displayForecast(data) {
	const forecast = forecastData(data);
	forecast.shift();
	console.log(forecast);
	forecast.forEach((item, i) => {
		item.isDay = true;

		const forecastCard = document.getElementById(`${i}`);
		const dateDiv = forecastCard.children[0];
		const iconDiv = forecastCard.children[1];
		const highDiv = forecastCard.children[2];
		const avgDiv = forecastCard.children[3];
		const lowDiv = forecastCard.children[4];
		const chanceDiv = forecastCard.children[5];

		const { icon } = fetchIcon(item);
		const date = format(new Date(item.date), "EEE");

		dateDiv.innerText = date;
		iconDiv.src = icon;
		highDiv.innerText = `${item.maxTemp} °C`;
		avgDiv.innerText = `${item.avgTemp} °C`;
		lowDiv.innerText = `${item.minTemp} °C`;
		chanceDiv.innerText = `Chance of rain: ${item.chanceRain}%`;
	});
}

function displayHero(data) {
	const current = currentData(data);
	const weatherDiv = document.querySelector(".weather");
	const locationDiv = document.querySelector(".location");
	const regionDiv = document.querySelector(".region");
	const dateDiv = document.querySelector(".date");
	const timeDiv = document.querySelector(".time");
	const tempDiv = document.querySelector(".temperature");
	const iconDiv = document.querySelector(".icon");

	weatherDiv.innerText = current.condition;
	locationDiv.innerText = current.location;
	regionDiv.innerText = current.region;
	dateDiv.innerText = current.currentDate;
	timeDiv.innerText = current.currentTime;
	tempDiv.innerText = `${current.tempC} °C`;
	iconDiv.src = fetchIcon(current).icon;
}

function displaySidebar(data) {
	const current = currentData(data);
	const sidebarFeel = document.querySelector("#feels-like :nth-child(3)");
	const sidebarRain = document.querySelector("#rain-chance :nth-child(3)");
	const sidebarHumidity = document.querySelector("#humidity :nth-child(3)");
	const sidebarWind = document.querySelector("#wind :nth-child(3)");
	const sidebarCloud = document.querySelector("#cloud :nth-child(3)");
	const sidebarUpdate = document.querySelector("#last-updated :nth-child(3)");

	sidebarFeel.innerText = `${current.feelLike} °C`;
	sidebarRain.innerText = `${current.chanceRain} %`;
	sidebarHumidity.innerText = `${current.humidity} %`;
	sidebarWind.innerText = `${current.wind} kph`;
	sidebarCloud.innerText = `${current.cloud} %`;
	sidebarUpdate.innerText = `${current.lastUpdated} ago`;
}

function displayData(data) {
	const errorDiv = document.querySelector(".error-message");
	if (Object.prototype.hasOwnProperty.call(data, "error")) {
		errorDiv.innerText = `${data.error.message} Please try again...`;
	} else {
		errorDiv.innerText = "";
		displayHero(data);
		displaySidebar(data);
		displayForecast(data);
	}
}

fetchForecast("London");
