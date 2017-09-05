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
  ctx.fillStyle = "#5F9553";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Container for our monsters
  var battleGround = new Battleground(ctx, canvas.width, canvas.height, 4, 64);
  battleGround.spawnAllHeroes();
  battleGround.initEnemySpawning(1000, 1000);

  var time = 0;
  var bLanes = battleGround.getBattleLanes();

  var gameInterval = setInterval(function() {
    var time = new Date().getTime();

    // Drawing code!
    //  Clear the Canvas Rect
    //  Draw all enemies
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#5F9553";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // DEBUG: Draw Battle Lanes
    if (globals.getDebugMode()){
      ctx.fillStyle = "#C51CB5";
      for (var i = 0; i < bLanes.length; i++) {
        ctx.fillRect(bLanes[i].x,0,bLanes[i].width,544);
      }
    }

    // Update all of the game entities
    battleGround.updateTimeStamp(time);
    battleGround.updateEnemies(ctx);
    battleGround.updateHeroes(ctx);

    // Test if the enemies have stacked or all the heroes are dead.
    //  refactor to also help with win checks
    if (battleGround.lossCheck()) {
      alert("Game over, man!");
      clearInterval(gameInterval);
    }

  }, 33);  // Attempting ~30fps
}
