import "./style.css";

function fetchForecast(location) {
	fetch(
		`http://api.weatherapi.com/v1/forecast.json?key=7ed75af930ca4051994152454232007&q=${location}`,
		{
			mode: "cors",
		},
	).then((response) => {
		const data = response.json();
		console.log(data);
	});
}

fetchForecast("london");
