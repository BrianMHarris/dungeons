// NOTE: Z-Depth is going to be necessary to ensure these effects are displayed on the proper layers. Must be added to imageManager, likely.

// The effect node object for the linked list of effects
function EffectNode(effectObj, entity=null, drawWidth=32, drawHeight=32, coords=null) {
  this.effectObj = effectObj; // the object defining the effect node's properties.
  this.img = imageManager.instance().loadImage(effectObj.img, effectObj.imgUrl);
  // debugger;
  this.entity = entity; // if the position is dynamic -> follow an entity
  this.drawWidth = drawWidth; // the width the effect should be drawn to
  this.drawHeight = drawHeight;  // the height the effect should be drawn to
  this.coords = coords; // if the position is static
  this.currentFrame = 0;
  this.timeRemaining = effectObj.lifetime;
  this.timeStamp = new Date().getTime();  // the time the effect was born.
  this.timeAccrued = 0;
  this.next = null;
}

// A manager class for all effects in the game. Each layer should have one of these.
function EffectManager() {
  this.firstNode = null;  // first node in the list
  this.lastNode = null; // final node in the list
  this.length = 0;
}

EffectManager.prototype.applyEffect = function(effectObj, entity=null, drawWidth=32, drawHeight=32, coords=null) {
  effect = new EffectNode(effectObj, entity, drawWidth, drawHeight, coords);
  // if there are no other effects live, put this one at the front of the list
  if (!this.firstNode) {
    this.firstNode = effect;
  } else {
    this.lastNode.next = effect;
  }

  this.lastNode = effect;
  this.length++;
  return effect;
}

EffectManager.prototype.updateEffects = function(ctx, timeDelta) {
  var currentNode = this.firstNode;
  var prevNode = null;

  var drawLeft = 0;
  var pos_x = 0;
  var pos_y = 0;

  // Loop through all of the effects and determine if they are still alive and animate if necessary.
  while (currentNode) {
    currentNode.timeAccrued += timeDelta;
    currentNode.timeRemaining -= timeDelta;

    // check to see if the effect has expired and remove it from the list, if so.
    if (currentNode.timeRemaining <= 0) {
      // if there was a previous node, make sure to connect the links
      if (prevNode)
        prevNode.next = currentNode.next;

      if (currentNode === this.firstNode)
        this.firstNode = currentNode.next;

      if (currentNode === this.lastNode)
        this.lastNode = prevNode;

      // update the current node and continue
      currentNode = currentNode.next;
      this.length--;
      continue;
    }

    // determine the current animation frame based on the time passed and how many frames should have gone by in this iteration
    //   SHOULD account for looping, using the %
    if (currentNode.timeAccrued >= currentNode.effectObj.frameDuration) {
      currentNode.timeAccrued = 0;
      if (currentNode.currentFrame >= currentNode.effectObj.numFrames - 1) {
        if (currentNode.effectObj.looping)
          currentNode.currentFrame = 0;
      } else {
        currentNode.currentFrame++;
      }
    }

    // do the update stuff for current now
    drawLeft = currentNode.currentFrame * currentNode.effectObj.width;
    pos_x = currentNode.entity? currentNode.entity.pos_x : currentNode.coords[x];
    pos_y = currentNode.entity? currentNode.entity.pos_y : currentNode.coords[y];

    // DRAW POSITION IS ALWAYS 0 DUDE! update to either entity or coords!
    ctx.drawImage(currentNode.img, drawLeft, 0, currentNode.effectObj.width, currentNode.effectObj.height,
      pos_x, pos_y, currentNode.drawWidth, currentNode.drawHeight);
    prevNode = currentNode;
    currentNode = currentNode.next;
  }
}


