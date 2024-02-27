async function getWeatherJSON() {
    try {
        const response = 
        await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/" +
        "rest/services/timeline/Manaus/2024-02-27T16:00:00?key=Y3KFJPKUUX6S8CX84GSXY9VJY", { // Here goes the URL of the API
            "method": "GET",
            "headers":{}});
        
        if (!response.ok) {
            throw new Error("ERROR - HTTP response code isn't ok");
        }
        console.log("SUCCESS - Weather data fetched:", response);
        const weather = await response.json();
        return weather;

    } catch (error) {
        console.error("FAILURE - Weather data fetch request was a failure:", error);
    }
}

const weatherDisplay = document.querySelector('.weatherDisplay');

getWeatherJSON().then((res) => {
    console.log(res.days[0].temp);
    weatherDisplay.textContent = "TEMP: " + res.days[0].temp + " MIN: " + res.days[0].tempmin + " MAX: " + res.days[0].tempmax;
});


