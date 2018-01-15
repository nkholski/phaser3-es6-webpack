export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y - 16, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.body.setVelocity(0, 0).setBounce(0, 0).setCollideWorldBounds(false);
    this.scene = config.scene;   
    this.mario = this.scene.mario; 
    this.direction = -50;
    this.flipX = true;
    this.scene.updateLoop.push(this);
    this.body.allowGravity = false;
    this.beenSeen = false;
    this.alive = true;
    //console.log(this.)
    //return this;
  }

  activated(){
    if(!this.alive){
      return false;
    }
    if(!this.beenSeen){
      if(this.x<this.scene.cameras.main.scrollX+this.scene.game.canvas.width+32){
        this.beenSeen = true;
        this.body.velocity.x = this.direction;
        this.body.allowGravity = true;
        return true;
      }
      return false;
    }
    return true;
  }

  verticalHit(enemy, mario){
        //let verticalHit = Math.abs(enemy.x-mario.x)<Math.abs(enemy.y-mario.y);
       return (enemy.y-mario.y)>15;
  }
  hurtMario(enemy, mario){
    // send the enemy to mario hurt method (if mario got a star this will not end well for the enemy)
    this.scene.mario.hurtBy(enemy);
  }

  starKilled(){
    if(!this.alive){
      return;
    }
    this.body.velocity.x  = 0;
    this.body.velocity.y = -200;
    this.alive = false;
    this.flipY = true;
  }
}
