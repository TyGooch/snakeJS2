class Coord {
  constructor(array, direction) {
    this.x = array[0];
    this.y = array[1];
    this.direction = direction;
  }

  plus(coord){
    this.x += coord.x;
    this.y += coord.y;
  }

  equals(coord){
    return (this.x === coord.x) && (this.y === coord.y);
  }

  isOpposite(coord){
    return (this.x === coord.y) && (this.y === coord.x);
  }

  pos(){
    return [this.x,this.y];
  }
}

module.exports = Coord;
