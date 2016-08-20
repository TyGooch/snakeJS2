/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const SnakeView = __webpack_require__(1);

	$( () => {
	  let el = $('.board');
	  let view = new SnakeView(el);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(2);
	const Apple = __webpack_require__(5);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Snake = __webpack_require__(3);

	class Board {
	  constructor(){
	    this.snake = new Snake();
	  }
	}

	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Coord = __webpack_require__(4);

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


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(2);

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


/***/ }
/******/ ]);