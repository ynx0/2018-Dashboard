

let ntClient = require("wpilib-nt-client");
let nt = new ntClient.Client();

nt.setReconnectDelay(1000);

nt.start((isConnected, err) => {
    console.log("Started NT client");
}, '10.4.1.2');//localhost 10.4.1.2

// Define UI elements
let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state').firstChild,
    gyro: {
        container: document.getElementById('gyro'),
        val: 0,
        offset: 0,
        visualVal: 0,
        arm: document.getElementById('gyro-arm'),
        number: document.getElementById('gyro-number')
    },
    robotDiagram: {
        arm: document.getElementById('robot-arm')
    },
    example: {
        button: document.getElementById('example-button'),
        //readout: document.getElementById('example-readout').firstChild
    },
    tuning: {
        list: document.getElementById('tuning'),
        button: document.getElementById('tuning-button'),
        name: document.getElementById('name'),
        value: document.getElementById('value'),
        set: document.getElementById('set'),
        get: document.getElementById('get')
    },
    autoSelect: document.getElementById('auto-select'),
    armPosition: document.getElementById('arm-position')
};
let address = document.getElementById('connect-address'),
    connect = document.getElementById('connect');

// Function for hiding the connect box 
let escCount = 0;
onkeydown = key => {
    if (key.key === 'Escape') {
        setTimeout(() => { escCount = 0; }, 400);
        escCount++;
        console.log(escCount);
        if (escCount === 2) {
            document.body.classList.toggle('login-close', true);
        }
    }
    else
        console.log(key.key);
};
if (noElectron) {

    document.body.classList.add('login-close');
}

/**** KEY Listeners ****/

// Gyro rotation
let updateGyro = (key, value) => {
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }
    ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
    ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
};
addKeyListener('/SmartDashboard/drive/navx/yaw', updateGyro);

// The following case is an example, for a robot with an arm at the front.
// Info on the actual robot that this works with can be seen at thebluealliance.com/team/1418/2016.
addKeyListener('/SmartDashboard/arm/encoder', (key, value) => {
    // 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
    if (value > 1140) {
        value = 1140;
    }
    else if (value < 0) {
        value = 0;
    }
    // Calculate visual rotation of arm
    var armAngle = value * 3 / 20 - 45;
    // Rotate the arm in diagram to match real arm
    ui.robotDiagram.arm.style.transform = `rotate(${armAngle}deg)`;
});

// This button is just an example of triggering an event on the robot by clicking a button.
addKeyListener('/SmartDashboard/example_variable', (key, value) => {
    // Sometimes, nt will pass booleans as strings. This corrects for that.
    // TODO: We shouldn't have to do this for every variable that can be a boolean.
    if (typeof value === 'string')
        value = value === 'true';
    // Set class active if value is true and unset it if it is false
    //ui.example.button.classList.toggle('active', value);
    ui.example.readout.data = 'Value is ' + (value ? 'true' : 'false');
});
function runTime(value) {
    // Sometimes, nt will pass booleans as strings. This corrects for that.
    if (typeof value === 'string')
        value = value === 'true';
    // When this nt variable is true, the timer will start.
    // You shouldn't need to touch this code, but it's documented anyway in case you do.
    var s = 135;
    if (value) {
        // Make sure timer is reset to black when it starts
        ui.timer.style.color = 'black';
        // Function below adjusts time left every second
        var countdown = setInterval(function () {
            s--; // Subtract one second
            // Minutes (m) is equal to the total seconds divided by sixty with the decimal removed.
            var m = Math.floor(s / 60);
            // Create seconds number that will actually be displayed after minutes are subtracted
            var visualS = (s % 60);
            // Add leading zero if seconds is one digit long, for proper time formatting.
            visualS = visualS < 10 ? '0' + visualS : visualS;
            if (s < 0) {
                // Stop countdown when timer reaches zero
                clearTimeout(countdown);
                return;
            }
            else if (s <= 15) {
                // Flash timer if less than 15 seconds left
                ui.timer.style.color = (s % 2 === 0) ? '#FF3030' : 'transparent';
            }
            else if (s <= 30) {
                // Solid red timer when less than 30 seconds left.
                ui.timer.style.color = '#FF3030';
            }
            ui.timer.firstChild.data = m + ':' + visualS;
        }, 1000);
    }
    else {
        s = 135;
    }
    //nt.putValue(key, false);
};
    // Load list of prewritten autonomous modes
    // addKeyListener('/SmartDashboard/time_running', (key, value) => {
    //     // Clear previous list
    //     while (ui.autoSelect.firstChild) {
    //         ui.autoSelect.removeChild(ui.autoSelect.firstChild);
    //     }
    //     // Make an option for each autonomous mode and put it in the selector
    //     for (let i = 0; i < value.length; i++) {
    //         var option = document.createElement('option');
    //         option.appendChild(document.createTextNode(value[i]));
    //         ui.autoSelect.appendChild(option);
    //     }
    //     // Set value to the already-selected mode. If there is none, nothing will happen.
    //     ui.autoSelect.value = nt.getValue('/SmartDashboard/currentlySelectedMode');
    // });
