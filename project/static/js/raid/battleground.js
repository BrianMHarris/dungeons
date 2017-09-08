function Battleground(ctx, width, height, numLanes, laneWidth) {
  this.ctx = ctx;
  this.backgroundPattern = null;
  this.backgroundReady = false;
  this.imgMan = imageManager.instance();
  this.numLanes = numLanes;
  this.battleLanes = [];  // container for multiple lanes, which will handle spawning enemies
  this.swapButtons = [];
  this.unitManager = new UnitManager();
  this.unitManager.addEnemySpawners();
  this.unitManager.addHeroSpawners();
  this.timeStamp = 0;
  this.timeDelta = 0;
  this.globals = globalSettings.instance();
  this.goldEarned = 0;  // gold per stage, not global gold

  // enemy-spawn-related variables
  this.enemyStart = -72;
  this.enemySpawnLow = 1000; // the low time between next enemy spawn
  this.enemySpawnHigh = 2000; // the high time between next enemy spawn
  this.enemySpawnNext = 0;
  this.timeSinceEnemySpawn = 0;
  this.lastLaneSpawned = 0;
  this.enemiesOutOfBounds = 0;
  this.enemyOOBoundsLimit = 10;

  this.fullWidth = width;
  this.laneHeight = height;
  this.laneMargin = (width - (numLanes * laneWidth)) / (numLanes + 1);

  // create all lanes with the appropriate x and width so they are spread evenly
  for (var i = 0; i < numLanes; i++) {
    this.battleLanes.push(new BattleLane(this.laneMargin + (i * this.laneMargin) + (i*laneWidth),
                      laneWidth, height));
  }

  this.imgMan.loadImage("swap", '/static/img/raid/swap.png');
  // create all of the swap buttons
  for (var j = 0; j < this.battleLanes.length - 1; j++) {
    this.swapButtons.push(new SwapButton(
        this.imgMan.getImageByName("swap"),
        this.battleLanes[j].x + laneWidth,
        this.laneHeight - 66,
        this.laneMargin,
        64
      ));
  }
}

Battleground.prototype.updateTimeStamp = function(timeStamp) {
  this.timeDelta = timeStamp - this.timeStamp;
  this.timeStamp = timeStamp;
  this.timeSinceEnemySpawn += this.timeDelta;
}

Battleground.prototype.setBackground = function(battlegroundName) {
  this.backgroundPattern = this.ctx.createPattern(this.imgMan.getImageByName(battlegroundName), 'repeat'); // Create a pattern with this image, and set it to "repeat".
  this.backgroundReady = true;
}

Battleground.prototype.drawBackground = function() {
  this.ctx.fillStyle=this.backgroundPattern;
  this.ctx.fillRect(0,0,this.fullWidth,this.laneHeight);
}

Battleground.prototype.getBattleLanes = function() {
  return this.battleLanes;
}

Battleground.prototype.getGoldEarned = function() {
  return this.goldEarned;
}

Battleground.prototype.getLivesRemaining = function() {
  return this.enemyOOBoundsLimit - this.enemiesOutOfBounds;
}

Battleground.prototype.displaySwapButtons = function() {
  for (var i = 0; i < this.swapButtons.length; i++) {
    this.swapButtons[i].display(this.ctx);
  }
}

Battleground.prototype.initEnemySpawning = function(low=1000, high=1000) {
  this.enemySpawnLow = low;
  this.enemySpawnHigh = high;
  this.enemySpawnNext = Math.floor(Math.random() * this.enemySpawnHigh) + this.enemySpawnLow;
}

Battleground.prototype.spawnEnemyToLane = function(laneNum) {
  var enemy = this.unitManager.enemyManager.spawnEnemy(0,
                                            this.battleLanes[laneNum].x,
                                            this.enemyStart);
  this.battleLanes[laneNum].enemies.push(enemy);
  return laneNum;
}

// spawn new enemies if necessary and update existing
Battleground.prototype.updateEnemies = function() {
  // if there is a scheduled spawn time for an enemy
  //   and the time passed is greater than that time, spawn!
  if (this.enemySpawnNext &&
        this.timeSinceEnemySpawn > this.enemySpawnNext) {
    var newLane = Math.floor(Math.random() * this.numLanes);

    while (newLane === this.lastLaneSpawned)
      newLane = Math.floor(Math.random() * this.numLanes);

    this.lastLaneSpawned = this.spawnEnemyToLane(newLane);

    // Set up the next enemy spawn time
    this.timeSinceEnemySpawn = 0;
    this.enemySpawnNext = Math.floor(Math.random() * this.enemySpawnHigh) + this.enemySpawnLow;
  }

  var unitAhead = null;
  var isColliding = false;
  // loop through each enemy in each battle lane and update animations, etc
  for (var i = 0; i < this.battleLanes.length; i++) {
    // Get rid of any dead enemies.
    for (var k = 0; k < this.battleLanes[i].enemies.length; k++) {
      // if any are dead just take them out and continue.
      if (this.battleLanes[i].enemies[k].deadCheck()) {
        this.battleLanes[i].enemies.splice(k, 1);
        continue;
      }
    }

     // TEST FOR OUT OF BOUNDS
    if (this.battleLanes[i].enemies.length >= 1 && this.battleLanes[i].enemies[0].boundsCheck(this.laneHeight)) {
      this.battleLanes[i].enemies.shift(); // Bye Bye enemy
      this.enemiesOutOfBounds++;
    }

    // reset whether it's colliding and keep checking
    isColliding = false;
    for (var j = 0; j < this.battleLanes[i].enemies.length; j++) {
      // TEST AGAINST OTHER UNITS
      // Either the unit ahead of us is an enemy or a hero.
      unitAhead = (j == 0)? this.battleLanes[i].hero : this.battleLanes[i].enemies[j-1];

      // are we touching a hero?
      isColliding = this.collisionCheck(this.battleLanes[i].enemies[j], unitAhead, this.timeDelta);

      // Check if the unit ahead of you is the hero in your lane
      if (isColliding && unitAhead === this.battleLanes[i].hero) {
        // Attack if you can!
        this.battleLanes[i].enemies[j].attackUnit(unitAhead, this.timeDelta);
      }
      // this.collisionCheck(this.battleLanes[i].enemies[j], this.battleLanes[i].enemies[j] - 1)
      this.battleLanes[i].enemies[j].update(this.ctx, this.timeDelta, isColliding);
    }
  }
}

