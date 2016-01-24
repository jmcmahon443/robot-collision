var canvas = document.getElementById("testCanvas");
var stage = new createjs.Stage(canvas);

var circle = new createjs.Shape();
circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
stage.addChild(circle);

stage.update();