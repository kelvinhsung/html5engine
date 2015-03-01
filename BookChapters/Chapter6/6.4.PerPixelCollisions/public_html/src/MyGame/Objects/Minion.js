/* 
 *
 */
function Minion(spriteTexture, atY) {
    this._kDelta = 0.2;
    this._mMinion= new SpriteAnimateRenderable(spriteTexture);
    this._mMinion.SetColor([1, 1, 1, 0]);
    this._mMinion.GetXform().SetPosition(Math.random() * 100, atY);
    this._mMinion.GetXform().SetSize(12, 9.6);
    this._mMinion.SetSpriteSequence(512, 0,     // first element pixel position: top-right 512 is top of image, 0 is right of image
                                    204,164,    // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this._mMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this._mMinion.SetAnimationSpeed(15);
                                // show each element for _mAnimSpeed updates
                                
    GameObject.call(this, this._mMinion);
};
gEngine.Core.InheritPrototype(Minion, GameObject);

Minion.prototype.Update = function(){
    // remember to update this._mMinion's animation
    this._mMinion.UpdateAnimation();
    
    // move towards the left and wraps
    var xform = this.GetXform();
    xform.IncXPosBy(-this._kDelta);
    
    if (xform.GetXPos() < 0) {
        xform.SetXPos(100);
        xform.SetYPos(65 * Math.random());
    }
};