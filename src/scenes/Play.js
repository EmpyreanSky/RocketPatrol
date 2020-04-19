class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image("rocket", "./assets/rocket.png");
        this.load.image("spaceship", "./assets/spaceship.png");
        this.load.image("spaceship2", "./assets/spaceship2.png");
        this.load.image("starfield", "./assets/starfield.png");
        this.load.image("starfield2", "./assets/starfield2.png");
        this.load.image("particles", "./assets/particle.png");
        this.load.spritesheet("explosion", "./assets/explosion.png", 
            {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.audio("backgroundMusic", "./assets/background_music.ogg");
    }

    create() {
        // background music
        let bgMusic = this.sound.add("backgroundMusic");
        bgMusic.setLoop(true);
        bgMusic.play();

        // place tile sprite
        this.starfield = this.add.tileSprite (0, 0, 640, 480, "starfield").setOrigin(0,0);
        this.starfield2 = this.add.tileSprite (0, 0, 640, 480, "starfield2").setOrigin(0,0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0.0);
        this.add.rectangle(5, 442, 630, 32, 0xFFFFFF).setOrigin(0.0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0.0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0.0);

        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0.0);

        // add the rocket (p1) 
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 
            "rocket").setScale(0.5, 0.5).setOrigin(0,0);
        
        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 150, "spaceship", 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 210, "spaceship", 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 280, "spaceship", 0, 10).setOrigin(0, 0);
        // fast spaceship
        this.ship04 = new Spaceship2(this, game.config.width, 130, "spaceship2", 0, 40).setOrigin(0, 0);

        // difine keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // score
        this.p1Score = 0;

        // score display
        let scoreConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        // game over flag
        this.gameOver = false;

        // timer display
        let timerConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#FACADE",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 60
        }
        this.timerMiddle = this.add.text(300, 54, game.settings.gameTimer, timerConfig);

        // create particle
        this.particles = this.add.particles("particles");
        // create emitter
        this.emitter = this.particles.createEmitter({
            speed: 200,
            lifespan: 400,
            blendMode:"ADD",
            frequency: 50,
            scale: {start: 1, end: 0},
            on: false
        });

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, "(F)ire to Restart or <- for Menu", scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        this.timerMiddle.text = game.settings.gameTimer/1000 - Math.floor(this.clock.getElapsedSeconds());
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // scroll starfield
        this.starfield.tilePositionX -= 4;
        this.starfield2.tilePositionX -= 3;
        
        // checking game over status
        if (!this.gameOver){
            // update rocket
            this.p1Rocket.update();

            // update spaceship
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
    }

    // checking collision between rocket and spaceship
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;
        // create explosion sprite at the ship's position
        this.particles.emitParticleAt(ship.x + 30, ship.y + 15, 50);
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
        boom.anims.play("explode");
        boom.on("animationcomplete", () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play("sfx_explosion");
    }
}