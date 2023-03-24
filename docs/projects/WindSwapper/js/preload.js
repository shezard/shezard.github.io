window.g = window.g || {};
g.preload = function() {
  game.load.image('ground', 'assets/ground.png');
  game.load.image('rwall', 'assets/rwall.png');
  game.load.image('lwall', 'assets/lwall.png');
  game.load.image('sign', 'assets/sign.png');
  game.load.image('platform', 'assets/platform.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.image('rain', 'assets/rain.png');
  game.load.image('rain', 'assets/rain-explosion.png');
}