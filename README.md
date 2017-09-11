# Phaser 3 + ES6 + Webpack
#### A Phaser 3 Bootstrap project / Sandbox

This repository is ment as a sandbox for testing out Phaser 3 while it's being developed. Please make a PR if you create anything to share. Beware that stuff might be broken and Phaser 3 is not ready for production yet. The Phaser 3 example code is a bit of guess work since there are no documentation yet, and does not represent best practises. It might however help you getting started experimenting with Phaser 3. I did this because I wanted ES6 and live reload. Can't live without it and I wanted to try out Phaser 3.

The repository is based on the excellent Bootstrap project for Phaser 2 "Phaser + ES6 + Webpack" (https://github.com/lean/phaser-es6-webpack), which was based on https://github.com/belohlavek/phaser-es6-boilerplate and https://github.com/cstuncsik/phaser-es6-demo. Most of this project is an exact copy of that repository, only with the Phaser package updated to Phaser 3 and the example replaced with one based on Phaser 3.

# Documentation
This section is a slightly modified version of that found on https://github.com/lean/phaser-es6-webpack.

## Features
- ESLINT with JavaScript Standard Style configuration
- Next generation of Javascript
- Browsers are automatically updated as you change project files
- Webpack ready
- WebFont Loader

# Setup
To use this bootstrap you’ll need to install a few things before you have a working copy of the project.

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

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser


## Build for deployment:

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.
