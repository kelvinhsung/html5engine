/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kMinionSpriteNormal = "assets/minion_sprite_normal.png";
    this.kBg = "assets/bg.png";
    this.kBgNormal = "assets/bg_normal.png";
    this.kBgLayer = "assets/bgLayer.png";
    this.kBgLayerNormal = "assets/bgLayer_normal.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mHeroCam = null;
    
    this.mBg = null;
    this.mBgL1 = null;

    this.mMsg = null;
    this.mMatMsg = null;

    // the hero and the support objects
    this.mLgtHero = null;
    this.mIllumHero = null;

    this.mLgtMinion = null;
    this.mIllumMinion = null;

    this.mGlobalLightSet = null;

    this.mBlock1 = null;   // to verify swiitching between shaders is fine
    this.mBlock2 = null;

    this.mLgtIndex = 0;
    this.mLgtRotateTheta = 0;
    
    // shadow support
    this.mBgShadow1 = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kBg);
    gEngine.Textures.loadTexture(this.kBgNormal);
    gEngine.Textures.loadTexture(this.kBgLayer);
    gEngine.Textures.loadTexture(this.kBgLayerNormal);
    gEngine.Textures.loadTexture(this.kMinionSpriteNormal);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kBg);
    gEngine.Textures.unloadTexture(this.kBgNormal);
    gEngine.Textures.unloadTexture(this.kBgLayer);
    gEngine.Textures.unloadTexture(this.kBgLayerNormal);
    gEngine.Textures.unloadTexture(this.kMinionSpriteNormal);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mHeroCam = new Camera(
        vec2.fromValues(20, 30.5), // position of the camera
        15,                        // width of camera
        [0, 330, 150, 150],         // viewport (orgX, orgY, width, height)
        2
    );
    this.mHeroCam.setBackgroundColor([0.5, 0.5, 0.9, 1]);
    
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
    var bgR = new IllumRenderable(this.kBg, this.kBgNormal);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(50, 50);
    bgR.getXform().setPosition(0, 0);
    bgR.getMaterial().setSpecular([0.2, 0.1, 0.1, 1]);
    bgR.getMaterial().setShinningness(50);
    bgR.getXform().setZPos(-20);
    bgR.addLight(this.mGlobalLightSet.getLightAt(1));   // only the directional light
    this.mBg = new ParallaxGameObject(bgR, 100, this.mCamera);
    
    var i; 
    var bgR1 = new IllumRenderable(this.kBgLayer, this.kBgLayerNormal);
    bgR1.getXform().setSize(50, 50);
    bgR1.getXform().setPosition(0, 0);
    bgR1.getXform().setZPos(-10);
    bgR1.addLight(this.mGlobalLightSet.getLightAt(1));   // the directional light
    bgR1.addLight(this.mGlobalLightSet.getLightAt(2));   // the hero spotlight light
    bgR1.addLight(this.mGlobalLightSet.getLightAt(3));   // the hero spotlight light
    bgR1.getMaterial().setSpecular([0.2, 0.2, 0.5, 1]);
    bgR1.getMaterial().setShinningness(10);    
    this.mBgL1 = new ParallaxGameObject(bgR1, 5, this.mCamera);
    this.mBgL1.setCurrentFrontDir([-1, 0]);
    
    // 
    // the objects
    this.mIllumHero = new Hero(this.kMinionSprite, this.kMinionSpriteNormal, 20, 30);
    this.mLgtHero = new Hero(this.kMinionSprite, null, 60, 50);
    this.mIllumMinion = new Minion(this.kMinionSprite, this.kMinionSpriteNormal, 25, 30);
    this.mLgtMinion = new Minion(this.kMinionSprite, null, 65, 25);
    for (i = 0; i < 4; i++) {
        this.mIllumHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
        this.mLgtHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
        this.mIllumMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
        this.mLgtMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
    }

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(1, 2);
    this.mMsg.setTextHeight(3);

    this.mMatMsg = new FontRenderable("Status Message");
    this.mMatMsg.setColor([1, 1, 1, 1]);
    this.mMatMsg.getXform().setPosition(1, 73);
    this.mMatMsg.setTextHeight(3);

    this.mBlock1 = new Renderable();
    this.mBlock1.setColor([1, 0, 0, 1]);
    this.mBlock1.getXform().setSize(5, 5);
    this.mBlock1.getXform().setPosition(30, 50);

    this.mBlock2 = new Renderable();
    this.mBlock2.setColor([0, 1, 0, 1]);
    this.mBlock2.getXform().setSize(5, 5);
    this.mBlock2.getXform().setPosition(70, 50);

    this.mSlectedCh = this.mIllumHero;
    this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
    this.mSelectedChMsg = "H:";
    
    this._setupShadow();  // defined in MyGame_Shadow.js
    
    // add to layer managers ...
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eBackground, this.mBg);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eShadowReceiver, this.mBgShadow1);
    
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mIllumMinion);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mLgtMinion);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mIllumHero);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mLgtHero);
    
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eFront, this.mBlock1);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eFront, this.mBlock2);
    
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eHUD, this.mMsg);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eHUD, this.mMatMsg);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    gEngine.LayerManager.drawAllLayers(this.mCamera);

    this.mHeroCam.setupViewProjection();
    gEngine.LayerManager.drawAllLayers(this.mHeroCam);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mCamera.update();  // to ensure proper interploated movement effects
    this.mHeroCam.update();

    this.mBgL1.update();  // not in the layer manager directly!
    gEngine.LayerManager.updateAllLayers();
    
    var xf = this.mIllumHero.getXform();
    this.mCamera.panWith(xf, 0.7);
    this.mGlobalLightSet.getLightAt(2).set2DPosition(xf.getPosition());
    this.mHeroCam.setWCCenter(xf.getXPos(), xf.getYPos());
        
    this.mCamera.panWith(this.mLgtHero.getXform(), 0.7);
    this.mGlobalLightSet.getLightAt(3).set2DPosition(this.mLgtHero.getXform().getPosition());
    
    // control the selected light
    var msg = "L=" + this.mLgtIndex + " ";
    msg += this._lightControl();
    this.mMsg.setText(msg);

    msg = this._selectCharacter();
    msg += this.materialControl();
    this.mMatMsg.setText(msg);

};

MyGame.prototype._selectCharacter = function () {
    // select which character to work with
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Five)) {
        this.mSlectedCh = this.mIllumMinion;
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
        this.mSelectedChMsg = "L:";
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Six)) {
        this.mSlectedCh = this.mIllumHero;
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
        this.mSelectedChMsg = "H:";
    }
    return this.mSelectedChMsg;
};
