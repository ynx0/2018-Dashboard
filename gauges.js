// Square Gauges
function moveLeftMotorGauge(value) {
    var leftDiagonalLines = document.getElementsByClassName("leftDiagonalLines");
    bar = document.getElementById("leftPowerGauge");
    var writeColor = Math.abs(value);
    var fillColor = "rgb(" + parseInt((((writeColor/100) * 232) + 23)) + "," + parseInt((((writeColor/100) * -197) + 197)) + "," + parseInt((((writeColor/100) * -218) + 218)) + ")"
    bar.style.fill = fillColor;

    for (i = 0; i < leftDiagonalLines.length; i++) {
        leftDiagonalLines[i].setAttribute("style","stroke:" + fillColor + ";stroke-width:" + writeColor/50);
    }
    //<rect id = "leftPowerGauge" class="squareGaugeBar" x="0" y="100" width="30" height="1"/>
    text = document.getElementById("leftPowerGaugePercentage");
    colorValue = Math.abs(value);
    if (value<=0) {
        bar.setAttribute("y", 100);
        if (value < -100) {
            value = -100;
        }
        if (value == -100) {
            runAnimation(bar, "maxed");
        }
        else {
            runAnimation(bar, "");
        }
        if (value !== 0) {
            text.style.transform = "translate3d(-9px, -131.5px, 0px)";
        }
        else {
            text.style.transform = "translate3d(-9px, -121.5px, 0px)";
        }
        //Element 201 px total, goes up and down by 100
        changeValue = value + "%";

        if (changeValue === text.innerHTML) {
        }
        else {
            runAnimation(leftPowerGaugePercentage,"fadeBack");
            text.innerHTML = changeValue;
        }

        value = (value) * -1;
        bar.setAttribute("height", value+"px");
        if (value == 100) {
            bar.setAttribute("height", "101px");
        }
    }
    else {
        if (value > 100) {
            value = 100;
        }
        text.style.transform = "translate3d(-9px, -111.5px, 0px)";
        changeValue = value + "%";
        if (changeValue === text.innerHTML) {
        }
        else {
            runAnimation(leftPowerGaugePercentage,"fadeBack");
            text.innerHTML = changeValue;
        }

        if (value == 100) {
            runAnimation(bar, "maxed");
            for (i = 0; i<leftDiagonalLines.length; i++) {
                runAnimation(leftDiagonalLines[i],"maxed");
            }
        }
        else {
            runAnimation(bar, "");
            for (i = 0; i<leftDiagonalLines.length; i++) {
                runAnimation(leftDiagonalLines[i],"");
            }
        }
        bar.setAttribute("height", (value)+"px");
        bar.setAttribute("y", (100-value) + "px");
    }
}

function moveRightMotorGauge(value) {
    var leftDiagonalLines = document.getElementsByClassName("rightDiagonalLines");
    bar = document.getElementById("rightPowerGauge");
    var writeColor = Math.abs(value);
    var fillColor = "rgb(" + parseInt((((writeColor/100) * 232) + 23)) + "," + parseInt((((writeColor/100) * -197) + 197)) + "," + parseInt((((writeColor/100) * -218) + 218)) + ")"
    bar.style.fill = fillColor;

    for (i = 0; i < leftDiagonalLines.length; i++) {
        leftDiagonalLines[i].setAttribute("style","stroke:" + fillColor + ";stroke-width:" + writeColor/50);
    }
    //<rect id = "leftPowerGauge" class="squareGaugeBar" x="0" y="100" width="30" height="1"/>
    text = document.getElementById("rightPowerGaugePercentage");
    colorValue = Math.abs(value);
    if (value<=0) {
        bar.setAttribute("y", 100);
        if (value < -100) {
            value = -100;
        }
        if (value !== 0) {
            text.style.transform = "translate3d(-9px, -131.5px, 0px)";
        }
        else {
            text.style.transform = "translate3d(-9px, -121.5px, 0px)";
        }
        //Element 201 px total, goes up and down by 100
        changeValue = value + "%";

        if (changeValue === text.innerHTML) {
        }
        else {
            runAnimation(rightPowerGaugePercentage,"fadeBack");
            text.innerHTML = changeValue;
        }

        if (value == -100) {
            runAnimation(bar, "maxed");
        }
        else {
            runAnimation(bar, "");
        }

        value = (value) * -1;
        bar.setAttribute("height", value+"px");
        if (value == 100) {
            bar.setAttribute("height", "101px");
        }
    }
    else {
        if (value > 100) {
            value = 100;
        }
        text.style.transform = "translate3d(-9px, -111.5px, 0px)";
        changeValue = value + "%";
        if (changeValue === text.innerHTML) {
        }
        else {
            runAnimation(rightPowerGaugePercentage,"fadeBack");
            text.innerHTML = changeValue;
        }
        if (value == 100) {
            runAnimation(bar, "maxed");
        }
        else {
            runAnimation(bar, "");
        }

        bar.setAttribute("height", (value)+"px");
        bar.setAttribute("y", (100-value) + "px");
    }
}



