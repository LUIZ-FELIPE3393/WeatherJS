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

    if (conArr.length === 0) {
        condDisplay.textContent.concat("LIMPO");
        return imgArr;
    }

    for (let i = 0; i < conArr.length; i++) {
        if (i > 0) {
            condDisplay.textContent = condDisplay.textContent.concat(" | ");
        }
        switch (conArr[i]) {
            case "type_21":
            case "type_24":
            case "type_25":
            case "type_26":
            case "type_2":
                console.log(conArr[i]);
                condDisplay.textContent = condDisplay.textContent.concat("CHUVA");
                imgArr[i+1] = new Image();
                imgArr[i+1].src = "img/rainy.png";
                break;
            case "type_41":
                console.log(conArr[i]);
                condDisplay.textContent = condDisplay.textContent.concat("NUBLADO");
                imgArr[i+1] = new Image();
                imgArr[i+1].src = "img/cloudy.png";
                break;
            case "type_42":
                console.log(conArr[i]);
                condDisplay.textContent = condDisplay.textContent.concat("PARCIALMENTE NUBLADO");
                imgArr[i+1] = new Image();
                imgArr[i+1].src = "img/pcloudy.png";
                break;
            case "type_8":
            case "type_19":
                console.log(conArr[i]);
                condDisplay.textContent = condDisplay.textContent.concat("NEBLINA");
                imgArr[i+1] = new Image();
                imgArr[i+1].src = "img/misty.png";
                break;
            case "type_31":
            case "type_32": 
            case "type_33":  
            case "type_34":
            case "type_35":
                console.log(conArr[i]);
                condDisplay.textContent = condDisplay.textContent.concat("NEVE");
                imgArr[i+1] = new Image();
                imgArr[i+1].src = "img/snowy.png";
                break;
            case "type_37":
            case "type_38":
            case "type_18":    
                console.log(conArr[i]);
                condDisplay.textContent = condDisplay.textContent.concat("TROVÕES");
                imgArr[i+1] = new Image();
                imgArr[i+1].src = "img/lightning.png";
                break;
        }
    }
    console.log(condDisplay.textContent);
    return imgArr;
}

document.onload = () => (function() {
    window.keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });
});

async function getWeatherJSON(local, erroDisplay) {
    try {
        const response =
            await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
                local + "/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Cdays&" +
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
const addrDisplay = document.querySelector('.addrTxt');

const canvas = document.getElementById("condCnv");
const ctx = canvas.getContext("2d");

const local = document.querySelector('#localText');
const buttonSubmitLocal = document.querySelector('#submitLocal');

buttonSubmitLocal.addEventListener('click', async (event) => {
    let tempMed = 0, tempMin = 0, tempMax = 0;
    const tempType = document.forms.opt.elements.temp.value;
    erroDisplay.textContent = "";
    addrDisplay.textContent = "";
    condDisplay.textContent = "";
    tempDisplay.textContent = "";

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

        addrDisplay.textContent = res.resolvedAddress;

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