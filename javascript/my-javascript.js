/*  2D Robot Collision Simulator
	Worcester Polytechnic Institute
	RBE 595: Advanced Robot Navigaton
	Professor Carlos Morato
	Spring 2016

	Joseph McMahon
	January 27, 2016
								
	The purpose of this simulator is to understand Reactive Navigation by implementing a randomly walking
	2D robot.

	This program has the following main sections:
		1.) CONSTANTS
		2.) GLOBAL VARIABLES
		3.) INITIALIZATIONS
		4.) FUNCTIONS
		5.) UPDATE EVENT
*/

	// ** CONSTANTS ** //
var robotRadius = 15;					// Size of the robot.
var collisionThreshold = 5; 			// Pixel collision threshold.
var angularAcceleration = 1;			// Change in rate of rotation during randomWalk() by X degrees per update per update.
var angularVelocity = 5;				// Maximum angular velocity during randomWalk() by X degrees per update.
var turnAngularVelocity = 3;			// Rate of rotation during turnRight() by X degrees per update.
var velocity = 4;						// Move X pixels per update.

var obstacle_1_width = 120;				// Obstacle dimensions.
var obstacle_1_height = 100;
var obstacle_2_width = 240;
var obstacle_2_height = 70;
var obstacle_3_width = 180;
var obstacle_3_height = 80;

	// ** GLOBAL VARIABLES ** //
var relativeRotation = 0;				// For storing relative values.
var relativeTranslationX = 0;
var relativeTranslationY = 0;

	// ** INITIALIZATIONS ** //
	// Easel.js framework.
var canvas = document.getElementById("canvas");
var stage = new createjs.Stage(canvas);

	// Clock.
createjs.Ticker.addEventListener("tick", tick);
createjs.Ticker.setFPS(30);

	// Initialize and add robot and obstacles.
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
container.x = 450;
container.y = 350;

container.addChild(circle);
container.addChild(sensorCircle);
container.addChild(line);

stage.addChild(container);

var obstacle_1 = new createjs.Shape();
obstacle_1.graphics.beginFill("Purple").drawRect(0, 0, obstacle_1_width, obstacle_1_height);
obstacle_1.x = 70;
obstacle_1.y = 10;
stage.addChild(obstacle_1);

var obstacle_2 = new createjs.Shape();
obstacle_2.graphics.beginFill("Blue").drawRect(0, 0, obstacle_2_width, obstacle_2_height);
obstacle_2.x = 340;
obstacle_2.y = 70;
stage.addChild(obstacle_2);

var obstacle_3 = new createjs.Shape();
obstacle_3.graphics.beginFill("Green").drawRect(0, 0, obstacle_3_width, obstacle_3_height);
obstacle_3.x = 180;
obstacle_3.y = 220;
stage.addChild(obstacle_3);

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

// Turn right.
function turnRight() {
	container.rotation = container.rotation + turnAngularVelocity;
	relativeRotation = 0;			// Reset the relative rotation back to 0.
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
		// Move forward.
	container.x = container.x + relativeTranslationX;
	container.y = container.y + relativeTranslationY;
}

	// Update the robot.
function updateRobot() {
	if ( isColliding() ) {				// If the robot is colliding, it should turn.
		turnRight();
	} else {							// Otherwise, move forward.
		randomWalk();
	}
}

	// ** UPDATE EVENT ** //
	// Clock tick event.
function tick(event) {
	updateRobot();						// Update the robot.
	stage.update();						// Refresh the stage.
		// Stream rotation and position.
	console.log("Time: "+createjs.Ticker.getTime());
	console.log("Absolute Rotation: "+container.rotation);
	console.log("Absolute Position: ["+container.x+","+container.y+"]");
	console.log("Relative Rotation: "+relativeRotation);
	console.log("Relative Translation: ["+relativeTranslationX+","+relativeTranslationY+"]");
	console.log("----------------------------------");
}