/* ** ** ** ** ** **
2D Reactive Navigation
Worcester Polytechnic Institute
RBE 595: Advanced Robot Navigaton
Professor Carlos Morato
Spring 2016

Joseph McMahon
January 27, 2016
								
This is a 2D simulation of a robot randomly exploring a map. It has a collision
threshold for the edge of the map and the three obstacles. Use the buttons below
to toggle the robot's path, pause, reset, or record a video.

To view streaming values, open your browser's JavaScript console:
http://webmasters.stackexchange.com/questions/8525/how-to-open-the-javascript-console-in-different-browsers.

The simluation is hosted on GitHub pages here: http://jmcmahon443.github.io/robot-collision.
The code can be viewed on my public GitHub page: https://github.com/jmcmahon443/robot-collision.

The EaselJS framework was used to draw on the canvas, and create timed events. An open source Javascript
framework was used to record the screen https://github.com/spite/ccapture.js/.

The random walk adjusts the robot's angular acceleration and moves the robot forward.
You can see this by resetin the simulation and using the path tracking - the robot
takes different paths.

This program has the following main sections:
	1.) CONSTANTS
	2.) GLOBAL VARIABLES
	3.) INITIALIZATIONS
	4.) FUNCTIONS
	5.) UPDATE EVENT
	6.) BUTTONS

** ** ** ** ** ** */

	// ** CONSTANTS ** //
var robotRadius = 15;					// Size of the robot.
var collisionThreshold = 10; 			// Pixel collision threshold.
var angularAcceleration = 0.5;			// Change in rate of rotation during randomWalk() by X degrees per update per update.
var angularVelocity = 4;				// Maximum angular velocity during randomWalk() by X degrees per update.
var turnAngularVelocity = 3;			// Rate of rotation during turnAway() by X degrees per update.
var velocity = 4;						// Move X pixels per update.

var width = window.innerWidth;
var height = window.innerHeight;
var obstacle_1_width = Math.random()*width;				// Obstacle dimensions.
var obstacle_1_height = Math.random()*height;
var obstacle_2_width = Math.random()*width;	
var obstacle_2_height = Math.random()*height;
var obstacle_3_width = Math.random()*width;
var obstacle_3_height = Math.random()*height;

	// ** GLOBAL VARIABLES ** //
var relativeRotation = 0;				// For storing relative values.
var relativeTranslationX = 0;
var relativeTranslationY = 0;

var pathTracking = true;				// Toggle path tracking.

	// ** INITIALIZATIONS ** //
	// Easel.js framework.
var canvas = document.getElementById("canvas");
canvas.width  = width-1;
canvas.height = height-1;
var stage = new createjs.Stage(canvas);

	// Clock.
createjs.Ticker.addEventListener("tick", tick);
createjs.Ticker.setFPS(30);

	// Initialize graphics.
var obstacle_1 = new createjs.Shape();
obstacle_1.graphics.beginFill("Purple").drawRect(0, 0, obstacle_1_width, obstacle_1_height);

var obstacle_2 = new createjs.Shape();
obstacle_2.graphics.beginFill("Blue").drawRect(0, 0, obstacle_2_width, obstacle_2_height);

var obstacle_3 = new createjs.Shape();
obstacle_3.graphics.beginFill("Green").drawRect(0, 0, obstacle_3_width, obstacle_3_height);

var path = new createjs.Shape();
path.graphics.setStrokeStyle(1);

var circle = new createjs.Shape();
circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, robotRadius);

var sensorCircle = new createjs.Shape();
sensorCircle.graphics.beginStroke("Red").drawCircle(0, 0, robotRadius+collisionThreshold);

var line = new createjs.Shape();
line.graphics.setStrokeStyle(3);
line.graphics.beginStroke('Black');
line.graphics.moveTo(0, 0);
line.graphics.lineTo(robotRadius, 0);
line.graphics.endStroke();

var container = new createjs.Container();

	// ** FUNCTIONS ** //
function spawnRobot() {
	container.x = Math.random()*width;
	container.y = Math.random()*height;
	while(isColliding()){
		container.x = Math.random()*width;
		container.y = Math.random()*height;
	}
}

function spawnObstacles() {
	obstacle_1.x = Math.random()*width;
	obstacle_1.y = Math.random()*height;
	obstacle_2.x = Math.random()*width;
	obstacle_2.y = Math.random()*height;
	obstacle_3.x = Math.random()*width;
	obstacle_3.y = Math.random()*height;
}

	// Returns true if robot is within collision threshold of any obstacles or canvas edge.
function isColliding() {
		// Check if the robot is within the collision threshold of the edge of the canvas.
	var x = container.x;
	var y = container.y;
		// Add the next velocity step.
	x = x + velocity * Math.cos( Math.PI * container.rotation / 180 );
	y = y + velocity * Math.sin( Math.PI * container.rotation / 180 );
	var xLow = x - robotRadius
	var xHigh = x + robotRadius;
	var yLow = y - robotRadius;
	var yHigh = y + robotRadius;

		// Check if colliding with canvas border.
	if( xLow < collisionThreshold ||
		xHigh > canvas.width - collisionThreshold ||
		yLow < collisionThreshold ||
		yHigh > canvas.height - collisionThreshold ) {
			return true;
	}

		// Check if colliding with obstacle 1.
	if( xHigh > ( obstacle_1.x - collisionThreshold ) &&
		xLow < ( obstacle_1.x + obstacle_1_width + collisionThreshold ) &&
		yHigh > ( obstacle_1.y  - collisionThreshold ) &&
		yLow < ( obstacle_1.y + obstacle_1_height + collisionThreshold ) ) {
			return true;
	}

		// Check if colliding with obstacle 2.
	if( xHigh > ( obstacle_2.x - collisionThreshold ) &&
		xLow < ( obstacle_2.x + obstacle_2_width + collisionThreshold ) &&
		yHigh > ( obstacle_2.y - collisionThreshold ) &&
		yLow < ( obstacle_2.y + obstacle_2_height + collisionThreshold ) ) {
			return true;
	}

		// Check if colliding with obstacle 3.
	if( xHigh > ( obstacle_3.x - collisionThreshold ) &&
		xLow < ( obstacle_3.x + obstacle_3_width + collisionThreshold ) &&
		yHigh > ( obstacle_3.y - collisionThreshold ) &&
		yLow < ( obstacle_3.y + obstacle_3_height + collisionThreshold ) ) {
			return true;
	}

		// If the function has reached this point, the robot is not is collision.
	return false;
}

	// ** INITIALIZATIONS ** //
