function Unit(name, imageName, walkSpeed=0, pos_x=0, pos_y=0) {
  // this.ctx = ctx;
  // this.urlImage = urlImage
  this.name = name;
  this.walkSpeed = walkSpeed;
  this.collided = true;
  this.width = 16;
  this.height = 16;
  this.unitWidth = 64;
  this.unitHeight = 64;
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  // start the animation at a random frame for variety
  this.avatar = new Avatar(imageName, Math.floor(Math.random() * 3), 1, this.unitWidth, this.unitHeight);
}

// update animations and movement
Unit.prototype.update = function(ctx, timeDelta, standStill=false) {
    this.collided = standStill; // A bit of a hack for fail-case check in battleground::lossCheck
    this.avatar.renderAnim(ctx, this.pos_x, this.pos_y, timeDelta, standStill);

    // if this unit walks, scaled its speed by time past for smooth movement
    if (this.walkSpeed > 0 && standStill == false) {
      this.pos_y = this.pos_y + (this.walkSpeed / timeDelta);
    }
}

Unit.prototype.boundsCheck = function(laneHeight) {
  if (this.pos_y > laneHeight + 2) // padding to give it a second to clear the board.
    return true;

  return false;
}

function Avatar(imageName, startFrame=0, startAnim=1, drawWidth, drawHeight) {
  this.currentFrame = startFrame;
  this.currentAnim = startAnim;
  this.timeAccrued = 0;
  this.timePerFrame = 333;  // ~30 fps
  this.drawWidth = drawWidth;
  this.drawHeight = drawHeight;

  this.image = imageManager.instance().getImageByName(imageName);
}

// let the game know this avatar is ready to display
Avatar.prototype.imageLoaded = function() {
  this.imgLoaded = true;
}

// determines the correct frame of animation and speed
Avatar.prototype.renderAnim = function(ctx, pos_x, pos_y,
    timeDelta=0, standStill=false) {
  if (standStill) {
    this.currentFrame == 0;
  } else {
    this.timeAccrued += timeDelta;
    if (this.timeAccrued >= this.timePerFrame) {

      this.timeAccrued = 0;

      if (this.currentFrame >= 2) {
        this.currentFrame = 1;
      } else {
        this.currentFrame++;
      }
    }
  }

  var drawLeft = this.currentFrame * 16;
  var drawTop = this.currentAnim * 16 + 1;

  ctx.drawImage(this.image, drawLeft, drawTop, 15, 16, pos_x, pos_y, this.drawWidth, this.drawHeight);
}

// change the animation ROW from the image
Avatar.prototype.setAnim = function(newAnim=1) {
  this.currentAnim = newAnim;
}
