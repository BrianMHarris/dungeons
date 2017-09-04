function Battleground(ctx, width, height, numLanes, laneWidth) {
  this.ctx = ctx;
  this.numLanes = numLanes;
  this.battleLanes = [];  // container for multiple lanes, which will handle spawning enemies
  this.heroLanding = [];  // container for multiple heroes, at bottom of lanes
  this.unitManager = new UnitManager();
  this.unitManager.addEnemySpawners();
  this.unitManager.addHeroSpawners();
  this.timeStamp = 0;
  this.timeDelta = 0;

  // enemy-spawn-related variables
  this.enemyStart = -72;
  this.enemySpawnLow = 0;
  this.enemySpawnHigh = 0;
  this.enemySpawnNext = 0;
  this.timeSinceEnemySpawn = 0;
  this.lastLaneSpawned = 0;

  this.laneMargin = (width - (numLanes * laneWidth)) / (numLanes + 1);

  // create all lanes with the appropriate x and width so they are spread evenly
  for (var i = 0; i < numLanes; i++) {
    this.battleLanes.push(new BattleLane(this.laneMargin + (i * this.laneMargin) + (i*laneWidth),
                      laneWidth, height));
  }
}

Battleground.prototype.updateTimeStamp= function(timeStamp) {
  this.timeDelta = timeStamp - this.timeStamp;
  this.timeStamp = timeStamp;
  this.timeSinceEnemySpawn += this.timeDelta;
}

Battleground.prototype.getBattleLanes = function() {
  return this.battleLanes;
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
Battleground.prototype.updateEnemies = function(ctx) {
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

  var testUnit = null;
  // loop through each enemy in each battle lane and update animations, etc
  for (var i = 0; i < this.battleLanes.length; i++) {
    for (var j = 0; j < this.battleLanes[i].enemies.length; j++) {
      // Either the unit ahead of us is an enemy or a hero.
      // testUnit =


      //this.collisionCheck(this.battleLanes[i].enemies[j], this.battleLanes[i].enemies[j] - 1)
      this.battleLanes[i].enemies[j].update(ctx, this.timeDelta);
    }
  }
}

Battleground.prototype.collisionCheck = function(testEnemy, unitAhead) {
  if (unitAhead && testEnemy.y + testEnemy.unitHeight >= unitAhead.y) {
    // NEED: getter, setter functions for this
    testEnemy.y = unitAhead.y - testEnemy.unitHeight;
    testEnemy.standStill(true);
  }
}

Battleground.prototype.spawnHeroToLane = function(laneNum) {
  var hero = this.unitManager.heroManager.spawnHero(0,
                                          this.battleLanes[laneNum].x,
                                          this.battleLanes[laneNum].height - 72)
  this.battleLanes[laneNum].hero = hero;
}

Battleground.prototype.spawnAllHeroes = function(laneNum) {
  for (var i = 0; i < this.battleLanes.length; i++) {
    this.spawnHeroToLane(i);
  }
}

// update all heroes (animations, etc)
Battleground.prototype.updateHeroes = function(ctx) {
  for (var i = 0; i < this.battleLanes.length; i++) {
    if (this.battleLanes[i].hero)
      this.battleLanes[i].hero.update(ctx, this.timeDelta)
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
