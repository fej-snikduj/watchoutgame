// start slingin' some d3 here.
var ball = {};
ball.id = 1;
ball.r = 30;
ball.cx =window.innerWidth*0.45;
ball.cy =window.innerHeight*0.45;

// Create new position for 20 enemy balls
var numberOfEnemy = 20;
var radius = 30;
var createNewBall = function(){
  var enemyPositions = [];
  for( var i = 0; i < numberOfEnemy; i++){
    enemyPositions[i]=[Math.random()*(window.innerWidth-2*radius), Math.random()*(window.innerHeight-2*radius)];
  }
  return enemyPositions;
}

// Create a board to let users play in, give it class
// d3.select('.board').append('svg').attr('class', 'svgBoard'); //delete board(dont forget to add mouse to svgBoard)



// .style('background-color',)
var d3svgBoard = d3.select('.svgBoard');



// Create enemy ball
var d3enemyBall = d3svgBoard.selectAll('span')
.data(createNewBall())
.enter()
.append('circle')
.attr('cx', function(d){return d[0]})
.attr('cy', function(d){return d[1]})
.attr('r', radius)
.attr('class','enemyBall')
.attr('fill', 'blue');

// Create player ball
d3svgBoard.selectAll('circle')
.data([ball], function(d){return d.id})
.enter()
.append('circle')
.attr('cx', function(d){return d.cx}) //shorten it
.attr('cy', function(d){return d.cy})
.attr('r', function(d){return d.r})
.attr('class','playerBall')
.attr('fill', 'red');

//align the health bar to the right;
d3svgBoard.append('rect').attr('x', '' + window.innerWidth - window.innerWidth*.1).attr('id', 'health').attr('y', '0');




///mouse effects
d3svgBoard.on('mousemove', function(){
  var position = d3.mouse(this);
  d3svgBoard.select('.playerBall')
  .attr('cx', position[0])
  .attr('cy', position[1]);
});



///keep enemy moving
var speed = 2000;
setInterval(function() {
  d3enemyBall.data(createNewBall()).transition().duration(speed)
  .attr('cx', function(d){return d[0]})
  .attr('cy', function(d){return d[1]})
}, speed);
var lifeLimit = 10;
var collisionCount = 0;
var playerCanCollide = false;

setTimeout(function(){
  playerCanCollide = true;
}, 2000)



///start collision function
var checkCollision = function(){
  var currentEnemyPos = [];
  var enemyBalls = document.getElementsByClassName('enemyBall');

  _.each(enemyBalls, function(enemy){
    currentEnemyPos.push([enemy.getAttribute('cx'), enemy.getAttribute('cy')]);
  })
  var currentPlayer = document.getElementsByClassName('playerBall')[0];
  var currentPlayerPos = [currentPlayer.getAttribute('cx'), currentPlayer.getAttribute('cy')];
  for (var i = 0;i < currentEnemyPos.length;i++){
    var d = Math.sqrt(Math.pow(currentEnemyPos[i][0]-currentPlayerPos[0],2)+Math.pow(currentEnemyPos[i][1]-currentPlayerPos[1],2));
    if (d < radius*2 && playerCanCollide){
      collisionCount++;
      playerCanCollide = false;
      setTimeout(function(){
        playerCanCollide = true;
      }, 4000);
      healthUpdate();
      //blackout
      d3svgBoard.transition().duration(200).style('background-color', 'blue');
    }
  }
}

// Collision Test
setInterval(function(){checkCollision()}, 100);
setInterval(function(){
  d3svgBoard.transition().duration(1500).style('background-color', 'white')}, 3000);
var time = 0;
setInterval(function(){
  d3.select('.time')
  .transition()
  .duration(50)
  .text(""+Math.floor(time/600)+" : "+Math.floor((time/10)%60)+" : "+time%10+'0');
  time++;
},100);


// update the health bar
var healthUpdate = function() {
  var healthHeight = '' + window.innerHeight*(lifeLimit - collisionCount)/10;
  d3.select('#health').transition().duration(2000).attr('y', window.innerHeight -healthHeight);
  if (collisionCount > 2) {
    d3.select('#health').transition().delay(2000).style('fill', 'greenyellow');
  }  
  if (collisionCount > 3) {
    d3.select('#health').transition().delay(2000).style('fill', 'yellow');
  }
  if (collisionCount >= 6) {
    d3.select('#health').transition().delay(2000).style('fill', 'orange');
  }
  if (collisionCount >= 8) {
    d3.select('#health').transition().delay(2000).style('fill', 'red');
  }
}
