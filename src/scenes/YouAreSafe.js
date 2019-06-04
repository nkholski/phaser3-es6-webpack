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
        //let video = document.getElementsByTagName('canvas')[0];
        this.video.playsinline = false;
        this.video.src = 'assets/video/youaresafe.mp4';
        this.video.id = 'youaresafe';
        //this.video.width = 420;
        //this.video.height = 240;
        this.video.autoplay = false;

        //this.video.style = 'width: 800px; height: 900px;'xv
        //
        //el.src = 'assets/video/youaresafe.mp4';
        this.element = this.add.dom(0,0, this.video);
        // this.element.parent.style.width='100%';
        // this.element.parent.height='100%';
        //this.element.setOrigin(0,0);

        // this.element.parent.style.width = 90 + 'vh';
        // this.element.parent.style.height = 352 + 'px';
        // this.element.parent.style.left = ((sw - this.element.parent.offsetHeight) / 2) + 'px';
        // this.element.parent.style.top = ((sh - this.element.parent.offsetWidth) / 2 ) + 'px';

        this.video.addEventListener('ended', (event) => {

            this.element.setVisible(false);

            this.scene.stop('YouAreSafe');
            var gameScene = this.scene.get('GameScene');
            gameScene.resume();
        });

        this.video.play(true);
        // this.video.style.transform = '';
    }

    update(time, delta) {
    }

}

export default YouAreSafe;
