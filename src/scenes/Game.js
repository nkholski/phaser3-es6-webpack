import Player from '../sprites/Player';

class GameScene extends Phaser.Scene {
  constructor () {
    super( { key: 'GameScene' });

    this.player = null;
  }

  create(){
    this.player = new Player({
      scene: this,
      key: 'player',
      x: this.game.config.width/2,
      y: this.game.config.height/2-150,
    });
  }

  update(){
    this.player.update();
  }
}

export default GameScene;
