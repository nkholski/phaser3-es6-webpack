# Generic Platformer and Phaser Bootstrap Project
#### Phaser 3 + ES6 + Webpack

This repository started as a sandbox for testing out Phaser 3 while it was in Beta bundeled with a few examples. These examples are now removed and replaced with a generic platformer project that explores Phaser 3 API. With the example project removed this is still a good boiler plate to start with. The aim of the platformer is not to relase a game but to try stuff out and to share something for others to learn from. I usually think the best way to learn is to read and manipulate source code. A quick disclaimer though, even if my aim is to identify best practices that's far from where the source code is today. I don't use pools. I do define at least one global function. Etc etc.

![Running example](https://github.com/nkholski/phaser3-es6-webpack/raw/master/rawAssets/smb-phaser3.gif)

**Live demo:** http://metroid.niklasberg.se/phaser3platformer/

The boiler plate code is based on the excellent Bootstrap project for Phaser 2 "Phaser + ES6 + Webpack" (https://github.com/lean/phaser-es6-webpack), which was based on https://github.com/belohlavek/phaser-es6-boilerplate and https://github.com/cstuncsik/phaser-es6-demo. Most of this project is an exact copy of that repository, only with the Phaser package updated to Phaser 3 and the example replaced with one based on Phaser 3. If (or when) Lean releases a Phaser 3 version of their own I'll probably shift to use that and focus on the generic platformer.

**Disclaimer**: The generic platformer isn't an attempt to recreate any copyrighted game, and it will not become a playable game. You get nothing out of this besides learning about Phaser 3.

# Contribute
Please any submit issues you have, including proposals. Ask me before preparing a PR or your PR might be rejected if in conflict with other ideas and planned way to do stuff. This would be great:
- Feedback on best practises and why I'm being stupid
- Extend the sprites texture atlas from the spritesheets I still use so I can dump them

# Parts of API used:
A messy list of things I used from the Phaser API. I'll try to improve this, but it gives a hint of what you might expect to find in the source code to read bring to your own projects.

**Preloader**
- image, tilemapTiledJSON, spritesheet, atlas, audio, audiosprite, bitmapFont, plugin

**Input**
- Phaser.Input.Keyboard
- Touch controls

**Audio**
- Audioatlas (including some event listeners)
- Music (pause/resume/rate)

**Animations**
- Animating sprites

**Tilemaps**
- Multiple layers
- Dynamic layers
- Animated tiles (Plugin: https://github.com/nkholski/phaser-animated-tiles)
- Object layers are used to manipulate the map, define areas and add enemies. 

**Tilesprite**
- Background clouds

**Sprites**
- All sprites are ES6 extensions of native Phaser.Sprite

**Physics**
- Acceleration
- body sizes
- pause
- collisions and overlap sprite/sprite and sprite/tilemaplayer

**Groups**
- Sprites are put in groups

**BitmapText**
- For score and timer

**Tweens**
- entering pipes, ending the world etc.

# Thanks to
- The Phaser team @photonstorm, @mikewesthad and @pavle-goloskokovic for building Phaser 3 in general and for assisting while building this.
- @AleBles - Updated webpack-stuff when the project was stalled at Beta 19.

# Setup
You’ll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

Navigate into your workspace directory.

Run:

```git clone https://github.com/nkholski/phaser3-es6-webpack.git```

## 2. Install node.js and npm:

https://nodejs.org/en/


## 3. Install dependencies (optionally you could install [yarn](https://yarnpkg.com/)):

Navigate to the cloned repo’s directory.

Run:

```npm install```

or if you choose yarn, just run ```yarn```

## 4. Run the development server:

Run:

```npm run dev```

This will run a server so you can run the game in a browser.

Open your browser and enter localhost:3000 into the address bar.

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser.


## Build for deployment:

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.
