export default class Mushroom extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y , config.key);
    config.scene.add.existing(this);
  }

  update () {
    this.angle++;
  }
}
