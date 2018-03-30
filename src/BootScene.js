import AnimatedTiles from 'phaser-animated-tiles';

class BootScene extends Phaser.Scene {
    constructor(test) {
      super({
        key: 'BootScene'
      });
    }
    preload()
    {
        this.load.image('background-clouds', 'assets/images/clouds.png'); // 16-bit later
        // Tilemap with a lot of objects and tile-properties tricks
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/super-mario.json');
        // I load the tiles as a spritesheet so I can use it for both sprites and tiles
        this.load.spritesheet('tiles', 'assets/images/super-mario.png', { frameWidth: 16, frameHeight: 16 });
        // Just for fun:
        this.load.spritesheet('tiles-16bit', 'assets/images/super-mario-16bit.png', { frameWidth: 16, frameHeight: 16 });
        // Spritesheets with fixed sizes. Should be replaced with atlas:
        this.load.spritesheet('mario', 'assets/images/mario-sprites.png', { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('sprites16', 'assets/images/16x16sprites.png', { frameWidth: 16, frameHeight: 16 });
        // Beginning of an atlas to replace spritesheets
        this.load.atlas('mario-sprites', 'assets/mario-sprites.png', 'assets/mario-sprites.json');
        // Music to play. Need to cut it for it to loop properly
        this.load.audio('overworld', [
          'assets/music/overworld.ogg',
          'assets/music/overworld.mp3'
        ]);
    
        this.load.audioSprite('sfx', [
          'assets/audio/sfx.ogg',
          'assets/audio/sfx.mp3'
        ], 'assets/audio/sfx.json', {
            instances: 4
          });
    
        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
    
        // Load plugin for animated tiles. This is just a first build of an upcoming plugin.
        // It's not optimized and lack features. The source code will be released when an
        // official first version is released.
        console.log("before")
        this.load.plugin('AnimatedTiles', AnimatedTiles);

          console.log("af")
        this.load.json('attractMode', 'assets/json/attractMode.json');    }
    create()
    {
      console.log("BOOTED");
//      this.scene.start('MarioBrosScene');
       this.scene.start('TitleScene');
        
    }
}

export default BootScene;
