function Unit(name, jobClass, type, imageName, pos_x=0, pos_y=0) {
  // this.ctx = ctx;
  // this.urlImage = urlImage
  this.name = name;
  this.expLevel = 1;
  this.currentExp = 0;
  this.attackTimeAccrued = 0;
  this.isDead = false;

  // put this into an object
  this.type = type;
  this.jobName = jobClass.jobName;
  this.hitpoints = jobClass.hitpoints;
  this.element = jobClass.element;
  this.attack = jobClass.attack;
  this.defense = jobClass.defense;
  this.attackSpd = jobClass.attackSpd;
  this.walkSpeed =jobClass.walkSpeed;
  this.collided = true;

  // drawing-related variables
  this.scaleWidth = 64;
  this.scaleHeight = 64;
  this.pos_x = pos_x;
  this.pos_y = pos_y;

  // start the animation at a random frame for variety
  this.avatar = new Avatar(imageName, Math.floor(Math.random() * 3), 1, this.scaleWidth, this.scaleHeight);
}

// update animations and movement. returns true if still updating, false if dead and taken out (enemies)
Unit.prototype.update = function(ctx, timeDelta, standStill=false) {
    this.collided = standStill; // A bit of a hack for fail-case check in battleground::lossCheck

    // if this unit walks, scaled its speed by time past for smooth movement
    if (this.walkSpeed > 0 && standStill == false) {
      this.pos_y = this.pos_y + (this.walkSpeed / timeDelta);
    }

    this.avatar.renderAnim(ctx, this.pos_x, this.pos_y, timeDelta, standStill, this.type);
}

var tempEffectList = {
  hero: {
    name: 'OrangeSword',
    img: 'orange_sword.png',
    imgUrl: `/static/img/raid/orange_sword.png`,
    lifetime: 150,
    frameDuration: 30,
    numFrames: 5,
    looping: false,
    width: 192,
    height: 192
  },
  enemy: {
    name: 'BlueSword',
    img: 'blue_sword.png',
    imgUrl: `/static/img/raid/blue_sword.png`,
    lifetime: 150,
    frameDuration: 30,
    numFrames: 5,
    looping: false,
    width: 192,
    height: 192
  }
};

// determines the correct frame of animation and speed. Takes in an effect manager to apply an effect with
Unit.prototype.attackUnit = function(target, timeDelta, effectManager) {
  this.attackTimeAccrued += timeDelta;

  // 250 is like 0 atk speed (make a global?!)
  if (target.hitpoints > 0 && this.attackTimeAccrued > 1000 * (this.attackSpd / 100) + 250) {
    this.attackTimeAccrued = 0;

    console.log(`${this.name} attacking ${target.name}`)

    effectManager.applyEffect(tempEffectList[this.type], target, target.scaleWidth, target.scaleHeight)
    // deal some damage and return TRUE if the enemy target is killed
    return target.takeDamage(this.attack);
  }
  // the enemy wasn't killed
  return false;
}

Unit.prototype.takeDamage = function(enemyAttack) {
  var defMod = enemyAttack / this.defense
  var finalMod = (Math.abs(defMod) < 1)? defMod : 1;

  this.hitpoints = this.hitpoints - (enemyAttack * finalMod);
  this.hitpoints = (this.hitpoints <= 0)? 0 : this.hitpoints;

  if (this.hitpoints <= 0) {
      // just once we should set them to dead, not in above line for spawning one-off death effects
      if (this.isDead === false) {
        this.isDead = true;
        this.avatar.dead(true);
        return true; // was killed!
      }
  }

  // they didn't die this round
  return false;
}

Unit.prototype.deadCheck = function() {
  return this.isDead;
}

// this is a check if enemies have passed the hero unit. ENEMY ONLY
Unit.prototype.pastHeroLine = function(heroUnit) {
  return this.pos_y >= heroUnit.pos_y;
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
  this.renderDead = false;

  this.image = imageManager.instance().getImageByName(imageName);
  this.deadImg = imageManager.instance().getImageByName("dead");
}

// let the game know this avatar is ready to display
Avatar.prototype.imageLoaded = function() {
  this.imgLoaded = true;
}

// getter/setter
Avatar.prototype.dead = function(isDead) {
  if (isDead) {
    this.renderDead = true;
  }
  return this.renderDead;
}

// determines the correct frame of animation and speed
Avatar.prototype.renderAnim = function(ctx, pos_x, pos_y,
    timeDelta=0, standStill=false, type='hero') {
  if (this.renderDead) {
    if (type === 'hero')
      ctx.drawImage(this.deadImg, 0, 0, 32, 32, pos_x, pos_y, this.drawWidth, this.drawHeight);
    return;
  }

  // Are we standing still? If not, keep flipping anim cells
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
