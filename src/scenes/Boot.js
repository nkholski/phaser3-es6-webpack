/* globals __DEV__ */

class BootScene extends Phaser.Scene {
  constructor () {
    super( { key: 'BootScene' });
    if (__DEV__) {
      console.log("BootScene created!");
    }
  }

  preload() {
    this.load.image('mushroom', './assets/images/mushroom2.png');
  }

  create(){
    this.scene.start('GameScene');
  }
}

export default BootScene;
