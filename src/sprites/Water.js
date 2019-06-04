export default class Water extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        config.scene.add.existing(this);
        this.gameScene = config.scene;
        this.type = config.type;
        if (! this.scene.hasOwnProperty('played')) this.scene.played = false;
        this.x += 16;
        this.setSize(8, 8);
        this.setVisible(false);

        //    this.scene.updateLoop.push(this);
        return this;
    }
    update() {
        if (this.alpha === 0) {
            this.destroy();
            return;
        }

        this.scene.physics.world.overlap(this, this.gameScene.mario, this.waterCollison, null, this);
    }

    waterCollison() {
        if (this.scene.played) return;
        this.scene.played = true;
        this.gameScene.playSafeVideo();
    }
}
