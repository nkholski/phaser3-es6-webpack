export default class Water extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.gameScene = config.scene;
        this.type = config.type;
        this.played = false;

        // Standard sprite is 16x16 pixels with a smaller body
        this.body.setSize(10, 10);
        this.body.offset.set(0, 5);

        //    this.scene.updateLoop.push(this);
        return this;
    }

    update() {
        if (this.alpha === 0) {
            this.destroy();
            return;
        }
        console.log(this);
        this.scene.physics.world.collide(this, this.scene.mario, this.waterCollison);
    }

    waterCollison(powerUp, mario) {
        if (this.played) return;
        this.gameScene.playSafeVideo();
        this.played = true;
    }
}
