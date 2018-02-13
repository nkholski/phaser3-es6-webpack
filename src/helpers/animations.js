export default function makeAnimations(scene) {
    // TONS of animations. Everything animation-related is ugly and stupid below. 
    // TODO:  maybe use JSON to load animations
    let config = {
        key: 'brickTile',
        frames: scene.anims.generateFrameNumbers('tiles', { start: 14, end: 14, first: 14 })
    };
    scene.anims.create(config);
    config = {
        key: 'blockTile',
        frames: scene.anims.generateFrameNumbers('tiles', { start: 43, end: 43, first: 43 })
    };


    
    scene.anims.create(config);
    config = {
        key: 'runSuper',
        frames: scene.anims.generateFrameNumbers('mario', { start: 0, end: 2, first: 0 }),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 0
    };
    scene.anims.create(config);
    config.key = "run";
    config.frames = scene.anims.generateFrameNumbers('mario', { start: 17, end: 19 }),
        scene.anims.create(config);
    config = {
        key: 'jumpSuper',
        frames: scene.anims.generateFrameNumbers('mario', { start: 4, end: 4 }),
    };
    scene.anims.create(config);
    config.key = "jump";
    config.frames = scene.anims.generateFrameNumbers('mario', { start: 21, end: 21 }),
        scene.anims.create(config);

        config.key = "death";
        config.frames = scene.anims.generateFrameNumbers('mario', { start: 22, end: 22 }),
            scene.anims.create(config);
    


    config = {
        key: 'standSuper',
        frames: scene.anims.generateFrameNumbers('mario', { start: 6, end: 6, first: 6 }),
    };
    scene.anims.create(config);
    
    config.key = "stand";
    config.frames = scene.anims.generateFrameNumbers('mario', { start: 23, end: 23 }),
    scene.anims.create(config);
    
    config = {
        key: 'turnSuper',
        frames: scene.anims.generateFrameNumbers('mario', { start: 3, end: 3, first: 3 }),
    };
    scene.anims.create(config);
    config.key = "turn";
    config.frames = scene.anims.generateFrameNumbers('mario', { start: 20, end: 20 }),
        scene.anims.create(config);
    config.key = "bendSuper";
    config.frames = [{ key: "mario-sprites", frame: 'mario/bend' }],
        scene.anims.create(config);


    // Didn't find a good way to create an animation with frame names without a pattern.
    let frames = [];
    (['mario/half', 'mario/stand', 'mario/half', 'mario/standSuper', 'mario/half', 'mario/standSuper']).forEach(
        frame => {
            frames.push({ frame, key: 'mario-sprites' });
        }
    );
    // scene is actually pretty cool. The powerup pauses physics and the animation onComplete-callback resumes it.
    config = {
        key: "grow",
        frames: frames,
        frameRate: 10,
        onComplete: () => { scene.physics.world.resume(); },
        repeat: 0,
        repeatDelay: 0
    };
    scene.anims.create(config);
    config = {
        key: "shrink",
        frames: frames.reverse(),
        frameRate: 10,
        onComplete: () => { scene.physics.world.resume(); },
        repeat: 0,
        repeatDelay: 0
    };
    scene.anims.create(config);
    config = {
        key: 'goomba',
        frames: scene.anims.generateFrameNumbers('sprites16', { start: 4, end: 5 }),
        frameRate: 5,
        repeat: -1,
        repeatDelay: 0
    };
    scene.anims.create(config);
    config = {
        key: 'goombaFlat',
        frames: scene.anims.generateFrameNumbers('sprites16', { start: 6, end: 6 }),
    };
    scene.anims.create(config);
    config = {
        key: 'turtle',
        frames: scene.anims.generateFrameNames('mario-sprites', { prefix: 'turtle/turtle', end: 1 }),
        frameRate: 5,
        repeat: -1,
        repeatDelay: 0
    };

    scene.anims.create(config);
    config = {
        key: 'mario/climb',
        frames: scene.anims.generateFrameNames('mario-sprites', { prefix: 'mario/climb', end: 1 }),
        frameRate: 5,
        repeat: -1,
        repeatDelay: 0
    };
    scene.anims.create(config);
    config = {
        key: 'mario/climbSuper',
        frames: scene.anims.generateFrameNames('mario-sprites', { prefix: 'mario/climbSuper', end: 1 }),
        frameRate: 5,
        repeat: -1,
        repeatDelay: 0
    };

    scene.anims.create(config);

    config = {
        key: 'flag',
        frames: [{ key: "mario-sprites", frame: 'flag' }],
        repeat: -1,
    };
    scene.anims.create(config);

    config = {
        key: 'turtleShell',
        frames: [{ frame: 'turtle/shell', key: 'mario-sprites' }],
    };

    scene.anims.create(config);

    config = {
        key: 'mushroom',
        frames: scene.anims.generateFrameNumbers('sprites16', { start: 2, end: 2 }),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 0
    };
    scene.anims.create(config);

    config = {
        key: 'coin',
        frames: scene.anims.generateFrameNumbers('sprites16', { start: 3, end: 3 }),
    };
    scene.anims.create(config);

    config = {
        key: '1up',
        frames: scene.anims.generateFrameNumbers('sprites16', { start: 0, end: 0 }),
    };
    scene.anims.create(config);

    config = {
        key: 'star',
        frames: scene.anims.generateFrameNumbers('sprites16', { start: 1, end: 1 }),
    };
    scene.anims.create(config);
    config = {
           key: 'dpad',
        frames: [{ frame: 'controller/dpad', key: 'mario-sprites' }],
    };
    scene.anims.create(config);
    config = {
        key: 'button',
     frames: [{ frame: 'controller/button', key: 'mario-sprites' }],
 };
 scene.anims.create(config);
}