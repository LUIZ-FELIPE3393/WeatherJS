function evaluateCondition(condDisplay, conditionCodes) {
    let conArr = conditionCodes.replace(' ', '').split(',');
    const time = new Date();
    condDisplay.textContent = "HORA: " + time.getHours() + ":" + time.getMinutes() + " COND: "
    let imgArr = [];


    if (time.getHours() >= 18 || time.getHours() < 6) {
        imgArr[0] = new Image();
        imgArr[0].src = "img/night.png";
    } else {
        imgArr[0] = new Image();
        imgArr[0].src = "img/sunny.png";
    }

    if (conArr.length == 0) {
        condDisplay.textContent.concat("LIMPO");
        return imgArr;
    }

    for (let i = 1; i < conArr.length + 1; i++) {
        if (i > 1) {
            condDisplay.textContent.concat(" | ");
        }
        switch (conArr[i]) {
            case "type_21":
                console.log(conArr[i]);
                condDisplay.textContent = condDisplay.textContent.concat("CHUVA");
                imgArr[i] = new Image();
                imgArr[i].src = "img/rainy.png";
                break;
            case "type_42":
                console.log(conArr[i]);
                condDisplay.textContent = condDisplay.textContent.concat("NUBLADO");
                imgArr[i] = new Image();
                imgArr[i].src = "img/cloudy.png";
                break;
        }
    }
    console.log(condDisplay.textContent);
    return imgArr;
}

async function getWeatherJSON(local, erroDisplay) {
    try {
        const response =
            await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
                local + "/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Cdays%2Chours&" +
                "key=Y3KFJPKUUX6S8CX84GSXY9VJY&contentType=json&lang=id&unitGroup=metric", { // Here goes the URI of the API
                "method": "GET",
                "headers": {}
            });

        if (!response.ok) {
            erroDisplay.textContent = "AVISO - O Local não pôde ser encontrado, verifique a entrada";
            throw new Error("ERROR - HTTP response code isn't ok");
        }
        const weather = await response.json();
        console.log("SUCCESS - Weather data fetched:", weather);
        return weather;

    } catch (error) {
        console.error("FAILURE - Weather data fetch request was a failure:", error);
    } finally {

    }
}

const tempDisplay = document.querySelector('.temp');
const condDisplay = document.querySelector('.condTxt');
const erroDisplay = document.querySelector('.errText');

const canvas = document.getElementById("condCnv");
const ctx = canvas.getContext("2d");

const local = document.querySelector('#localText');
const buttonSubmitLocal = document.querySelector('#submitLocal');

buttonSubmitLocal.addEventListener('click', async (event) => {
    let tempMed = 0, tempMin = 0, tempMax = 0;
    const tempType = document.forms.opt.elements.temp.value;
    erroDisplay.textContent = "";

    if (local.value.length === 0) {
        erroDisplay.textContent = "AVISO - Escreva o nome de algum local no campo \"Local\"";
        return;
    }

    getWeatherJSON(local.value, erroDisplay).then(async (res) => {
        let img = evaluateCondition(condDisplay, res.days[0].conditions);
        if (tempType === 'C') {
            // Maintain Celsius
            tempMed = res.days[0].temp;
            tempMin = res.days[0].tempmin;
            tempMax = res.days[0].tempmax;
            tempDisplay.textContent = "TEMP: " + tempMed.toFixed(1) + "°C" + " TEMP MIN: " + tempMin.toFixed(1)
                + "°C" + " TEMP MAX: " + tempMax.toFixed(1) + "°C";
        } else if (tempType === 'F') {
            // Convert to fahrenheit
            tempMed = res.days[0].temp * 1.8 + 32;
            tempMin = res.days[0].tempmin * 1.8 + 32;
            tempMax = res.days[0].tempmax * 1.8 + 32;
            tempDisplay.textContent = "TEMP: " + tempMed.toFixed(1) + "°F" + " TEMP MIN: " + tempMin.toFixed(1)
                + "°F" + " TEMP MAX: " + tempMax.toFixed(1) + "°F";
        }
        else {
            // Display Error
            erroDisplay.textContent = "AVISO - Selecione um tipo de temperatura.";
        }

        const canvas = document.getElementById("condCnv");
        let ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, 400, 300);

        img[0].onload = () => {
            ctx.drawImage(img[0], 100, 10, 150, 150);

            for (let i = 1; i < img.length + 1; i++) {
                img[i].onload = () => {
                    ctx.drawImage(img[i], 75, 40, 250, 250);
                }
                console.log("Imagem:" + img[i]);
            }
        }
    });
});