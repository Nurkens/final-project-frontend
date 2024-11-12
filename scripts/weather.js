

async function fetchData() {
    try {
        const cityName = 'Astana';
        const apiKey = '86c33f2ccde9c230d73b0d3da5cae232';
        const lang = 'ru';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&lang=${lang}`);

        const data = await response.json();

        

        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const temperatureKelvin = data.main.temp;
        const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(0);
       

        const weatherInfoDiv = document.querySelector('.weather-img');
        weatherInfoDiv.innerHTML = `<img src="${iconUrl}" alt="Weather icon" width ="35px">`;
        
        
        document.querySelector('.temp').textContent = temperatureCelsius + "°C";
       
    } catch (error) {
        console.log(error);
    }
}



fetchData();