// Load list of prewritten autonomous modes
// addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
//     ui.autoSelect.value = value;
// });
// The rest of the doc is listeners for UI elements being clicked on
// ui.example.button.onclick = function () {
//     // Set nt values to the opposite of whether button has active class.
//     nt.putValue('/SmartDashboard/example_variable', this.className != 'active');
// };
// Reset gyro value to 0 on click
ui.gyro.container.onclick = function () {
    // Store previous gyro val, will now be subtracted from val for callibration
    ui.gyro.offset = ui.gyro.val;
    // Trigger the gyro to recalculate value.
    updateGyro('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
};
// Open tuning section when button is clicked
ui.tuning.button.onclick = function () {
    if (ui.tuning.list.style.display === 'none') {
        ui.tuning.list.style.display = 'block';
    }
    else {
        ui.tuning.list.style.display = 'none';
    }
};
// Manages get and set buttons at the top of the tuning pane
ui.tuning.set.onclick = function () {
    // Make sure the inputs have content, if they do update the NT value
    if (ui.tuning.name.value && ui.tuning.value.value) {
        //nt.putValue('/SmartDashboard/' + ui.tuning.name.value, ui.tuning.value.value);
    }
};
ui.tuning.get.onclick = function () {
    ui.tuning.value.value = nt.getValue(ui.tuning.name.value);
};

function moveGyro(value) {
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }
    ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
    ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
}

