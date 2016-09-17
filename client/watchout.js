// start slingin' some d3 here.
var ball = {};
ball.id = 1;
ball.r = 30;
ball.cx = Math.random()*(window.innerWidth-2*ball.r);
ball.cy = Math.random()*(window.innerHeight-2*ball.r);

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
d3.select('.board').append('svg').attr('class', 'svgBoard'); //delete board(dont forget to add mouse to svgBoard)

// .style('background-color',)
var d3svgBoard = d3.select('.svgBoard');

// Create player ball
d3svgBoard.selectAll('circle')
.data([ball], function(d){return d.id})
.enter()
.append('circle')
.attr('cx', function(d){return d.cx}) //shorten it
.attr('cy', function(d){return d.cy})
.attr('r', function(d){return d.r})
.attr('class','playerBall');

// Create enemy ball
d3svgBoard.selectAll('div')
.data(createNewBall())
.enter()
.append('circle')
.attr('cx', function(d){return d[0]})
.attr('cy', function(d){return d[1]})
.attr('r', radius)
.attr('class','enemyBall');
// Update enemy ball


d3svgBoard.on('mousemove', function(){
  var position = d3.mouse(this);
  d3svgBoard.select('.playerBall')
  .attr('cx', position[0])
  .attr('cy', position[1]);
});
