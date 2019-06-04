class YourPrincessScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'YourPrincessScene'
        });
    }
    preload() {

    }
    create() {
        this.timer = 0;
        this.state = 0;
        this.gameScene = this.scene.get('GameScene');
    }

    update(time, delta) {
        this.timer += delta;
        if (this.timer > 2000 && this.state === 0) {
            this.displayTextBox('Sorry,\nbut your princess\nis in another castle!');
            this.state++;
        }
    }

    displayTextBox(text) {
        this.physics.world.pause();

        this.scene.launch('TextBox', {
            text: text
        });
        const textBox = this.scene.get('TextBox');
    }
}

export default YourPrincessScene;
