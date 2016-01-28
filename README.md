# robot-collision
Simulation of a 2D robot colliding into things.

This is a 2D simulation of a robot randomly exploring a map. It has a collision threshold for the edge of the map and the three obstacles. Use the buttons below to toggle the robot's path, pause, reset, or record a video.

The code can be viewed on my public GitHub page: https://github.com/jmcmahon443/robot-collision.

I used the EaselJS framework to draw on the canvas, create timed events. I wrote the collision detection code by myself. I used an open source Javascript script to record the screen. I did not have enough time to implement path tracking though.

The random walk adjusts the robot's angular acceleration and moves the robot forward. You can see this by resetin the simulation and using the path tracking - the robot takes different paths.

The collision avoidance uses a threshold in which the robot considers itself in collision.