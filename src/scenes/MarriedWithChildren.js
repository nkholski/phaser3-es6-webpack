class MarriedWithChildren extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'MarriedWithChildren'
        });

        this.style = document.createElement('style');
        this.style.innerHTML = '#marriedwithchildren {' +
            'transform: inherit !important; position:fixed !important; width: 100vw; left: 0;' +
            '}';
        document.body.appendChild(this.style);
    }
    preload() {

    }
    create() {
        this.gameScene = this.scene.get('GameScene');

        this.video = document.createElement('video');
        this.video.playsinline = false;
        this.video.src = 'assets/video/marriedwithchildren.mp4';
        this.video.id = 'marriedwithchildren';
        this.video.autoplay = false;
        this.video.style.width = '100%';
        this.video.style.height = '100%';
        this.video.style.position = 'absolute';
        this.video.style.left = '0';
        this.video.style.top = '0';

        this.element = document.body.prepend(this.video);

        this.video.addEventListener('ended', (event) => {
            this.video.remove();
            this.scene.stop('MarriedWithChildren');
            this.gameScene.resume();
        }, this);

        this.video.play(true);

        this.input.keyboard.on('keydown', event => {
            if (event.key !== 'v') return;
            this.video.remove();
            this.scene.stop('MarriedWithChildren');
            this.gameScene.resume();
        }, this);
    }

    update(time, delta) {

    }

}

export default MarriedWithChildren;