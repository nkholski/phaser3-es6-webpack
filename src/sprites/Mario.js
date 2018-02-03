export default class Mario extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.acceleration = 600;
    this.body.maxVelocity.x = 200;
    this.body.maxVelocity.y = 500;
    this.animSuffix = "";
    this.small();
    this.bending = false;
    this.wasHurt = -1;
    this.flashToggle = false;
    this.star = {
      active: false,
      timer: -1,
      step: 0
    }
    this.enteringPipe = false;
    this.anims.play("stand");
    this.alive = true;
    this.type = "mario";
    this.jumpTimer = 0;
    this.jumping = false;
  }

  update(keys, time, delta) {

    // If Mario falls down a cliff or died, just let him drop from the sky and prentend like nothing happened
    
    if (this.y > 2040) {
      this.y = -32;
      this.alive = true;
      this.scene.music.seek = 0;
      this.scene.music.play();
    }else if(this.y>240 && this.alive){
      this.die();
    }


    // Don't do updates while entering the pipe or being dead
    if (this.enteringPipe || !this.alive) {
      return;
    }

    // Just run callbacks when hitting something from below or trying to enter it
    if (this.body.velocity.y < 0 || this.bending) {
      this.scene.physics.world.collide(this, this.scene.groundLayer, this.scene.tileCollision);
    }
    else {
      this.scene.physics.world.collide(this, this.scene.groundLayer);
    }




    if (this.wasHurt > 0) {
      this.wasHurt -= delta;
      this.flashToggle = !this.flashToggle;
      this.alpha = this.flashToggle ? 0.2 : 1;
      if (this.wasHurt <= 0) {
        this.alpha = 1;
      }
    }

    if (this.star.active) {
      if (this.star.timer < 0) {
        this.star.active = false;
        this.tint = 0xFFFFFF;
      }
      else {
        this.star.timer -= delta;
        this.star.step = (this.star.step === 5) ? 0 : this.star.step + 1;
        this.tint = [0xFFFFFF, 0xFF0000, 0xFFFFFF, 0x00FF00, 0xFFFFFF, 0x0000FF][this.star.step];
      }
    }


    //this.angle++
    //  console.log(this.body.velocity.y);
    if (this.body.velocity.y > 0) {
      this.hasFalled = true;
    }

    this.bending = false;

    this.jumpTimer-=delta;

    if (keys.left.isDown) {
      if (this.body.velocity.y === 0) {
        this.run(-this.acceleration);
      }
      else {
        this.run(-this.acceleration / 3);
      }
      this.flipX = true;
    }
    else if (keys.right.isDown) {
      if (this.body.velocity.y === 0) {
        this.run(this.acceleration);
      }
      else {
        this.run(this.acceleration / 3);
      }
      this.flipX = false;
    }
    else if (this.body.blocked.down) {

      if (Math.abs(this.body.velocity.x) < 10) {
        this.body.setVelocityX(0);
        this.run(0);
      }
      else {

        this.run(((this.body.velocity.x > 0) ? -1 : 1) * this.acceleration / 2);
      }


    }
    else if (!this.body.blocked.down) {
      this.run(0);
    }

    if (keys.jump.isDown && (!this.jumping || this.jumpTimer>0)) {
      this.jump();
    }
    else if(!keys.jump.isDown && this.body.blocked.down){
      this.jumping = false;
    }



    let anim = null;
    if (this.body.velocity.y !== 0) {
      anim = "jump"
    } else if (this.body.velocity.x !== 0) {
      anim = "run";
      if ((keys.right.isDown || keys.left.isDown) && ((this.body.velocity.x > 0 && this.body.acceleration.x < 0) || (this.body.velocity.x < 0 && this.body.acceleration.x > 0))) {
        anim = "turn";
      }
      else if (this.animSuffix != "" && keys.down.isDown && !(keys.right.isDown || keys.left.isDown)) {
        anim = "bend";
      }
    }
    else {
      anim = "stand";
      if (this.animSuffix != "" && keys.down.isDown && !(keys.right.isDown || keys.left.isDown)) {
        anim = "bend";
      }
    }

    anim += this.animSuffix;
    if (this.anims.currentAnim.key !== anim) {
      this.anims.play(anim);
    }

    if (keys.down.isDown && this.body.velocity.x < 100) {
      this.bending = true;
    }

    this.physicsCheck = true;

  }

  run(vel) {
    this.body.setAccelerationX(vel);
  }

  jump() {

    if (!this.body.blocked.down && !this.jumping) {
      return;
    }

    if(this.animSuffix===""){
      this.scene.sound.playAudioSprite('sfx', 'Jump');
    }
    else {
      this.scene.sound.playAudioSprite('sfx', 'Big Jump');
    }
    if(this.body.velocity.y<0 || this.body.blocked.down){
    this.body.setVelocityY(-200);
    }
    if(!this.jumping){
    this.jumpTimer = 300;
    }
    this.jumping = true;

  }

  enemyBounce() {

    this.body.setVelocityY(-150);

  }

  hurtBy(enemy) {
    if(!this.alive){
      return;
    }
    if (this.star.active) {
      enemy.starKilled(enemy, this);
    }
    else if (this.wasHurt < 1) {
      if (this.animSuffix !== "") {
        this.resize(false);
        this.wasHurt = 2000;
      }
      else {
        this.die();
      }
    }
  }

  resize(large) {
    this.scene.physics.world.pause();
    if (large) {
      this.large();
      this.animSuffix = "Super";
      this.play("grow");
    }
    else {
      this.small();
      this.animSuffix = "";
      this.play("shrink");
    }
  }

  small() {
    this.body.setSize(10, 10);
    this.body.offset.set(3, 22);
  }
  large() {
    this.body.setSize(10, 22);
    this.body.offset.set(3, 10);
  }

  die() {
    // Called when killed by enemy or TODO: Timeup
    this.scene.music.pause(); 
    this.play("death");
    this.scene.sound.playAudioSprite('sfx', 'Die');

    this.body.setAcceleration(0);
    this.body.setVelocity(0, -300);
    this.alive = false;
  }

  enterPipe(id, dir, init = true) {

    if (init) {
      if (this.animSuffix === "") {
        this.play("stand");
      }
      else {
        this.play("bend" + this.animSuffix);
      }
      this.scene.sound.playAudioSprite('sfx', 'Warp');

      this.enteringPipe = true;
      this.body.setVelocity(0);
      this.body.setAcceleration(0);
      this.setDepth(-100);
      this.scene.tweens.add({
        targets: this,
        y: this.y + 40,
        duration: 800,
        onComplete: function () {
          console.log(this.targets, id, dir); console.log(id); console.log(dir); this.targets[0].enterPipe(id, dir, false);
        },
      });

    }
    else {
      this.scene.cameras.main.setBackgroundColor(this.scene.destinations[id].sky);
      this.setDepth(1);
      this.enteringPipe = false;
      this.x = this.scene.destinations[id].x;
      this.y = this.scene.destinations[id].top ? -100 : 100;
      this.scene.rooms.forEach(
        (room) => {
          if (this.x >= room.x && this.x <= (room.x + room.width)) {
            let cam = this.scene.cameras.main;
            let layer = this.scene.groundLayer;
            cam.setBounds(room.x, 0, room.width * layer.scaleX, layer.height * layer.scaleY);
          }
        }
      );
    }
  }



}
