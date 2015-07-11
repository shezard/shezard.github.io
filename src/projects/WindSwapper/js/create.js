window.g = window.g || {};

g.create = function() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  
  // Setup the background - OFF from now on ?
  game.stage.backgroundColor = 0x000000;
  
  // global - Setup the platforms
  platforms = game.add.group();
  platforms.enableBody = true;
  
  // Setup the ground & walls
  var floor = new Phaser.TileSprite(game, 32, game.world.height - 32, game.stage.bounds.width - 64, 32, 'ground');
  var rwall = new Phaser.TileSprite(game, game.world.width - 32, 0, 32, game.stage.bounds.height - 32, 'rwall');
  var lwall = new Phaser.TileSprite(game, 0, 0, 32, game.stage.bounds.height - 32, 'lwall');
  platforms.add(floor).body.immovable = true;
  platforms.add(rwall).body.immovable = true;
  platforms.add(lwall).body.immovable = true;

  sign = game.add.sprite(256, game.world.height - 48, 'sign');
  game.physics.arcade.enable(sign);
  sign.body.immovable = true;
  
  // Setup legdes to be climbed
  platforms.create(416, 480, 'platform').body.immovable = true;
  platforms.create(32, 320, 'platform').body.immovable = true;
  platforms.create(64, 320, 'platform').body.immovable = true;
  platforms.create(96, 320, 'platform').body.immovable = true;
  platforms.create(128, 352, 'platform').body.immovable = true;
  platforms.create(160, 352, 'platform').body.immovable = true;
  platforms.create(192, 352, 'platform').body.immovable = true;
  platforms.create(224, 384, 'platform').body.immovable = true;
  platforms.create(256, 384, 'platform').body.immovable = true;
  platforms.create(288, 384, 'platform').body.immovable = true;
  
  player = game.add.sprite(32, game.world.height - 150, 'dude');
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);
  game.physics.arcade.enable(player);
  
  player.body.bounce.y = 0.1;
  player.body.gravity.y = 1000;
  player.body.collideWorldBounds = true;
  
  game.camera.setSize(800,600);
  game.camera.follow(player);
  
  g.cursors = game.input.keyboard.createCursorKeys();
  
  // Setup the wind
  g.wind = {};
  g.wind.base = 0;
  g.wind.speed = 100;
  g.wind.direction = 1;
  g.wind.getSpeed = function() {
    return g.wind.base+g.wind.direction*g.wind.speed
  }
  
  // And the rain accordingly
  g.emitter = g.emitter || {};
  g.emitter.rain = emitterRain(g.wind);
}

var emitterRain = function(wind) {

  var emitterRain = game.add.emitter(0, 0, 50);
      emitterRain.gravity = 1200;
      emitterRain.setXSpeed(wind.getSpeed()*6+50, wind.getSpeed()*6-50);
      emitterRain.setYSpeed(350, 150);
      emitterRain.minRotation = 0;
      emitterRain.maxRotation = 0;
      emitterRain.makeParticles('rain', 0, 75, true);
      emitterRain.start(false, 1000, 50);
  
  emitterRain._update = function(wind, x) {
    emitterRain.setXSpeed(wind.getSpeed()*6+50, wind.getSpeed()*6-50);
    emitterRain.x = 1600*(Math.random()-.5) + x;
  }

  return emitterRain;
}