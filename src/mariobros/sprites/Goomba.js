import Enemy from './Enemy';

export default class Goomba extends Enemy {
  constructor (config) {
    super(config);
    this.body.setVelocity(0,0).setBounce(0, 0).setCollideWorldBounds(false);
    this.anims.play('goomba');
    this.killAt = 0;
  }

  update (delta) {
    if(!this.activated()){return;}
    
    this.scene.physics.world.collide(this, this.scene.groundLayer);
    if(this.killAt !== 0){
      // Kolla timr
      if(this.killAt === 1){
        this.killAt = delta+500;
      }
      console.log("NOT ALIVE")
      this.body.setVelocityX(0);
      if(this.killAt < delta ){
        this.alpha = 0;
        this.alive = false;
      }
      return;
    }


    this.scene.physics.world.overlap(this, this.mario, this.marioHit);

    if(this.body.velocity.x === 0) {
      this.direction = -this.direction;
      this.body.velocity.x = this.direction;
    }

  }

  marioHit(enemy, mario){
    if(enemy.verticalHit(enemy, mario)){
      mario.enemyBounce();
      enemy.killed(enemy, mario);
    }
    else {
      enemy.hurtMario(enemy, mario);
    }

  }

  killed(enemy,mario){
    enemy.play("goombaFlat");
    enemy.body.setVelocityX(0);
    enemy.body.acceleration.x = 0;
    enemy.killAt = 1;
    console.log("DIED!");
  }


}
