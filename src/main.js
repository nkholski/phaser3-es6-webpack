import 'phaser';
import BootScene from './scenes/Boot';
import GameScene from './scenes/Game';

let config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    scene: [
      BootScene,
      GameScene
    ]
};

let game = new Phaser.Game(config);
