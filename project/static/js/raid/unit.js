function Unit(name, urlImage, walkSpeed=0, pos_x=0, pos_y=0) {
  // this.ctx = ctx;
  // this.urlImage = urlImage
  this.name = name;
  this.walkSpeed = walkSpeed;
  this.standStill = false;
  this.width = 16;
  this.height = 16;
  this.unitWidth = 0;
  this.unitHeight = 0;
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  // start the animation at a random frame for variety
  this.avatar = new Avatar(urlImage, Math.floor(Math.random() * 3), 1);
}

// update animations and movement
Unit.prototype.update = function(ctx, timeDelta) {
  if (this.avatar.imgLoaded) {
    this.avatar.renderAnim(ctx, this.pos_x, this.pos_y, timeDelta);
    // if this unit walks, scaled its speed by time past for smooth movement
    if (this.walkSpeed > 0 && this.standStill == false) {
      this.pos_y = this.pos_y + (this.walkSpeed / timeDelta);
    }
  }
}

Unit.prototype.standStill = function(isStill) {
  this.standStill = isStill;
}

function Avatar(urlImage, startFrame=0, startAnim=1) {
  this.urlImage = urlImage;
  this.currentFrame = startFrame;
  this.currentAnim = startAnim;
  this.timeAccrued = 0;
  this.timePerFrame = 333;  // ~30 fps

  this.image = new Image();
  this.imgLoaded = false;
  this.image.src = urlImage;
  // let update function know when ready to animate
  this.image.onload = this.imageLoaded.bind(this)
}

// let the game know this avatar is ready to display
Avatar.prototype.imageLoaded = function() {
  this.imgLoaded = true;
}

// determines the correct frame of animation and speed
Avatar.prototype.renderAnim = function(ctx, pos_x, pos_y,
    timeDelta=0) {
  this.timeAccrued += timeDelta;
  if (this.timeAccrued >= this.timePerFrame) {

    this.timeAccrued = 0;

    if (this.currentFrame >= 2) {
      this.currentFrame = 1;
    } else {
      this.currentFrame++;
    }
  }

  var drawLeft = this.currentFrame * 16;
  var drawTop = this.currentAnim * 16 + 1;

  ctx.drawImage(this.image, drawLeft, drawTop, 15, 16, pos_x, pos_y, 64, 64);
}

// change the animation ROW from the image
Avatar.prototype.setAnim = function(newAnim=1) {
  this.currentAnim = newAnim;
}