function collectedCube(collected) {
    var cube = document.getElementById("Cube");
    var cameraBackground = document.getElementById("camera");
    if (collected === true) {
        var x = cube.style.x
        if (x === "49px") {
        }
        else {
            runAnimation(cameraBackground, "flash");
            //player.play('Beep.wav', function(err){})
        }
        cube.style.opacity = 100;
        cube.style.x = "49px";
        //'#333 to #FFD52E';
    }
    else if (collected === false) {
        cube.style.opacity = 0;
        cube.style.x= "-40px";
    }
}
function resize() {
    if (window.innerWidth != 1365) {
        //window.resizeTo(1365,590);
    }
    //nt.putValue('/SmartDashboard/arm/encoder', parseInt(3));
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function checkCamera() {
    console.log("Checking for camera");
    var image = document.getElementById("cameraFeed");
    image.src = '';
    image.src = "http://192.168.9.91:8080";
    //image.src = 'https://vignette.wikia.nocookie.net/ttte/images/d/d6/MainThomasCGI2.png/revision/latest?cb=20180130081706';
}

function moveElevator(value) {
    if (value === 0) {
        value = -10;
    }
    value = 100-value
    
    var arm = document.getElementById("ElevatorCarriage");
    var cube = document.getElementById("Cube");
    var movement = (value * .01) * 200;
    arm.style.y = 30+movement;
    cube.style.y = -5+movement;
}

function armMover(value) {

    ui.robotDiagram.arm.style.transform = `rotate(${value}deg)`;
}

addKeyListener('/SmartDashboard/beep', (key,value) => {
    if (typeof value === 'string')
        value = value === 'true';

    if (value === true) {
        player.play('Beep.wav', function(err){});
    }
})

function beep() {
    player.play('Beep.wav', function(err){})
    //player.play('Demonic Beep.wav', function(err){})
}

function sensorPage(value) {
    var body = document.body;
    var teamName = document.getElementById("bottomSliver");
    if (value == true) {
        // teamName.style.transform = "translateY(0px);";
        body.style.transform = "translate3d(" + window.innerWidth + "px,0px,0px)"
    }
    else {
        // teamName.style.transform = "translateY(316px)";
        body.style.transform = "translate3d(0px,0px,0px)"
    }
}
function toggleSensorPage(e) {
    var keynum;
    if (window.event) {
        keynum = e.keyCode;
    }
    else if(e.which) {
        keynum = e.which;
    }
    var keyString = String.fromCharCode(keynum);
    if (keyString == "a" || keyString == "s" || keyString == "d" || keyString == "f") {
        var bodyX = document.body.style.transform;
        //console.log(bodyX);
        if (bodyX == "translate3d(0px, 0px, 0px)") {
            sensorPage(true);
        }
        else {
            sensorPage(false);
        }
    }
    else if (keyString == "r") {
        checkCamera();
    }
}

function tiltRobot(value) {
    var robot = document.getElementById("robot-diagram");
    robot.style.transform = "translate3d(-6%,0,0) rotate(" + value + "deg)";
}

function runAnimation(element, name) {
    //console.log('Ran animation ' + name);
    element.style.animationName = null;
    element.offsetHeight; /* trigger reflow */
    element.style.animationName = name;
};

function addKeyListener(inKey, lambda) {
    nt.addListener((key, val, type, id) => {
        if (inKey == key) {
            lambda(key, val);
        };
    });
};
function load() {
    registerHandlers();
    checkCamera();
}


function registerHandlers() {
    var driveMax = 500;
    var driveMin = -500;
    var maxDriveAmps = 0;
    var intakeMinVelocity = 0;
    var intakeMaxVelocity = 0;
    var maxIntakeLeftAmps = 0;
    var maxIntakeRightAmps = 0;
    var maxIntakeAmps = 0; 
    var maxElevatorAmps = 0;
    var elevatorMinVelocity = 0;
    var elevatorMaxVelocity = 0;


    addKeyListener('/SmartDashboard/maxDriveAmps', (key,value) => {
        maxDriveAmps = value;
    });
    addKeyListener('/SmartDashboard/maxIntakeLeftAmps', (key,value) => {
        maxIntakeLeftAmps = value;
    })
    addKeyListener('/SmartDashboard/maxIntakeRightAmps', (key,value) => {
        maxIntakeRightAmps = value;
    })
    addKeyListener('/SmartDashboard/driveMaxVelocity', (key,value) => {
        driveMax = value;
    });
    addKeyListener('/SmartDashboard/driveMinVelocity', (key,value) => {
        driveMin = value;
    });

    addKeyListener('/SmartDashboard/intakeMaxVelocity', (key,value) => {
        intakeMaxVelocity = value;
    });
    addKeyListener('/SmartDashboard/intakeMinVelocity', (key,value) => {
        intakeMinVelocity = value;
    });
    addKeyListener('/SmartDashboard/maxIntakeAmps', (key,value) => {
        maxIntakeAmps = value;
    });
    addKeyListener('/SmartDashboard/maxElevatorAmps', (key,value) => {
        maxElevatorAmps = value;
    });
    addKeyListener('/SmartDashboard/elevatorMinVelocity', (key,value) => {
        elevatorMinVelocity = value;
    })
    addKeyListener('/SmartDashboard/elevatorMaxVelocity', (key,value) => {
        elevatorMaxVelocity = value;
    })

    addKeyListener('/SmartDashboard/intakeVelocity', (key,value) => {
        //console.log("intakeMinVelocity " + intakeMinVelocity + " intake max " + intakeMaxVelocity);
        changeCircle(value,'IntakeVelocity',intakeMinVelocity,intakeMaxVelocity,false,' RPM',2,0,false);
        changeCircle(value,'IntakeVelocity2',intakeMinVelocity,intakeMaxVelocity,false,' RPM',2,0,false);
    });

    addKeyListener('/SmartDashboard/intakeAmps', (key,value) => {
        changeCircle(value,'IntakeAmps',0,90,false,'A',2,0,false,maxIntakeAmps);
    });
    addKeyListener('/SmartDashboard/intakePos', (key,value) => {
        //console.log("maxIntakeAmps is " + maxIntakeAmps);
        changeNumber(value,0,maxIntakeAmps,'IntakePosition', ' A',1,2);
    });


    addKeyListener('/SmartDashboard/vbus', (key, value) => {
        changeCircle(value,'Voltage',6,15,false, 'V',2,0);
        changeCircle(value,'MainPower',6,15,false, 'V',2,0);
    });



    addKeyListener('/SmartDashboard/totalAmps', (key, value) => {
        changeNumber(value,0,200,'TotalAmps', ' A');
    });

    addKeyListener('/SmartDashboard/driveShift', (key,value) =>  {
        changeArrow(value == "high", 'DriveShift');
    });

    addKeyListener('/SmartDashboard/driveLeftAmps', (key,value) =>  {
        changeNumber(value,0,maxDriveAmps,'CurrentLeft', ' A');
    });
    addKeyListener('/SmartDashboard/driveRightAmps', (key,value) =>  {
        changeNumber(value,0,maxDriveAmps,'CurrentRight', ' A');
    });


    addKeyListener('/SmartDashboard/driveLeftVelocity', (key,value) =>  {
        var passedValue = value;
        //console.log("from network tables: " + value);
        changeCircle(value,'LeftVelocity',driveMin,driveMax,false," RPM",1,0,true);
        if (passedValue > 0) {
            moveLeftMotorGauge((passedValue/driveMax)*100);
        }
        else if (passedValue == 0) {
            moveLeftMotorGauge(0);
        }
        else {
            moveLeftMotorGauge((passedValue/driveMin)*-100);
        }
    });
    addKeyListener('/SmartDashboard/driveRightVelocity', (key,value) =>  {
        //console.log("from network tables: " + value);
        var passedValue = value;
        changeCircle(value,'RightVelocity',driveMin,driveMax,false," RPM",1,0,true);
        if (passedValue > 0) {
            moveRightMotorGauge((passedValue/driveMax)*-100);
        }
        else if (passedValue == 0) {
            moveRightMotorGauge(0);
        }
        else {
            moveRightMotorGauge((passedValue/driveMin)*100);
        }
    });

    addKeyListener('/SmartDashboard/driveLeftPosition', (key,value) =>  {
        changeNumber(value,0,0,'LeftPosition', ' R',1,2);
    });

    addKeyListener('/SmartDashboard/driveRightPosition', (key,value) =>  {
        changeNumber(value,0,0,'RightPosition', ' R',1);
    });

    addKeyListener('/SmartDashboard/pitch', (key,value) =>  {
        changeLevel(value,"Pitch");
    });

    addKeyListener('/SmartDashboard/yaw', (key,value) =>  {
        changeCompass(value,"Compass");
        changeCompass(value,'Compass2');
    });


    addKeyListener('/SmartDashboard/intakeLeftAmps', (key,value) => {
        //console.log("passing " + value + " from 0 to " + maxIntakeLeftAmps);
        changeNumber(value,0,maxIntakeLeftAmps,'IntakeLeftCurrent', ' A',1,2);
    });
    addKeyListener('/SmartDashboard/intakeRightAmps', (key,value) => {
        //console.log("passing " + value + " from 0 to " + maxIntakeRightAmps);
        changeNumber(value,0,maxIntakeRightAmps,'IntakeRightCurrent', ' A',1,2);
    });


    addKeyListener('/SmartDashboard/kicker', (key,value) => {
        //console.log("passing from kicker " + value);
        changeSwitch(value,'Kicker',true);
    });
    addKeyListener('/SmartDashboard/clamp', (key,value) => {
        changeSwitch(value,'Clamp',true);
    })
    addKeyListener('/SmartDashboard/elevatorLowerLimit', (key,value) => {
        changeSwitch(value,'LowerLimit',true);
        changeBody(value);
    });
    addKeyListener('/SmartDashboard/elevatorRatchet', (key,value) => {
        changeSwitch(value,'Ratchet',true);
    });


    addKeyListener('/SmartDashboard/elevatorPosition', (key,value) => {
        changeNumber(value,0,0,'ElevatorPosition',' R',1,2);
    });

    addKeyListener('/SmartDashboard/elevatorAmps', (key,value) => {
        changeNumber(value,0,maxElevatorAmps,'ElevatorAmps',' A',1,2);
    });

    addKeyListener('/SmartDashboard/elevatorVelocity', (key,value) => {
        changeCircle(value,'ElevatorVelocity',elevatorMinVelocity,elevatorMaxVelocity,false,' RPM',1);
        changeCircle(value,'ElevatorVelocity2',elevatorMinVelocity,elevatorMaxVelocity,false,' RPM',1);
    });

    addKeyListener('/SmartDashboard/elevatorDeploy',(key,value) => {
        changeLock(value,'ElevatorDeploy');
    });
    addKeyListener('/SmartDashboard/rungsDeploy', (key,value) => {
        changeLock(value,'RungsDeploy');
    });
    addKeyListener('/SmartDashboard/elevatorShift', (key,value) => {
        changeArrow(value == "high", 'ElevatorShift');
    });

    addKeyListener('/SmartDashboard/elevatorPositionPercentage',(key,value) => {
        moveElevator(value);
    });

    addKeyListener('/SmartDashboard/hasCube',(key,value) => {
        collectedCube(value);
    });

    addKeyListener('/SmartDashboard/match_time', (key, value) => {
        var timer =document.getElementById('timer');
        //Turn seconds passed to time in minutes:seconds as m:visualS
        var counter = Math.floor(value).toFixed(0);
        //M = minutes
        var m = Math.floor(counter/60);
        //visualS = seconds
        var visualS = (counter % 60);

        //Control what is displayed on the clock
        if (visualS < 10) {
            timer.firstChild.data = m + ':0' + visualS;
        }
        else {
            timer.firstChild.data = m + ':' + visualS;
        }
        
        //Change colors depending on time left in game
        if (value < 30 && value > 15) {
            timer.style.color = '#ffff30';
        }
        else if (value <= 15 && value > 5) {
            if (counter % 2 === 0) {
                timer.style.color = '#ffff30';
            }
            else {
                timer.style.color = '#FF3030';
            }
        }
        else if (value <= 5 && value >= 0) {
            timer.style.color = '#FF3030';
        }
        else if (m === -1) {
            timer.style.color = '#09b509'
            timer.firstChild.data = "N/A";
        }
        else {
            timer.style.color = 'white';
        }
    });
}