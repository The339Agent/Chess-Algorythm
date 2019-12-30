/**
 * Author: Nicolai Frigaard,
 * Refrenceses:
 * - https://en.wikipedia.org/wiki/Minimax          // Minimax algorythm refrence
 * - https://github.com/lhartikk/simple-chess-ai/   // Chess.js + Chessboard.js refrence
 * - https://github.com/jhlywa/chess.js/            // Chess.js download page / docs
 * - https://chessboardjs.com/docs                  // Chessboard.js docs
 */

var chessboard,
  game = new Chess();
var botIsWhite = false;
var botIsBoth = false;

/* Algorythms */

// Random move "algorythm"

var randomMove = function(isWhite) {
  let moves = game.moves();
  return moves[Math.floor(Math.random() * moves.length)];
};

// Minimax move algorythm

// Not optimized Minimax
var minimaxMove = function(isWhite) {
  console.log("Starting Minimax move search.");
  let move = minimax(game, depth, isWhite, true);
  console.log(
    "Move search done. Optimal move: " +
      move.move +
      ". Expected result: " +
      move.value
  );
  return move.move;
};

var minimax = function(board, depth, isWhite, topLevel = false) {
  if (depth === 0) {
    return { value: getBoardValue(board), move: null };
  }

  if (isWhite) {
    // If white, we want the highest possible end value
    let value = -Infinity;
    let bestMove = null;

    // Loop over all possible moves
    for (let i = 0; i < board.moves().length; i++) {
      // Get move
      let move = board.moves()[i];

      // Do move on game clone
      let boardclone = new Chess();
      boardclone.load(board.fen());
      boardclone.move(move);

      // Check if move is better than currently best move
      let moveMiniMax = minimax(boardclone, depth - 1, !isWhite);
      if (value < moveMiniMax.value) {
        // Set move as best move
        if (move !== null && topLevel) {
          console.log(
            "New best move for maximal score. Move: " +
              moveMiniMax.move +
              ". Expected result: (" +
              value +
              ") " +
              moveMiniMax.value
          );
        }
        value = moveMiniMax.value;
        bestMove = move;
      }

      if (topLevel) {
        console.log(
          "Search progress: " +
            Math.floor(((i + 1) / board.moves().length) * 100) +
            "%"
        );
      }
    }

    return { value: value, move: bestMove };
  } else {
    // If black, we want the lowest possible end value
    let value = Infinity;
    let bestMove = null;

    // Loop over all possible moves
    for (let i = 0; i < board.moves().length; i++) {
      // Get move
      let move = board.moves()[i];

      // Do move on game clone
      let boardclone = new Chess();
      boardclone.load(board.fen());
      boardclone.move(move);

      // Check if move is better than currently best move
      let moveMiniMax = minimax(boardclone, depth - 1, !isWhite);
      if (value > moveMiniMax.value) {
        // Set move as best move
        if (move !== null && topLevel) {
          console.log(
            "New best move for minimal score. Move: " +
              moveMiniMax.move +
              ". Expected result: (" +
              value +
              ") " +
              moveMiniMax.value
          );
        }
        value = moveMiniMax.value;
        bestMove = move;
      }

      if (topLevel) {
        console.log(
          "Search progress: " +
            Math.floor(((i + 1) / board.moves().length) * 100) +
            "%"
        );
      }
    }

    return { value: value, move: bestMove };
  }
};

// Alpha-Beta prunning (Optimized minimax algorythm)
var alphaBetaPrunningMove = function(isWhite) {
  // Automaticly add as many depth levels as possible
  depth = 2;
  if (game.moves().length < 30) depth = 3;
  if (game.moves().length < 3) depth = 4;

  console.log(
    "Starting alpha-beta prunning search with depth of " +
      depth +
      ". " +
      game.moves().length +
      " possible initial moves."
  );

  let move = alphaBetaPrunning(game, depth, -Infinity, Infinity, isWhite, true);
  console.log(
    "Alpha-beta prunning search done. Optimal move: " +
      move.move +
      ". Expected result: " +
      move.value
  );
  return move.move;
};

var alphaBetaPrunning = function(
  board,
  depth,
  alpha,
  beta,
  isWhite,
  topLevel = false
) {
  if (depth === 0) return { value: getBoardValue(board), move: null };

  if (isWhite) {
    // If the bot is white, it wants to get the move with the highest value
    let value = -Infinity;
    let bestMove = null;

    for (let i = 0; i < board.moves().length; i++) {
      // Get move
      let move = board.moves()[i];

      // Do the move
      board.move(move);

      // Get value of tile
      let moveAlphaBeta = alphaBetaPrunning(
        board,
        depth - 1,
        alpha,
        beta,
        !isWhite
      );

      // Undo the move
      board.undo();

      // Check if move is better than currently best move
      if (value < moveAlphaBeta.value) {
        // Set move as best move
        if (move !== null && topLevel) {
          console.log(
            "New best move for maximal score. Move: " +
              moveAlphaBeta.move +
              ". Expected result: (" +
              value +
              ") " +
              moveAlphaBeta.value
          );
        }
        value = moveAlphaBeta.value;
        bestMove = move;
      }

      // Update alpha
      alpha = Math.max(alpha, value);

      // Check for beta prunning
      if (alpha > beta) {
        // Perform beta prunning
        if (topLevel) {
          console.log("Performing beta prunning.");
        }
        break;
      }

      // Print progress
      if (topLevel) {
        console.log(
          "Search progress: " +
            Math.floor(((i + 1) / board.moves().length) * 100) +
            "%"
        );
      }
    }

    return { value: value, move: bestMove };
  } else {
    // If the bot is black, it wants to get the move with the lowest value
    let value = Infinity;
    let bestMove = null;

    for (let i = 0; i < board.moves().length; i++) {
      // Get move
      let move = board.moves()[i];

      // Do the move
      board.move(move);

      // Get value of tile
      let moveAlphaBeta = alphaBetaPrunning(
        board,
        depth - 1,
        alpha,
        beta,
        !isWhite
      );

      // Undo the move
      board.undo();

      // Check if move is better than currently best move
      if (value > moveAlphaBeta.value) {
        // Set move as best move
        if (move !== null && topLevel) {
          console.log(
            "New best move for minimal score. Move: " +
              moveAlphaBeta.move +
              ". Expected result: (" +
              value +
              ") " +
              moveAlphaBeta.value
          );
        }
        value = moveAlphaBeta.value;
        bestMove = move;
      }

      // Update beta
      beta = Math.min(beta, value);

      // Check for alpha prunning
      if (alpha > beta) {
        // Perform alpha prunning
        if (topLevel) {
          console.log("Performing alpha prunning.");
        }
        break;
      }

      // Print progress
      if (topLevel) {
        console.log(
          "Search progress: " +
            Math.floor(((i + 1) / board.moves().length) * 100) +
            "%"
        );
      }
    }

    return { value: value, move: bestMove };
  }
};

