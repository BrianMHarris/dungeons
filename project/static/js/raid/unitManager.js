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
  // HACK: pull info from database to create spawners for each stage. NEED TO CONSOLIDATE WITH JOB CLASS
  var tempEnemyList = [{
                        name: 'Skeleton',
                        img: 'Skeleton_2.png',
                        imgUrl: `/static/img/raid/Skeleton_2.png`,
                        type: 'enemy'
                      }];

  for (var i = 0; i < tempEnemyList.length; i++) {
    this.enemyManager.addSpawner(tempEnemyList[i]['name'],
                    tempEnemyList[i]['img'],
                    tempEnemyList[i]['imgUrl'],
                    tempEnemyList[i]['type'])
  }
}

UnitManager.prototype.addHeroSpawners = function() {
  // HACK: pull info from database to create spawners for each stage
  var tempHeroList = [{
                        name: 'Golden Knight',
                        img: 'Knight_4.png',
                        imgUrl: `/static/img/raid/Knight_4.png`,
                        deadImgUrl: `/static/img/raid/grave.png`,
                        type:'hero'
                      }];

  for (var i = 0; i < tempHeroList.length; i++) {
    this.heroManager.addSpawner(tempHeroList[i]['name'],
                    tempHeroList[i]['img'],
                    tempHeroList[i]['imgUrl'],
                    tempHeroList[i]['deadImgUrl'],
                    tempHeroList[i]['type'])
  }
}

/*  EnemyManager   */

function EnemyManager() {
  this.enemySpawners = []; // contains a spawner for each type of enemy. filled once per stage
}

EnemyManager.prototype.addSpawner = function(name, img, imgUrl, type) {
  // create a new enemy spawner with appropriate settings
  var newEnemySpawner = {
    name: name,
    img: img,
    imgUrl: imgUrl,
    type: type
  }

  // Load the appropriate image for later retrival
  var imgMan = imageManager.instance();
  imgMan.loadImage(img, imgUrl);

  // add the new enemy spawner to the spawners in Unit Manager
  this.enemySpawners.push(newEnemySpawner)
}

var tempEnemyJob1 = {
  "jobName": "Skel-Soldier",
  "hitpoints": 60,
  "element": "earth",
  "attack": 22,
  "defense": 15,
  "attackSpd": 30,
  "walkSpeed": 50
}

// This function needs logic to determine what enemy spawns
EnemyManager.prototype.spawnEnemy = function(enemyType=0, pos_x, pos_y) {
  var img = this.enemySpawners[enemyType].img;
  var imgUrl = this.enemySpawners[enemyType].imgUrl

  var enemy = new Unit(this.enemySpawners[enemyType].name,
                        tempEnemyJob1,
                        this.enemySpawners[enemyType].type,
                        this.enemySpawners[enemyType].img,
                        pos_x,
                        pos_y);
  // debugger;
  return enemy;
}

/*  HeroManager   */

function HeroManager() {
  this.heroSpawners = []; // contains a spawner for each type of enemy. filled once per stage
}

HeroManager.prototype.addSpawner = function(name, img, imgUrl, deadImgUrl, type) {
  // create a new hero spawner with appropriate settings  NEED TO CONSOLIDATE WITH JOB CLASS
  var newHeroSpawner = {
    name: name,
    img: img,
    imgUrl: imgUrl,
    deadImgUrl: deadImgUrl,
    type: type
  }

  // Load the appropriate image for later retrival
  var imgMan = imageManager.instance();
  imgMan.loadImage(img, imgUrl);
  imgMan.loadImage("dead", deadImgUrl);

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
                        this.heroSpawners[heroType].type,
                        this.heroSpawners[heroType].img,
                        pos_x,
                        pos_y);
  hero.avatar.setAnim(2);  // make sure heroes have correct anim
  return hero;
}
