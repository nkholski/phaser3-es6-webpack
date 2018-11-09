import Enemy from './Enemy';

export default class Turtle extends Enemy {
    constructor(config) {
        super(config);
        this.flipX = true;
        this.anims.play('turtle');
        this.sliding = false;
        this.type = 'turtle';
        this.body.setSize(12, 12);
        this.body.offset.set(2, 2);
    }

    update() {
        if (!this.activated()) {
            return;
        }
        if (this.sliding) {
            this.scene.physics.world.collide(this, this.scene.groundLayer, this.scene.tileCollision);
            this.scene.enemyGroup.children.entries.forEach((enemy) => {
                if (this !== enemy) {
                    this.scene.physics.world.overlap(this, enemy, this.slidekill);
                }
            });
        } else {
            this.scene.physics.world.collide(this, this.scene.groundLayer);
        }
        this.scene.physics.world.overlap(this, this.scene.mario, this.marioHit);
        if (this.body.velocity.x === 0) {
            this.direction = -this.direction;
            this.body.velocity.x = this.direction;
            this.flipX = this.direction < 0;
        }
    }

    slidekill(turtle, victim) {
        if (typeof victim.starKilled !== 'undefined') {
            victim.starKilled();
        }
    }

    marioHit(enemy, mario) {
        // direction
        // den av overlap x or overlap y som är störst
        // let verticalHit = Math.abs(enemy.x-mario.x)<Math.abs(enemy.y-mario.y);

        // console.log('vertical',verticalHit);
        if (mario.star.active) {
            enemy.hurtMario(enemy, mario);
            return;
        }

        if (enemy.verticalHit(enemy, mario)) {
            // get points
            enemy.scene.updateScore(100);
            if (!enemy.sliding || (enemy.sliding && enemy.body.velocity.x === 0)) {
                enemy.scene.sound.playAudioSprite('sfx', 'smb_kick');
                // enemy.body.height = 16;
                enemy.direction = 150 * (mario.x < enemy.x ? 1 : -1);

                enemy.body.velocity.x = enemy.direction;
                enemy.sliding = true;
                enemy.play('turtleShell');
            } else {
                enemy.scene.sound.playAudioSprite('sfx', 'smb_stomp');

                enemy.direction = 0;
                enemy.body.velocity.x = 0;
                enemy.sliding = true;
                enemy.play('turtleShell');
            }
            mario.enemyBounce(enemy);
        } else {
            if (enemy.sliding && enemy.body.velocity.x === 0) {
                enemy.scene.sound.playAudioSprite('sfx', 'smb_kick');

                enemy.direction = 150;
                enemy.body.velocity.x = 150;
            }
            enemy.hurtMario(enemy, mario);
        }
    }
}
