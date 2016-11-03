/// Initial state of overall game;
// Create a board to let users play in, give it class
var d3svgBoard = d3.select('.svgBoard');

//add device motion detection for mobile browsers
$(document).ready(function(){
  window.addEventListener("devicemotion",onDeviceMotion,false);
  });


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

function onDeviceMotion(event){
  var accel = event.accelerationIncludingGravity;
  d3.selectAll('circle').attr('cx', window.innerWidth*0.45);
  .attr('cy', window.innerHeight*0.45);
  $("#xvalue").text(Math.round(accel.x));
  $("#yvalue").text(Math.round(accel.y)); 
  $("#zvalue").text(Math.round(accel.z));
  var angle = Math.atan2(accel.y,accel.x);

  // ctx.clearRect(0,0,100,100);
  // ctx.beginPath();
  // ctx.arc(50,50,5,0,2*Math.PI,false);
  // ctx.moveTo(50,50);
  // ctx.lineTo(50-50*Math.cos(angle),50+50*Math.sin(angle));
  // ctx.stroke();
}

