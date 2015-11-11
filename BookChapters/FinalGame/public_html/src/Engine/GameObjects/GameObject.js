/* File: GameObject.js 
 *
 * Abstracts a game object's behavior and apparance
 */

/*jslint node: true, vars: true */
/*global vec2, vec3, BoundingBox */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Default Constructor<p>
 * Abstracts a game object's behavior and apparance
 * @memberOf GameObject
 * @param {type} renderableObj
 * @returns {GameObject}
 */
function GameObject(renderableObj) {
    this.mRenderComponent = renderableObj;
    this.mVisible = true;
    this.mCurrentFrontDir = vec2.fromValues(0, 1);  // this is the current front direction of the object
    this.mSpeed = 0;
    this.mPhysicsComponent = null;
}

/**
 * 
 * @memberOf GameObject
 * @returns {GameObject.prototype@pro;mRenderComponent@call;getXform}
 */
GameObject.prototype.getXform = function () { return this.mRenderComponent.getXform(); };

/**
 * 
 * @memberOf GameObject
 * @returns {BoundingBox}
 */
GameObject.prototype.getBBox = function () {
    var xform = this.getXform();
    var b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    return b;
};

/**
 * 
 * @memberOf GameObject
 * @param {type} f
 * @returns {undefined}
 */
GameObject.prototype.setVisibility = function (f) { this.mVisible = f; };

/**
 * 
 * @memberOf GameObject
 * @returns {type|Boolean}
 */
GameObject.prototype.isVisible = function () { return this.mVisible; };

/**
 * 
 * @memberOf GameObject
 * @param {type} s
 * @returns {undefined}
 */
GameObject.prototype.setSpeed = function (s) { this.mSpeed = s; };

/**
 * 
 * @memberOf GameObject
 * @returns {Number|type}
 */
GameObject.prototype.getSpeed = function () { return this.mSpeed; };

/**
 * 
 * @memberOf GameObject
 * @param {type} delta
 * @returns {undefined}
 */
GameObject.prototype.incSpeedBy = function (delta) { this.mSpeed += delta; };

/**
 * 
 * @memberOf GameObject
 * @param {type} f
 * @returns {undefined}
 */
GameObject.prototype.setCurrentFrontDir = function (f) { vec2.normalize(this.mCurrentFrontDir, f); };

/**
 * 
 * @memberOf GameObject
 * @returns {unresolved}
 */
GameObject.prototype.getCurrentFrontDir = function () { return this.mCurrentFrontDir; };

/**
 * 
 * @memberOf GameObject
 * @returns {type}
 */
GameObject.prototype.getRenderable = function () { return this.mRenderComponent; };

/**
 * 
 * @memberOf GameObject
 * @param {type} p
 * @returns {undefined}
 */
GameObject.prototype.setPhysicsComponent = function (p) { this.mPhysicsComponent = p; };

/**
 * 
 * @memberOf GameObject
 * @returns {type}
 */
GameObject.prototype.getPhysicsComponent = function () { return this.mPhysicsComponent; };

/**
 * Orientate the entire object to point towards point p<p>
 * will rotate Xform() accordingly
 * @memberOf GameObject
 * @param {type} p
 * @param {type} rate
 * @returns {undefined}
 */
GameObject.prototype.rotateObjPointTo = function (p, rate) {
    // Step A: determine if reach the destination position p
    var dir = [];
    vec2.sub(dir, p, this.getXform().getPosition());
    var len = vec2.length(dir);
    if (len < Number.MIN_VALUE) {
        return; // we are there.
    }
    vec2.scale(dir, dir, 1 / len);

    // Step B: compute the angle to rotate
    var fdir = this.getCurrentFrontDir();
    var cosTheta = vec2.dot(dir, fdir);

    if (cosTheta > 0.999999) { // almost exactly the same direction
        return;
    }

    // Step C: clamp the cosTheda to -1 to 1 
    // in a perfect world, this would never happen! BUT ...
    if (cosTheta > 1) {
        cosTheta = 1;
    } else {
        if (cosTheta < -1) {
            cosTheta = -1;
        }
    }

    // Step D: compute whether to rotate clockwise, or counterclockwise
    var dir3d = vec3.fromValues(dir[0], dir[1], 0);
    var f3d = vec3.fromValues(fdir[0], fdir[1], 0);
    var r3d = [];
    vec3.cross(r3d, f3d, dir3d);

    var rad = Math.acos(cosTheta);  // radian to roate
    if (r3d[2] < 0) {
        rad = -rad;
    }

    // Step E: rotate the facing direction with the angle and rate
    rad *= rate;  // actual angle need to rotate from Obj's front
    vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), rad);
    this.getXform().incRotationByRad(rad);
};

/**
 * 
 * @memberOf GameObject
 * @returns {undefined}
 */
GameObject.prototype.update = function () {
    // simple default behavior
    var pos = this.getXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());

    if (this.mPhysicsComponent !== null) {
        this.mPhysicsComponent.update();
    }
};

/**
 * 
 * @memberOf GameObject
 * @param {type} aCamera
 * @returns {undefined}
 */
GameObject.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        this.mRenderComponent.draw(aCamera);
    }
    if (this.mPhysicsComponent !== null) {
        this.mPhysicsComponent.draw(aCamera);
    }
};