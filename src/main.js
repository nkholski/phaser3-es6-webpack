import 'phaser';
import BootScene from './scenes/Boot';
import BootMenu from './scenes/BootMenu';
import PlayerScene from './scenes/examples/PlayerScene';
import MushroomScene from './scenes/examples/MushroomScene';
import MarioBrosScene from './mariobros/MarioBrosScene';


let config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 400,
    height: 240,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: true
        }
    },
    scene: [
      BootScene,
      BootMenu,
      MushroomScene,
      PlayerScene,
      MarioBrosScene
    ]
};

let game = new Phaser.Game(config);
