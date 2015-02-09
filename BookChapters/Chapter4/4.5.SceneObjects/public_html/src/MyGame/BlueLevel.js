/*
 * File: BlueLevel.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function BlueLevel()
{       
    // scene file name
    this._kSceneFile = "resources/BlueLevel.xml";
    // all square
    this._mSqSet = new Array();        // these are the renderable objects
    
    // The camera to view the rectangles
    this._mCamera = null;
};
gEngine.Core.InheritPrototype(BlueLevel, Scene);

BlueLevel.prototype.LoadAndBeginScene = function() 
{
    // load the scene file
    gEngine.TextFileLoader.LoadTextFile(this._kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile); 
    gEngine.GameLoop.Start(this);
};

BlueLevel.prototype.UnloadScene = function() 
{
    // unload the scene flie
    gEngine.TextFileLoader.UnloadTextFile(this._kSceneFile);
    
    var nextLevel = new MyGame();  // load the next level
    nextLevel.LoadAndBeginScene();
};

BlueLevel.prototype.Initialize = function() 
{
    var sceneParser = new SceneFileParser(this._kSceneFile);
    
    // Step A: Read in the camera
    this._mCamera = sceneParser.ParseCamera();
    
    // Step B: Read all the squares
    sceneParser.ParseSquares(this._mSqSet);
    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BlueLevel.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Step  B: Activate the drawing Camera
    this._mCamera.SetupViewProjection();
    
        // Step  C: Draw all the squares
        for (var i = 0; i<this._mSqSet.length; i++) {
            this._mSqSet[i].Draw(this._mCamera.GetVPMatrix());
        }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
BlueLevel.prototype.Update = function()
{
    // For this very simple game, let's move the first square
    var xform = this._mSqSet[1].GetXform();
    var deltaX = 0.05;
    
    /// MOve right and swap ovre
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        xform.IncXPosBy(deltaX);
        if (xform.GetXPos() > 30)  // this is the right-bound of the window
            xform.SetPosition(12, 60);
    }
    
    // Step A: test for white square movement
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) {
        xform.IncXPosBy(-deltaX);
        if (xform.GetXPos() < 11) { // this is the left-bundary
            gEngine.GameLoop.Stop();
        }
    }
};