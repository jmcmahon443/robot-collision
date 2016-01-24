var velocity = 3; // 2 pixels per update
var ang_velocity = 1; // degrees per update (convert to radians?)

var canvas = document.getElementById("canvas");
var stage = new createjs.Stage(canvas);

createjs.Ticker.addEventListener("tick", tick);
createjs.Ticker.setFPS(30);

// Why won't this work?
// function drawLine(){
// 	var line = new createjs.Shape();
// 	line.graphics.moveTo(220,60).setStrokeStyle(1).beginStroke("#00ff00").lineTo(300,60);
// 	stage.addChild(line);   
// }

function updateRobot(){
	random = Math.random(); // 0 to 1
	rotation = circle.rotation;
	if ( random >= 0.666 ) {
		new_rotation = rotation + ang_velocity;
	} else if ( random < 0.666 && random > 0.333 ) {
		new_rotation = rotation - ang_velocity;
	} else if ( random < 0.333 ) {
		new_rotation = rotation;
	};
	circle.rotation = new_rotation;
	circle.x = circle.x + velocity * Math.cos(Math.PI * circle.rotation/180);
	circle.y = circle.y + velocity * Math.sin(Math.PI * circle.rotation/180);
}

function tick(event) {
	updateRobot();
	stage.update();
}

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

// drawLine();

stage.update();