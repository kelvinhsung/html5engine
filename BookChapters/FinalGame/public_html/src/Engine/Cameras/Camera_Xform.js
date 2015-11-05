/* 
 * File: Camera_Xform.js
 * Defines the functions that supports camera to pixel space transforms (mainly for illumination support)
 */

/*jslint node: true, vars: true, bitwise: true */
/*global Camera, vec3*/
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

/**
 * 
 * @param {Number} z
 * @returns {Number}
 */
Camera.prototype.fakeZInPixelSpace = function (z) {
    return z * this.mRenderCache.mWCToPixelRatio;
};

/**
 * 
 * @param {vec3} p vec3 position, fake Z
 * @returns {vec3}
 */
Camera.prototype.wcPosToPixel = function (p) {
    // Convert the position to pixel space
    var x = this.mViewport[Camera.eViewport.eOrgX] + ((p[0] - this.mRenderCache.mCameraOrgX) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    var y = this.mViewport[Camera.eViewport.eOrgY] + ((p[1] - this.mRenderCache.mCameraOrgY) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    var z = this.fakeZInPixelSpace(p[2]);
    return vec3.fromValues(x, y, z);
};

/**
 * 
 * @param {vec3} d vec3 direction in WC
 * @returns {vec3}
 */
Camera.prototype.wcDirToPixel = function (d) {
    // Convert the position to pixel space
    var x = d[0] * this.mRenderCache.mWCToPixelRatio;
    var y = d[1] * this.mRenderCache.mWCToPixelRatio;
    var z = d[2];
    return vec3.fromValues(x, y, z);
};

/**
 * 
 * @param {Number} s
 * @returns {Number}
 */
Camera.prototype.wcSizeToPixel = function (s) {
    return (s * this.mRenderCache.mWCToPixelRatio) + 0.5;
};
