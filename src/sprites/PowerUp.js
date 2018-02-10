export default class PowerUp extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.type = config.type;


    this.direction = 70;
    if (this.scene.mario.x > config.x + 8) {
      // Mario on the right -> powerup bounces left
      this.direction = -this.direction;
    }
    this.body.velocity.x = this.direction;

    // Standard sprite is 16x16 pixels with a smaller body
    this.body.setSize(12, 12);
    this.body.offset.set(2, 4);

    if (this.type === "mushroom" || this.type === "1up") {
      this.body.velocity.y = -150;
    } else if (this.type === "coin") {
      this.body.setVelocity(0, 0);
      this.body.allowGravity = false;
      this.scene.tweens.add({
        targets: this,
        y: this.y - 50,
        duration: 300,
        onComplete: () => { this.destroy(); },
      });
    }

    this.anims.play(this.type);
    this.tintCnt = 0;
    this.tintIndex = 0;

    if(this.type === "coin"){
      this.scene.sound.playAudioSprite('sfx', 'smb_coin');

    }
    else {
      this.scene.sound.playAudioSprite('sfx', 'smb_powerup_appears');
      this.scene.powerUps.add(this);


    }

//    this.scene.updateLoop.push(this);

    return this;
  }

  update() {
    if(this.alpha === 0){
      this.scene.powerUps.remove(this);
      this.destroy();
      return;
    }

    this.scene.physics.world.collide(this, this.scene.groundLayer);
    this.scene.physics.world.overlap(this, this.scene.mario, this.collected);

    if(!this.body){
      return;
    }

    if (this.body.velocity.x === 0) {
      this.direction = -this.direction;
      this.body.velocity.x = this.direction;
    }
    if (this.type === "star") {
      if (this.body.blocked.down) {
        this.body.velocity.y = -300;
      }
      this.tintCnt++;
      if (this.tintCnt > 5) {
        this.tintIndex++;
        this.tintCnt = 0;
        if (this.tintCnt > 7) {
          this.tintCnt = 0;
        }
      }
      this.tint = [0xFFFFFF, 0xFF0000, 0xFFFFFF, 0x00FF00, 0xFFFFFF, 0x0000FF][this.tintCnt];
    }
  }

  collected(powerUp, mario) {
    switch (powerUp.type) {
      case "mushroom":
         // Powerup will not be removed until next loop after physics is running again
         // (physics is paused by mario.resize), until then we'll just hide it.
        mario.resize(true);
        powerUp.scene.sound.playAudioSprite('sfx', 'smb_powerup');
        break;
      case "star":
        mario.star.active = true;
        mario.star.timer = 10000;
        powerUp.scene.sound.playAudioSprite('sfx', 'smb_powerup');
        break;
      case "1up":
        powerUp.scene.sound.playAudioSprite('sfx', 'smb_1-up');
        break;
    }
    // get points
    powerUp.scene.updateScore(1000);
    powerUp.alpha = 0;
    

  }

}
