import 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import TitleScene from './scenes/TitleScene';
import YouAreSafe from './scenes/YouAreSafe';

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.WEBGL,
    pixelArt: true,
    roundPixels: true,
    parent: 'content',
    width: 400,
    height: 240,
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 800
            },
            debug: false
        }
    },
    scene: [
        BootScene,
        TitleScene,
        GameScene,
        YouAreSafe
    ]
};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
