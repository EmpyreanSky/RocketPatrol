/*
These are the modifications I made to the project:

Add your own (copyright-free) background music to the Play scene (10)
Create a new scrolling tile sprite for the background (10)
Allow the player to control the Rocket after it's fired (10)
Display the time remaining (in seconds) on the screen (15)
Implement parallax scrolling (15)
Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (25)
Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (25)

I understand this adds up to 110, but that's just incase you don't count the new scrolling background I
made that's paired up closely with parallax scrolling. =]
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}

// reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT;