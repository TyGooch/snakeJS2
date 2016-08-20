const Board = require('./board.js');

class Apple {
  constructor(board){
    this.board = board;
    this.pos = this.randomApple();
  }

  randomApple() {
    let randX = Math.floor(Math.random() * 20);
    let randY = Math.floor(Math.random() * 20);
    let segments = this.board.snake.segments;
    segments.forEach(coord => {
      if(coord.pos === [randX,randY]){
        Apple.randomApple();
      }
    });
    return [randX,randY];
  }
}

module.exports = Apple;
