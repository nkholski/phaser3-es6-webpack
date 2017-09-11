class BootMenu extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootMenu'
    });
  }

  create() {
    let config = {
      x: 100,
      y: 100,
      text: 'Phaser 3 - Examples',
      style: {
        font: '64px Arial',
        fill: '#ff00ff',
        align: 'center',
        stroke: '#ffffff',
        strokeThickness: '4',
      }
    };
    this.make.text(config);

    config = {
      x: 100,
      y: 180,
      text: '[A] Spinning mushroom\n[B] Player Demo (input)',
      style: {
        font: '48px Arial',
        fill: '#ff00ff',
        align: 'center',
              }
    };
    this.make.text(config);

    this.input = [
      { key:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A), scene: "MushroomScene"},
      { key:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B), scene: "PlayerScene"}
    ];

  }

  update() {
    for(let input of this.input){
      if(input.key.isDown){
        this.scene.start(input.scene);
      }
    }
  }
}

export default BootMenu;