Battleground.prototype.collisionCheck = function(testEnemy, unitAhead, timeDelta) {
  if (unitAhead && !unitAhead.deadCheck() && testEnemy.pos_y + testEnemy.scaleHeight + (testEnemy.walkSpeed / timeDelta) >= unitAhead.pos_y) {
    // NEED: getter, setter functions for this
    testEnemy.pos_y = unitAhead.pos_y - testEnemy.scaleHeight;
    return true;
  } else {
    return false;
  }
}

// Check if the user has lost via enemy stacking or all heroes dead or too many enemies out of bounds
Battleground.prototype.lossCheck = function() {
  var maxEnemies = Math.floor(this.laneHeight / 64);
  var deadHeroes = 0;
  if (this.enemiesOutOfBounds > this.enemyOOBoundsLimit)
    return true;
  for (var i = 0; i < this.battleLanes.length; i++) {

    if (this.battleLanes[i].enemies.length >= maxEnemies)
      // Check if the last enemy is standing still, which means they've made it to the line...
      if (this.battleLanes[i].enemies[maxEnemies - 1].collided)
        return true;

    if (this.battleLanes[i].hero.deadCheck())
      deadHeroes++;
  }

  if (deadHeroes === this.battleLanes.length)
    return true;

  return false;
}

Battleground.prototype.spawnHeroToLane = function(laneNum) {
  var hero = this.unitManager.heroManager.spawnHero(0,
                                          this.battleLanes[laneNum].x,
                                          this.battleLanes[laneNum].height-66)
  this.battleLanes[laneNum].hero = hero;
}

Battleground.prototype.spawnAllHeroes = function(laneNum) {
  for (var i = 0; i < this.battleLanes.length; i++) {
    this.spawnHeroToLane(i);
  }
}

Battleground.prototype.enemyFightCheck = function(hero, enemy) {
  return (enemy && !enemy.deadCheck() && enemy.pos_y + enemy.scaleHeight >= hero.pos_y - 1);
}

// update all heroes (animations, etc)
Battleground.prototype.updateHeroes = function(ctx) {
  var isColliding = false;
  var unitAhead = false;

  for (var i = 0; i < this.battleLanes.length; i++) {
    if (this.battleLanes[i].hero) {
      isColliding = false;

      // TEST AGAINST LEAD ENEMY (Enemies that wakled past you already are considered out of bounds already)

      // need to find the enemy to fight if there is one
      if (this.battleLanes[i].enemies.length > 0 && this.battleLanes[i].hero.deadCheck() === false) {
        unitAhead = this.battleLanes[i].enemies[0];

        isColliding = this.enemyFightCheck(this.battleLanes[i].hero, unitAhead);

        // if the front enemy has already passed us, attack second if possible
        if (isColliding && this.battleLanes[i].enemies[0].pastHeroLine(this.battleLanes[i].hero)){
          isColliding = false;

          if (this.battleLanes[i].enemies.length > 1) {
            unitAhead = this.battleLanes[i].enemies[1];
            isColliding = this.enemyFightCheck(this.battleLanes[i].hero, unitAhead);
          }
        }
        // now we attack!
        if (isColliding && unitAhead) {
          // attack, and if true comes back, enemy has died.
          if (this.battleLanes[i].hero.attackUnit(unitAhead, this.timeDelta)) {
            this.goldEarned += unitAhead.expLevel;

            if (this.globals.getDebugMode())
              console.log("GOLD IS NOW: " +  this.goldEarned);
          }

        }
      }
      this.battleLanes[i].hero.update(ctx, this.timeDelta)
    }
  }
}

// a simple BattleLane object
function BattleLane(x, width, height) {
  this.x = x;
  this.width = width;
  this.height = height;
  this.enemies = [];
  this.hero = null;
}

function SwapButton(image, x, y, width, height) {
  this.img = image;
  this.x = x;
  this.y = y;
  this.drawWidth = width;
  this.drawHeight = height;
}

SwapButton.prototype.display = function(ctx) {
  ctx.drawImage(this.img, this.x, this.y, this.drawWidth, this.drawHeight);
}
