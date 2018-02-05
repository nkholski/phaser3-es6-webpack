/**
 * 
 *  THIS IS THE FIRST BUILD OF A UPCOMING PLUGIN
 *  = Not optimized
 *  = Lacking features
 *  = API might change (even if the API is very limited)
 * 
 */



(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("AnimatedTiles", [], factory);
	else if(typeof exports === 'object')
		exports["AnimatedTiles"] = factory();
	else
		root["AnimatedTiles"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
* @author       Niklas Berg <nkholski@niklasberg.se>
* @copyright    2018 Niklas Berg
* @license      {@link https://github.com/nkholski/phaser3-animated-tiles/blob/master/LICENSE|MIT License}
*/

var AnimatedTiles = function (scene) {
    //  The Scene that owns this plugin
    this.scene = scene;

    this.systems = scene.sys;

    // TileMap the plugin belong to. 
    // TODO: Array or object for multiple tilemaps support
    // TODO: reference to layers too, and which is activated or not
    this.map = null;

    // Array with all tiles to animate
    this.animatedTiles = [];

    // Global playback rate
    this.rate = 1;
    // Playback rate per tile as multiple of the global rate.
    this.tileRate = {};

    // Should the animations play or not?
    this.active = false;

    if (!scene.sys.settings.isBooted) {
        scene.sys.events.once('boot', this.boot, this);
    }
};

//  Static function called by the PluginFile Loader.
AnimatedTiles.register = function (PluginManager) {
    //  Register this plugin with the PluginManager, so it can be added to Scenes.

    //  The first argument is the name this plugin will be known as in the PluginManager. It should not conflict with already registered plugins.
    //  The second argument is a reference to the plugin object, which will be instantiated by the PluginManager when the Scene boots.
    //  The third argument is the local mapping. This will make the plugin available under `this.sys.base` and also `this.base` from a Scene if
    //  it has an entry in the InjectionMap.
    PluginManager.register('AnimatedTiles', AnimatedTiles, 'animatedTiles');
};

AnimatedTiles.prototype = {

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot: function () {
        var eventEmitter = this.systems.events;

        //  Listening to the following events is entirely optional, although we would recommend cleanly shutting down and destroying at least.
        //  If you don't need any of these events then remove the listeners and the relevant methods too.

        //eventEmitter.on('start', this.start, this);

        //eventEmitter.on('preupdate', this.preUpdate, this);
        //eventEmitter.on('update', this.update, this);
        eventEmitter.on('postupdate', this.postUpdate, this);

        //eventEmitter.on('pause', this.pause, this);
        //eventEmitter.on('resume', this.resume, this);

        //eventEmitter.on('sleep', this.sleep, this);
        //eventEmitter.on('wake', this.wake, this);

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    // Initilize support for animated tiles on given map
    init: function (map) {
        this.map = map;
        // TODO: Allow to specify tileset?
        this.map.tilesets.forEach((tileset)=>
         {        
            this.animatedTiles = this.getAnimatedTiles(tileset.tileData);
         }
        )
        this.start(); // Start the animations by default
    },

    setRate(rate, tile = null) {
        if (!index) {
            this.rate = rate;
        }
        // if tile is number (gid) --> set rate for that tile
        // if tile is object -> check properties matching object and set rate
    },

    //  Start (or resume) animations
    start: function () {
        this.active = true;
    },

    // Stop (or pause) animations
    stop: function () {
        this.active = false;
    },

    //  Called every Scene step - phase 3
    postUpdate: function (time, delta) {
        if (!this.active) {
            return;
        }
        this.animatedTiles.forEach(
            (animatedTile) => {
                //let animatedTile = this.animatedTiles[tilkey];
                animatedTile.next -= delta * this.rate;
                if (animatedTile.next < 0) {
                    let currentIndex = animatedTile.currentFrame;
                    let newIndex = currentIndex + 1;
                    if (newIndex > (animatedTile.frames.length - 1)) {
                        newIndex = 0;
                    }
                    animatedTile.next = animatedTile.frames[newIndex].duration;
                    animatedTile.currentFrame = newIndex;
                    /**
                     * 
                     * TODO: 1. Gå på AnimationIndex, 
                     * 2. ändra bara inom vyn: MEN då måste räkna ut nya tiles som inte syntes nyss. Kom ihåg förra området!
                     * 
                     */
                    this.map.replaceByIndex(animatedTile.frames[currentIndex].tileid, animatedTile.frames[newIndex].tileid);
                }
                else {
                    // TODO: Uppdatera sådana som inte synts i förra uppdateringen

                }
            }
        );
    },

    resetRate: function (globalOnly = false) {
        this.rate = 1;
        if (!globalOnly) {
            Object.keys(this.tileRates).forEach(
                (key) => {
                    this.tileRates[key] = 1;
                }
            )
        }
    },

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function () {
    },


    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy: function () {
        this.shutdown();

        this.scene = undefined;
    },



    getAnimatedTiles: function (tileData) {
        // Buildning the array with tiles that should be animated
        let animatedTiles = [];
        Object.keys(tileData).forEach(
            (key) => {
                console.log(key);
                if (tileData[key].hasOwnProperty("animation")) {
                    let tile = {
                        key,
                        frames: [],
                        currentFrame: 0
                    };
                    tileData[key].animation.forEach((frame) => { frame.tileid++; tile.frames.push(frame) });
                    tile.next = tile.frames[0].duration;
                    animatedTiles.push(tile);
                    this.tileRate[key] = 1;
                    /**
                     * 
                     *  TODO: Add animationIndex to all
                     * 
                     */

                }
            }
        )
        return animatedTiles;
    }

};

AnimatedTiles.prototype.constructor = AnimatedTiles;

//  Make sure you export the plugin for webpack to expose

module.exports = AnimatedTiles;


/***/ })
/******/ ]);
});