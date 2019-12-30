var chessboard,
  game = new Chess();

var onDragStart = function(source, piece, position, orientation) {};

var onDrop = function(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: "q"
  });

  if (move === null) {
    return "snapback";
  }

  window.setTimeout(250);
};

var onMouseoutSquare = function() {};

var onMouseoverSquare = function() {};

var onSnapEnd = function() {};

var cfg = {
  draggable: true,
  position: "start",
  pieceTheme: "libraries/chessboard.js/img/chesspieces/wikipedia/{piece}.png",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
};
board = ChessBoard("chessboard", cfg);
