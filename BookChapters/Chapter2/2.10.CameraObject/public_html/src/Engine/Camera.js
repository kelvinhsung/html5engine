/* 
 * File: Camera.js
 * Encapsulates the user define Window and Viewport functionality
 */

// cameraPosition: is a vec2
// cameraWidth: is the width of the user defined Window
//      Height of the user defined Window is implicitly defined by the viewport aspect ratio
//      Please refer to the following
// viewportRect: an array of 4 elements
//      [0] [1]: (x,y) position of lower left corner on the canvas (in pixel)
//      [2]: width of viewport
//      [3]: height of viewport
//      
//  cameraHeight = cameraWidth * viewport[3]/viewport[2]
//
function Camera(cameraPosition, cameraWidth, viewportArray)
{
    // Camera and viewport position and size
    this._mCameraPosition = cameraPosition;
    this._mCameraWidth = cameraWidth;
    this._mViewport = viewportArray;
    this._mNearPlane = 0;
    this._mFarPlane = 1000;
    
    // transformation matrices
    this._mViewMatrix = mat4.create();
    this._mProjMatrix = mat4.create();
    this._mVPMatrix = mat4.create();
    
    // background color
    this._mBgColor = [0, 0, 0, 1];
    
    //<editor-fold desc="setter/getter of window and viewport">
    this.SetCameraPosition = function(xPos, yPos) { 
        this._mCameraPosition[0] = xPos; this._mCameraPosition[1] = yPos; };
    this.GetCameraPosition = function() { return this._mCameraPosition; };
    this.SetCameraWidth = function(width) { this._mCameraWidth = width; };
    
    this.SetViewport = function(viewportArray) { this._mViewport = viewportArray; };
    this.GetViewport = function() { return this._mViewport; };
    //</editor-fold>
    
    //<editor-fold desc="setter/getter of camera background color">
    this.SetBackgroundColor = function(newColor) { this._mBgColor = newColor; };
    this.GetBackgroundColor = function() { return this._mBgColor; };
    //</editor-fold>
};

// <editor-fold desc="Public Methods">

// Initializes the camera to begin drawing to this camera
Camera.prototype.BeginDraw = function() {
    var gl = gEngineCore.GetGL();
    //<editor-fold desc="Step 1: Set up and clear the Viewport">
    // Step 1a: Set up the viewport: area on canvas to be drawn
    gl.viewport(this._mViewport[0], // x position of bottom-left corner of the area to be drawn
                this._mViewport[1], // y position of bottom-left corner of the area to be drawn
                this._mViewport[2], // width of the area to be drawn
                this._mViewport[3]);  // height of the area to be drawn
    // Step 1b: set up the corresponding scissor area to limite clear area
    gl.scissor( this._mViewport[0], // x position of bottom-left corner of the area to be drawn
                this._mViewport[1], // y position of bottom-left corner of the area to be drawn
                this._mViewport[2], // width of the area to be drawn
                this._mViewport[3]);// height of the area to be drawn
    // Step 1c: set the color to be clear to black
    gl.clearColor(this._mBgColor[0], this._mBgColor[1], this._mBgColor[2], this._mBgColor[3]);  // set the color to be cleared
    // Step 1d: enable the scissor area, clear, and then disable the scissor area
    gl.enable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT); 
    gl.disable(gl.SCISSOR_TEST);
    //</editor-fold>
    
    //<editor-fold desc="Step 2: Set up the View and Projection matrices"> 
    // Step 2a: define the view matrix
    mat4.lookAt(this._mViewMatrix, 
        [this._mCameraPosition[0], this._mCameraPosition[1], 10],   // camera position
        [this._mCameraPosition[0], this._mCameraPosition[1], 0],    // look at position
        [0, 1, 0]);     // orientation vector
    
    // Step 2b: define the projection matrix
    var halfCameraWidth = 0.5 * this._mCameraWidth;
    var halfCameraHeight = halfCameraWidth * this._mViewport[3] / this._mViewport[2]; // viewportH/viewportW
    mat4.ortho(this._mProjMatrix,
        -halfCameraWidth,   // distant to left of frustum
         halfCameraWidth,   // distant to right of frustum
        -halfCameraHeight,  // distant to bottom of frustum
         halfCameraHeight,  // distant to top of frustum
         this._mNearPlane,   // distant to near plane of frustum
         this._mFarPlane  // distant to far plane of frustum
    );
    // Step 2c: concatnate view and project matrices
    mat4.multiply(this._mVPMatrix, this._mProjMatrix, this._mViewMatrix);
    //</editor-fold>
};

// returns the matrix the concatenates the View and Projection matrix
Camera.prototype.GetVPMatrix = function() {
      return this._mVPMatrix;
};

//</editor-fold>