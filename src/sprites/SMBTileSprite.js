export default class SMBTileSprite extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, -100, 0, 'tiles');
        config.scene.add.existing(this);
        this.tile = null;
        this.scene = config.scene;
        this.play('brickTile');
        this.alpha = 0;
        config.scene.physics.world.enable(this);
        this.body.allowGravity = false;
    }

    update() {
        // this.scene.physics.world.collide(this, this.scene.enemyGroup, ()=>{console.log('COLLIDED!')});
        this.scene.enemyGroup.children.entries.forEach(enemy => {
            this.scene.physics.world.overlap(this, enemy, () => {
                enemy.starKilled();
            });
        });

        /* this.scene.updateLoop.forEach(
          (sprite) => { sprite.update(delta); }
        ) */
    }

    restart(tile) {
        let anim = 'brickTile';
        this.tile = tile;
        this.tile.alpha = 0;
        this.alpha = 1;
        // tile
        if (tile.index === 44) {
            anim = 'blockTile';
        }

        this.play(anim);
        this.x = this.tile.x * 16 + 8;
        this.y = this.tile.y * 16 + 8;
        this.scene.tweens.add({
            targets: this,
            y: this.y - 8,
            yoyo: true,
            duration: 100,
            onUpdate: () => this.update(),
            onComplete: () => {
                this.tile.alpha = 1;
                this.x = -100;
                this.alpha = 0;
            }
        });
    }
}
