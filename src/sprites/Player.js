export default class Player extends Phaser.GameObjects.Sprite {
  constructor (config) {
    const { scene, x, y, key } = config;

    super(scene, x, y , key);

    const playerFrames = scene.anims.generateFrameNumbers('player');
    const animationConfig = {
      walkDown: {
        key: 'playerWalkDown',
        frames: playerFrames.slice(0, 4),
        frameRate: 6,
        repeat: -1,
      },
      walkUp: {
        key: 'playerWalkUp',
        frames: playerFrames.slice(34, 38),
        frameRate: 6,
        repeat: -1,
      },
      walkLeft: {
        key: 'playerWalkLeft',
        frames: playerFrames.slice(51, 55),
        frameRate: 6,
        repeat: -1,
      },
      walkRight: {
        key: 'playerWalkRight',
        frames: playerFrames.slice(17, 21),
        frameRate: 6,
        repeat: -1,
      },
    }

    scene.anims.create(animationConfig.walkDown);
    scene.anims.create(animationConfig.walkUp);
    scene.anims.create(animationConfig.walkLeft);
    scene.anims.create(animationConfig.walkRight);
    this.anims.load('playerWalkDown');
    this.anims.load('playerWalkUp');
    this.anims.load('playerWalkLeft');
    this.anims.load('playerWalkRight');
    // this.scaleX = 2;
    // this.scaleY = 2;

    this.setInteractive();
    this.downKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    console.log(this);

    config.scene.add.existing(this);
  }

  update () {
    if(this.downKey.isDown) {
      this.y += 5;
      this.anims.play('playerWalkDown', true);
    } else if(this.upKey.isDown) {
      this.y -= 5;
      this.anims.play('playerWalkUp', true);
    } else if(this.leftKey.isDown) {
      this.x -= 5;
      this.anims.play('playerWalkLeft', true);
    } else if(this.rightKey.isDown) {
      this.x += 5;
      this.anims.play('playerWalkRight', true);
    }

    if(this.downKey.isUp && this.upKey.isUp && this.leftKey.isUp && this.rightKey.isUp) {
      this.anims.stop();
    }
  }
}
