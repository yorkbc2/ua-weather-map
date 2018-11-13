(function () {
	let map;
	const iconUrl = "http://openweathermap.org/img/w/%s.png";
	const fetchUrl = "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=61d393fc9a8e5d6e7bd1b9d10c1b8165";
	const markers = [];

	window.init = () => {
		
		map = new google.maps.Map(document.getElementById('map'), {
	      center: {
	        lat: 50.45,
	        lng: 30.52
	      },
	      zoom: 7
	    });
		const cities = [
			'Kyiv',
			'Vinnytsia',
			'Kharkiv',
			'Lviv',
			'Donetsk',
			'Zhytomyr',
			'Dnipro',
			'Mykolaiv',
			'Kherson'
		];
		recursiveFetchData( fetchUrl, cities, fetchEnd );
	}

	const fetchData = (url, callback) => {
		return fetch(url)
			.then(response => response.json())
			.then(data => {
				callback(data);
			});
	};

	const recursiveFetchData = (url, arrayOfKeys, callback) => {
		arrayOfKeys.forEach(key => {
			fetchData( prepare(url, key), callback );
		});
	};

	const fetchEnd = (data) => {
		markers.push(data);

		let marker = appendMarker(parseOpenWeatherApiResponse(data, {
			icon: iconUrl
		}));
		
		marker.addListener("click", () => {
			alert(`
Місто: ${data.name}
Температура: ${kelvinToCelsium(data.main.temp)}
Захід сонця: ${timeFromTimestamp(data.sys.sunset)}
Схід сонця: ${timeFromTimestamp(data.sys.sunrise)}`);
		});
	};

	const appendMarker = options => {
		return new google.maps.Marker({
			map: map,
			position: {
		      lat: parseFloat(options.lat),
		      lng: parseFloat(options.lon)
		    },
		    title: options.title,
		    icon: {
		    	url: options.icon
		    }
		});
	};

	const parseOpenWeatherApiResponse = (response, options) => {
		let icon = response.weather[0].icon;
		if (options) {
			icon = prepare((options.icon || "%s"), response.weather[0].icon);
		}
		return {
			lat: response.coord.lat,
			lon: response.coord.lon,
			title: response.name,
			icon: icon
		};
	};

	const prepare = (str, param) => str.replace("%s", param);

	const kelvinToCelsium = k => Math.floor(k - 273);

	const timeFromTimestamp = timestamp => {
		let d = new Date(timestamp * 1000);

		return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
	}
}())