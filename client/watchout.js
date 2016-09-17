/// Initial state of overall game;
// Create a board to let users play in, give it class
var d3svgBoard = d3.select('.svgBoard');
var lifeLimit = 10;
var collisionCount = 0;
var createHealthBar = function(){
  d3svgBoard.append('rect').attr('x', '' + window.innerWidth - window.innerWidth*.1).attr('id', 'health').attr('y', '0');
}


/*
This section is for initiating the balls
1. Enemy Balls
2. Player ball
*/
/// 1. Enemy Ball
//Create new position for 20 enemy balls
var numberOfEnemy = 10;
var enemyRadius = 30;
var createNewBall = function(){
  var enemyPositions = [];
  for( var i = 0; i < numberOfEnemy; i++){
    enemyPositions[i]=[Math.random()*(window.innerWidth*1.2) - window.innerWidth*.1 , Math.random()*(window.innerHeight*1.2) - window.innerHeight*.1];
  }
  return enemyPositions;
}
// Create enemy ball
var d3enemyBall = d3svgBoard.selectAll('span')
.data(createNewBall())
.enter()
.append('circle')
.attr('cx', function(d){return d[0]})
.attr('cy', function(d){return d[1]})
.attr('r', enemyRadius)
.attr('class','enemyBall')
.attr('fill', 'blue');

/// 2. Player Ball
// Create player ball
var playerRadius = 30;
d3svgBoard
.append('circle')
.attr('cx', window.innerWidth*0.45) //shorten it
.attr('cy', window.innerHeight*0.45)
.attr('r', playerRadius)
.attr('class','playerBall')
.attr('fill', 'red');
// Makes the playerBall follow mouse cursor(mouse effects)
d3svgBoard.on('mousemove', function(){
  var position = d3.mouse(this);
  d3svgBoard.select('.playerBall')
  .attr('cx', position[0])
  .attr('cy', position[1]);
});
// Set initial game conditions for player ball
var playerCanCollide = false;
setTimeout(function(){
  playerCanCollide = true;
}, 2000)

// We are creating the healthbar here to put it on the top layer
createHealthBar();


/* Movement functions and interval functions
1. Movement functions
2. interval functions
*/

// 1.Movement Functions: Keeps the enemy moving
var speed = 2000;
var moveEnemyInterval = setInterval(function() {
  var newPositionBalls =d3enemyBall.data(createNewBall());
  newPositionBalls.transition().duration(speed)
  .attr('cx', function(d){return d[0]})
  .attr('cy', function(d){return d[1]})
  newPositionBalls.enter()
  .append('circle')
  .transition().duration(speed)
  .attr('cx', function(d){return d[0]})
  .attr('cy', function(d){return d[1]})
}, speed);


/* Check collision every setInterval, 1. getting the enemy positions into an
array 2. for every ball in the enemy position array, test collision with player
ball using collision test function. When there is a collision 3.run our collision
occurence function.
*/
// Run collision Test
var collisionInterval = setInterval(function(){checkCollision()}, 100);
var checkCollision = function(){
  // get current enemy current pos
  var currentEnemyPos = [];
  var enemyBalls = document.getElementsByClassName('enemyBall');
  _.each(enemyBalls, function(enemy){
    currentEnemyPos.push([enemy.getAttribute('cx'), enemy.getAttribute('cy')]);
  })
  // get current playerBall pos
  var currentPlayer = document.getElementsByClassName('playerBall')[0];
  var currentPlayerPos = [currentPlayer.getAttribute('cx'), currentPlayer.getAttribute('cy')];
  // Check collision for all enmeny
  for (var i = 0;i < currentEnemyPos.length;i++){
    var d = Math.sqrt(Math.pow(currentEnemyPos[i][0]-currentPlayerPos[0],2)+Math.pow(currentEnemyPos[i][1]-currentPlayerPos[1],2));
    if (d < (playerRadius+enemyRadius) && playerCanCollide){
      // Execute collision Occurence when there is a collision
      collisionOccurence();
    }
  }
}
// Every event that happens upon a collision is defined in this function
var collisionOccurence = function(){
  collisionCount++;
  // Give invincibility to the player ball
  playerCanCollide = false;
  var timeInvincible = 4000;
  setTimeout(function(){
    playerCanCollide = true;
  }, timeInvincible);
  // Checking for endGame
  endGame()
  healthUpdate();
  // Blackout
  d3svgBoard.transition().duration(200).style('background-color', 'blue');
  // Recover blackout
  setTimeout(function(){
    d3svgBoard.transition().duration(1500).style('background-color', 'white')
  }, 2000);
}
// Events that happen when the game ends
var endGame = function(){
  if (collisionCount === lifeLimit){
    clearInterval(timeInterval);
    clearInterval(collisionInterval);
    clearInterval(moveEnemyInterval);
    // Pops time
    d3.select('.time').transition().duration(500)
    .style('bottom', '65vh')
    .style('font-size','6em');
    d3.select('.gameOverText').transition().duration(500)
    .text('GAME OVER')
    .style('bottom', '40vh')
    .style('font-size', '10em');
    d3.select('.level').transition().duration(500)
    .style('top', '10vh')
    .style('font-size','6em');
  }
}
// update the health bar
var healthUpdate = function() {
  var healthColors = ['#45DC00','#7ED800', '#B6D400', '#CFB400', '#CB7A00', '#C74100', '#C74100', '#C30B00', '#C30B00', '#BF0029'];
  var healthHeight = '' + window.innerHeight*(lifeLimit - collisionCount)/10;
  d3.select('#health').transition().duration(2000).attr('y', window.innerHeight -healthHeight).style('fill', healthColors[collisionCount]);
}

// Update time constantly
var time = 0;
var level = 1;// Keeps track of level(related to time)
var timeInterval= setInterval(function(){
  d3.select('.time')
  .transition()
  .duration(50)
  .text(""+Math.floor(time/600)+" : "+Math.floor((time/10)%60)+" : "+time%10+'0');
  time++;
  if(level < 2 && time > 150) {
    level = 2;
    upOneLevel();
  };
},100);
// Level updating
// Level 2
var upOneLevel = function(){
  numberOfEnemy *=2;
}
