'use strict';

var game = {};
game.speed = {};
game.speed.ball = 5;
game.speed.paddle = 3;
game.player1 = {};
game.player1.paddle = {};
game.player1.paddle.velocity = 0;
game.player2 = {};
game.player2.paddle = {};
game.player2.paddle.velocity = 0;
game.ball = {};
game.ball.velocity = 0;


$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  game.width = window.innerWidth;
  game.height = window.innerHeight;
  var btnLeft = (game.width / 2) - (parseInt($('#start').css('width'), 10) / 2);
  var btnTop = (game.height / 2) - (parseInt($('#start').css('height'), 10) / 2);
  var ballOffset = parseInt($('#ball').css('width'), 10) / 2;
  $('#ball').css('top', (game.height / 2) - ballOffset);
  $('#ball').css('left', (game.width / 2) - ballOffset);
  var paddleTop = (game.height / 2) - (parseInt($('.paddle').css('height'), 10) / 2);
  $('#start').css('left', btnLeft).css('top', btnTop).css('visibility', 'visible');
  $('.paddle').css('top', paddleTop);
  $('#start').click(clickStart);
  $('html').keydown(keyPress);
  $('html').keyup(keyRelease);

  game.timer = setInterval(draw, 20);
}

// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //

function clickStart() {
  $('#start').css('visibility', 'hidden');
  $('#gameBoard').css('visibility', 'visible').focus();
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
    $left.css('top', (leftTop + game.speed.paddle * game.player1.paddle.velocity) + 'px');
  } else if (leftTop + parseInt($left.css('height'), 10) < game.height && game.player1.paddle.velocity === 1) {
    //left paddle is not at bottom and has a downward velocity
    $left.css('top', (leftTop + game.speed.paddle * game.player1.paddle.velocity) + 'px');
  }

  //update right paddle
  var rightTop = parseInt($right.css('top'), 10);
  if (rightTop > 0 && game.player2.paddle.velocity === -1) {
    //right paddle is not at top and has an upward velocity
    $right.css('top', (rightTop + game.speed.paddle * game.player2.paddle.velocity) + 'px');
  } else if (rightTop + parseInt($right.css('height'), 10) < game.height && game.player2.paddle.velocity === 1) {
    //right paddle is not at bottom and has a downward velocity
    $right.css('top', (rightTop + game.speed.paddle * game.player2.paddle.velocity) + 'px');
  }
}

function ballStart() {
  // $('#ball')
}




// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //


function getValue(selector, fn){
  var value = $(selector).val();
  value = value.trim();
  $(selector).val('');

  if(fn){
    value = fn(value);
  }

  return value;
}

function parseUpperCase(string){
  return string.toUpperCase();
}

function parseLowerCase(string){
  return string.toLowerCase();
}

function formatCurrency(number){
  return '$' + number.toFixed(2);
}

// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //

function canRun(flag){
  var isQunit = $('#qunit').length > 0;
  var isFlag = flag !== undefined;
  var value = isQunit && isFlag || !isQunit;
  return value;
}
