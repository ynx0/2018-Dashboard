var player = require('play-sound') (opts = {})
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
        readout: document.getElementById('example-readout').firstChild
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

// Sets function to be called on NetworkTables connect. Commented out because it's usually not necessary.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

// Sets function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false);

// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);

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

/**
 * Function to be called when robot connects
 * @param {boolean} connected 
 */


/*
element.addEventListener("click", function(e){
  e.preventDefault;
  
  element.classList.remove("run-animation");
  void element.offsetWidth;
  element.classList.add("run-animation");
}, false);
*/
function runFlash(element) {
    console.log('ran');
    element.style.animationName = null;
    element.offsetHeight; /* trigger reflow */
    element.style.animationName = "flash";
}

function collectedCube(collected) {
    var cube = document.getElementById("Cube");
    var cameraBackground = document.getElementById("camera");
    if (collected === true) {
        cube.style.opacity = 100;
        cube.style.x = 139;
        //' #333 to #FFD52E';
        runFlash(cameraBackground);
        player.play('Beep.wav', function(err){})
    }
    else if (collected === false) {
        cube.style.opacity = 0;
        cube.style.x= 50;

    }
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
    image.src = "http://192.168.9.91:8080";
}

function moveElevator(value) {
    if (value === 0) {
        value = -10;
    }
    value = 100-value
    
    var arm = document.getElementById("ElevatorCarriage");
    var cube = document.getElementById("Cube");
    var movement = (value * .01) * 200;
    arm.style.y = 160+movement;
    cube.style.y = 125+movement;
}

