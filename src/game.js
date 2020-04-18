const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 640,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false,
        }
    }
};

const game = new Phaser.Game(config);

let player, ball, cursors;
let gameStarted = false;
let openingText, gameOverText, playerWonText;

function preload() {
    this.load.image('ball', 'assets/images/ball_32_32.png');
    this.load.image('paddle', 'assets/images/lie-down.png');
}

function create() {
    player = this.physics.add.sprite(
        400, // x position
        600, // y position
        'paddle', // key of image for the sprite
    );

    ball = this.physics.add.sprite(
        400, // x position
        565, // y position
        'ball' // key of image for the sprite
    );

    cursors = this.input.keyboard.createCursorKeys();
    player.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1, 1);
    player.setImmovable(true);
    this.physics.add.collider(ball, player, hitPlayer, null, this);

    openingText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Press SPACE to Start',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        }
    );
    
    openingText.setOrigin(0.5);

    // Create game over text
    gameOverText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Game Over',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        }
    );
  
    gameOverText.setOrigin(0.5);

    // Make it invisible until the player loses
    gameOverText.setVisible(false);

    // Create the game won text
    playerWonText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'You won!',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        }
    );

    playerWonText.setOrigin(0.5);

    // Make it invisible until the player wins
    playerWonText.setVisible(false);
}

function update() {
    if (isGameOver(this.physics.world)) {
        gameOverText.setVisible(true);
        ball.disableBody(true, true);
        return;
    }
    if (isWon()) {
        playerWonText.setVisible(true);
        ball.disableBody(true, true);
        return;
    }

    player.body.setVelocityX(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-350);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(350);
    }

    if (!gameStarted) {
        ball.setX(player.x);
        
        if (cursors.space.isDown) {
            gameStarted = true;
            ball.setVelocityY(-200);
            openingText.setVisible(false);
        }
    }
}

function isGameOver(world) {
    return ball.body.y > world.bounds.height;
}

function isWon() {
    return false;
}

function hitPlayer(ball, player) {
    // Increase the velocity of the ball after it bounces
    ball.setVelocityY(ball.body.velocity.y - 5);
  
    let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
    // If the ball is to the left of the player, ensure the X-velocity is negative
    if (ball.x < player.x) {
        ball.setVelocityX(-newXVelocity);
    } else {
        ball.setVelocityX(newXVelocity);
    }
}