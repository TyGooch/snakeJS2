const Board = require("./board.js");
const Apple = require('./apple.js');

class SnakeView {
  constructor($el) {
    this.$el = $el;
    this.buildBoard();
    this.board = new Board();
    this.bindEvents();
    this.interval = 250;
    this.playInterval = setInterval(this.play.bind(this), this.interval);
  }

  play() {
    if(!this.gameOver()){
      this.step();
    } else{
      clearInterval(this.playInterval);
      $('.square').css('background', '#D2B48C');
      $('.snake').css('background', '#556B2F');
      this.addOverlay();
    }
  }

  gameOver() {
    let head = this.board.snake.segments[0];
    let headPos = head.pos();
    if(headPos[0] === 20 || headPos[0] < 0 || headPos[1] === 20 || headPos[1] < 0){
      return true;
    }
    let segments = this.board.snake.segments;
    let body = segments.slice(3);
    for(let i=0; i < body.length; i++){
      let seg = body[i];
      if(seg.pos()[0] === headPos[0] && seg.pos()[1] === headPos[1]){
        return true;
      }
    }
    return false;
  }

  step(){
    this.board.snake.move();
    this.render();
  }

  bindEvents(){
    $(document).keypress( event => {
      this.handleKeyEvent(event);
    });
    console.log("bind");
  }

  handleKeyEvent(event){
    if (event.keyCode === '38' || event.keyCode === 119 ){
      this.board.snake.turn('U');
    } else if (event.keyCode === '39' || event.keyCode === 100){
      this.board.snake.turn('R');
    } else if (event.keyCode === '40' || event.keyCode === 115){
      this.board.snake.turn('D');
    } else if (event.keyCode === '37' || event.keyCode === 97){
      this.board.snake.turn('L');
    }
  }

  buildBoard(){
    for(let rowIdx = 0; rowIdx < 20; rowIdx++){
      let $ul = $('<ul>');
      let row = this.$el.append($ul);
      for(let colIdx = 0; colIdx < 20; colIdx++){
        let $square =  $('<li>').addClass("square").attr("data-pos", [rowIdx, colIdx]);
        row.append($square);
      }
    }
  }

  render(){
    let segments = this.board.snake.segments;
    $('.square').removeClass('snake');

    segments.forEach( coord => {
      let $seg = $('.square').filter(`[data-pos='${coord.pos()}']`);
      $seg.addClass('snake');
    });

    if (!$('.apple').length){
      this.addApple();
    }

    let head = this.board.snake.segments[0];
    let $apple = $('.apple');
    let applePos = $apple.attr('data-pos').split(',').map(el => parseInt(el));

    if(head.pos()[0] === applePos[0] && head.pos()[1] === applePos[1]){
      this.interval /= 1.1;
      clearInterval(this.playInterval);
      this.playInterval = setInterval(this.play.bind(this), this.interval);
      this.board.snake.eat();
      $('.apple').removeClass('apple');
    }
  }

  addApple(){
    let apple = new Apple(this.board);
    let $apple = $('.square').filter(`[data-pos='${apple.pos}']`);
    $apple.addClass('apple');
  }

  addOverlay(){
    let $overlay = this.$el.append('<div>');
    $overlay.addClass('game-over');
    let $gameOverText = $('<p>').addClass('game-over-text');
    $gameOverText.text("GAME OVER.");
    $overlay.append($gameOverText);
  }

}

// let v = new SnakeView('ul');
// console.log(v);
module.exports = SnakeView;
