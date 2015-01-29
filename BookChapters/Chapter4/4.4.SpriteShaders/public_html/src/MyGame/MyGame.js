/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // variables of the shaders for drawing: 
    this._mConstColorShader = null;
    this._mTextureShader = null;
    
    // variable for renderable objects
    this._mTexSq = null;        // these are the renderable objects
    this._mSpriteFontSq = null;
    this._mSpriteBoySq = null;
    this._mRedSq = null;
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // textures to be loaded
    this._kTextureWithAlpha = "resources/UWB-Alpha.png";
    this._kFontSprite = "resources/dos-font.png";
    this._kBoySprite = "resources/BoySprite.png";
    
    // Initialize the webGL Context
    gEngine.Core.InitializeEngineCore(htmlCanvasID);
    
    // Initialize the game
    this.Initialize();
};

MyGame.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.9, 0.9, 0.9, 1]);
            // sets the background to light gray
        
    // Step  B: create the shaders
    this._mTextureShader = new TextureShader(
            "src/GLSLShaders/TextureVS.glsl",      // Path to the VertexShader 
            "src/GLSLShaders/TextureFS.glsl");    // Path to the White FragmentShader
    
    this._mSpriteShader = new SpriteShader(
            "src/GLSLShaders/TextureVS.glsl",
            "src/GLSLShaders/TextureFS.glsl");
            
    this._mConstColorShader = new SimpleShader( 
            "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
            "src/GLSLShaders/SimpleFS.glsl");      // Path to the simple FragmentShader
    
    
    // Step  C: Create the renderable objects:
    this._mTexSq = new TextureRenderable(this._mTextureShader, this._kTextureWithAlpha);
    this._mSpriteFontSq = new SpriteRenderable(this._mSpriteShader, this._kFontSprite);
    this._mSpriteBoySq = new SpriteRenderable(this._mSpriteShader, this._kBoySprite);
    this._mRedSq = new Renderable(this._mConstColorShader);
    this._mRedSq.SetColor([1, 0, 0, 1]);
    
    // The transparent W 
    this._mTexSq.GetXform().SetPosition(26, 58);
    this._mTexSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mTexSq.GetXform().SetSize(5, 5);
    
    // Top left square with font sprite
    this._mSpriteFontSq.GetXform().SetPosition(14, 62);
    this._mSpriteFontSq.GetXform().SetSize(5, 5);
    
    // Top right square with boty sprite
    this._mSpriteBoySq.GetXform().SetPosition(26, 63);
    this._mSpriteBoySq.GetXform().SetSize(8, 4);
    
    // centre the red square
    this._mRedSq.GetXform().SetPosition(20, 60);
    this._mRedSq.GetXform().SetSize(2, 2);
    
    // load in images to draw with
    gEngine.Textures.LoadTexture(this._kTextureWithAlpha);
    gEngine.Textures.LoadTexture(this._kFontSprite);
    gEngine.Textures.LoadTexture(this._kBoySprite);
    
    // now start the game loop running
    gEngine.GameLoop.Start(this);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    gEngine.Core.ClearCanvas([0.3, 0.3, 0.3, 1.0]); // clear to dark gray
    
    // Draw with mCamera
    this._mCamera.BeginDraw();
        
    // Draw the two sprite objects
    this._mSpriteFontSq.Draw(this._mCamera.GetVPMatrix());
    this._mSpriteBoySq.Draw(this._mCamera.GetVPMatrix());
        
    // Draw the texturedSq and the redSq
    this._mTexSq.Draw(this._mCamera.GetVPMatrix());
    this._mRedSq.Draw(this._mCamera.GetVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function! 
MyGame.prototype.Update = function()
{
    // For this very simple game, let's move the textured square and pulse the red
    
    var texXform = this._mTexSq.GetXform();
    var deltaX = 0.05;
    
    // Move the textured square
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        if (texXform.GetXPos() > 30)  // this is the right-bound of the window
            texXform.SetPosition(10, texXform.GetYPos());
        texXform.IncXPosBy(deltaX);
    }
    
    // Rotate the textured square
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Up))
        texXform.IncRotationByDegree(1);
    
    
    var redXform = this._mRedSq.GetXform();
    
    // pulse the red square
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Down)) {
        if (redXform.GetWidth() > 5)
            redXform.SetSize(2, 2);
        redXform.IncSizeBy(0.05);
    }
    
    
    // animate the texture coordinate of both of the sprite objects
    
    // <editor-fold desc="Font: continuously shrink it ...">
    var delta = 0.001;
    var texArray = this._mSpriteFontSq.GetTexArray();
    if (texArray[this._mSpriteShader.eTextureCoordArray.eLeft] < 0.4) { // this is the x-value of right boundary
        this._mSpriteFontSq.SetTextureCoordinate(
                texArray[this._mSpriteShader.eTextureCoordArray.eLeft]+delta,
                texArray[this._mSpriteShader.eTextureCoordArray.eRight]-delta,
                texArray[this._mSpriteShader.eTextureCoordArray.eBottom]+delta,
                texArray[this._mSpriteShader.eTextureCoordArray.eTop]-delta);
    } else { // showing only a very small area!
        this._mSpriteFontSq.SetTextureCoordinate(0, 1, 0, 1);  // reset to cover the entire image
    }
    // </editor-fold>
    
    // <editor-fold desc="Boy: zoom into upper-left">
    texArray = this._mSpriteBoySq.GetTexArray();
    if (texArray[this._mSpriteShader.eTextureCoordArray.eRight] > 0.5) { // this is the x-value of right boundary
        this._mSpriteBoySq.SetTextureCoordinate(
                texArray[this._mSpriteShader.eTextureCoordArray.eLeft],
                texArray[this._mSpriteShader.eTextureCoordArray.eRight]-delta,
                texArray[this._mSpriteShader.eTextureCoordArray.eBottom]+delta,
                texArray[this._mSpriteShader.eTextureCoordArray.eTop]);
    } else { // showing only a very small area!
        this._mSpriteBoySq.SetTextureCoordinate(0, 1, 0, 1);  // reset to cover the entire image
    }
    // </editor-fold>
    
};