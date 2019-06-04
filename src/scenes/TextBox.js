class TextBox extends Phaser.Scene {

    constructor(props) {
        super({ key: 'TextBox' });
    }

    preload() {
        this.partial = 5;
        this.boxPart = 5 / 3;
    }

    getTextStart(size) {
        const divisor = window.screen.availHeight / this.game.config.height;
        const margin = 16;
        return [divisor * size[0] / this.partial + margin, divisor * size[1] / this.partial + margin];
    }

    create(data) {
        this.gameScene = this.scene.get('GameScene');
        this.text = data.text.replace('\n', '\n\n').toUpperCase();

        const graphics = this.add.graphics();

        const sh = this.game.config.height;
        const sw = this.game.config.width;

        const size = [sw / this.partial, sh / this.partial, sw / this.boxPart, sh / this.boxPart];

        graphics.fillStyle('0x000000', 1);
        graphics.fillRect(...size);
        graphics.lineStyle(4, 0x003366, 1);
        graphics.strokeRect(...size);

        this.input.keyboard.on('keydown', event => {
            console.log(event);
            if (event.key !== ' ') return;
            this.scene.stop('TextBox');
            this.scene.get('GameScene').resume();
        }, this);

        this.textObject = this.add.bitmapText(...this.getTextStart(size), 'font', this.text, 9);
    }

    update(time, delta) {

    }

}

export default TextBox;
