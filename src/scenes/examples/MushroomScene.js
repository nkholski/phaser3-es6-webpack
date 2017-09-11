import Mushroom from '../../sprites/Mushroom';

class MushroomScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MushroomScene'
    });
  }

  create() {
    this.mushroom = new Mushroom({
      scene: this,
      key: 'mushroom',
      x: this.game.config.width / 2,
      y: this.game.config.height / 2 - 150,
    })

    this.tweens.add({
      targets: this.mushroom,
      y: this.game.config.height / 2 + 150,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1
    });
  }

  update() {
    this.mushroom.update();
  }
}

export default MushroomScene;
