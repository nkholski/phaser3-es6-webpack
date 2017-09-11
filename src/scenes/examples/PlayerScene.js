/*
  Created by @srobertson421
*/

import Player from '../../sprites/Player';

class PlayerScene extends Phaser.Scene {
  constructor () {
    super( { key: 'PlayerScene' });

    this.player = null;
  }

  create(){
    this.player = new Player({
      scene: this,
      key: 'player',
      x: this.game.config.width/2,
      y: this.game.config.height/2-150,
    });
    this.player.scaleX=10;
    this.player.scaleY=10;
  }

  update(){
    this.player.update();
  }
}

export default PlayerScene;
