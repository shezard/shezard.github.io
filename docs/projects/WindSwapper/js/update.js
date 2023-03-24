window.g = window.g || {};
g.update = function() {
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(g.emitter.rain, platforms, function(rain) {
    // TODO : add rain touching floor explosion
    rain.kill();
  }, null, this);
  
  player.body.velocity.x = 0;

  if(!player.body.touching.none) {
    if (g.cursors.left.isDown) {
        player.body.velocity.x -= 200.0;
    } else if (g.cursors.right.isDown) {
        player.body.velocity.x += 200.0;
    } 
  } else {
   if (g.cursors.left.isDown) {
        player.body.velocity.x -= 200.0 - g.wind.getSpeed();
    } else if (g.cursors.right.isDown) {
        player.body.velocity.x += 200.0 + g.wind.getSpeed();
    } else {
        player.body.velocity.x = g.wind.getSpeed();
    }
  }
  
  if(g.cursors.left.isDown) {
      player.animations.play('left');
  } else if(g.cursors.right.isDown) {
      player.animations.play('right');
  } else if(player.body.velocity.x == 0) {
      player.animations.stop();
  }
  
  player._reading = false;
  game.physics.arcade.collide(player, sign, function() {
    player._reading = true;
  }, null, this);
  
  if (g.cursors.up.isDown && player.body.touching.down) {
    if(!player._reading) {
      player.body.velocity.y = -550;
    } else {
      console.log('Lorem Ispum ...');
    }
  }
  
  if(game.input.keyboard.justPressed(32)) {
    player.body.gravity.y = 500;
  }
  
   if(game.input.keyboard.justReleased(32)) {
    player.body.gravity.y = 1000;
  }
  
  // q
  if(game.input.keyboard.justPressed(81)) {
    g.wind.direction = -1;
  };

  // d 
   if(game.input.keyboard.justPressed(68)) {
    g.wind.direction = 1;
  };
  
  g.emitter.rain._update(g.wind, player.body.x);
  game.camera.update();
}