/*
 * File: MyGame_LightControl: support UI manipulation of light parameters
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!
MyGame.prototype._LightControl = function() {
    var delta = 0.2;
    var msg = "";
    this._AnimateLight();
    // player select which light to work 
    this._SelectLight();
    
    // manipulate the light
    var lgt = this._mGlobalLightSet.GetLightAt(this._mLgtIndex);
    var p = lgt.GetPosition();
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) {
        lgt.SetXPos(p[0] - delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        lgt.SetXPos(p[0] + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Up)) {
        lgt.SetYPos(p[1] + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Down)) {
        lgt.SetYPos(p[1] - delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Z)) {
        lgt.SetZPos(p[2] + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.X)) {
        lgt.SetZPos(p[2] - delta); 
    }
    
    // radius
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.C)) {
        lgt.SetInner(lgt.GetInner() + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.V)) {
        lgt.SetInner(lgt.GetInner() - delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.B)) {
        lgt.SetOuter(lgt.GetOuter() + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.N)) {
        lgt.SetOuter(lgt.GetOuter() - delta); 
    }
    
    // Intensity
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.K)) {
        lgt.SetIntensity(lgt.GetIntensity() + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.L)) {
        lgt.SetIntensity(lgt.GetIntensity() - delta); 
    }
    
    // on/off
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.H)) {
        lgt.SetLightTo(!lgt.LightIsOn());
    }
    msg = "On(" + lgt.LightIsOn() + ") " +
          this._PrintVec3("P", p) +
          "R(" + lgt.GetInner().toPrecision(3) + "/" + lgt.GetOuter().toPrecision(3) + ") " + 
          "I(" + lgt.GetIntensity().toPrecision(3) + ")";
    
    return msg;
};

MyGame.prototype._SelectLight = function() {
    // select which light to work with
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Zero)) 
        this._mLgtIndex = 0; 
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.One))
        this._mLgtIndex = 1;
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Two))
        this._mLgtIndex = 2;
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Three))
        this._mLgtIndex = 3;
};

MyGame.prototype._PrintVec3 = function(msg, p)
{
    return msg + "(" + p[0].toPrecision(2) + " " + p[1].toPrecision(2) + " " + p[2].toPrecision(2) + ") ";
};

MyGame.prototype._AnimateLight = function()
{
    var radius = 10;
    var delta = 0.01; // in radians
    
    // spin light #3 (the spot light)
    var nx = radius * Math.sin(this._mLgtRotateTheta);
    var ny = radius * Math.cos(this._mLgtRotateTheta);
    this._mLgtRotateTheta += delta;
    if (this._mLgtRotateTheta > (2*Math.PI))
        this._mLgtRotateTheta -= (2*Math.PI);
    
    var lgt = this._mGlobalLightSet.GetLightAt(3);
    var p = lgt.GetPosition();
    var pt = vec3.fromValues(p[0]+nx, p[1]+ny, -2);
    vec3.sub(pt, pt, p);
    lgt.SetDirection(pt);
    
    // scan light #1, the directional light
    lgt = this._mGlobalLightSet.GetLightAt(1);
    var d = lgt.GetDirection();
    var p = lgt.GetPosition();
    if (gEngine.Input.IsButtonPressed(gEngine.Input.MouseButton.Left)) {
        var x = this._mCamera.MouseWCX();
        var y = this._mCamera.MouseWCY();
        d[0] = 0.1* (x - p[0]);
        d[1] = 0.1* (y - p[1]);
    }
};