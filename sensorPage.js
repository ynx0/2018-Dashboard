//Change circle gauge (number,string id,number,number,boolean,string)
function changeCircle(value,displayAs,start,end,usePercent,unit='',fixAmount=0,changeAmount=0,symetrical=false) {
	var spinCircle = document.getElementById("circleGauge" + displayAs);
	var gaugeText = document.getElementById("circleGaugeText" + displayAs);
	var startLimit = document.getElementById("startLimit" + displayAs);
	var endLimit = document.getElementById("endLimit" + displayAs);
	if (value > end) {
		value = end;
	}
	else if (value < start) {
		value = start;
	}
	if (start.toString().substring(0,1) === "[" || end.toString().substring(0,1) === "[") {

	}
	else {
		startLimit.innerHTML = start;
		endLimit.innerHTML = end;
	}

	//scale the start and end of the gauge to begin at 0
	end = end-start;
	start=0;
	var fixed = value.toFixed(fixAmount);
	var stringValue = value.toString();
	//console.log("Start is " + start + " and end is " + end);
	var newDegrees;
	if (usePercent) {
		newDegrees = ((((value/100)*end)/end)*180)-90;
		gaugeText.innerHTML = fixed + "%";
	}
	//use the literal value
	else {
		gaugeText.innerHTML = fixed + unit;
		newDegrees = map(value,start,end,0,180)-180;//(value/end)*180-90;
		newDegrees = newDegrees+changeAmount;
		//console.log(newDegrees + ", start is " + start + " end is " + end + ", value is " + value);
	}
	var percentageAdjustOfCircle = changeAmount/(start+end);
	var percentage = map(value,start,end,0,100)/100;
	console.log("percentage is " + percentage + " percentage adjustment is " + percentageAdjustOfCircle + " and value is " + value);
	if (symetrical) { 
		if(value*100 < ((start+end)/2)) {
			console.log("ran1");
			percentage = Math.abs(map(percentage,start,end,0,-100));
		}
		else {
			console.log("ran2");
			percentage = map(percentage,start,end,0,100);
		}
		percentage*=80;
	}
	console.log("changing color to " + "rgb(" + parseInt((((percentage) * 72) + 23)) + "," + parseInt((((percentage) * -124) + 197)) + "," + parseInt((((percentage) * -50) + 218)) + ")")
    spinCircle.style.fill = "rgb(" + parseInt((((percentage) * 72) + 23)) + "," + parseInt((((percentage) * -124) + 197)) + "," + parseInt((((percentage) * -50) + 218)) + ")";
    spinCircle.style.transform = "translate3d(-00px,00px,0px) rotate(" + newDegrees + "deg)";
}
//Map one scale onto another
function map(x, in_min, in_max, out_min, out_max) {

  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
//Change boolean gauge (boolean,string id, boolean)
function changeSwitch(value,displayAs,on) {
	var green = document.getElementById("switchGreen" + displayAs);
	var red = document.getElementById("switchRed" + displayAs);
	if(on) {
		red.style.opacity = "100";
		green.style.opacity = "100";
		if (value) {
			console.log("ran1")
			red.style.transform = "translateY(-35px) translateX(-100px)"
			green.style.transform = "translateX(0px)";
		}
		else {
			console.log('ran2');
			green.style.transform = "translateX(100px)"
			red.style.transform = "translateY(-35px) translateX(0px)";
		}
	}
	else {
		red.style.opacity = "0";
		green.style.transform = "translateX(100px)";
		red.style.transform = "translateX(-100px) translateY(-35px)"
		green.style.opacity = "0";
	}
}
//Change numberIndicator (number,number,number,string id, string)
function changeNumber(value,limitLow,limitHigh, displayAs,unit,fixAmount=-1) {
	var text = document.getElementById("numberReadoutValue" + displayAs);
	var element = document.getElementById("numberReadout" + displayAs);
	if (fixAmount != -1) {
		value = value.toFixed(fixAmount);
	}
	text.innerHTML = value + unit;
	textFit(element,{alignVert: true, alignHoriz: true});
	if (limitLow != 0 && limitHigh != 0) {
		if (value > limitHigh) {
			element.style.background = "rgb(255,0,0)";
		}
		else if (value < limitLow) {
			element.style.background = "rgb(255,0,0)";
		}
	}
}
//Change arrow direction (boolean, string id)
function changeArrow(value,displayAs) {
	var arrow = document.getElementById("arrowUp" + displayAs);
	var box = document.getElementById("arrow" + displayAs);
	if (value) {
		box.style.transform = "rotate(0deg) translateX(45px) translateY(-15px)";
		arrow.style.animationName = "pulseUp";
	}
	else {
		box.style.transform = "rotate(180deg) translateX(45px) translateY(-15px)";
		arrow.style.animationName = "pulseDown";
	}
}
//Change lock value (string, string id)
function changeLock(value,displayAs) {
	var lock = document.getElementById("lock" + displayAs);
	if (value === "locked") {
		//to lock
		if (lock.classList.contains("fa-lock-open")) {
			lock.classList.remove("fa-lock-open");
			lock.classList.add("fa-lock");
		}
	}
	else if (value === "unlocked") {
		if (lock.classList.contains("fa-lock")) {
			lock.classList.remove("fa-lock");
			lock.classList.add("fa-lock-open");
		}
	}
}
//Change rotation of an element (degrees (centered at 0), string id)
function changeLevel(value,displayAs) {
	var svg = document.getElementById("levelLine" + displayAs); //Yaw
	var text = document.getElementById("levelText" + displayAs);
	var fixed = value.toFixed(3);
	text.innerHTML = fixed + "deg";
	value = value * -1;
	svg.style.transform = "rotate(" + value + "deg)";
}
//Modifies the degree of rotation on a compass element (degrees,id)
function changeCompass(value,displayAs) {
	var compassLine = document.getElementById("compassSVG" + displayAs);
	value=value+180;
	compassLine.style.transform = "rotate(" + value + "deg)";
}