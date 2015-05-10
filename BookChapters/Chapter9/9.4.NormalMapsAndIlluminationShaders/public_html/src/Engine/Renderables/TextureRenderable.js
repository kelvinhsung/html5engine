/*
 * File: TextureRenderable.js
 *  
 * Renderable objects with textures
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Renderable: false */
/* find out more about jslint: http://www.jslint.com/lint.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function TextureRenderable(myTexture) {
    Renderable.call(this);
    Renderable.prototype.setColor.call(this, [1, 1, 1, 0]); // Alpha of 0: switch off tinting of texture
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getTextureShader());
    this.mTexture = myTexture;          // texture for this object, cannot be a "null"

    // these two instance variables are to cache texture informaiton
    // for supporting per-pixel accurate collision
    this.mTextureInfo = gEngine.Textures.getTextureInfo(myTexture);
    this.mColorArray = null;
    // defined for subclass to override
    this.mTexWidth = this.mTextureInfo.mWidth;
    this.mTexHeight = this.mTextureInfo.mHeight;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
}
gEngine.Core.inheritPrototype(TextureRenderable, Renderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
TextureRenderable.prototype.draw = function (aCamera) {
    // activate the texture
    gEngine.Textures.activateTexture(this.mTexture);
    Renderable.prototype.draw.call(this, aCamera);
};

TextureRenderable.prototype.getTexture = function () { return this.mTexture; };
TextureRenderable.prototype.setTexture = function (t) { this.mTexture = t; };
//--- end of Public Methods
//</editor-fold>