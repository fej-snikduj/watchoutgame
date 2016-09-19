/// Initial state of overall game;
// Create a board to let users play in, give it class
var d3svgBoard = d3.select('.svgBoard');
var lifeLimit = 15;
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
var enemyRadiusUpdate = 30;
var enemyRadiusEnter = 30;
var pulseRadius = 120;
 
var enemyColor = 'blue';
var blackOutColor = 'blue'
var createNewPositions = function(){
  var enemyPositions = [];
  for( var i = 0; i < numberOfEnemy; i++){
    enemyPositions[i]=[Math.random()*(window.innerWidth*1.2) - window.innerWidth*.1 , Math.random()*(window.innerHeight*1.2) - window.innerHeight*.1, enemyRadiusUpdate];
  }
  return enemyPositions;
}
// Create enemy ball
var d3enemyBall = d3svgBoard.selectAll('span')
.data(createNewPositions())
.enter()
.append('circle')
.attr('cx', function(d){return d[0]})
.attr('cy', function(d){return d[1]})
.attr('r', enemyRadiusEnter)
.attr('class','enemyBall')
.attr('fill', enemyColor);

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
var moveEnemyInterval;
var intervalSpeed = 2000;
var cornerNumber = 0;
var speed = 2000;
//declare loaded variable for level 4 - if loaded, slow transition, if not, no transition
var loaded = true;
var moveEnemyIntervalFun = function() {moveEnemyInterval = setInterval(function() {
  var passingArray;
  var cornerArray = [[0,0,pulseRadius],[0,window.innerHeight, pulseRadius],[window.innerWidth, 0, pulseRadius], [window.innerWidth, window.innerHeight, pulseRadius]];
  var multiplyFun = function() {
    if(cornerNumber === 0) {
      return [window.innerWidth*(1+Math.random()*9), window.innerHeight*(0 + Math.random()*10), enemyRadiusEnter];
    }
    if(cornerNumber === 1) {
      return [window.innerWidth*(1+Math.random()*9), window.innerHeight*(1 + Math.random()*-10), enemyRadiusEnter];
    }
    if(cornerNumber === 2) {
      return [window.innerWidth*(0 - Math.random()*9), window.innerHeight*(0 + Math.random()*10), enemyRadiusEnter];
    }
    if(cornerNumber === 3) {
      return [window.innerWidth*(0 - Math.random()*9), window.innerHeight*(1 + Math.random()*-10), enemyRadiusEnter];
    }  
  };
  //LEVEL CONDITIONS - CHANGE DATA ARRAY DEPENDING ON LEVEL
  if(newLevel === 2){
    passingArray = getEnemyPositions().concat(getEnemyPositions());
    newLevel = 0;
    enemyRadiusEnter = 30;
    enemyRadiusUpdate = 20;
    enemyColor = 'orange';
  }else if (newLevel === 3) {
    passingArray = new Array(40).fill([window.innerWidth/2, window.innerHeight/2, enemyRadiusUpdate]);
    newLevel = 0;
  } else if (newLevel === 4 ){
    passingArray = cornerArray;
    newLevel = 4.5;
    enemyColor = 'purple';
    blackOutColor = 'purple';
    enemyRadiusEnter = 20;
  } else if (newLevel === 4.5){

    if(loaded){
      passingArray = cornerArray;
      currentPlayer = document.getElementsByClassName('playerBall')[0];
      for (var i = 4; i < document.getElementsByClassName('enemyBall').length;i++){
        passingArray.push(multiplyFun());
      }
    }else{
      passingArray = cornerArray;
      cornerNumber = Math.floor(Math.random()*4);
      var bulletArray = new Array(numberOfBallShoot).fill([cornerArray[cornerNumber][0], cornerArray[cornerNumber][1], enemyRadiusEnter]);
      passingArray = passingArray.concat(bulletArray);
    }

  }else {
    passingArray = createNewPositions();
  }
  //UPDATE AND ENTER SELECTIONS WITH PASSINGARRAY AS DATA ARRAY - PASSING ARRAY
  //DETERMINED FROM LEVEL CONDITIONS ABOVE

  //DEFINE THE TRANSITION OUTSIDE OF THE FUNCTION
    var t = d3.transition().duration(function(d) {
    if (!loaded && newLevel > 3) {
        return 0;
    }
    return speed;

  }); 

  var newPositionBalls =d3.select('.svgBoard').selectAll('.enemyBall').data(passingArray);
  newPositionBalls.transition(t).delay(function(d,i){
    if (loaded && newLevel > 3) {
      return i*150;
    }
    return 0;
  })
  .style('fill', enemyColor)
  .attr('cx', function(d){return d[0]})
  .attr('cy', function(d){return d[1]})
  .attr('r', function(d){return d[2]});
  newPositionBalls.enter()
  .append('circle').transition(t)
  .style('fill', enemyColor)
  .attr('cx', function(d){return d[0]})
  .attr('cy', function(d){return d[1]})
  .attr('r', function(d){return d[2]})
  .attr('class', 'enemyBall');

  newPositionBalls.exit().remove();
  if (newLevel === 4 || newLevel === 4.5){
    loaded = !loaded;
  }


}, intervalSpeed)};

