/*
  the ultimate function of UnitManager will be to
    manage which types of enemies will spawn using
    a timing and difficulty formula
*/

function UnitManager() {
  this.enemyManager = new EnemyManager();
  this.heroManager = new HeroManager();
}

UnitManager.prototype.addEnemySpawners = function() {
  // HACK: pull info from database to create spawners for each stage
  var tempEnemyList = [{
                        name: 'Skeleton',
                        img: 'Skeleton_2.png',
                        walkSpd: 20
                      }];

  for (var i = 0; i < tempEnemyList.length; i++) {
    this.enemyManager.addSpawner(tempEnemyList[i]['name'],
                    tempEnemyList[i]['img'],
                    tempEnemyList[i]['walkSpd'] )
  }
}

UnitManager.prototype.addHeroSpawners = function() {
  // HACK: pull info from database to create spawners for each stage
  var tempHeroList = [{
                        name: 'Golden Knight',
                        img: 'Knight_4.png',
                      }];

  for (var i = 0; i < tempHeroList.length; i++) {
    this.heroManager.addSpawner(tempHeroList[i]['name'],
                    tempHeroList[i]['img'])
  }
}

/*  EnemyManager   */

function EnemyManager() {
  this.enemySpawners = []; // contains a spawner for each type of enemy. filled once per stage
}

EnemyManager.prototype.addSpawner = function(name, urlImage, walkSpd) {
  // create a new enemy spawner with appropriate settings
  var newEnemySpawner = {
    name: name,
    urlImage: urlImage,
    walkSpd: walkSpd
  }

  // add the new enemy spawner to the spawners in Unit Manager
  this.enemySpawners.push(newEnemySpawner)
}

// This function needs logic to determine what enemy spawns
EnemyManager.prototype.spawnEnemy = function(enemyType=0, pos_x, pos_y) {
  var enemy = new Unit(this.enemySpawners[enemyType].name,
                        this.enemySpawners[enemyType].urlImage,
                        this.enemySpawners[enemyType].walkSpd,
                        pos_x,
                        pos_y);
  return enemy;
}

/*  HeroManager   */

function HeroManager() {
  this.heroSpawners = []; // contains a spawner for each type of enemy. filled once per stage
}

HeroManager.prototype.addSpawner = function(name, urlImage) {
  // create a new enemy spawner with appropriate settings
  var newHeroSpawner = {
    name: name,
    urlImage: urlImage,
  }

  // add the new enemy spawner to the spawners in Unit Manager
  this.heroSpawners.push(newHeroSpawner)
}

// This function needs logic to determine what hero spawns
HeroManager.prototype.spawnHero = function(heroType=0, pos_x, pos_y) {
  var hero = new Unit(this.heroSpawners[heroType].name,
                        this.heroSpawners[heroType].urlImage,
                        0,  // walk speed
                        pos_x,
                        pos_y);
  hero.avatar.setAnim(2);  // make sure heroes have correct anim
  return hero;
}
