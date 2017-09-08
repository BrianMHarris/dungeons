// Initialize anything necessary for the page
$(document).ready(function() {
  main();
});

// This is the main GAME initialization
function main() {

  var globals = globalSettings.instance();

  var canvas = document.getElementById("canvas");
  canvas.width = canvas.parentNode.clientWidth;
  canvas.height = canvas.parentNode.clientHeight;

  var ctx = canvas.getContext('2d');

  // Container for our monsters
  var battleGround = new Battleground(ctx, canvas.width, canvas.height, 4, 64);
  battleGround.spawnAllHeroes();
  battleGround.initEnemySpawning(1000, 2000);

  // Set up the background image for the battleground.
  var imgMan = imageManager.instance();
  imgMan.loadImage("grass", '/static/img/raid/grass.png');
  imgMan.getImageByName("grass").onload = function(){
    battleGround.setBackground("grass");
  };

  var $playerGold = $("#player-gold");
  var $playerLives = $("#player-lives")

  var time = 0;
  var bLanes = battleGround.getBattleLanes();
  var goldEarned = 0;

  // MAIN GAME LOOP
  var gameInterval = setInterval(function() {
    var time = new Date().getTime();
    $playerGold.text(battleGround.getGoldEarned());
    $playerLives.text(battleGround.getLivesRemaining());

    // DEBUG: Draw Battle Lanes
    if (globals.getDebugMode()){
      ctx.fillStyle = "#C51CB5";
      for (var i = 0; i < bLanes.length; i++) {
        ctx.fillRect(bLanes[i].x,0,bLanes[i].width,544);
      }
    }

    // draw the background
    battleGround.drawBackground();

    // Update all of the game entities
    battleGround.updateTimeStamp(time);
    battleGround.updateHeroes(ctx);
    battleGround.updateEnemies();
    battleGround.displaySwapButtons();


    // Test if the enemies have stacked or all the heroes are dead.
    //  refactor to also help with win checks
    if (battleGround.lossCheck()) {
      gameOver(ctx, battleGround.getGoldEarned(goldEarned));
      clearInterval(gameInterval);
    }
  }, 33);  // Attempting ~30fps
}

function gameOver(ctx, goldEarned) {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.font = "30px Arial";
  ctx.fillStyle = "yellow";
  ctx.fillText(`Game Over`,10,50);
  ctx.fillText(`You earned ${goldEarned} Gold`,10,100);
}
