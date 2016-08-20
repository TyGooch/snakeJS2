const Coord = require("./coord.js");

class Snake {

  constructor() {
    this.DIRECTIONS = ['U', 'R', 'D', 'L'];
    this.DELTAS = [[-1,0], [0,1], [1,0], [0,-1] ];

    // Set random starting direction
    this.direction = this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];
    // Array of coord objects
    this.segments = [new Coord([10,10], this.direction)];
  }

  move(){
    let head = this.segments[0];
    let delta = this.DELTAS[this.DIRECTIONS.indexOf(head.direction)];
    let next = new Coord(delta, head.direction);
    next.plus(head);
    this.segments.unshift(next);
    this.segments.pop();
  }

  turn(newDirection){
    this.segments[0].direction = newDirection;
  }

  eat() {
    let tail = this.segments[this.segments.length - 1];
    let delta = this.DELTAS[this.DIRECTIONS.indexOf(tail.direction)];
    delta.map(el => {el * -1});
    let newTail = new Coord(delta, tail.direction);
    newTail.plus(tail);
    this.segments.push(newTail);
  }
}

module.exports = Snake;
