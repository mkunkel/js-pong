'use strict';

var game = {};
game.speed = {}; //default speeds
game.speed.ball = 3;
game.speed.paddle = 4;
game.player1 = {};
game.player1.paddle = {};
game.player1.score = 0;
game.player1.paddle.height = 100;
game.player1.paddle.velocity = 0;
game.player1.paddle.speed = game.speed.paddle;
game.player2 = {};
game.player2.paddle = {};
game.player2.score = 0;
game.player2.paddle.height = 100;
game.player2.paddle.velocity = 0;
game.player2.paddle.speed = game.speed.paddle;
game.ball = {};
game.ball.velocity = {};
game.ball.speed = game.speed.ball;


$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  game.width = window.innerWidth;
  game.height = window.innerHeight;
  var btnLeft = (game.width / 2) - (parseInt($('#start').css('width'), 10) / 2);
  var btnTop = (game.height / 2) - (parseInt($('#start').css('height'), 10) / 2);

  var paddleTop = (game.height / 2) - (parseInt($('.paddle').css('height'), 10) / 2);
  $('#start').css('left', btnLeft).css('top', btnTop).css('visibility', 'visible');
  $('.paddle').css('top', paddleTop);
  $('#start').click(clickStart);
  $('html').keydown(keyPress);
  $('html').keyup(keyRelease);
  ballStart();
}

// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //

function clickStart() {
  $('#start').css('visibility', 'hidden');
  $('#gameBoard').css('visibility', 'visible').focus();
  game.timer = setInterval(draw, 20);
}

function keyPress(key) {
  //first make sure the game has been started
  if ($('#gameBoard').css('visibility') === 'visible') {
    switch(key.which) {
    case 87: //user pressed W key
      game.player1.paddle.velocity = -1;
      break;
    case 83: //user pressed S key
      game.player1.paddle.velocity = 1;
      break;
    case 38: //user pressed up key
      game.player2.paddle.velocity = -1;
      break;
    case 40: //user pressed down key
      game.player2.paddle.velocity = 1;
    }
  } else if(key.which === 13 || key.which === 32) {
    $('#start').trigger('click');
  }
}

function keyRelease(key) {
  //first make sure the game has been started
  if ($('#gameBoard').css('visibility') === 'visible') {
    switch(key.which) {
    case 87: //user released W key
      game.player1.paddle.velocity = 0;
      break;
    case 83: //user released S key
      game.player1.paddle.velocity = 0;
      break;
    case 38: //user released up key
      game.player2.paddle.velocity = 0;
      break;
    case 40: //user released down key
      game.player2.paddle.velocity = 0;
    }
  }
}

// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //

