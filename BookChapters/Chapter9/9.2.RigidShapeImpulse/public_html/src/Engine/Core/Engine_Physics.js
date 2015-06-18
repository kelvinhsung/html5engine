/*
 * File: EngineCore_Physics.js 
 * Physics engine supporting impulse responses and verlet integration. 
 */
/*jslint node: true, vars: true, white: true */
/*global vec2, CollisionInfo */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

gEngine.Physics = (function () {
    var mRelaxationCount = 15;
    var mPosCorrectionRate = 0.8;
    var mSystemGravity = -100;
    
    var mRelaxationLoopCount = 0;
    var mHasOneCollision = false;
    
    var mCollisionInfo = null;
    
    var initialize = function() {
        mCollisionInfo = new CollisionInfo(); // to avoid allocating this all the time
    } 
    
    var _positionalCorrection = function (s1, s2, collisionInfo) {
        var s1InvMass = s1.getInvMass();
        var s2InvMass = s2.getInvMass();
        var num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * mPosCorrectionRate;
        var correctionAmount = [0, 0];
        vec2.scale(correctionAmount, collisionInfo.getNormal(), num);

        var ca = [0, 0];
        vec2.scale(ca, correctionAmount, s1InvMass);
        var s1Pos = s1.getPosition();
        vec2.subtract(s1Pos, s1Pos, ca);

        vec2.scale(ca, correctionAmount, s2InvMass);
        var s2Pos = s2.getPosition();
        vec2.add(s2Pos, s2Pos, ca);
    };
    
    // n is the collision normal
    // v is the velocity
    // f is the friction 
    // m is the invMass
    var _applyFriction = function(n, v, f, m) {
        var tangent = vec2.fromValues(n[1], -n[0]);  // perpendicular to n
        f *= m;
        if (vec2.dot(v, tangent) < 0) {
            vec2.scale(tangent, tangent, -f);
        } else {
            vec2.scale(tangent, tangent, f);
        }
        vec2.sub(v, v, tangent);
    };
    var resolveCollision = function (s1, s2, collisionInfo) {
        mHasOneCollision = true;
        _positionalCorrection(s1, s2, collisionInfo);

        var relativeVelocity = [0, 0];
        var s1V = s1.getVelocity();
        var s2V = s2.getVelocity();
        
        // collision normal direction is _against_ s2
        var n = collisionInfo.getNormal();
        _applyFriction(n, s1V, s1.getFriction(), s1.getInvMass());
        _applyFriction(n, s2V, -s2.getFriction(), s2.getInvMass());
        
        
        s1V[0] *= (1-s1.getFriction());
        s2V[0] *= (1-s2.getFriction());
        
        vec2.sub(relativeVelocity, s2V, s1V);

        // Relative velocity in normal direction
        var rVelocityInNormal = vec2.dot(relativeVelocity, n);
        //if objects moving apart ignore
        if (rVelocityInNormal > 0) {
            return;
        }

        var newRestituion = Math.min(s1.getRestitution(), s2.getRestitution());
        // Calc impulse scalar
        var j = -(1 + newRestituion) * rVelocityInNormal;
        j = j / (s1.getInvMass() + s2.getInvMass());

        var impulse = [0, 0];
        vec2.scale(impulse, collisionInfo.getNormal(), j);

        var newImpulse = [0, 0];
        vec2.scale(newImpulse, impulse, s1.getInvMass());
        vec2.sub(s1V, s1V, newImpulse);

        vec2.scale(newImpulse, impulse, s2.getInvMass());
        vec2.add(s2V, s2V, newImpulse);
    };
    
    var beginRelaxation = function() { 
        mRelaxationLoopCount = mRelaxationCount; 
        mHasOneCollision = true;
    };
    var continueRelaxation = function() { 
        var oneCollision = mHasOneCollision;
        mHasOneCollision = false;
        mRelaxationLoopCount = mRelaxationLoopCount - 1;
        return ((mRelaxationLoopCount > 0) && oneCollision); 
    };
    var processObjObj = function(obj1, obj2) {
        var s1 = obj1.getRigidShape();
        var s2 = obj2.getRigidShape();
        if (s1 === s2)
            return;
        beginRelaxation();
        while (continueRelaxation()) {
            if (s1.collided(s2, mCollisionInfo)) {
                resolveCollision(s1, s2, mCollisionInfo);
            }
        }
    };
    var processObjSet = function(obj, set) {
        var s1 = obj.getRigidShape();
        var i, s2;
        beginRelaxation();
        while (continueRelaxation()) {
            for (i=0; i<set.size(); i++) {
                s2 = set.getObjectAt(i).getRigidShape();
                if ((s1 !== s2) && (s1.collided(s2, mCollisionInfo))) {
                    resolveCollision(s1, s2, mCollisionInfo);
                }
            }
        }
    };
    var processSetSet = function(set1, set2) {
        var i, j, s1, s2;
        beginRelaxation();
        while (continueRelaxation()) {
            for (i=0; i<set1.size(); i++) {
                s1 = set1.getObjectAt(i).getRigidShape();
                for (j=0; j<set2.size(); j++) {
                    s2 = set2.getObjectAt(j).getRigidShape();
                    if ((s1 !== s2) && (s1.collided(s2, mCollisionInfo))) {
                        resolveCollision(s1, s2, mCollisionInfo);
                    }
                }
            }
        }
    };
    var getSystemGravity = function() { return mSystemGravity; };
    var setSystemGravity = function(g) { mSystemGravity = g; };
    var getRelaxationCorrectionRate = function() { return mPosCorrectionRate; };
    var setRelaxationCorrectionRate = function(r) {
        if ((r <= 0) || (r>=1)) {
            r = 0.8;
        }
        mPosCorrectionRate = r;
    };
    var getRelaxationLoopCount = function() { return mRelaxationCount; };
    var setRelaxationLoopCount = function(c) { mRelaxationCount = c; };
    
    var mPublic = {
        initialize: initialize,
        resolveCollision: resolveCollision,
        beginRelaxation: beginRelaxation,
        continueRelaxation: continueRelaxation,
        getSystemGravity: getSystemGravity,
        setSystemGravity: setSystemGravity,
        getRelaxationCorrectionRate: getRelaxationCorrectionRate,
        setRelaxationCorrectionRate: setRelaxationCorrectionRate,
        getRelaxationLoopCount: getRelaxationLoopCount,
        setRelaxationLoopCount: setRelaxationLoopCount,
        processObjObj: processObjObj,
        processObjSet: processObjSet,
        processSetSet: processSetSet
    };

    return mPublic;
}());
