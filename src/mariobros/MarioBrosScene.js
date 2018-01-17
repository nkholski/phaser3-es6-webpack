import Mario from './sprites/Mario';
import Goomba from './sprites/Goomba';
import Turtle from './sprites/Turtle';
import PowerUp from './sprites/PowerUp';

class MarioBrosScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MarioBrosScene'
    });
  }

  preload() {
    this.load.image('floor', '/assets/mariobros/images/floor.png');
    this.load.tilemapJSON('map', '/assets/mariobros/tilemaps/super-mario.json');
    this.load.image('tiles', '/assets/mariobros/images/super-mario.png');
    this.load.spritesheet('mario', '/assets/mariobros/images/mario-sprites.png', { frameWidth: 16, frameHeight: 32 });
    this.load.spritesheet('sprites16', '/assets/mariobros/images/16x16sprites.png', { frameWidth: 16, frameHeight: 16 });
    this.load.audio('overworld', [
      '/assets/mariobros/music/overworld.ogg',
      '/assets/mariobros/music/overworld.mp3'
    ]);
    this.load.atlas('mario-sprites', '/assets/mariobros/mario-sprites.png', '/assets/mariobros/mario-sprites.json');

  }

  create() {

    this.music = this.sound.add('overworld');
    this.music.rate = 1.5;
    //this.music.play();

    let map = this.make.tilemap({ key: 'map' });
    let tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

    this.updateLoop = [];

    this.groundLayer = map.createDynamicLayer('world', tileset, 0, 0);
    //this.groundLayer.alpha=0.5;
    this.physics.world.bounds.width = this.groundLayer.width;
    let layer = this.groundLayer;
    this.animatedTiles = this.findAnimatedTiles(tileset.tileData, this.groundLayer);

    //map.setCollisionByExclusion(0);
    // You can set collision on one tile index (11 = coin)
    map.setCollision(11);

    // Or, you can set collision on tiles with an index between two values (14 - 16 are blocks)
    map.setCollisionBetween(14, 16);

    // Or, you can set collision on all indexes within an array
    map.setCollision([20, 21, 22, 23, 24, 25, 27, 28, 29, 33, 39, 40]);

    map.setCollision(40);

    this.setCollisionByProperty(map);
    /*let scale = 0.7;
    this.minimap = this.cameras.add(200, 10, 1400, 240*scale).setZoom(scale);
    this.minimap.setBackgroundColor(0x002244);
    this.minimap.setBounds(0, 0, layer.width * 1, layer.height);*/

    // Add goombas



 

   /* this.input.events.on('POINTER_DOWN_EVENT', function (event) {
      debugGraphics.visible = !debugGraphics.visible;
    });*/
    var config = {
      key: 'runSuper',
      frames: this.anims.generateFrameNumbers('mario', { start: 0, end: 2, first: 0 }),
      frameRate: 10,
      repeat: -1,
      repeatDelay: 0
    };
    this.anims.create(config);
    config.key = "run";
    config.frames = this.anims.generateFrameNumbers('mario', { start: 17, end: 19 }),
    this.anims.create(config);

    var config = {
      key: 'jumpSuper',
      frames: this.anims.generateFrameNumbers('mario', { start: 4, end: 4 }),
    };
    this.anims.create(config);
    config.key = "jump";
    config.frames = this.anims.generateFrameNumbers('mario', { start: 21, end: 21 }),
    this.anims.create(config);


    var config = {
      key: 'standSuper',
      frames: this.anims.generateFrameNumbers('mario', { start: 6, end: 6, first: 6 }),
    };
    this.anims.create(config);
    config.key = "stand";
    config.frames = this.anims.generateFrameNumbers('mario', { start: 23, end: 23 }),
    this.anims.create(config);

    var config = {
      key: 'turnSuper',
      frames: this.anims.generateFrameNumbers('mario', { start: 3, end: 3, first: 3 }),
    };

    this.anims.create(config);
    config.key = "turn";
    config.frames = this.anims.generateFrameNumbers('mario', { start: 20, end: 20 }),
    this.anims.create(config);


    var config = {
      key: 'goomba',
      frames: this.anims.generateFrameNumbers('sprites16', { start: 4, end: 5 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };
    this.anims.create(config);
    var config = {
      key: 'goombaFlat',
      frames: this.anims.generateFrameNumbers('sprites16', { start: 6, end: 6 }),
    };
    this.anims.create(config);

    var config = {
      key: 'turtle',
      frames: this.anims.generateFrameNumbers('mario', { start: 31, end: 32 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };
    this.anims.create(config);

    var config = {
      key: 'turtleShell',
      frames: this.anims.generateFrameNumbers('mario', { start: 33, end: 33 }),
    };

    this.anims.create(config);

    var config = {
      key: 'mushroom',
      frames: this.anims.generateFrameNumbers('sprites16', { start: 2, end: 2 }),
      frameRate: 10,
      repeat: -1,
      repeatDelay: 0
    };
    this.anims.create(config);

    var config = {
      key: '1up',
      frames: this.anims.generateFrameNumbers('sprites16', { start: 0, end: 0 }),
    };
    this.anims.create(config);

    var config = {
      key: 'star',
      frames: this.anims.generateFrameNumbers('sprites16', { start: 1, end: 1 }),
    };
    this.anims.create(config);

    var config = {
      key: 'coin',
      frames: this.anims.generateFrameNumbers('sprites16', { start: 3, end: 3 }),
    };
    this.anims.create(config);

    this.mario = new Mario({
      scene: this,
      key: 'mario',
      x: 16*6,
      y: this.game.config.height - 48
    })
 
    map.objects.enemies.forEach(

      (enemy) => {
        switch (tileset.tileProperties[enemy.gid - 1].name) {
          case "goomba":
            new Goomba({
              scene: this,
              key: 'sprites16',
              x: enemy.x,
              y: enemy.y
            });
            break;
          case "turtle":
            new Turtle({
              scene: this,
              key: 'sprites16',
              x: enemy.x,
              y: enemy.y
            });
            break;
          default:
            console.error("Unknown:",tileset.tileProperties[enemy.gid - 1]);
          break;
        }
      }
    );

    map.objects.modifiers.forEach((modifier)=>{
      
      //tile.properties.callback
      
      let tile = this.groundLayer.getTileAt(modifier.x/16,modifier.y/16-1);
      let properties, type;
      if(typeof modifier.gid !== "undefined"){
        properties = tileset.tileProperties[modifier.gid-1];
        type = properties.type;
        console.log("modifier!", modifier, modifier.gid, properties)
        if(properties.hasOwnProperty("powerUp")){
          type = "powerUp";
        }
      }
      else {
        type = modifier.properties.type;
      }

      //tile = this.groundLayer.getTileAt(modifier.x, modifier.y);

      switch(type){
        case "powerUp":
        console.log("powerUp", modifier, properties, type);
          tile.powerUp = properties.powerUp;
          tile.properties.callback = "questionMark";
          if(!tile.collide){
            tile.setCollision(false,false,false,true);
         }
        break;
      }
      
    }
    );
    debugger;

    this.keys = {
      jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

    };

    //let static1 = this.physics.add.staticImage(300, 150, 'floor');

   // this.floor = [static1, this.groudLayer, map];
    this.map = map;
    let cam = this.cameras.main;
    cam.setBounds(0, 0, layer.width * layer.scaleX, layer.height * layer.scaleY);
    //cam.scrollX = player.x - cam.width * 0.5;
    // cam.scrollY = player.y - cam.height * 0.5;

    this.cameras.main.startFollow(this.mario);
    //    this.minimap.startFollow(this.mario);

    /*    this.input.keyboard.events.on('KEY_DOWN_EVENT', (event) => {
            console.dir(event.data.key);
            if (event.data.key === "ArrowRight" || event.data.key === "ArrowLeft") {
              this.mario.run(event.data.key);
            }
            if (event.data.key === "ArrowUp") {
              this.mario.jump();
            }
          }
        );*/

        var debugGraphics = this.add.graphics();
        //debugGraphics.setScale(2);
        map.renderDebug(debugGraphics);
        debugGraphics.visible = false;

        this.blockEmitter = this.add.particles('mario-sprites');
        this.blockEmitter.createEmitter({
          frame: { frames: ["brick"], cycle: true },
          gravityY: 1000,
          lifespan: 2000,
          speed: 400,
          angle: { min: -90-25, max: -45-25 },
          frequency: -1,
       });
       this.emitted = false;
  }

  update(delta) {
    //this.blockEmitter.pause();
 
    if (this.mario.physicsCheck) {
      //this.physics.world.collide(this.mario, this.floor);
      if (this.mario.body.velocity.y < 0) {
        this.physics.world.collide(this.mario, this.groundLayer, this.callback);
      }
      else {
        this.physics.world.collide(this.mario, this.groundLayer);
      }
      //this.physics.world.collide(this.mario, this.map);
    }
    //    this.physics.world.collide(this.mario, this.groundLayer,this.callback);

    this.updateLoop.forEach(
      (sprite) => { sprite.update(delta); }
    )

    this.mario.update(this.keys, delta);
    let cam = this.cameras.main;

    Object.keys(this.animatedTiles).forEach(
      (key) => {
        let animatedTile = this.animatedTiles[key];
        if (animatedTile.next < delta) {
          let currentIndex = animatedTile.currentFrame;
          let newIndex = currentIndex + 1;
          if (newIndex > (animatedTile.frames.length - 1)) {
            newIndex = 0;
          }
          animatedTile.next = delta + animatedTile.frames[newIndex].duration;
          animatedTile.currentFrame = newIndex;
          this.map.replaceByIndex(animatedTile.frames[currentIndex].tileid, animatedTile.frames[newIndex].tileid);
          //console.log( animatedTile.frames[currentIndex].tileid-1, animatedTile.frames[newIndex].tileid);
        }


        /*       this.groundLayer.culledTiles.forEach(
                 (tile) => {
                   if (tile.index == 13) {
                     tile.index = 1;
       
                   }
                 }
               )*/


        // console.log("Kolla",this.groundLayer.culledTiles);
      }
    );

    /*let smoothFactor = 0.9;
    cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (this.mario.x - cam.width * 0.5);
    cam.scrollX = cam.scrollX < 0 ? 0 : cam.scrollX;*/
    //cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (this.mario.y - cam.height * 0.5);
  }

  findAnimatedTiles(tileData) {
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

  callback(mario, tile) {
    if(mario.type === "turtle"){
      if(tile.y>Math.round(mario.y/16)){
        return;
      }

    }

    if (tile.properties.callback) {
      
      switch (tile.properties.callback) {
        case "questionMark":
          
          tile.index = 44;
          tile.properties.callback = null;
          tile.setCollision(true); // Invincible blocks are only collidable from above, but everywhere once revealed
          if(!tile.powerUp) {
            return;
          }
          new PowerUp(
            {
              scene: mario.scene,
              key: 'sprites16',
              x: tile.x * 16 + 8,
              y: tile.y * 16 - 8,
              type: tile.powerUp
            });
          break;
        case "breakable":
          tile.index = 1;
          tile.properties.callback = null;
          tile.resetCollision();
          console.log(tile.layer.tilemapLayer.map);
          tile.layer.tilemapLayer.map.calculateFacesWithin(tile.x-1,tile.y-1,3,3,tile.layer.tilemapLayer);
          mario.scene.blockEmitter.emitParticle(6,tile.x*16,tile.y*16);
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

/*  questionMark(tile) {
    tile.setId(4);

  }
  breakable(tile) {

  }*/

}

export default MarioBrosScene;