var getBoardValue = function(gameboard) {
  var totalBoardValue = 0;

  let boardWidth = 8;
  let boardHeight = 8;
  for (var column = 0; column < boardWidth; column++) {
    for (var row = 0; row < boardHeight; row++) {
      totalBoardValue += getValueOfPiece(
        gameboard.get(decToGameCoords(column, row)),
        {
          col: column,
          row: row
        }
      );
    }
  }

  return totalBoardValue;
};

var decToGameCoords = function(column, row) {
  // Return null for invalid coordinates
  if (column < 0 || column > 7) return null;
  if (row < 0 || row > 7) return null;

  // Switch row to the corresponding letter
  var decToStr = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h"
  };

  return decToStr[row] + (column + 1);
};

var getValueOfPiece = function(piece, piecePos) {
  if (piece === null) return 0; // Value is not worth anything if it does not exist

  let pieceValue;
  let isWhite = piece.color === "w";
  switch (piece.type) {
    case "p":
      // Pawn
      pieceValue =
        10 +
        (isWhite
          ? pawnEvalWhite[piecePos.col][piecePos.row]
          : pawnEvalBlack[piecePos.col][piecePos.row]);
      break;
    case "r":
      // Rook
      pieceValue =
        50 +
        (isWhite
          ? rookEvalWhite[piecePos.col][piecePos.row]
          : rookEvalBlack[piecePos.col][piecePos.row]);
      break;
    case "n":
      // Knight
      pieceValue = 30 + knightEval[piecePos.col][piecePos.row];
      break;
    case "b":
      // Bishop
      pieceValue =
        30 +
        (isWhite
          ? bishopEvalWhite[piecePos.col][piecePos.row]
          : bishopEvalBlack[piecePos.col][piecePos.row]);
      break;
    case "k":
      // King
      pieceValue =
        1000 +
        (isWhite
          ? kingEvalWhite[piecePos.col][piecePos.row]
          : kingEvalBlack[piecePos.col][piecePos.row]);
      break;
    case "q":
      // Queen
      pieceValue = 100 + evalQueen[piecePos.col][piecePos.row];
      break;
    default:
      throw "Piece type of " + piece.type + " not recogniced.";
  }

  return isWhite ? pieceValue : -pieceValue;
};

/* Move generation code */

// Set the algorythm to use to select the best move
var moveSelectorAlgorythm = alphaBetaPrunningMove;

var makeChessMove = function() {
  // Check if the bot is in checkmate
  if (!game.game_over()) {
    // Make a random move
    let startTime = Date.now();
    game.move(moveSelectorAlgorythm(botIsWhite));
    let timeElapsed = Math.fround((Date.now() - startTime) / 1000).toFixed(3);
    console.log(
      "Move algorytm has found a move in " + timeElapsed + "seconds."
    );

    // Update the Chessboard.js board
    chessboard.position(game.fen(), true);

    // Queue a new bot move
    if (botIsBoth) {
      botIsWhite = !botIsWhite;
      window.setTimeout(makeChessMove, 250);
    }
  } else {
    logGameEnd();
  }
};

var logGameEnd = function(whiteTurn) {
  if (game.game_over()) {
    if (game.in_stalemate()) {
      alert("Game over! Stalemate! It's a draw!");
    } else if (game.in_draw()) {
      alert("Game over! Game ended as draw due to max 50-move rule.");
    } else if (game.insufficient_material()) {
      alert("Game over! Not enough pices for game end.");
    } else {
      alert("Game over! " + (!whiteTurn ? "White" : "Black") + " wins!");
    }
  }
};

/* Chessboard.js + Chess.js linking */

var onDragStart = function(source, piece, position, orientation) {
  // Allow user to move pice if the following conditions are not true
  if (
    game.game_over() || // The game is over
    (piece.search(/^b/) !== -1) == !botIsWhite || // The piece is not the user color
    botIsBoth
  ) {
    logGameEnd();
    return false;
  }
};

var onDrop = function(source, target) {
  // Update the Chess.js game instance with the made move
  var move = game.move({
    from: source,
    to: target,
    promotion: "q"
  });

  // Make sure that a move has been done
  if (move === null) {
    return "snapback";
  }

  // Wait a quarter of a second before making a AI move
  window.setTimeout(makeChessMove, 250);
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
chessboard = ChessBoard("chessboard", cfg);

if (botIsBoth) botIsWhite = true;
if (botIsWhite || botIsBoth) {
  makeChessMove();
}
