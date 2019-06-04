class YouAreSafe extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'YouAreSafe'
        });

        this.style = document.createElement('style');
        this.style.innerHTML = '#youaresafe {' +
            'transform: inherit !important; position:fixed !important; width: 100vw; left: 0;' +
            '}';
        document.body.appendChild(this.style);
    }
    preload() {

    }
    create() {
        this.gameScene = this.scene.get('GameScene');
        let sh = window.screen.availHeight;
        let sw = window.screen.availWidth;

        let multiplier = 1;
        if (sh / sw > 0.6) {
            // Portrait, fit width
            multiplier = sw / 400;
        } else {
            multiplier = sh / 240;
        }
        multiplier = Math.floor(multiplier);
        console.log(multiplier);

        this.video = document.createElement('video');
        this.video.playsinline = false;
        this.video.src = 'assets/video/youaresafe.mp4';
        this.video.id = 'youaresafe';
        this.video.autoplay = false;
        this.video.style.width = '100%';
        this.video.style.height = '100%';
        this.video.style.position = 'absolute';
        this.video.style.left = '0';
        this.video.style.top = '0';

        this.element = document.body.prepend(this.video);

        this.video.addEventListener('ended', (event) => {
            this.element.setVisible(false);
            this.scene.stop('YouAreSafe');
            this.gameScene.resume();
        });

        this.video.play(true);

        this.input.keyboard.on('keydown', event => {
            this.scene.stop('YouAreSafe');
            this.gameScene.resume();
        }, this);
    }

    update(time, delta) {
    }

}

export default YouAreSafe;
