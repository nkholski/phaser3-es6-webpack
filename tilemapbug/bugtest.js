var config = {
    type: Phaser.WEBGL,
    width: 160,
    height: 160,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);

function preload() {
    this.load.image('tiles', './red.png');
    this.load.tilemapJSON('map', './map.json');
    this.load.spritesheet('player', './green.png', { frameWidth: 16, frameHeight: 16 });
}

function create() {
    this.map = this.make.tilemap({ key: 'map' });
    
    var tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createDynamicLayer(0, tileset, 0, 0);
    this.map.setCollision(1);
    this.player1 = this.add.sprite(16 * 9, 16 * 2, 'player', 1);
    this.physics.world.enable(this.player1);
    this.player2 = this.physics.add.sprite(0, 16 * 7, 'player', 1);
    this.physics.add.collider(this.player2, this.layer);
    this.removed = false;
}

function update(time, delta) {
    this.player1.body.setVelocityX(-100);
    this.player2.body.setVelocityX(100);
    this.physics.world.collide(this.player1, this.layer);
    if (!this.removed && time > 6000) {
        tile = this.layer.getTileAt(4, 2);
        tile.index = 0;
        tile.properties.callback = null;
        tile.resetCollision();
        this.map.calculateFacesWithin(tile.x-1,tile.y-1,3,3, this.layer);

        tile = this.layer.getTileAt(5, 7);
        tile.index = 0;
        tile.properties.callback = null;
        tile.resetCollision();


    }
}