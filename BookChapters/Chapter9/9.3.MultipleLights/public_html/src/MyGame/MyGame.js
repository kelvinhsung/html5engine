/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, FontRenderable, SpriteRenderable, LightRenderable,
  GameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kBg = "assets/bg.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mBg = null;

    this.mMsg = null;

    // the hero and the support objects
    this.mHero = null;
    this.mLMinion = null;
    this.mRMinion = null;

    this.mGlobalLightSet = null;

    this.mBlock1 = null;   // to verify swiitching between shaders is fine
    this.mBlock2 = null;

    this.mLgtIndex = 0;    // the light to move
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kBg);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kBg);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                       // width of camera
        [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

    // the light
    this._initializeLights();   // defined in MyGame_Lights.js

    // the Background
    var bgR = new LightRenderable(this.kBg);
    bgR.setElementPixelPositions(0, 1900, 0, 1000);
    bgR.getXform().setSize(380, 200);
    bgR.getXform().setPosition(50, 35);
    var i;
    for (i = 0; i < 4; i++) {
        bgR.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
    }
    this.mBg = new GameObject(bgR);

    // 
    // the objects
    this.mHero = new Hero(this.kMinionSprite);
    this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(0));   // hero light
    this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(3));   // center light
    // Uncomment the following to see how light affects Dye
    //      this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(1)); 
    //      this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(2)); 

    this.mLMinion = new Minion(this.kMinionSprite, 30, 30);
    this.mLMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(1));   // LMinion light
    this.mLMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(3));   // center light

    this.mRMinion = new Minion(this.kMinionSprite, 70, 30);
    this.mRMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(2));   // RMinion light
    this.mRMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(3));   // center light

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(1, 2);
    this.mMsg.setTextHeight(3);

    this.mBlock1 = new Renderable();
    this.mBlock1.setColor([1, 0, 0, 1]);
    this.mBlock1.getXform().setSize(5, 5);
    this.mBlock1.getXform().setPosition(30, 50);

    this.mBlock2 = new Renderable();
    this.mBlock2.setColor([0, 1, 0, 1]);
    this.mBlock2.getXform().setSize(5, 5);
    this.mBlock2.getXform().setPosition(70, 50);
};


MyGame.prototype.drawCamera = function (camera) {

    // Step A: set up the View Projection matrix
    camera.setupViewProjection();
    // Step B: Now draws each primitive
    this.mBg.draw(camera);
    this.mBlock1.draw(camera);
    this.mLMinion.draw(camera);
    this.mBlock2.draw(camera);
    this.mHero.draw(camera);
    this.mRMinion.draw(camera);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Draw with all three cameras
    this.drawCamera(this.mCamera);
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    var msg = "Selected Light=" + this.mLgtIndex + " ";

    this.mCamera.update();  // to ensure proper interploated movement effects

    this.mLMinion.update(); // ensure sprite animation
    this.mRMinion.update();

    this.mHero.update();  // allow keyboard control to move

    // control the selected light
    msg += this._lightControl();

    this.mMsg.setText(msg);
};