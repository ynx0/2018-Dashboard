// NetworkTables.addKeyListener('/SmartDashboard/vbus', (key, value) => {
//     changeCircle(value,'Voltage',6,15,false);
// });

// NetworkTables.addKeyListener('/SmartDashboard/totalAmps', (key, value) => {
//     changeNumber(value,0,200,'TotalAmps', ' A');
// });

// NetworkTables.addKeyListener('/SmartDashboard/driveShift', (key,value) =>  {
// 	changeArrow(value == "high", 'DriveShift');
// });

// NetworkTables.addKeyListener('/SmartDashboard/driveLeftAmps', (key,value) =>  {
// 	var max = NetworkTables.getEntry(NetworkTables.getKeyID('/SmartDashboard/maxDriveAmps'));
// 	changeNumber(value,0,max,'CurrentLeft', ' A');
// });

// NetworkTables.addKeyListener('/SmartDashboard/driveRightAmps', (key,value) =>  {
// 	var max = NetworkTables.getEntry(NetworkTables.getKeyID('/SmartDashboard/maxDriveAmps'));
// 	changeNumber(value,0,max,'CurrentRight', ' A');
// });

// NetworkTables.addKeyListener('/SmartDashboard/driveLeftVelocity', (key,value) =>  {
// 	var max = NetworkTables.getEntry(NetworkTables.getKeyID('/SmartDashboard/driveMaxVelocity'));
// 	var min = NetworkTables.getEntry(NetworkTables.getKeyID('/SmartDashboard/driveMinVelocity'));
// 	changeCircle(value,'Voltage',min,max,false," RPM")
// });

// NetworkTables.addKeyListener('/SmartDashboard/driveRightVelocity', (key,value) =>  {
// 	var max = NetworkTables.getEntry(NetworkTables.getKeyID('/SmartDashboard/driveMaxVelocity'));
// 	var min = NetworkTables.getEntry(NetworkTables.getKeyID('/SmartDashboard/driveMinVelocity'));
// 	changeCircle(value,'Voltage',min,max,false," RPM")
// });

// NetworkTables.addKeyListener('/SmartDashboard/driveLeftPostion', (key,value) =>  {
// 	changeNumber(value,0,0,'LeftPostion', ' R');
// });

// NetworkTables.addKeyListener('/SmartDashboard/driveRightPostion', (key,value) =>  {
// 	changeNumber(value,0,0,'RightPostion', ' R');
// });

// NetworkTables.addKeyListener('/SmartDashboard/pitch', (key,value) =>  {
// 	changeLevel(value,"Pitch");
// });

// NetworkTables.addKeyListener('/SmartDashboard/yaw', (key,value) =>  {
// 	changeCompass(value,"Compass");
// });