/* 
 * File: RigidShape.js
 * Defines a simple rigid shape
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, LineRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

RigidShape.eRigidType = Object.freeze({
    eRigidAbstract: 0,
    eRigidCircle: 1,
    eRigidRectangle: 2
});


function RigidShape(xform) {
    this.mXform = xform; // this is typically from gameObject
    this.kPadding = 1; // size of the position mark
    
    this.mPositionMark1 = new LineRenderable();
    this.mPositionMark2 = new LineRenderable();
    
    this.mDrawBounds = false;
    
    // physical properties
    this.mInvMass = 1;
    this.mRestitution = 0.8;
    this.mVelocity = vec2.fromValues(0, 0);
    this.mFriction = 0.01;
    this.mGravity = vec2.fromValues(0, gEngine.Physics.getSystemGravity());
}

RigidShape.prototype.rigidType = function () {
    return RigidShape.eRigidType.eRigidAbstract;
};

RigidShape.prototype.draw = function (aCamera) {
    if (!this.mDrawBounds) {
        return;
    }
    
    //calculation for the X at the center of the shape
    var x = this.mXform.getXPos();
    var y = this.mXform.getYPos();
    
    this.mPositionMark1.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
    this.mPositionMark1.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT
    this.mPositionMark2.setFirstVertex(x + this.kPadding, y + this.kPadding);  //TOP RIGHT
    this.mPositionMark2.setSecondVertex(x - this.kPadding, y - this.kPadding); //BOTTOM LEFT
    
    this.mPositionMark1.draw(aCamera);
    this.mPositionMark2.draw(aCamera);
    
};

RigidShape.prototype.getPosition = function() { 
    return this.mXform.getPosition(); 
};
RigidShape.prototype.setPosition = function(x, y ) { 
    this.mXform.setPosition(x, y); 
};
RigidShape.prototype.getXform = function () { return this.mXform; };
RigidShape.prototype.setXform = function (xform) { this.mXform = xform; };
RigidShape.prototype.setColor = function (color) {
    this.mPositionMark1.setColor(color);
    this.mPositionMark2.setColor(color);
};
RigidShape.prototype.getColor = function () { return this.mPositionMark1.getColor(); };
RigidShape.prototype.setDrawBounds = function(d) { this.mDrawBounds = d; };
RigidShape.prototype.getDrawBounds = function() { return this.mDrawBounds; };