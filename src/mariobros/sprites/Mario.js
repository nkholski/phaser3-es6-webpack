export default class Mario extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.velocity = 200;
    this.body.setVelocity(0, 0).setBounce(0, 0).setCollideWorldBounds(false);

    this.body.maxVelocity.x = 200;
    this.body.width = 4;
    this.animSuffix = "";
    this.body.setSize(14, 32, -1, 0);
    //console.log("size", this.body.width, this.body.height, this.body);
    this.hasFalled = true;
    this.anims.play('runSuper');
    this.wasHurt = -1;
    this.flashToggle = false;
    this.star = {
      active: false,
      timer: -1,
      step: 0
    }
    return this;
  }

  update(keys, delta) {
    this.alpha = 1;

    if (this.wasHurt === 1) {
      this.wasHurt = delta + 2000;
    }
    if (this.wasHurt > (delta + 500)) {
      this.flashToggle = !this.flashToggle;
      this.alpha = this.flashToggle ? 0.2 : 1;
    }

    if (this.star.active) {
      if (this.star.timer < delta - 500) {
        this.star.timer = delta + 5000;
      }
      console.log(this.star.timer);
      if (this.star.timer > delta) {
        this.star.step = (this.star.step === 5) ? 0 : this.star.step + 1;
        this.tint = [0xFFFFFF, 0xFF0000, 0xFFFFFF, 0x00FF00, 0xFFFFFF, 0x0000FF][this.star.step];

      }
      else {
        this.star.active = false;
        this.tint = 0xFFFFFF;
      }
    }


    if (this.body.velocity.y < 0) {
      console.log(this.body.acceleration.y);
    }
    //this.angle++
    //  console.log(this.body.velocity.y);
    if (this.body.velocity.y > 0) {
      this.hasFalled = true;
    }


    if (keys.left.isDown) {
      if (this.body.velocity.y === 0) {
        this.run(-this.velocity);
      }
      else {
        this.run(-this.velocity / 3);
      }
      this.flipX = true;
    }
    else if (keys.right.isDown) {
      if (this.body.velocity.y === 0) {
        this.run(this.velocity);
      }
      else {
        this.run(this.velocity / 3);
      }
      this.flipX = false;
    }
    else if (this.body.blocked.down) {

      if (Math.abs(this.body.velocity.x) < 10) {
        this.body.setVelocityX(0);
      }

      this.run(-this.body.velocity.x * 2);


    }
    else if (!this.body.blocked.down) {
      this.run(0);
    }

    if (keys.jump.isDown) {
      this.jump();
    }

    let anim = null;
    if (this.body.velocity.y !== 0) {
      anim = "jump"
    } else if (this.body.velocity.x !== 0) {
      anim = "run";
      if ((keys.right.isDown || keys.left.isDown) && ((this.body.velocity.x > 0 && this.body.acceleration.x < 0) || (this.body.velocity.x < 0 && this.body.acceleration.x > 0))) {
        anim = "turn";
      }
    }
    else {
      anim = "stand";
    }
    anim += this.animSuffix;
    if (this.anims.currentAnim.key !== anim) {
      this.anims.play(anim);
    }


    this.physicsCheck = true;

  }

  run(vel) {
    this.body.setAccelerationX(3 * vel);
  }

  jump() {

    if (!this.body.blocked.down) {
      return;
    }
    console.log("HOPPAR");
    this.body.setVelocityY(-350);
    this.hasFalled = false;
    this.physicsCheck = false;

  }

  enemyBounce() {

    this.body.setVelocityY(-150);

  }

  hurtBy(enemy) {
    if (this.star.active) {
      enemy.starKilled(enemy, this);
    }
    else {
      this.wasHurt = 1;
      console.log("hurt by", enemy);
    }
  }
}
