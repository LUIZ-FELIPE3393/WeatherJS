function evaluateCondition(ctx, condDisplay, conditionCodes) {
    let conArr = conditionCodes.trim().split(',');
    condDisplay.textContent = "COND:"
    let imgArr = [];

    for (let i = 0; i < conArr.length; i++) {
        switch(conArr[i]) {
            case "type_21":
                condDisplay.textContent = condDisplay.textContent.concat("|", "CHUVA");
                imgArr[i] = new Image();
                imgArr[i].src = "img/rainy.png";
            case "type_41":
                condDisplay.textContent = condDisplay.textContent.concat("|", "NUBLADO");
                imgArr[i] = new Image();
                imgArr[i].src = "img/cloudy.png";
        }
    }
    console.log(condDisplay.textContent);
    return imgArr;
}

async function getWeatherJSON() {
    try {
        const response = 
        await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
            "MANAUS/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Cdays%2Chours&" +
            "key=Y3KFJPKUUX6S8CX84GSXY9VJY&contentType=json&lang=id&unitGroup=metric", { // Here goes the URI of the API
            "method": "GET",
            "headers":{}});
        
        if (!response.ok) {
            throw new Error("ERROR - HTTP response code isn't ok");
        }
        const weather = await response.json();
        console.log("SUCCESS - Weather data fetched:", weather);
        return weather;

    } catch (error) {
        console.error("FAILURE - Weather data fetch request was a failure:", error);
    }
}

const tempDisplay = document.querySelector('.temp');
const condDisplay = document.querySelector('.condTxt');
const canvas = document.getElementById("condCnv");
let ctx = canvas.getContext("2d");

getWeatherJSON().then((res) => {
    let img = evaluateCondition(ctx, condDisplay, res.days[0].conditions);
    tempDisplay.textContent = "TEMP MIN: " + res.days[0].tempmin + "°C TEMP MAX: " + res.days[0].tempmax + "°C";

    for (let i = 0; i < img.length; i++) {
        ctx.drawImage(img[i], 10, 10);
        console.log("Imagem:" + img[i]);
    }
});