function onRobotConnection(connected) {
    var fadeHelp = document.getElementById("helpText");
    var state = connected ? 'Robot connected!' : 'Robot disconnected.';
    console.log(state);
    ui.robotState.data = state;
    if (!noElectron) {
        if (connected) {
            fadeHelp.style.opacity = "0";
            // On connect hide the connect popup
            document.body.classList.toggle('login-close', true);
        }
        else {
            console.log("Scanning for robot");
            fadeHelp.style.opacity = "100";
            // On disconnect show the connect popup
            document.body.classList.toggle('login-close', false);
            // Add Enter key handler
            address.onkeydown = ev => {
                if (ev.key === 'Enter') {
                    connect.click();
                }
            };
            // Enable the input and the button
            address.disabled = false;
            connect.disabled = false;
            connect.firstChild.data = 'Connect';
            // Add the default address and select xxxx
            address.value = '10.4.1.2';
            address.focus();
            address.setSelectionRange(8, 12);
            // On click try to connect and disable the input and the button
            ipc.send('connect', address.value);
            address.disabled = true;
            connect.disabled = true;
            connect.firstChild.data = 'Connecting';
            //sleep(200);
        }
    }
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
NetworkTables.addKeyListener('/SmartDashboard/drive/navx/yaw', updateGyro);

// The following case is an example, for a robot with an arm at the front.
// Info on the actual robot that this works with can be seen at thebluealliance.com/team/1418/2016.
NetworkTables.addKeyListener('/SmartDashboard/arm/encoder', (key, value) => {
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

function armMover(value) {
    ui.robotDiagram.arm.style.transform = `rotate(${value}deg)`;
}

NetworkTables.addKeyListener('/SmartDashboard/beep', (key,value) => {
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

// This button is just an example of triggering an event on the robot by clicking a button.
NetworkTables.addKeyListener('/SmartDashboard/example_variable', (key, value) => {
    // Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
    // TODO: We shouldn't have to do this for every variable that can be a boolean.
    if (typeof value === 'string')
        value = value === 'true';
    // Set class active if value is true and unset it if it is false
    ui.example.button.classList.toggle('active', value);
    ui.example.readout.data = 'Value is ' + (value ? 'true' : 'false');
});
NetworkTables.addKeyListener('/SmartDashboard/match_time', (key, value) => {
    //Turn seconds passed to time in minutes:seconds as m:visualS
    var counter = Math.floor(value).toFixed(0);
    //M = minutes
    var m = Math.floor(counter/60);
    //visualS = seconds
    var visualS = (counter % 60);

    //Control what is displayed on the clock
    if (visualS < 10) {
        ui.timer.firstChild.data = m + ':0' + visualS;
    }
    else {
        ui.timer.firstChild.data = m + ':' + visualS;
    }
    
    //Change colors depending on time left in game
    if (value < 30 && value > 15) {
        ui.timer.style.color = '#ffff30';
    }
    else if (value <= 15 && value > 5) {
        if (counter % 2 === 0) {
            ui.timer.style.color = '#ffff30';
        }
        else {
            ui.timer.style.color = '#FF3030';
        }
    }
    else if (value <= 5 && value >= 0) {
        ui.timer.style.color = '#FF3030';
    }
    else if (m === -1) {
        ui.timer.style.color = '#09b509'
        ui.timer.firstChild.data = "N/A";
    }
    else {
        ui.timer.style.color = 'white';
    }
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/time_running', (key, value) => {
    // Clear previous list
    while (ui.autoSelect.firstChild) {
        ui.autoSelect.removeChild(ui.autoSelect.firstChild);
    }
    // Make an option for each autonomous mode and put it in the selector
    for (let i = 0; i < value.length; i++) {
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(value[i]));
        ui.autoSelect.appendChild(option);
    }
    // Set value to the already-selected mode. If there is none, nothing will happen.
    ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
    ui.autoSelect.value = value;
});

/**
 * Global Listener that runs whenever any value changes
 * @param {string} key 
 * @param value 
 * @param {boolean} isNew 
 */
function onValueChanged(key, value, isNew) {
    // Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
    if (value === 'true') {
        value = true;
    }
    else if (value === 'false') {
        value = false;
    }
    // The following code manages tuning section of the interface.
    // This section displays a list of all NetworkTables variables (that start with /SmartDashboard/) and allows you to directly manipulate them.
    var propName = key.substring(16, key.length);
    // Check if value is new and doesn't have a spot on the list yet
    if (isNew && !document.getElementsByName(propName)[0]) {
        // Make sure name starts with /SmartDashboard/. Properties that don't are technical and don't need to be shown on the list.
        if (/^\/SmartDashboard\//.test(key)) {
            // Make a new div for this value
            var div = document.createElement('div'); // Make div
            ui.tuning.list.appendChild(div); // Add the div to the page
            var p = document.createElement('p'); // Make a <p> to display the name of the property
            p.appendChild(document.createTextNode(propName)); // Make content of <p> have the name of the NetworkTables value
            div.appendChild(p); // Put <p> in div
            var input = document.createElement('input'); // Create input
            input.name = propName; // Make its name property be the name of the NetworkTables value
            input.value = value; // Set
            // The following statement figures out which data type the variable is.
            // If it's a boolean, it will make the input be a checkbox. If it's a number,
            // it will make it a number chooser with up and down arrows in the box. Otherwise, it will make it a textbox.
            if (typeof value === 'boolean') {
                input.type = 'checkbox';
                input.checked = value; // value property doesn't work on checkboxes, we'll need to use the checked property instead
                input.onchange = function () {
                    // For booleans, send bool of whether or not checkbox is checked
                    NetworkTables.putValue(key, this.checked);
                };
            }
            else if (!isNaN(value)) {
                input.type = 'number';
                input.onchange = function () {
                    // For number values, send value of input as an int.
                    NetworkTables.putValue(key, parseInt(this.value));
                };
            }
            else {
                input.type = 'text';
                input.onchange = function () {
                    // For normal text values, just send the value.
                    NetworkTables.putValue(key, this.value);
                };
            }
            // Put the input into the div.
            div.appendChild(input);
        }
    }
    else {
        // Find already-existing input for changing this variable
        var oldInput = document.getElementsByName(propName)[0];
        if (oldInput) {
            if (oldInput.type === 'checkbox') {
                oldInput.checked = value;
            }
            else {
                oldInput.value = value;
            }
        }
        else {
            console.log('Error: Non-new variable ' + key + ' not present in tuning list!');
        }
    }
}

// The rest of the doc is listeners for UI elements being clicked on
ui.example.button.onclick = function () {
    // Set NetworkTables values to the opposite of whether button has active class.
    NetworkTables.putValue('/SmartDashboard/example_variable', this.className != 'active');
};
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
        NetworkTables.putValue('/SmartDashboard/' + ui.tuning.name.value, ui.tuning.value.value);
    }
};
ui.tuning.get.onclick = function () {
    ui.tuning.value.value = NetworkTables.getValue(ui.tuning.name.value);
};
// Update NetworkTables when autonomous selector is changed
ui.autoSelect.onchange = function () {
    NetworkTables.putValue('/SmartDashboard/autonomous/selected', this.value);
};
// Get value of arm height slider when it's adjusted
ui.armPosition.oninput = function () {
    NetworkTables.putValue('/SmartDashboard/arm/encoder', parseInt(this.value));
};
