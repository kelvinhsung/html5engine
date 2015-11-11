/* 
 * File: CameraShake.js
 * Defines a damped simple harmonic motion to simulate camera shakie
 */

/*jslint node: true, vars: true, bitwise: true */
/*global gEngine, vec2, ShakePosition */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

/**
 * damped simple harmonic shake motion
 * @memberOf CameraShake
 * @param {CameraState} state CameraState to be shaked.
 * @param {Number} xDelta  how large a shake
 * @param {Number} yDelta  how large a shake
 * @param {Number} shakeFrequency how much movement
 * @param {Number} shakeDuration for how long in number of cycles
 * @returns {CameraShake} new instance of CameraShake
 */
function CameraShake(state, xDelta, yDelta, shakeFrequency, shakeDuration) {
    this.mOrgCenter = vec2.clone(state.getCenter());
    this.mShakeCenter = vec2.clone(this.mOrgCenter);
    this.mShake = new ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration);
}

/**
 * 
 * @memberOf CameraShake
 * @returns {void}
 */
CameraShake.prototype.updateShakeState = function () {
    var s = this.mShake.getShakeResults();
    vec2.add(this.mShakeCenter, this.mOrgCenter, s);
};

/**
 * Return the shake status
 * @memberOf CameraShake
 * @returns {Boolean} true if shake is done
 */
CameraShake.prototype.shakeDone = function () {
    return this.mShake.shakeDone();
};

/**
 * 
 * @memberOf CameraShake
 * @returns {unresolved}
 */
CameraShake.prototype.getCenter = function () { return this.mShakeCenter; };

/**
 * Set the CameraShakes center refrence
 * @memberOf CameraShake
 * @param {Float[]} c (x,y) center position
 * @returns {void}
 */
CameraShake.prototype.setRefCenter = function (c) {
    this.mOrgCenter[0] = c[0];
    this.mOrgCenter[1] = c[1];
};