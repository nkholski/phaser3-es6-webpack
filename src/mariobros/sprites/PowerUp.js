export default class PowerUp extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    
    this.width = 16;
    this.height = 16;
    this.type = config.type;
    this.velocity = 200;
    this.body.setVelocity(0,0).setBounce(0, 0).setCollideWorldBounds(false);
    this.scene = config.scene;
    this.direction = 70;
    if(this.scene.mario.x > config.x+8) {
      this.direction=-this.direction;
    }
    console.log(this.scene.mario.x, config.x)
    this.body.velocity.x = this.direction;
    
    if(this.type === "mushroom"){
      this.body.velocity.y=-150;
    }else if(this.type === "coin"){
      this.body.setVelocity(0,0);
      this.body.allowGravity = false;
      this.scene.tweens.add({
        targets: this,
        y: this.y-50,
        duration: 300,
        onComplete: () => { this.destroy();},
     });
    }

    this.anims.play(this.type);
    this.tintCnt = 0;
    this.tintIndex = 0;
    this.scene.updateLoop.push(this);

    return this;
  }

  update () {
    if(this.alpha === 0 || this.type === "coin"){
      return;
    }
    this.scene.physics.world.collide(this, this.scene.groundLayer);
    this.scene.physics.world.overlap(this, this.scene.mario, this.collected);

    if(this.body.velocity.x === 0) {
      this.direction = -this.direction;
      this.body.velocity.x = this.direction;
    }
    if(this.type==="star"){
      if(this.body.blocked.down){
      this.body.velocity.y = -300;
      }
      this.tintCnt++;
      if(this.tintCnt>5){
        this.tintIndex++;
        this.tintCnt = 0;
        if(this.tintCnt>7){
          this.tintCnt = 0;
        }
      }
      this.tint = [0xFFFFFF, 0xFF0000, 0xFFFFFF, 0x00FF00, 0xFFFFFF, 0x0000FF][this.tintCnt];
    }
  }

  collected(powerUp, mario){
    switch(powerUp.type){
      case "mushroom":
       
        powerUp.scene.physics.world.pause();
 
        mario.large();
        mario.animSuffix = "Super";
        powerUp.alpha = 0;
        mario.play("grow");
      break;
      case "star":
        mario.star.active = true;
        powerUp.alpha = 0;
        break;

    }

  }

}
