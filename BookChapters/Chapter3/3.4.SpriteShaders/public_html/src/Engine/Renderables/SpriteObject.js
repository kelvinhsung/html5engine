/*
 * File: SpriteObject.js
 *  
 * Texture objects where texture cooridnate can change
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SpriteObject(shader, myTexture)
{
    TextureObject.call(this, shader, myTexture);
    this._mTexLeft = 0.0;   // bounds of texture coordinate (0 is left, 1 is right)
    this._mTexRight = 1.0;  // 
    this._mTexTop = 1.0;    //   1 is top and 0 is bottom of image
    this._mTexBottom = 0.0; // 
};
gEngine.Core.InheritPrototype(SpriteObject, TextureObject);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
SpriteObject.prototype.Draw = function() {
    // set the current texture coordinate
    // 
    // activate the texture
    this._mShader.SetTextureCoordinate(this.GetTexArray());
    TextureObject.prototype.Draw.call(this);
};

SpriteObject.prototype.SetTextureCoordinate = function(left, right, bottom, top)
{
    this._mTexLeft = left;
    this._mTexRight = right;
    this._mTexBottom = bottom;
    this._mTexTop = top;
};

SpriteObject.prototype.GetTexArray = function() {
    return [
      this._mTexRight,  this._mTexTop,          // x,y of top-right
      this._mTexLeft,   this._mTexTop,
      this._mTexRight,  this._mTexBottom,
      this._mTexLeft,   this._mTexBottom
    ];
};
//--- end of Public Methods
//
//</editor-fold>