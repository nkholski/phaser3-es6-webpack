import 'phaser';
import BootScene from './BootScene';
import MarioBrosScene from './MarioBrosScene';
import TitleScene from './TitleScene';

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.WEBGL,
    pixelArt: true,
    parent: 'content',
    width: 400,
    height: 240,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [
        BootScene,
        TitleScene,
        MarioBrosScene
    ]
};

const game = new Phaser.Game(config);