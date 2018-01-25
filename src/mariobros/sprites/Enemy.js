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
    //this.scene.updateLoop.push(this);
    this.body.allowGravity = false;
    this.beenSeen = false;
    this.alive = true;
    //console.log(this.)
    //return this;
    this.body.setSize(12, 12);
    this.body.offset.set(2, 4);

    this.id = Math.random();
  }

  activated(){
    if(!this.alive){
      return false;
    }
    if(!this.beenSeen){
      if(this.x<this.scene.cameras.main.scrollX+this.scene.sys.game.canvas.width+32){
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
     return (mario.body.y+mario.body.height)-enemy.body.y<4;
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

  kill(){
    //this.scene.updateLoop  = this.scene.updateLoop.filter(enemy => enemy !== this);
    this.scene.enemyGroup.remove(this);
    this.destroy();
  }
}
