/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{   
    // Step A: Initialize the webGL Context
    gEngine.Core.InitializeWebGL(htmlCanvasID);
    
    // Step B: Create the shaders: white and then the red shader
    this._mWhiteShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // Step C: Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader);
    this._mRedSq = new RenderableObject(this._mRedShader);
    
    // Step D: Draw!
    gEngine.Core.ClearCanvas();        // 1. Clear the canvas
    
    // Step D1: Draw renderable objects with the white shader
    this._mWhiteSq.Draw();
    
    // Step D2: Draw renderable objects with the red shader
    this._mRedSq.Draw();
    
};