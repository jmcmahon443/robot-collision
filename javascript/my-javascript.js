// CONSTANTS.
var robotRadius = 14;
var collisionThreshold = 20; // Pixel collision threshold.
var angularVelocity = 3; // Rotate X degrees per update.
var velocity = 3; // Move X pixels per update.

var obstacle_1_width = 120;
var obstacle_1_height = 100;
var obstacle_2_width = 240;
var obstacle_2_height = 70;
var obstacle_3_width = 180;
var obstacle_3_height = 80;

// Easel.js framework.
var canvas = document.getElementById("canvas");
var stage = new createjs.Stage(canvas);

// Clock.
createjs.Ticker.addEventListener("tick", tick);
createjs.Ticker.setFPS(30);

// Initialize and add robot and obstacles.
var circle = new createjs.Shape();
circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, robotRadius);

var line = new createjs.Shape();
line.graphics.setStrokeStyle(3);
line.graphics.beginStroke('Black');
line.graphics.moveTo(0, 0);
line.graphics.lineTo(robotRadius, 0);
line.graphics.endStroke();

var line1 = new createjs.Shape();
line1.graphics.setStrokeStyle(1);
line1.graphics.beginStroke('Red');
line1.graphics.moveTo(robotRadius, 0);
line1.graphics.lineTo(robotRadius+collisionThreshold, 0);
line1.graphics.endStroke();

var line2 = new createjs.Shape();
line2.graphics.setStrokeStyle(1);
line2.graphics.beginStroke('Red');
line2.graphics.moveTo(0, robotRadius);
line2.graphics.lineTo(0, robotRadius+collisionThreshold);
line2.graphics.endStroke();

var line3 = new createjs.Shape();
line3.graphics.setStrokeStyle(1);
line3.graphics.beginStroke('Red');
line3.graphics.moveTo(0, -robotRadius);
line3.graphics.lineTo(0, -robotRadius-collisionThreshold);
line3.graphics.endStroke();

var line4 = new createjs.Shape();
line4.graphics.setStrokeStyle(1);
line4.graphics.beginStroke('Red');
line4.graphics.moveTo(Math.cos(Math.PI/4)*robotRadius, Math.sin(Math.PI/4)*robotRadius);
line4.graphics.lineTo(Math.cos(Math.PI/4)*(robotRadius+collisionThreshold), Math.sin(Math.PI/4)*(robotRadius+collisionThreshold));
line4.graphics.endStroke();

var line5 = new createjs.Shape();
line5.graphics.setStrokeStyle(1);
line5.graphics.beginStroke('Red');
line5.graphics.moveTo(Math.cos(-Math.PI/4)*robotRadius, Math.sin(-Math.PI/4)*robotRadius);
line5.graphics.lineTo(Math.cos(-Math.PI/4)*(robotRadius+collisionThreshold), Math.sin(-Math.PI/4)*(robotRadius+collisionThreshold));
line5.graphics.endStroke();

var container = new createjs.Container();
container.x = 450;
container.y = 350;

container.addChild(circle);
container.addChild(line);
container.addChild(line1);
container.addChild(line2);
container.addChild(line3);
container.addChild(line4);
container.addChild(line5);

stage.addChild(container);

var obstacle_1 = new createjs.Shape();
obstacle_1.graphics.beginFill("Red").drawRect(0, 0, obstacle_1_width, obstacle_1_height);
obstacle_1.x = 40;
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
obstacle_3.y = 200;
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

// Returns true if robot is within collision threshold of any obstacles or canvas edge.
function isColliding() {
	// Check if the robot is within the collision threshold of the edge of the canvas.
	var x = container.x;
	var y = container.y;
	x = x + velocity * Math.cos( Math.PI * container.rotation / 180 ); // Add the next velocity step.
	y = y + velocity * Math.sin( Math.PI * container.rotation / 180 );
	var xLow = x - robotRadius
	var xHigh = x + robotRadius;
	var yLow = y - robotRadius;
	var yHigh = y + robotRadius;
	if( xLow < collisionThreshold || xHigh > canvas.width - collisionThreshold || yLow < collisionThreshold || yHigh > canvas.height - collisionThreshold ) {
		return true;
	}

	// Check if the robot is colliding with obstacle 1.
	if( xHigh > ( obstacle_1.x - collisionThreshold ) && xLow < ( obstacle_1.x + obstacle_1_width + collisionThreshold ) && yHigh > ( obstacle_1.y  - collisionThreshold ) && yLow < ( obstacle_1.y + obstacle_1_height + collisionThreshold ) ) {
		return true;
	}

	// Check if the robot is colliding with obstacle 2.
	if( xHigh > ( obstacle_2.x - collisionThreshold ) && xLow < ( obstacle_2.x + obstacle_2_width + collisionThreshold ) && yHigh > ( obstacle_2.y - collisionThreshold ) && yLow < ( obstacle_2.y + obstacle_2_height + collisionThreshold ) ) {
		return true;
	}

	// Check if the robot is colliding with obstacle 3.
	if( xHigh > ( obstacle_3.x - collisionThreshold ) && xLow < ( obstacle_3.x + obstacle_3_width + collisionThreshold ) && yHigh > ( obstacle_3.y - collisionThreshold ) && yLow < ( obstacle_3.y + obstacle_3_height + collisionThreshold ) ) {
		return true;
	}

	// If the function has reached this point, the robot is not is collision.
	return false;
}

// Turns the robot left.
function turnRobot() {
	container.rotation = container.rotation + angularVelocity;
}

// Translates the robot forward.
function randomWalk() {
	// Part tracking.
	lx = container.x;
	ly = container.y;
	// Take one step forward.
	container.x = container.x + velocity * Math.cos( Math.PI * container.rotation / 180 );
	container.y = container.y + velocity * Math.sin( Math.PI * container.rotation / 180 );
	// Then turn a random amount, with the angularVelocity constant as the maximum.
	var randomTurn = Math.random() - 0.5;
	container.rotation = container.rotation + 2 * randomTurn * angularVelocity;

	var path = new createjs.Shape();
	path.graphics.setStrokeStyle(1);
	path.graphics.beginStroke('Black');
	path.graphics.moveTo(lx, ly);
	path.graphics.lineTo(container.x, container.y);
	path.graphics.endStroke();
}

// Updates the robot.
function updateRobot() {
	// If the robot is colliding, it should turn.
	if ( isColliding() ) {
		turnRobot();
	} else { // Otherwise, move forward.
		randomWalk();
	}
}

// Clock tick event.
function tick(event) {
	// If it's been long enough.
	if( createjs.Ticker.getTime() > 20000 ) {
		createjs.Ticker.removeEventListener("tick", tick);
		cc.stop(); // Stop screen recording.
	// Otherwise.
	} else {
		updateRobot(); // Update the robot.
		stage.update(); // Refresh the stage.
		// Stream the robot's rotation and position.
		console.log("Time: "+createjs.Ticker.getTime());
		console.log("Rotation: "+container.rotation);
		console.log("Absolute Position: ["+container.x+","+container.y+"]");
		var transX = container.x - 450;
		var transY = container.y - 350;
		console.log("Translation: ["+transX+","+transY+"]");
		console.log("----------------------------------");
	}
}