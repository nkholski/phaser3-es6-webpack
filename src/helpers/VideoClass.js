/* video typedef. */                                                                                                               

export default class VideoClass extends Phaser.GameObjects.Image {

	constructor(scene, id, x, y, texture, file, width, height, loop) {
	
			/* set texture pointer to new canvas. */
	scene.textures.createCanvas(texture, width, height);
	super(this, scene, x, y, texture);

	/* gameobject data. */
	this.id=id;
	this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;

	/* video data. */
	this.loaded=false;
	this.loop=false;
	if (loop)
		this.loop=true;

	/* create video as html5 video element. */
	this.video=document.createElement('video');
	this.video.muted=false;
	this.video.src=file;

	/* laziness - should use .call(this, ...) */
	var _this=this;

	/* hook video event listener into animation. */
	this.video.addEventListener('loadeddata', function() {
		this.play();
		_this.texture.context.drawImage(this, 0, 0);
		_this.texture.refresh();
		_this.loaded=true;
	});
	/* loop by playing on 'end' event listener. */
	if (this.loop) {
		this.video.addEventListener('ended', function() {
			this.play();
		});
	}

	/* dragging. */
	this.setInteractive({draggable:true});
	this.on('dragstart', function (gameobject) {
		this.setTint(0xff0000);
	});
	this.on('drag', function (gameobject, drag_x, drag_y) {
		this.x=drag_x;
		this.y=drag_y;
	});
	this.on('dragend', function (gameobject) {
		this.clearTint();
	});

	scene.add.existing(this);
	}

	update() {
		/* phaser's update call. */
		if (this.loaded) {
			this.texture.context.drawImage(this.video, 0, 0);
			/* beware of refresh and issues with overloading the GPU  - need more research here. */
			this.texture.refresh();
			//this.texture.update();
		}
	}
}
// video_t.prototype.constructor=video_t;
// video_t.prototype=Object.create(Phaser.GameObjects.Image.prototype);

// video_t.prototype.update=function() {
// 	/* phaser's update call. */
// 	if (this.loaded) {
// 		this.texture.context.drawImage(this.video, 0, 0);
// 		/* beware of refresh and issues with overloading the GPU  - need more research here. */
// 		this.texture.refresh();
// 		//this.texture.update();
// 	}
// }
