// CONSTANTS.
var collisionThreshold = 1; // 1 pixel collision threshold.
var angularVelocity = 1; // Rotate 1 degree per update.
var velocity = 1; // Move 1 pixel per update.

// Easel.js framework.
var canvas = document.getElementById("canvas");
var stage = new createjs.Stage(canvas);

// Clock.
createjs.Ticker.addEventListener("tick", tick);
createjs.Ticker.setFPS(30);

// Initialize and add robot and obstacles.
var circle = new createjs.Shape();
circle.graphics.beginFill("DeepSkyBlue").drawCircle(250, 350, 10);
stage.addChild(circle);

var obstacle_1 = new createjs.Shape();
obstacle_1.graphics.beginFill("Red").drawRect(40, 10, 120, 100);
stage.addChild(obstacle_1);

var obstacle_2 = new createjs.Shape();
obstacle_2.graphics.beginFill("Blue").drawRect(340, 70, 240, 70);
stage.addChild(obstacle_2);

var obstacle_3 = new createjs.Shape();
obstacle_3.graphics.beginFill("Green").drawRect(180, 200, 180, 80);
stage.addChild(obstacle_3);

// Why won't this work?
// function drawLine(){
// 	var line = new createjs.Shape();
// 	line.graphics.moveTo(220,60).setStrokeStyle(1).beginStroke("#00ff00").lineTo(300,60);
// 	stage.addChild(line);   
// }
// drawLine();

// Propogates the robot's motion forward one step.
function propogateRobot( x, y ){
	newX = x + velocity * Math.cos( Math.PI * circle.rotation / 180 );
	newY = y + velocity * Math.sin( Math.PI * circle.rotation / 180 );
	return [ newX, newY ];	
}

// Turns the robot left.
function turnRobot() {
	circle.rotation = circle.rotation + angularVelocity;
}

// Translates the robot forward.
function moveRobot() {
	newPosn = propogateRobot( circle.x, circle.y );
	circle.x = newPosn[1];
	circle.y = newPosn[2];
}

// Returns true if robot is within collision threshold of
//   any obstacles or canvas edge.
function isColliding() {
	// For each obstacle, check if the robot is colliding with it.
	// for child in stage.children {
	// 	// if ( child ) { // If it's an obstacle
	// 		if( circle.x > child.x && circle.x < ( child.x + child.width ) ) {
	// 			return true;
	// 		}
	// 	// }
	// }

	// Check if the robot is outside of the canvas.
	newPosn = propogateRobot( circle.x, circle.y );
	x = newPosn[1];
	y = newPosn[2];
	if( x < collisionThreshold || x > canvas.width - collisionThreshold || y < collisionThreshold || y > canvas.height - collisionThreshold ) {
		return true;
	}

	// If the function has reached this point, the robot is not colliding.
	return false;
}

// Updates the robot.
function updateRobot() {
	// If the robot is colliding, have it turn.
	if ( isColliding() ) {
		turnRobot();
	} else { // Otherwise, move forward.
		moveRobot();
	}
}

// Clock tick event.
function tick(event) {
	// Stream the robot's rotation and position.
	console.log(circle.rotation);
	console.log("["+circle.x+","+circle.y+"]");

	updateRobot(); // Update the robot.
	stage.update(); // Refresh the stage.
}

// Refresh the stage.
stage.update();