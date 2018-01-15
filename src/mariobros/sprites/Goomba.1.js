import Enemy from './Enemy';

export default class Goomba extends Enemy {
  constructor (config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.velocity = 200;
    this.body.setVelocity(0,0).setBounce(0, 0).setCollideWorldBounds(false);
    this.scene = config.scene;
    
    this.direction = -50;
    this.anims.play('goomba');
    this.scene.updateLoop.push(this);

    this.body.allowGravity = false;

    this.beenSeen = false;

    return this;
  }

  update () {
    if(!this.beenSeen){
      if(this.x<this.scene.cameras.main.scrollX+this.scene.game.canvas.width+32){
        this.beenSeen = true;
        this.body.velocity.x = this.direction;
        this.body.allowGravity = true;
      }
      return;
    }
    this.scene.physics.world.collide(this, this.scene.groundLayer);
    if(this.body.velocity.x === 0) {
      this.direction = -this.direction;
      this.body.velocity.x = this.direction;
    }

  }

}
