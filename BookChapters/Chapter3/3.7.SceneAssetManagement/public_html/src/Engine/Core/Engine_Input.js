/*
 * File: EngineCore_Input.js 
 * Provides input support
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

gEngine.Input = function()
{
    // Scancode constants
    var kLEFT = 37;
    var kUP = 38;
    var kRIGHT = 39;
    var kDOWN = 40;
    var kSPACE = 32;
    var k0 = 48;
    var k1 = 49;
    var k2 = 50;
    var k3 = 51;
    var k4 = 52;
    var k5 = 53;
    var k6 = 54;
    var k7 = 55;
    var k8 = 56;
    var k9 = 57;
    var kW = 87;
    var kA = 65;
    var kS = 83;
    var kD = 68;
    var kE = 69;
    var kR = 82;
    var kF = 70;
    var kJ = 74;
    var kI = 73;
    var kL = 76;
    var kK = 75;
    
    var kLastKeyCode = 222;

    // The pressed keys.
    var _mIsKeyPressed = {};


    // Event service functions
    var _OnKeyDown = function (event) {
        _mIsKeyPressed[event.keyCode] = true;  };
    var _OnKeyUp = function (event)  {
        _mIsKeyPressed[event.keyCode] = false; };
    
    var Initialize = function ()
    {
        for (var i = 0; i<kLastKeyCode; i++)
            _mIsKeyPressed[i] = false;
        
        // register services 
        window.addEventListener('keyup', _OnKeyUp);
        window.addEventListener('keydown', _OnKeyDown);
    };
    
    // Function for GameEngine Prorammer to test if a key is pressed down
    var IsKeyDown = function (keyCode) {
        return _mIsKeyPressed[keyCode]; };

    var oPublic =
    {
        Initialize: Initialize,
        IsKeyDown: IsKeyDown,
        UP: kUP,
        DOWN: kDOWN,
        LEFT: kLEFT,
        RIGHT: kRIGHT,
        SPACE: kSPACE,
        W: kW,
        A: kA,
        S: kS,
        D: kD,
        E: kE,
        R: kR,
        F: kF,
        J: kJ,
        I: kI,
        L: kL,
        K: kK,
        Zero: k0,
        One: k1,
        Two: k2,
        Three: k3,
        Four: k4,
        Five: k5,
        Six: k6,
        Seven: k7,
        Eight: k8,
        Nine: k9
    };
    return oPublic;
}();