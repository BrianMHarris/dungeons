/*
  the ultimate function of UnitManager will be to
    manage which types of enemies will spawn using
    a timing and difficulty formula
*/

function UnitManager() {
  this.imageCache = {}; // object container k,v pair representing "name":"url" of image
  this.enemyManager = new EnemyManager(this.imageCache); // kind of dirty to pass imageCache but simplest method atm
  this.heroManager = new HeroManager(this.imageCache);
}

UnitManager.prototype.addEnemySpawners = function() {
  // HACK: pull info from database to create spawners for each stage. NEED TO CONSOLIDATE WITH JOB CLASS
  var tempEnemyList = [{
                        name: 'Skeleton',
                        img: 'Skeleton_2.png',
                        imgUrl: `/static/img/raid/Skeleton_2.png`,
                      }];

  for (var i = 0; i < tempEnemyList.length; i++) {
    this.enemyManager.addSpawner(tempEnemyList[i]['name'],
                    tempEnemyList[i]['img'],
                    tempEnemyList[i]['imgUrl'])
  }
}

UnitManager.prototype.addHeroSpawners = function() {
  // HACK: pull info from database to create spawners for each stage
  var tempHeroList = [{
                        name: 'Golden Knight',
                        img: 'Knight_4.png',
                        imgUrl: `/static/img/raid/Knight_4.png`
                      }];

  for (var i = 0; i < tempHeroList.length; i++) {
    this.heroManager.addSpawner(tempHeroList[i]['name'],
                    tempHeroList[i]['img'],
                    tempHeroList[i]['imgUrl'])
  }
}

/*  EnemyManager   */

function EnemyManager(imageCache) {
  this.enemySpawners = []; // contains a spawner for each type of enemy. filled once per stage
  this.imageCache = imageCache;
}

EnemyManager.prototype.addSpawner = function(name, img, imgUrl) {
  // create a new enemy spawner with appropriate settings
  var newEnemySpawner = {
    name: name,
    img: img,
    imgUrl: imgUrl,
  }

  // Load the appropriate image for later retrival
  var imgMan = imageManager.instance();
  imgMan.loadImage(img, imgUrl);

  // add the new enemy spawner to the spawners in Unit Manager
  this.enemySpawners.push(newEnemySpawner)
}

var tempEnemyJob1 = {
  "jobName": "Skel-Soldier",
  "hitpoints": 40,
  "element": "earth",
  "attack": 20,
  "defense": 15,
  "attackSpd": 30,
  "walkSpeed": 50
}

// This function needs logic to determine what enemy spawns
EnemyManager.prototype.spawnEnemy = function(enemyType=0, pos_x, pos_y) {
  var img = this.enemySpawners[enemyType].img;
  var imgUrl = this.enemySpawners[enemyType].imgUrl

  if (!(img in this.imageCache)) {
    this.imageCache[img] = new Image();
    this.imageCache[img].src = imgUrl;
  }

  var enemy = new Unit(this.enemySpawners[enemyType].name,
                        tempEnemyJob1,
                        this.enemySpawners[enemyType].img,
                        pos_x,
                        pos_y);
  // debugger;
  return enemy;
}

/*  HeroManager   */

function HeroManager(imageCache) {
  this.heroSpawners = []; // contains a spawner for each type of enemy. filled once per stage
  this.imageCache = imageCache;
}

HeroManager.prototype.addSpawner = function(name, img, imgUrl) {
  // create a new hero spawner with appropriate settings  NEED TO CONSOLIDATE WITH JOB CLASS
  var newHeroSpawner = {
    name: name,
    img: img,
    imgUrl: imgUrl,
  }

  // Load the appropriate image for later retrival
  var imgMan = imageManager.instance();
  imgMan.loadImage(img, imgUrl);

  // add the new enemy spawner to the spawners in Unit Manager
  this.heroSpawners.push(newHeroSpawner)
}

var tempHeroJob1 = {
  "jobName": "Soldier",
  "hitpoints": 100,
  "element": "fire",
  "attack": 55,
  "defense": 45,
  "attackSpd": 50,
  "walkSpeed": 0
}

// This function needs logic to determine what hero spawns
HeroManager.prototype.spawnHero = function(heroType=0, pos_x, pos_y) {
  var hero = new Unit(this.heroSpawners[heroType].name,
                        tempHeroJob1,
                        this.heroSpawners[heroType].img,
                        pos_x,
                        pos_y);
  hero.avatar.setAnim(2);  // make sure heroes have correct anim
  //debugger;
  return hero;
}