spawnObstacles();
spawnRobot();

container.addChild(circle);
container.addChild(sensorCircle);
container.addChild(line);

stage.addChild(obstacle_1);
stage.addChild(obstacle_2);
stage.addChild(obstacle_3);
stage.addChild(path);
stage.addChild(container);

	// Start screen recording.
var cc = new CanvasCapture({
    debug: true,
    fps: 8,
    inCanvasEl: document.getElementById("canvas")
});
cc.start();

	// Refresh the stage.
stage.update();

	// ** FUNCTIONS ** //
	// Turn right.
function turnAway() {
	container.rotation = container.rotation + turnAngularVelocity;
		// Reset the relative rotation and translation back to 0.
	relativeRotation = 0;
	relativeTranslationX = 0;
	relativeTranslationY = 0;
}

	// Add random angular acceleration and move forward.
function randomWalk() {
		// Update relative angular velocity and rotation.
		// Random number from -1 to 1.
	randomWeight = 2 * ( Math.random() - 0.5 );
	relativeRotation = relativeRotation + randomWeight*angularAcceleration;
		// Limit the relativeRotation to the angular velocity constant.
	if( relativeRotation > angularVelocity ) {
		relativeRotation = angularVelocity;
	} else if ( relativeRotation < -angularVelocity ) {
		relativeRotation = -angularVelocity;
	}
		// Update relative translation.
		// Use trignometric functions and the robot's absolute rotation.
	relativeTranslationX = velocity * Math.cos( Math.PI * container.rotation / 180 );
	relativeTranslationY = velocity * Math.sin( Math.PI * container.rotation / 180 );

		// Rotate.
	container.rotation = container.rotation + relativeRotation;
		// Move forward and path tracking.
	if( pathTracking ) {
		path.graphics.beginStroke('DeepSkyBlue');
		path.graphics.moveTo(container.x, container.y);		
	}

	container.x = container.x + relativeTranslationX;
	container.y = container.y + relativeTranslationY;

	if( pathTracking ) {
		path.graphics.lineTo(container.x, container.y);
		path.graphics.endStroke();		
	}
}

	// Update the robot.
function updateRobot() {
	if ( isColliding() ) {				// If the robot is colliding, it should turn.
		turnAway();
			// Stream rotation and position.
		console.log("Time: "+createjs.Ticker.getTime());
		console.log("Absolute Rotation: "+container.rotation);
		console.log("Absolute Position: ["+container.x+","+container.y+"]");
		console.log("Relative Rotation: "+turnAngularVelocity);
		console.log("Relative Translation: ["+relativeTranslationX+","+relativeTranslationY+"]");
		console.log("----------------------------------");
	} else {							// Otherwise, move forward.
		randomWalk();
			// Stream rotation and position.
		console.log("Time: "+createjs.Ticker.getTime());
		console.log("Absolute Rotation: "+container.rotation);
		console.log("Absolute Position: ["+container.x+","+container.y+"]");
		console.log("Relative Rotation: "+relativeRotation);
		console.log("Relative Translation: ["+relativeTranslationX+","+relativeTranslationY+"]");
		console.log("----------------------------------");
	}
}

	// ** UPDATE EVENT ** //
	// Clock tick event.
function tick(event) {
	if( !createjs.Ticker.paused ) {
		updateRobot();						// Update the robot.
		stage.update();						// Refresh the stage.
	}
}

	// ** BUTTONS ** //
	// Toggle path tracking.
function toggleClick() {
	if( pathTracking ) {
		pathTracking = false;
		path.graphics.clear();
	} else {
		pathTracking = true;
	}
}
var toggle = document.getElementById("toggle");
toggle.onclick = function() { toggleClick() };


	// Pause.
function tickerstate() {
	if( createjs.Ticker.paused ) {
		createjs.Ticker.paused = false;
	} else {
		createjs.Ticker.paused = true;
	}
}
var pause = document.getElementById("pause");
var play = document.getElementById("play");
function pauseClick() {
	tickerstate();
	pause.style.display = "none";
	play.style.display = "inline-block";
}
function playClick() {
	tickerstate();
	pause.style.display = "inline-block";
	play.style.display = "none";
}
pause.onclick = function() { pauseClick() };
play.onclick = function() { playClick() };

	// Reset.
function resetClick() {
	createjs.Ticker.removeEventListener("tick", tick);
	path.graphics.clear();
	spawnObstacles();
	spawnRobot();
	container.rotation = 0;
	relativeRotation = 0;
	createjs.Ticker.addEventListener("tick", tick);
}
var reset = document.getElementById("reset");
reset.onclick = function() { resetClick() };

	// Stop and save video.
function videoClick() {
	createjs.Ticker.removeEventListener("tick", tick);
	cc.stop();
}
var video = document.getElementById("video");
video.onclick = function() { videoClick() };
