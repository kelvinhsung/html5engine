/* 
 * 
 */
function MainLevel()
{
    Scene.call(this);
    this.mMainShader = "Texture-Sprite-Rectangle";
    this.mCamera;
    this.mPlayer;
    this.mEnemyManager;
    this.mBackgroundManager;
    this.mTestString;
}
MainLevel.prototype = Object.create(Scene.prototype);

MainLevel.prototype.contentLoad = function()
{
    //Puts a shader into our game engine to use.
    EngineCore.Resources.addShader(this.mMainShader,
        "shaders/textured-vs.glsl",
        "shaders/textured-fs.glsl");
    
    // Preload Object Assets
    Player.prototype.preloadResources();
    EnemyManager.prototype.preloadResources();
    BackgroundGenerator.prototype.preloadResources();
    
    // Load sounds
    EngineCore.Resources.loadAudio("resources/game-sound.wav");
    EngineCore.Resources.loadAudio("resources/Mind_Meld.mp3");
    
    // Load Font
    EngineCore.Resources.loadFont("resources/fonts/dos-font.png",
                                  "resources/fonts/dos-font.fnt");
};

MainLevel.prototype.initialize = function()
{
    //Init the camera
    this.mCamera = new Camera([10,7.7], 20,
        0, 
        0,
        EngineCore.Resources.getCanvasWidth(),
        EngineCore.Resources.getCanvasHeight());
    
    // Setup a player transform.
    var transform = new Transform();

    transform.setPosition(10, 8);
    transform.setSize(2,2);
    transform.setZOrder(10);

    this.mPlayer = new Player(transform, this.mCamera, this.mMainShader);
    
    this.mEnemyManager = new EnemyManager(this.mPlayer, this.mMainShader);
    
    this.mBackgroundManager = new BackgroundGenerator(this.mPlayer, this.mMainShader);
    
    // Text
    var textTransform = new Transform();
    textTransform.setPosition(5,5);
    textTransform.setSize(1,1);
    textTransform.setZOrder(7);
    
    this.mTestString = new FontTexture(textTransform, this.mMainShader,
                                       "resources/fonts/dos-font.png",
                                       "resources/fonts/dos-font.fnt",
                                       "Testing Textures! 87465@#RT");
    
    // Setup background audio, can't take it any more.
    //EngineCore.Resources.playBackgroundAudio("resources/Mind_Meld.mp3");
};

MainLevel.prototype.update = function()
{
    if(EngineCore.Input.isKeyDown(EngineCore.Input.E))
    {
        EngineCore.Resources.playSound("resources/game-sound.wav");
    }
    
    if(EngineCore.Input.isKeyDown(EngineCore.Input.W))
    {
        EngineCore.Resources.playBackgroundAudio("resources/Mind_Meld.mp3");
    }
    
    if(EngineCore.Input.isKeyDown(EngineCore.Input.S))
    {
        EngineCore.Resources.stopBackgroundAudio();
    }
    
    if(EngineCore.Input.isKeyDown(EngineCore.Input.LEFT))
    {
        this.mTestString.mTransformMatrix.getScale()[0] -= .1;
    }
    if(EngineCore.Input.isKeyDown(EngineCore.Input.RIGHT))
    {
        this.mTestString.mTransformMatrix.getScale()[0] += .1;
    }
    if(EngineCore.Input.isKeyDown(EngineCore.Input.UP))
    {
        this.mTestString.mTransformMatrix.getScale()[1] += .1;
    }
    if(EngineCore.Input.isKeyDown(EngineCore.Input.DOWN))
    {
        this.mTestString.mTransformMatrix.getScale()[1] -= .1;
    }
    
    // Update Scene
    this.mPlayer.update();
    this.mEnemyManager.update();
    this.mBackgroundManager.update();
};

MainLevel.prototype.draw = function()
{
    EngineCore.Resources.clearCanvas();
    this.mEnemyManager.addToDrawSet();
    this.mBackgroundManager.addToDrawSet();
    this.mPlayer.addToDrawSet();
    this.mTestString.addToDrawSet();
    this.mCamera.draw();
};