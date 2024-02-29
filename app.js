function evaluateCondition(condDisplay, conditionCodes) {
    let conArr = conditionCodes.replace(' ', '').split(',');
    condDisplay.textContent = "COND:"
    let imgArr = [];
    const time = new Date();

    if (time.getHours() >= 18 || time.getHours() < 6) {
        imgArr[0] = new Image();
        imgArr[0].src = "img/night.png";
    } else {
        imgArr[0] = new Image();
        imgArr[0].src = "img/sunny.png";
    }

    for (let i = 1; i < conArr.length + 1; i++) {
        switch (conArr[i]) {
            case "type_21":
                console.log(conArr[i]);
                condDisplay.textContent = condDisplay.textContent.concat("|", "CHUVA");
                imgArr[i] = new Image();
                imgArr[i].src = "img/rainy.png";
                break;
            case "type_42":
                console.log(conArr[i]);
                condDisplay.textContent = condDisplay.textContent.concat("|", "NUBLADO");
                imgArr[i] = new Image();
                imgArr[i].src = "img/cloudy.png";
                break;
        }
    }
    console.log(condDisplay.textContent);
    return imgArr;
}

async function getWeatherJSON(local) {
    try {
        const response =
            await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
                local + "/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Cdays%2Chours&" +
                "key=Y3KFJPKUUX6S8CX84GSXY9VJY&contentType=json&lang=id&unitGroup=metric", { // Here goes the URI of the API
                "method": "GET",
                "headers": {}
            });

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
const ctx = canvas.getContext("2d");

/*const image = new Image(200, 200);
image.src = "img/sunny.png";

image.onload = () => {
    ctx.drawImage(image, 75, 10, 250, 250);
};*/

getWeatherJSON("MANAUS").then((res) => {
    let img = evaluateCondition(condDisplay, res.days[0].conditions);
    tempDisplay.textContent = "TEMP MIN: " + res.days[0].tempmin + "°C TEMP MAX: " + res.days[0].tempmax + "°C";

    const canvas = document.getElementById("condCnv");
    let ctx = canvas.getContext("2d");

    img[0].onload = () => {
        ctx.drawImage(img[0], 100, 10, 150, 150);
    }

    for (let i = 1; i < img.length + 1; i++) {
        img[i].onload = () => {
            ctx.drawImage(img[i], 75, 40, 250, 250);
        }
        console.log("Imagem:" + img[i]);
    }
});
