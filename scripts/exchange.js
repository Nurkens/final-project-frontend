async function fetchExchange(){
    try {
        const apiKey = 'caf069d8f08712ea60403d6c';
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/KZT`);
        const data = await response.json();
        const conversionRates = data.conversion_rates;
        
        const ratesInTenge = {};

        for (const currency in conversionRates) {
            ratesInTenge[currency] = 1 / conversionRates[currency];  
        }

     
        document.querySelector('.dollar').textContent = ratesInTenge.USD.toFixed(2); 
        document.querySelector('.euro').textContent = ratesInTenge.EUR.toFixed(2);   
        document.querySelector('.ruble').textContent = ratesInTenge.RUB.toFixed(2);    

        
    } catch (error) {
        console.log(error);
    }
}

fetchExchange();
