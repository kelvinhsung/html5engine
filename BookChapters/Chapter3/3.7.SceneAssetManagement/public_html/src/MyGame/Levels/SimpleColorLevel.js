/*
 * File: SimpleColorLevel.js 
 * Draws two constant color squares with simple audio support
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SimpleColorLevel()
{
    // variables of the shaders for drawing: one red and one white
    // variables of the shaders for drawing: one red and one white
    this._mRedShader = null;
    this._mWhiteShader = null;
        
    // variables for the squares
    this._mWhiteSq = null;        // these are the renderable objects
    this._mRedSq = null;    
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    this._kKeyClicked = "resources/sounds/game-sound.wav";
    
    // Initialize the game
    this.Initialize();
};
gEngine.Core.InheritPrototype(SimpleColorLevel, Scene);

SimpleColorLevel.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.4, 0.4, 0.4, 1]);
            // sets the background to dark gray
    
    // Step  B: create the shaders
    this._mWhiteShader = new SimpleShader( 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new SimpleShader( 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    
    // Step  C: Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader);
    this._mRedSq = new RenderableObject(this._mRedShader);
    
    // Step  D: Initialize the white renderable object: centred, 5x5, rotated
    this._mWhiteSq.GetXform().SetPosition(20, 60);
    this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mWhiteSq.GetXform().SetSize(5, 5);
    
    // Step  E: Initialize the red renderable object: centered 2x2
    this._mRedSq.GetXform().SetPosition(20, 60);
    this._mRedSq.GetXform().SetSize(2, 2);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
SimpleColorLevel.prototype.Draw = function() 
{       
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Step  B: Activate the drawing Camera
    this._mCamera.BeginDraw();
    
        // Step  C: Activate the white shader to draw
        this._mWhiteShader.ActivateShader(this._mCamera.GetVPMatrix());
            this._mWhiteSq.Draw();
        
        // Step  D: Activate the red shader to draw
        this._mRedShader.ActivateShader(this._mCamera.GetVPMatrix());
            this._mRedSq.Draw();
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function! 
SimpleColorLevel.prototype.Update = function()
{
    // For this very simple game, let's move the white square and pulse the red
    
    var whiteXform = this._mWhiteSq.GetXform();
    var deltaX = 0.05;
    
    // Step A: test for white square movement
    if (gEngine.Input.IsKeyDown(gEngine.Input.RIGHT)) {
        if (whiteXform.GetXPos() > 30)  // this is the right-bound of the window
            whiteXform.SetPosition(10, 60);
        whiteXform.IncXPosBy(deltaX);
        gEngine.AudioClips.PlaySound(this._kKeyClicked);
    }
    
    // Step  B: test for white square rotation
    if (gEngine.Input.IsKeyDown(gEngine.Input.UP)) {
        whiteXform.IncRotationByDegree(1);
        gEngine.AudioClips.PlaySound(this._kKeyClicked);
    }
    
    
    var redXform = this._mRedSq.GetXform();
    
    // Step  C: test for pulsing the red square
    if (gEngine.Input.IsKeyDown(gEngine.Input.DOWN)) {
        if (redXform.GetWidth() > 5)
            redXform.SetSize(2, 2);
        redXform.IncSizeBy(0.05);
        gEngine.AudioClips.PlaySound(this._kKeyClicked);
    }
    
    if (gEngine.Input.IsKeyDown(gEngine.Input.Three)) {
        this.UnloadScene( new TextureLevel() );
    }
};

SimpleColorLevel.prototype.LoadContent = function() {
    gEngine.AudioClips.LoadAudio(this._kKeyClicked);
};

SimpleColorLevel.prototype.UnloadContent = function() {
    // What we load, we should/must unload
    gEngine.AudioClips.UnloadAudio(this._kKeyClicked);
};