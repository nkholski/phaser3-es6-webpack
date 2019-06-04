class TextBox extends Phaser.Scene {

    constructor(props) {
        super({ key: 'TextBox' });
    }

    preload() {

    }

    create(data) {
        this.gameScene = this.scene.get('GameScene');
        this.text = data.text.toUpperCase();

        this.add.rectangle(200, 120, 380, 140, '0x000000');

        this.input.keyboard.on('keydown', function (event) {
            this.scene.scene.stop('TextBox');
            this.scene.gameScene.resume();
        });

        this.textObject = this.add.bitmapText(15, 55, 'font', this.text, 9);
    }

    update(time, delta) {

    }


}

export default TextBox;
