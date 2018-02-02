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
    this.load.image('background-clouds', '/assets//images/clouds.png'); // 16-bit later
    // Tilemap with a lot of objects and tile-properties tricks
    this.load.tilemapTiledJSON('map', '/assets//tilemaps/super-mario.json');
    // I load the tiles as a spritesheet so I can use it for both sprites and tiles
    this.load.spritesheet('tiles', '/assets//images/super-mario.png', { frameWidth: 16, frameHeight: 16 });
    // Just for fun:
    this.load.spritesheet('tiles-16bit', '/assets//images/super-mario-16bit.png', { frameWidth: 16, frameHeight: 16 });
    // Spritesheets with fixed sizes. Should be replaced with atlas:
    this.load.spritesheet('mario', '/assets//images/mario-sprites.png', { frameWidth: 16, frameHeight: 32 });
    this.load.spritesheet('sprites16', '/assets//images/16x16sprites.png', { frameWidth: 16, frameHeight: 16 });
    // Beginning of an atlas to replace spritesheets
    this.load.atlas('mario-sprites', '/assets//mario-sprites.png', '/assets//mario-sprites.json');
    // Music to play. Need to cut it for it to loop properly
    this.load.audio('overworld', [
      '/assets//music/overworld.ogg',
      '/assets//music/overworld.mp3'
    ]);

    this.load.audioSprite('sfx', [
      'assets/audio/sfx.ogg',
      'assets/audio/sfx.mp3'
    ], 'assets/audio/sfx.json', {
        instances: 4
      });
  }

  create() {
    // Places to warp to (from pipes)
    this.destinations = {};
    // Array of rooms to keep bounds within to avoid the need of multiple tilemaps per level.
    this.rooms = [];
    // TODO: Shift to group
    //this.updateLoop = [];

    // Add and play the music
    this.music = this.sound.add('overworld');
    //this.music.rate = 1.5; <-- this will be used when time is short
    this.music.play();

    // Define all animations we'll use
    makeAnimations(this);

    // Add the map
    let map = this.make.tilemap({ key: 'map' });
    this.map = map;
    let tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    // Dynamic layer because we want breakable and animated tiles
    this.groundLayer = map.createDynamicLayer('world', tileset, 0, 0);
    // Probably not the correct way of doing this:
    this.physics.world.bounds.width = this.groundLayer.width;

    // Custom method to initialize animated tiles. I'll improve this and make it into a plugin.
    this.animatedTiles = this.findAnimatedTiles(tileset.tileData, this.groundLayer);

    // Add the background as an tilesprite and send it to the back! 
    let tileSprite = this.add.tileSprite(0, 0, this.groundLayer.width, 500, 'background-clouds');

    // TODO: Just set collision by property and using native API
    map.setCollision(11);
    map.setCollisionBetween(14, 16);
    map.setCollision([20, 21, 22, 23, 24, 25, 27, 28, 29, 33, 39, 40]);
    map.setCollision(40);
    this.setCollisionByProperty(map);

    // CREATE MARIO!!!
    this.mario = new Mario({
      scene: this,
      key: 'mario',
      x: 16 * 6,
      y: this.sys.game.config.height - 48
    });

    // This group contains all enemies for collision and calling update-methods
    this.enemyGroup = this.add.group();

    // The map has one object layer with enemies as stamped tiles, 
    // each tile has properties containing info on what enemy it represents.
  
    // Was map.objects.enemies.forEach
    map.objects[1].objects.forEach(
      (enemy) => {
        let enemyObject;
        console.log(enemy.gid);
        switch (tileset.tileProperties[enemy.gid - 1].name) {
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
            console.error("Unknown:", tileset.tileProperties[enemy.gid - 1]);
            break;
        }
        this.enemyGroup.add(enemyObject);
      }
    );

    // A group powerUps to update
    this.powerUps = this.add.group();

    // The map has an object layer with "modifiers" that do "stuff", see below
    map.objects[0].objects.forEach((modifier) => {
      let tile, properties, type;
      // Get property stuff from the tile if present or just from the object layer directly
      if (typeof modifier.gid !== "undefined") {
        properties = tileset.tileProperties[modifier.gid - 1];
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
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    };

    this.cameras.main.setBounds(0, 0, this.groundLayer.width * this.groundLayer.scaleX, this.groundLayer.height * this.groundLayer.scaleY);
    this.cameras.main.startFollow(this.mario);
    this.cameras.main.setBackgroundColor('#6888ff'); //Blue sky

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

    // This works:
    //tileset.setImage(this.sys.textures.get('tiles-16bit'));

    // Hack to get sprite's destroy method to function.
    this.sys.physicsManager = this.physics.world;

  }

  update(time, delta) {
    // Avoid running updates when physics is paused
    if (this.physics.world.isPaused) {
      return;
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

    // Animate tiles. This is just for a quick test and not very sophisticated. 
    // I'm working on a plugin.
    Object.keys(this.animatedTiles).forEach(
      (key) => {
        let speed = 1;
        let animatedTile = this.animatedTiles[key];
        animatedTile.next -= delta * speed;
        if (animatedTile.next < 0) {
          let currentIndex = animatedTile.currentFrame;
          let newIndex = currentIndex + 1;
          if (newIndex > (animatedTile.frames.length - 1)) {
            newIndex = 0;
          }
          animatedTile.next = animatedTile.frames[newIndex].duration;
          animatedTile.currentFrame = newIndex;
          this.map.replaceByIndex(animatedTile.frames[currentIndex].tileid, animatedTile.frames[newIndex].tileid);
        }
      }
    );
  }

  findAnimatedTiles(tileData) {
    // poor choice, should have been an array, but I'll abandon this later when I have my plugin anyway
    let animatedTiles = {};
    Object.keys(tileData).forEach(
      (key) => {
        if (tileData[key].hasOwnProperty("animation")) {
          animatedTiles[key] = { frames: [] };
          tileData[key].animation.forEach((frame) => { frame.tileid++; animatedTiles[key].frames.push(frame) });
          animatedTiles[key].next = animatedTiles[key].frames[0].duration;
          animatedTiles[key].currentFrame = 0;

        }
      }
    )
    return animatedTiles;
  }

  tileCollision(sprite, tile) {

    if (sprite.type === "turtle") {
      if (tile.y > Math.round(sprite.y / 16)) {
        // Turtles ignore the ground
        return;
      }
    } else if (sprite.type === "mario"){
      // Mario is bending on a pipe that leads somewhere:
      if (sprite.bending && tile.properties.pipe && tile.properties.dest) {
        sprite.enterPipe(tile.properties.dest, tile.rotation);
      }
    }
    // If it's Mario and the body isn't blocked up it can't hit question marks or break bricks
    // Otherwise Mario will break bricks he touch from the side while moving up.
    if(sprite.type==="mario" && !sprite.body.blocked.up){
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
            sprite.scene.sound.playAudioSprite('sfx', 'Bump');
          }
          else {
            sprite.scene.map.removeTileAt(tile.x, tile.y, true, true, this.groundLayer);
            sprite.scene.sound.playAudioSprite('sfx', 'Break');
            sprite.scene.blockEmitter.emitParticle(6, tile.x * 16, tile.y * 16);
          }
          break;
        default:
          sprite.scene.sound.playAudioSprite('sfx', 'Bump');
          break;

      }
    }
  }

  setCollisionByProperty(map) {
    Object.keys(map.tilesets[0].tileProperties).forEach(
      (id) => {
        map.setCollision(parseInt(id) + 1);
      }
    )
  }

}

export default MarioBrosScene;
