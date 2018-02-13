import Mario from './sprites/Mario';
import Goomba from './sprites/Goomba';
import Turtle from './sprites/Turtle';
import PowerUp from './sprites/PowerUp';
import SMBTileSprite from './sprites/SMBTileSprite';
import makeAnimations from './helpers/animations';
class MarioBrosScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MarioBrosScene'
    });
  }

  preload() {
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
    this.load.plugin('AnimatedTiles', 'assets/plugins/AnimatedTiles.js');
  }

  create() {
    // Install AnimatedTiles plugin to allow to use it
    this.sys.install('AnimatedTiles');

    // Places to warp to (from pipes)
    this.destinations = {};
    // Array of rooms to keep bounds within to avoid the need of multiple tilemaps per level.
    this.rooms = [];
    // Running in 8-bit mode
    this.eightBit = true;

    // Add and play the music
    this.music = this.sound.add('overworld');
    this.music.play({ loop: true });

    // Define all sprite animations we'll use
    makeAnimations(this);

    // Add the map 
    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

    // Dynamic layer because we want breakable and animated tiles
    this.groundLayer = this.map.createDynamicLayer('world', this.tileset, 0, 0);

    // We got the map. Tell animated tiles plugin to loop through the tileset properties and get ready.
    // We don't need to do anything beyond this point for animated tiles to work.
    this.sys.animatedTiles.init(this.map);

    // Probably not the correct way of doing this:
    this.physics.world.bounds.width = this.groundLayer.width;

    // Add the background as an tilesprite. TODO: Not working since beta 20
    let tileSprite = this.add.tileSprite(0, 0, this.groundLayer.width, 500, 'background-clouds');

    // Set collision by property
    this.groundLayer.setCollisionByProperty({ collide: true });

    // CREATE MARIO!!!
    this.mario = new Mario({
      scene: this,
      key: 'mario',
      x: 16 * 6, // 3500, 
      y: this.sys.game.config.height - 48 -48
    });

    // This group contains all enemies for collision and calling update-methods
    this.enemyGroup = this.add.group();

    // The map has one object layer with enemies as stamped tiles, 
    // each tile has properties containing info on what enemy it represents.
    this.map.getObjectLayer("enemies").objects.forEach(
      (enemy) => {
        let enemyObject;
        switch (this.tileset.tileProperties[enemy.gid - 1].name) {
          case "goomba":
            enemyObject = new Goomba({
              scene: this,
              key: 'sprites16',
              x: enemy.x,
              y: enemy.y
            });
            break;
          case "turtle":
            enemyObject = new Turtle({
              scene: this,
              key: 'mario-sprites',
              x: enemy.x,
              y: enemy.y
            });
            break;
          default:
            console.error("Unknown:", this.tileset.tileProperties[enemy.gid - 1]);
            break;
        }
        this.enemyGroup.add(enemyObject);
      }
    );

    // A group powerUps to update
    this.powerUps = this.add.group();

    // The map has an object layer with "modifiers" that do "stuff", see below
    this.map.getObjectLayer("modifiers").objects.forEach((modifier) => {
      let tile, properties, type;
      // Get property stuff from the tile if present or just from the object layer directly
      if (typeof modifier.gid !== "undefined") {
        properties = this.tileset.tileProperties[modifier.gid - 1];
        type = properties.type;
        if (properties.hasOwnProperty("powerUp")) {
          type = "powerUp";
        }
      }
      else {
        type = modifier.properties.type;
      }

      switch (type) {
        case "powerUp":
          // Modifies a questionmark below the modifier to contain something else than the default (coin)
          tile = this.groundLayer.getTileAt(modifier.x / 16, modifier.y / 16 - 1);
          tile.powerUp = properties.powerUp;
          tile.properties.callback = "questionMark";
          if (!tile.collides) {
            // Hidden block without a question mark
            tile.setCollision(false, false, false, true);
          }
          break;
        case "pipe":
          // Adds info on where to go from a pipe under the modifier
          tile = this.groundLayer.getTileAt(modifier.x / 16, modifier.y / 16);
          tile.properties.dest = parseInt(modifier.properties.goto);
          break;
        case "dest":
          // Adds a destination so that a pipe can find it
          this.destinations[modifier.properties.id] = { x: modifier.x + modifier.width / 2, top: (modifier.y < 16) };
          break;
        case "room":
          // Adds a "room" that is just info on bounds so that we can add sections below pipes 
          // in an level just using one tilemap.
          this.rooms.push({ x: modifier.x, width: modifier.width, sky: modifier.properties.sky });
          break;
      }

    }
    );

    // this.keys will contain all we need to control Mario.
    // Any key could just replace the default (like this.key.jump)
    this.keys = {
      jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
    };

    this.cameras.main.setBounds(0, 0, this.groundLayer.width * this.groundLayer.scaleX, this.groundLayer.height * this.groundLayer.scaleY);
    this.cameras.main.startFollow(this.mario);
    //this.cameras.main.setBackgroundColor('#6888ff'); //Blue sky

    // An emitter for bricks when blocks are destroyed.
    this.blockEmitter = this.add.particles('mario-sprites');

    this.blockEmitter.createEmitter({
      frame: { frames: ["brick"], cycle: true },
      gravityY: 1000,
      lifespan: 2000,
      speed: 400,
      angle: { min: -90 - 25, max: -45 - 25 },
      frequency: -1,
    });

    // Used when hitting a tile from below that should bounce up.
    this.bounceTile = new SMBTileSprite({
      scene: this,
    })

    // Hack to get sprite's destroy method to function.
    this.sys.physicsManager = this.physics.world;


    let hud = this.add.bitmapText(5 * 8, 8, 'font', "MARIO                      TIME", 8);
    hud.setScrollFactor(0, 0);
    this.levelTimer = {
      textObject: this.add.bitmapText(36 * 8, 16, 'font', "255", 8),
      time: 150 * 1000,
      displayedTime: 255,
      hurry: false
    }
    this.levelTimer.textObject.setScrollFactor(0, 0);
    this.score = {
      pts: 0,
      textObject: this.add.bitmapText(5 * 8, 16, 'font', "000000", 8)
    }
    this.score.textObject.setScrollFactor(0, 0);

    // Prepare the finishLine
    let worldEndAt = -1;
    for (let x = 0; x < this.groundLayer.width; x++) {
      let tile = this.groundLayer.getTileAt(x, 2);
      if (tile && tile.properties.worldsEnd) {
        worldEndAt = tile.pixelX;
        break;
      }
    }
    this.finishLine = {
      x: worldEndAt,
      flag: this.add.sprite(worldEndAt + 8, 4 * 16),
      active: false
    }
    this.finishLine.flag.play("flag");

    // Set bounds for current room
    this.mario.setRoomBounds(this.rooms);

    // Touch controls is really just a quick hack to try out performance on mobiles,
    // It's not itended as a suggestion on how to do it in a real game.
    let jumpButton = this.add.sprite(350,180);
    jumpButton.play("button");
    let dpad = this.add.sprite(20,170);
    dpad.play("dpad");
    this.touchControls = {
      dpad: dpad,
      abutton: jumpButton,
      left: false,
      right: false,
      down: false,
      jump: false,
      visible: false
    }
    jumpButton.setScrollFactor(0,0);
    jumpButton.alpha = 0;
    jumpButton.setInteractive();
    jumpButton.on('pointerdown', (pointer) => {
      this.touchControls.jump = true;
    });
    jumpButton.on('pointerup', (pointer) => {
      this.touchControls.jump = false;
    });
    dpad.setScrollFactor(0,0);
    dpad.alpha = 0;
    dpad.setInteractive();
    dpad.on('pointerdown', (pointer) => {
      let x = dpad.x + dpad.width - pointer.x;
      let y = dpad.y + dpad.height - pointer.y;
      console.log(x,y);      
      if(y>0 || Math.abs(x)>-y){
        if(x>0){
          console.log('going left');
          this.touchControls.left = true;
        }
        else {
          console.log('going right')
          this.touchControls.right = true;
        }
      }else {
        this.touchControls.down = true;
      }
    });
    dpad.on('pointerup', (pointer) => {
      this.touchControls.left = false;
      this.touchControls.right = false;
      this.touchControls.down = false;
    });
     window.toggleTouch = this.toggleTouch.bind(this);
  }

  update(time, delta) {
    // Avoid running updates when physics is paused
    if (this.physics.world.isPaused) {
      return;
    }

    if (this.mario.x > this.finishLine.x && this.finishLine.active) {
      this.removeFlag();
      this.physics.world.pause();
      return;
    }

    this.levelTimer.time -= delta * 2;
    if (this.levelTimer.time - this.levelTimer.displayedTime * 1000 < 1000) {
      this.levelTimer.displayedTime = Math.round(this.levelTimer.time / 1000);
      this.levelTimer.textObject.setText(("" + this.levelTimer.displayedTime).padStart(3, "0"));
      if (this.levelTimer.displayedTime < 50 && !this.levelTimer.hurry) {
        this.levelTimer.hurry = true;
        this.music.pause();
        let sound = this.sound.addAudioSprite('sfx');
        sound.on('ended', (sound) => {
          this.music.seek = 0;
          this.music.rate = 1.5;
          this.music.resume();
          sound.destroy();
        });
        sound.play('smb_warning');
      }
      if (this.levelTimer.displayedTime < 1) {
        this.mario.die();
        this.levelTimer.hurry = false;
        this.music.rate = 1;
        this.levelTimer.time = 150 * 1000;
        this.levelTimer.displayedTime = 255;
      }
    }



    // Run the update method of Mario
    this.mario.update(this.keys, time, delta);

    // Run the update method of all enemies
    this.enemyGroup.children.entries.forEach(
      (sprite) => { sprite.update(time, delta); }
    )
    // Run the update method of non-enemy sprites
    this.powerUps.children.entries.forEach(
      (sprite) => { sprite.update(time, delta); }
    )
  }

  tileCollision(sprite, tile) {

    if (sprite.type === "turtle") {
      if (tile.y > Math.round(sprite.y / 16)) {
        // Turtles ignore the ground
        return;
      }
    } else if (sprite.type === "mario") {
      // Mario is bending on a pipe that leads somewhere:
      if (sprite.bending && tile.properties.pipe && tile.properties.dest) {
        sprite.enterPipe(tile.properties.dest, tile.rotation);
      }
    }
    // If it's Mario and the body isn't blocked up it can't hit question marks or break bricks
    // Otherwise Mario will break bricks he touch from the side while moving up.
    if (sprite.type === "mario" && !sprite.body.blocked.up) {
      return;
    }

    // If the tile has a callback, lets fire it
    if (tile.properties.callback) {
      switch (tile.properties.callback) {
        case "questionMark":
          // Shift to a metallic block
          tile.index = 44;
          // Bounce it a bit
          sprite.scene.bounceTile.restart(tile);
          // The questionmark is no more
          tile.properties.callback = null;
          // Invincible blocks are only collidable from above, but everywhere once revealed
          tile.setCollision(true);
          // Check powerUp for what to do, make a coin if not defined
          let powerUp = tile.powerUp ? tile.powerUp : "coin";
          // Make powerUp (including a coin)
          new PowerUp(
            {
              scene: sprite.scene,
              key: 'sprites16',
              x: tile.x * 16 + 8,
              y: tile.y * 16 - 8,
              type: powerUp
            });
          break;
        case "breakable":
          if (sprite.type === "mario" && sprite.animSuffix === "") {
            // Can't break it anyway. Bounce it a bit.
            sprite.scene.bounceTile.restart(tile);
            sprite.scene.sound.playAudioSprite('sfx', 'smb_bump');
          }
          else {
            // get points
            sprite.scene.updateScore(50);
            sprite.scene.map.removeTileAt(tile.x, tile.y, true, true, this.groundLayer);
            sprite.scene.sound.playAudioSprite('sfx', 'smb_breakblock');
            sprite.scene.blockEmitter.emitParticle(6, tile.x * 16, tile.y * 16);
          }
          break;
        case "toggle16bit":
          sprite.scene.eightBit = !sprite.scene.eightBit;
          if (sprite.scene.eightBit) {
            sprite.scene.tileset.setImage(sprite.scene.sys.textures.get('tiles'));
          }
          else {
            sprite.scene.tileset.setImage(sprite.scene.sys.textures.get('tiles-16bit'));
          }
          break;
        default:
          sprite.scene.sound.playAudioSprite('sfx', 'smb_bump');
          break;

      }
    }
    else {
      sprite.scene.sound.playAudioSprite('sfx', 'smb_bump');
    }
  }

  /** To be removed, supported natively now:
   * setCollisionByProperty(map) {
    Object.keys(map.tilesets[0].tileProperties).forEach(
      (id) => {

        if (map.tilesets[0].tileProperties[id].collide) {
          map.setCollision(parseInt(id) + 1);
        }
      }
    )
  }*/

  updateScore(score) {
    this.score.pts += score;
    this.score.textObject.setText(("" + this.score.pts).padStart(6, "0"));
  }

  removeFlag(step = 0) {
    switch (step) {
      case 0:
        this.music.pause();
        this.sound.playAudioSprite('sfx', 'smb_flagpole');
        this.mario.play("mario/climb" + this.mario.animSuffix);
        this.mario.x = this.finishLine.x - 1;
        this.tweens.add({
          targets: this.finishLine.flag,
          y: 240 - 6 * 8,
          duration: 1500,
          onComplete: () => this.removeFlag(1)
        });
        this.tweens.add({
          targets: this.mario,
          y: 240 - 3 * 16,
          duration: 1000,
          onComplete: () => { this.mario.flipX = true; this.mario.x += 11; }
        });
        break;
      case 1:
        let sound = this.sound.addAudioSprite('sfx');
        sound.on('ended', (sound) => {
          this.mario.x = 48;
          this.mario.y = -32;
          this.mario.body.setVelocity(0);
          this.mario.alpha = 1;
          this.music.rate = 1;          
          this.music.seek = 0;
          this.music.resume();
          this.levelTimer.hurry = false;
          this.levelTimer.time = 150 * 1000;
          this.levelTimer.displayedTime = 255;   
          this.physics.world.resume();

          sound.destroy();
        });
        sound.play('smb_stage_clear');

        this.mario.play("run" + this.mario.animSuffix);

        this.mario.flipX = false;
        this.tweens.add({
          targets: this.mario,
          x: this.finishLine.x + 6 * 16,
          duration: 1000,
          onComplete: () => this.removeFlag(2)
        });
        break;
      case 2:
        this.tweens.add({
          targets: this.mario,
          alpha: 0,
          duration: 500,
        });
        break;
    }
  }

  toggleTouch(){
    this.touchControls.visible = !this.touchControls.visible;
    if(this.touchControls.visible){
      this.touchControls.dpad.alpha = 0;
      this.touchControls.abutton.alpha = 0;
    }
    else {
      this.touchControls.dpad.alpha = 0.5;
      this.touchControls.abutton.alpha = 0.5;
    }
  }
}

export default MarioBrosScene;
