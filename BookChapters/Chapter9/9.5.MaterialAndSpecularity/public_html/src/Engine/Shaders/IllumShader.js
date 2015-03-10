/* 
 * File: NaormalMapShader.js
 * Subclass from LightShader (to take advantage of light sources)
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor 
function IllumShader(vertexShaderPath, fragmentShaderPath)
{
    var gl = gEngine.Core.GetGL();
    
    // Call sper class constructor
    LightShader.call(this, vertexShaderPath, fragmentShaderPath);  // call super class constructor
    
    // this is the material property of the renderable
    this._mMaterial = null;
    this._mMaterialLoader = new ShaderMaterial(this._mCompiledShader);
    
    // Reference to the camera position
    this._mCameraPos = null;  // points to a vec3
    this._mCameraPosRef = gl.getUniformLocation(this._mCompiledShader, "uCameraPosition");
    
    // reference to the normal map sampler
    this._mNormalSamlerRef = gl.getUniformLocation(this._mCompiledShader, "uNormalSampler");
    
    // now define normal map texture coordinate buffer
    this._mNomalMapCoordBuffer = null; // this is the reference to gl buffer that contains the actual texture coordinate
    this._mNormalMapTexCoordAttribute = gl.getAttribLocation(this._mCompiledShader, "aNormalMapCoordinate");
  
    var initNormalMapTexCoord = [
      1.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      0,0, 0.0  
    ];
    
    this._mNomalMapCoordBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this._mNomalMapCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initNormalMapTexCoord), gl.DYNAMIC_DRAW);
            // DYNAMIC_DRAW: says buffer content may change!
};
gEngine.Core.InheritPrototype(IllumShader, LightShader);
//</editor-fold>

// <editor-fold desc="Public Methods">

// Overriding the Activation of the shader for rendering
IllumShader.prototype.ActivateShader = function(pixelColor, aCamera) {
    // fist call the super class's activate
    LightShader.prototype.ActivateShader.call(this, pixelColor, aCamera);    
    var gl = gEngine.Core.GetGL();
    gl.uniform1i(this._mNormalSamlerRef, 1); // binds to texture unit 1
    
    // binds the normal map texture coordinate to the attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this._mNomalMapCoordBuffer);
    gl.vertexAttribPointer(this._mNormalMapTexCoordAttribute, 
            2,
            gl.FLOAT, 
            false,    
            0,        
            0);
    gl.enableVertexAttribArray(this._mNormalMapTexCoordAttribute);
    this._mMaterialLoader.LoadToShader(this._mMaterial);
    gl.uniform3fv(this._mCameraPosRef, this._mCameraPos);
};

IllumShader.prototype.SetNormalMapTexCoordinate = function(texCoord)
{
    var gl = gEngine.Core.GetGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._mNomalMapCoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
};

IllumShader.prototype.CleanUp = function()
{
    var gl = gEngine.Core.GetGL();
    gl.deleteBuffer(this._mNomalMapCoordBuffer);
    
    // now call super class's clean up ...
    LightShader.prototype.CleanUp.call(this);
};

IllumShader.prototype.SetMaterialAndCameraPos = function(m, p) { 
    this._mMaterial = m; 
    this._mCameraPos = p;
};
//</editor-fold>