//Circle Gauges
function movePowerGauge(value) {
    console.log("---");
    value = parseFloat(value); //50 //40
    console.log("Current float rotation amount: " + value + "%");
    var element = document.getElementById("powerGauge");
    var gauge = document.getElementById("powerGaugeCircle");
    var guagePercentageText = document.getElementById("powerOutputPercentage");
    var currentRotation = element.style.transform;
    currentRotation = currentRotation.substring(37,currentRotation.length-3);
    currentRotation = String(currentRotation);
    try {
        currentRotation = parseFloat(currentRotation);
    }
    catch (error) {
        console.log(error);
        try {
            currentRotation = currentRotation.substring(0,currentRotation.length-1);
            currentRotation = parseFloat(currentRotation);
        }
        catch (error) {
            console.log(error);
            currentRotation = currentRotation.substring(0,currentRotaiton.length-1);
            currentRotation = parseFloat(currentRotation);
        }
    }
    
    currentRotation = 100*(currentRotation/180);

    console.log("The previous rotation was " + currentRotation + "%");
    if (value > currentRotation && isNaN(currentRotation) === false) {
        element.style.animationDirection = "normal";
        console.log("ran, comparing " + value + " and " + currentRotation);
    }
    else if (isNaN(currentRotation) === false) {
        element.style.animationDirection = "reverse";
        console.log("ran2, comparing " + value + " and " + currentRotation);
    }
    // element.style.animationDelay = (value/100) * -1;
    if (currentRotation != value) {
        runAnimation(guagePercentageText,"fadeBack");
    }
    changeAmountDegrees = (value/100) * 180; //.5*180=90 //.4*180
    console.log("Value is " + value);

    guagePercentageText.innerHTML = value + "%"
    gauge.style.fill = "rgb(" + parseInt((((value/100) * 72) + 23)) + "," + parseInt((((value/100) * -124) + 197)) + "," + parseInt((((value/100) * -50) + 218)) + ")";
    element.style.transform = "translate3d(-10px,10px,0px) rotate(" + changeAmountDegrees + "deg)";
    currentRotation = value;
}

function moveCarriageMotorGauge(value) {
    console.log("---");
    value = parseFloat(value); //50 //40
    console.log("Current float rotation amount: " + value + "%");
    var element = document.getElementById("powerGauge");
    var gauge = document.getElementById("powerGaugeCircle");
    var guagePercentageText = document.getElementById("powerOutputPercentage");
    var currentRotation = element.style.transform;
    currentRotation = currentRotation.substring(37,currentRotation.length-3);
    currentRotation = String(currentRotation);
    try {
        currentRotation = parseFloat(currentRotation);
    }
    catch (error) {
        console.log(error);
        try {
            currentRotation = currentRotation.substring(0,currentRotation.length-1);
            currentRotation = parseFloat(currentRotation);
        }
        catch (error) {
            console.log(error);
            currentRotation = currentRotation.substring(0,currentRotaiton.length-1);
            currentRotation = parseFloat(currentRotation);
        }
    }
    
    currentRotation = 100*(currentRotation/180);

    console.log("The previous rotation was " + currentRotation + "%");
    if (value > currentRotation && isNaN(currentRotation) === false) {
        element.style.animationDirection = "normal";
        console.log("ran, comparing " + value + " and " + currentRotation);
    }
    else if (isNaN(currentRotation) === false) {
        element.style.animationDirection = "reverse";
        console.log("ran2, comparing " + value + " and " + currentRotation);
    }
    // element.style.animationDelay = (value/100) * -1;
    if (currentRotation != value) {
        runAnimation(guagePercentageText,"fadeBack");
    }
    changeAmountDegrees = (value/100) * 180; //.5*180=90 //.4*180
    console.log("Value is " + value);

    guagePercentageText.innerHTML = value + "%"
    gauge.style.fill = "rgb(" + parseInt((((value/100) * 72) + 23)) + "," + parseInt((((value/100) * -124) + 197)) + "," + parseInt((((value/100) * -50) + 218)) + ")";
    element.style.transform = "translate3d(-10px,10px,0px) rotate(" + changeAmountDegrees + "deg)";
    currentRotation = value;
}






//Modifies all gauges
function moveCarriageMotorGauge(value, name) {
    console.log("---");
    value = parseFloat(value); //50 //40
    console.log("Current float rotation amount: " + value + "%");
    var element = document.getElementById("powerGauge");
    var gauge = document.getElementById("powerGaugeCircle");
    var guagePercentageText = document.getElementById("powerOutputPercentage");
    var currentRotation = element.style.transform;
    currentRotation = currentRotation.substring(37,currentRotation.length-3);
    currentRotation = String(currentRotation);
    try {
        currentRotation = parseFloat(currentRotation);
    }
    catch (error) {
        console.log(error);
        try {
            currentRotation = currentRotation.substring(0,currentRotation.length-1);
            currentRotation = parseFloat(currentRotation);
        }
        catch (error) {
            console.log(error);
            currentRotation = currentRotation.substring(0,currentRotaiton.length-1);
            currentRotation = parseFloat(currentRotation);
        }
    }
    
    currentRotation = 100*(currentRotation/180);

    console.log("The previous rotation was " + currentRotation + "%");
    if (value > currentRotation && isNaN(currentRotation) === false) {
        element.style.animationDirection = "normal";
        console.log("ran, comparing " + value + " and " + currentRotation);
    }
    else if (isNaN(currentRotation) === false) {
        element.style.animationDirection = "reverse";
        console.log("ran2, comparing " + value + " and " + currentRotation);
    }
    // element.style.animationDelay = (value/100) * -1;
    if (currentRotation != value) {
        runAnimation(guagePercentageText,"fadeBack");
    }
    changeAmountDegrees = (value/100) * 180; //.5*180=90 //.4*180
    console.log("Value is " + value);

    guagePercentageText.innerHTML = value + "%"
    gauge.style.fill = "rgb(" + parseInt((((value/100) * 72) + 23)) + "," + parseInt((((value/100) * -124) + 197)) + "," + parseInt((((value/100) * -50) + 218)) + ")";
    element.style.transform = "translate3d(-10px,10px,0px) rotate(" + changeAmountDegrees + "deg)";
    currentRotation = value;
}