function draw() {
  var $left = $('#left .paddle');
  var $right = $('#right .paddle');

  //update left paddle
  var leftTop = parseInt($left.css('top'), 10);

  if (leftTop > 0 && game.player1.paddle.velocity === -1) {
    //left paddle is not at top and has an upward velocity
    $left.css('top', (leftTop + game.player1.paddle.speed * game.player1.paddle.velocity) + 'px');
  } else if (leftTop + parseInt($left.css('height'), 10) < game.height && game.player1.paddle.velocity === 1) {
    //left paddle is not at bottom and has a downward velocity
    $left.css('top', (leftTop + game.player1.paddle.speed * game.player1.paddle.velocity) + 'px');
  }
  game.player1.paddle.top = parseInt($('#left .paddle').css('top'), 10);
  game.player1.paddle.bottom = game.player1.paddle.top + game.player1.paddle.height;

  //update right paddle
  var rightTop = parseInt($right.css('top'), 10);
  if (rightTop > 0 && game.player2.paddle.velocity === -1) {
    //right paddle is not at top and has an upward velocity
    $right.css('top', (rightTop + game.player2.paddle.speed * game.player2.paddle.velocity) + 'px');
  } else if (rightTop + parseInt($right.css('height'), 10) < game.height && game.player2.paddle.velocity === 1) {
    //right paddle is not at bottom and has a downward velocity
    $right.css('top', (rightTop + game.player2.paddle.speed * game.player2.paddle.velocity) + 'px');
  }
  game.player2.paddle.top = parseInt($('#right .paddle').css('top'), 10);
  game.player2.paddle.bottom = game.player2.paddle.top + game.player2.paddle.height;

  var $ball = $('#ball');
  var ballDiameter = parseInt($ball.css('height'), 10);
  var ballTop = parseInt($ball.css('top'), 10);
  var ballBottom = ballTop + ballDiameter;
  var ballLeft = parseInt($ball.css('left'), 10);
  var ballRight = ballLeft + ballDiameter;
  var ballCenter = ballTop + ballDiameter;
  var gutter = parseInt($('.gutter').css('width'), 10);
  // console.log((ballTop) + ' & ' + (game.height - ballBottom));

  //update ball position
  $ball.css('left', (ballLeft + (game.ball.speed * game.ball.velocity.x)) + 'px');
  $ball.css('top', (ballTop + (game.ball.speed * game.ball.velocity.y)) + 'px');

  //check for ball collisions on y axis and update velocity.
  if (ballTop <= 0) {
    if (game.ball.velocity.y < 0) {game.ball.velocity.y *= -1;} //multiply velocity by -1 to reverse direction
  } else if (ballBottom >=game.height) {
    if (game.ball.velocity.y > 0) {game.ball.velocity.y *= -1;} //multiply velocity by -1 to reverse direction
  }

  //check for same on x axis. Need separate conditional in case ball
  //reaches both x and y boundaries at the same time
  if (ballLeft <= gutter) { // Ball hit left gutter

    if (ballCenter + (ballDiameter / 2) >= game.player1.paddle.top && ballCenter - (ballDiameter / 2) <= game.player1.paddle.bottom) {
      //Ball hit left paddle
      if (game.ball.velocity.x < 0) {
        game.ball.velocity.x *= -1; // make sure the ball goes in the reverse direction
        adjustBallAngle(game.player1.paddle, $('#left .paddle'));
      }
    } else if (ballLeft <= 0) {
      //Player 2 scores!

      ballStart('left');
      game.player2.score += 1;

    }
  } else if (ballRight >= game.width - gutter) { // Ball hit right gutter

    if (ballCenter + (ballDiameter / 2) >= game.player2.paddle.top && ballCenter - (ballDiameter / 2) <= game.player2.paddle.bottom) {
      //Ball hit right paddle
      if (game.ball.velocity.x > 0) {
        game.ball.velocity.x *= -1; // make sure the ball goes in the reverse direction
        adjustBallAngle(game.player2.paddle, $('#right .paddle'));
      }
    } else if (ballRight >= game.width) {
      //Player 2 scores!

      ballStart('right');
      game.player1.score += 1;

    }
  }

  //update scores
  $('#leftScore').text(game.player1.score);
  $('#rightScore').text(game.player2.score);
}

function ballStart(toward) {
  game.ball.speed = game.speed.ball;
  // console.log('new ball');
  var ballOffset = parseInt($('#ball').css('width'), 10) / 2;
  $('#ball').css('top', (game.height / 2) - ballOffset);
  $('#ball').css('left', (game.width / 2) - ballOffset);
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  if (toward === 'left') {
    plusOrMinus = -1;
  } else if (toward ==='right') {
    plusOrMinus = 1;
  }
  game.ball.velocity.x = Math.floor(Math.random()*2 +1) * plusOrMinus;
  plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  game.ball.velocity.y = Math.floor(Math.random()*2 + 1) * plusOrMinus;
}

function adjustBallAngle(paddle, $element) {
  var section = paddle.height / 5;
  var top = parseInt($element.css('top'), 10);
  var ballCenter = parseInt($('#ball').css('top'), 10) + (parseInt($('#ball').css('height'), 10) / 2);
  if (ballCenter < top + section) {
    game.ball.velocity.y -= 0.5;
  } else if(ballCenter < top + (section * 2)) {
    game.ball.velocity.y -= 0.25;
  } else if(ballCenter < top + (section * 4) && ballCenter > top + (section * 3)) {
    game.ball.velocity.y += 0.25;
  } else if(ballCenter < top + (section * 5)) {
    game.ball.velocity.y += 0.5;
  }
  if (paddle.velocity === -0.25) {
    game.ball.velocity.y--;
  } else if (paddle.velocity === 0.25) {
    game.ball.velocity.y++;
  }
  adjustBallSpeed();
}

function adjustBallSpeed() {
  game.ball.speed += 0.5;
  // debugger;
  console.log(game.ball.speed);
}