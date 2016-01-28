# 2D Reactive Navigation
Worcester Polytechnic Institute

RBE 595: Advanced Robot Navigaton

Professor Carlos Morato

Spring 2016

Joseph McMahon

January 27, 2016

This is a 2D simulation of a robot randomly exploring a map. It has a collision threshold for the edge of the map and the three obstacles. Use the buttons below to toggle the robot's path, pause, reset, or record a video.

To view streaming values, open your browser's JavaScript console: http://webmasters.stackexchange.com/questions/8525/how-to-open-the-javascript-console-in-different-browsers.

The simluation is hosted on GitHub pages here: http://jmcmahon443.github.io/robot-collision.
The code can be viewed on my public GitHub page: https://github.com/jmcmahon443/robot-collision.

I used the EaselJS framework to draw on the canvas, create timed events. I wrote the collision detection code by myself. I used an open source Javascript script to record the screen. I did not have enough time to implement path tracking though.

The random walk adjusts the robot's angular acceleration and moves the robot forward. You can see this by resetin the simulation and using the path tracking - the robot takes different paths.

This program has the following main sections:
	1.) CONSTANTS
	2.) GLOBAL VARIABLES
	3.) INITIALIZATIONS
	4.) FUNCTIONS
	5.) UPDATE EVENT
	6.) BUTTONS