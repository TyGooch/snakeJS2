const SnakeView = require('./snakeView.js');

$( () => {
  let el = $('.board');
  let view = new SnakeView(el);
});