//invoke the function
moveEnemyIntervalFun();


/* Check collision every setInterval, 1. getting the enemy positions into an
array 2. for every ball in the enemy position array, test collision with player
ball using collision test function. When there is a collision 3.run our collision
occurence function.
*/
// Run collision Test
var collisionInterval = setInterval(function(){checkCollision()}, 10);
var checkCollision = function(){
  // get current enemy current pos
  var currentEnemyPos = getEnemyPositions();
  // get current playerBall pos
  var currentPlayer = document.getElementsByClassName('playerBall')[0];
  var currentPlayerPos = [currentPlayer.getAttribute('cx'), currentPlayer.getAttribute('cy')];
  // Check collision for all enmeny
  for (var i = 0;i < currentEnemyPos.length;i++){
    var d = Math.sqrt(Math.pow(currentEnemyPos[i][0]-currentPlayerPos[0],2)+Math.pow(currentEnemyPos[i][1]-currentPlayerPos[1],2));
    if (d < (playerRadius+Number(currentEnemyPos[i][2])) && playerCanCollide){
      // Execute collision Occurence when there is a collision
      collisionOccurence();
    }
  }
}
var getEnemyPositions = function(){
  var currentEnemyPos = [];
  var enemyBalls = document.getElementsByClassName('enemyBall');
  _.each(enemyBalls, function(enemy){
    currentEnemyPos.push([enemy.getAttribute('cx'), enemy.getAttribute('cy'), enemy.getAttribute('r')]);
  })
  return currentEnemyPos;
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
  d3svgBoard.transition().duration(200).style('background-color', blackOutColor);
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
    .style('top', '' + window.innerHeight*.3 + 'px')
    .style('font-size','6em');
    d3.select('.gameOverText').transition().duration(500)
    .text('GAME OVER')
    .style('top', '' + window.innerHeight*.5 + 'px')
    .style('font-size', '10em');
    d3.select('.level').transition().duration(500)
    .style('top', '' + window.innerHeight*.0 + 'px')
    .style('font-size','6em');
  }
}
// update the health bar
var healthUpdate = function() {
  var healthColors = ['#45DC00','#7ED800', '#B6D400', '#CFB400', '#CB7A00', '#C74100', '#C74100', '#C30B00', '#C30B00', '#BF0029'];
  var healthHeight = '' + window.innerHeight*(lifeLimit - collisionCount)/lifeLimit;
  d3.select('#health').transition().duration(2000).attr('y', window.innerHeight -healthHeight).style('fill', healthColors[Math.floor(collisionCount/lifeLimit*10)]);
  d3.select('.health').transition().duration(2000).style('top', '' + window.innerHeight - healthHeight + 'px');
}

// Update time constantly
var time = 0;
var timeInterval= setInterval(function(){
  d3.select('.time')
  .transition()
  .duration(50)
  .text(""+Math.floor(time/600)+" : "+Math.floor((time/10)%60)+" : "+time%10+'0');
  time++;
  if(time === 200) {
    toLevelTwo();
  } else if (time === 400 {
    toLevelThree();
  } else if (time === 600){
    toLevelFour();
  };
},100);
// Level updating
// Level 2
var newLevel = 0;
var toLevelTwo = function(){
  numberOfEnemy *=2;
  newLevel = 2;
  d3.select('.level').transition().duration(900).text('LEVEL 2').style('font-size', '3em');
  blackOutColor = 'orange';
}
var toLevelThree = function(){
  newLevel = 3;
  d3.select('.level').transition().duration(900).text('LEVEL 3').style('font-size', '3em');
  blackOutColor = 'red';
  setTimeout(function() {
    numberOfEnemy = 1;
    enemyRadiusEnter = 250;
    enemyRadiusUpdate = 250;
    speed = 500;
    enemyColor = 'red'
  }, 2100);
}
var numberOfBallShoot = 20;
var toLevelFour = function(){
  d3.select('.level').transition().duration(900).text('LEVEL 4').style('font-size', '3em');
  newLevel = 4;
  ;
  enemyRadiusUpdate = 100;
  clearInterval(moveEnemyInterval)
  intervalSpeed = 3000;
  pulseRadius = 120;
  moveEnemyIntervalFun();
  setTimeout(function(){
    levelFourIntervalFun()
    speed = 2000; 
  }, 5000)
}


var levelFourIntervalFun = function(){setInterval(function(){
  if (pulseRadius === 100) {
    pulseRadius = 120;
  } else {
    pulseRadius = 100;
  }
  var colorArray = ['purple', 'yellow', 'blue', 'red'];
  var newPositionBalls =d3.select('.svgBoard').selectAll('.enemyBall').data([[colorArray[Math.floor(Math.random()*4)], pulseRadius], [colorArray[Math.floor(Math.random()*4)], pulseRadius],[colorArray[Math.floor(Math.random()*4)], pulseRadius],  ['blue', pulseRadius]]);
    newPositionBalls.transition().duration(500)
    .style('fill', function(d) {return d[0]})
    .attr('r', function(d){return d[1]});
}, 1000)};
