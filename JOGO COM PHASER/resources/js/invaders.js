
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'Space Invaders - BSI', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('bullet', 'resources/img/bullet.png');
    game.load.image('enemyBullet', 'resources/img/enemy-bullet.png');
    game.load.spritesheet('invader', 'resources/img/inimigo.png', 82, 82);
    game.load.image('ship', 'resources/img/nave.png');
    game.load.spritesheet('kaboom', 'resources/img/explode.png', 128, 128);
    game.load.image('starfield', 'resources/img/lactea.png');
    /*game.load.image('background', 'assets/games/starstruck/background2.png');*/

}

var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var seconds = 0;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    starfield = game.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'starfield');

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    player = game.add.sprite(game.world.centerX, game.world.height - 100, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    criarAliens();

    scoreString = 'Pontos : ';
    scoreText = game.add.text(10, game.world.height - 50, scoreString + score, { font: '34px Arial', fill: '#FFD700' });

    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Vidas', { font: '34px Arial', fill: '#FFD700' });
	
	secondText = game.add.text(game.world.width - 150, game.world.height - 50, 'Alvos: ' + seconds, { font: '34px Arial', fill: '#FFD700'});
	
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var imagemVida = lives.create(game.world.width - 88 + (30 * i), 60, 'enemyBullet');
        imagemVida.anchor.setTo(0.5, 0.5);
    }

    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

function criarAliens () {

    for (var y = 0; y < 3; y++)
    {
        for (var x = 0; x < 17; x++)
        {
            var alien = aliens.create(x * 70, y * 90, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.body.moves = false;
        }
    }

    aliens.x = 100;
    aliens.y = 50;
	
    var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    tween.onLoop.add(descend, this);
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += 10;

}

function update() {
		
	starfield.tilePosition.y += 2;

    if (player.alive)
    {
        player.body.velocity.setTo(0, 0);
		
		if (cursors.left.isDown)
    {
        player.x -= 4;
        player.scale.x = -1;
    }
    else if (cursors.right.isDown)
    {
        player.x += 4;
        player.scale.x = 1;
    }

    if (cursors.up.isDown)
    {
        player.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        player.y += 4;
    }

    if (fireButton.isDown)
    {
        fireBullet();
    }

    if (game.time.now > firingTimer)
    {
        enemyFires();
    }

    game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    }

}

function render() {
	//Necessário para renderização
}

function collisionHandler (bullet, alien) {

    bullet.kill();
    alien.kill();
	
	seconds += 1;
    score += 20;
	secondText.text = "Alvos: " + seconds;
    scoreText.text = scoreString + score;

	//@TODO - EXPLOSAO CASO FOR NECESSARIO
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " Você venceu! \n Clique para reiniciar";
        stateText.visible = true;

        game.input.onTap.addOnce(restart,this);
    }

}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');
		game.stop;
        stateText.text=" Você perdeu! \n Clique para reiniciar";
        stateText.visible = true;

        game.input.onTap.addOnce(restart,this);
    }

}

function enemyFires () {

    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        var shooter=livingEnemies[random];
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,220);
        firingTimer = game.time.now + 2500;
    }

}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = - 500;
            bulletTime = game.time.now + 100;
        }
    }

}

function resetBullet (bullet) {
    seconds = 0;
	bullet.kill();
}

function restart () {
	
	seconds = 0;
    score = 0;
	secondText.text = "Alvos: " + seconds;
    scoreText.text = scoreString + score;
    lives.callAll('revive');
    aliens.removeAll();
    criarAliens();
    player.revive();
    stateText.visible = false;

}
