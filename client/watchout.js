/// Initial state of overall game;
// Create a board to let users play in, give it class
var d3svgBoard = d3.select('.svgBoard');


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
}, 2000);
