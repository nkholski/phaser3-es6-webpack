class MarriedWithChildren extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'MarriedWithChildren'
        });

        this.style = document.createElement('style');
        this.style.innerHTML = '#marriedwithchilden {' +
            'transform: inherit !important; position:fixed !important; width: 100vw; left: 0;' +
            '}';
        document.body.appendChild(this.style);
    }
    preload() {
        
    }
    create() {
       
        this.video = document.createElement('video');
        this.video.playsinline = false;
        this.video.src = 'assets/video/marriedwithchildren.mp4';
        this.video.id = 'marriedwithchilden';
        this.video.autoplay = false;

        this.element = this.add.dom(0,0, this.video);
        
        this.video.addEventListener('ended', (event) => {
    
            this.element.setVisible(false);
    
            this.scene.stop('MarriedWithChildren');
            var gameScene = this.scene.get('GameScene');
            gameScene.resumeAfterVideo();
        });
        
        this.video.play(true);
    }

    update(time, delta) {
    }

}

export default MarriedWithChildren;
