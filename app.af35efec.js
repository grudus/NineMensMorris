// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"app/game/Player.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Player;

(function (Player) {
  Player[Player["PLAYER_1"] = 0] = "PLAYER_1";
  Player[Player["PLAYER_2"] = 1] = "PLAYER_2";
  Player[Player["NO_PLAYER"] = 2] = "NO_PLAYER";
})(Player = exports.Player || (exports.Player = {}));

exports.nextPlayer = function (player) {
  return player === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;
};
},{}],"app/game/Coordinate.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var A_CODE = 'a'.charCodeAt(0);

function point(row, col) {
  return {
    row: row,
    col: col,
    colIndex: col.charCodeAt(0) - A_CODE
  };
}

exports.point = point;

function coordinatesFromIndexes(row, col) {
  return {
    row: row + 1,
    col: String.fromCharCode(A_CODE + col),
    colIndex: col
  };
}

exports.coordinatesFromIndexes = coordinatesFromIndexes;

function areCoordsEquals(coord1, coord2) {
  return coord1.row == coord2.row && coord1.col == coord2.col;
}

exports.areCoordsEquals = areCoordsEquals;
},{}],"app/game/InitialGameHelper.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Player_1 = require("./Player");

var NineMensMorrisGame_1 = require("./NineMensMorrisGame");

var Coordinate_1 = require("./Coordinate");

exports.initHandQueue = function () {
  var queue = [];
  var players = [Player_1.Player.PLAYER_1, Player_1.Player.PLAYER_2];

  for (var i = 0; i < NineMensMorrisGame_1.NineMensMorrisGame.NUMBER_OF_POINTS * 2; i++) {
    queue.push(players[i % players.length]);
  }

  return queue;
};

exports.initBoard = function () {
  var columns = [['a', 'd', 'g'], ['b', 'd', 'f'], ['c', 'd', 'e'], ['a', 'b', 'c', 'e', 'f', 'g'], ['c', 'd', 'e'], ['b', 'd', 'f'], ['a', 'd', 'g']];
  var board = [];

  var _loop = function _loop(i) {
    columns[i - 1].forEach(function (col) {
      board.push({
        player: Player_1.Player.NO_PLAYER,
        coordinate: Coordinate_1.point(i, col)
      });
    });
  };

  for (var i = 1; i <= NineMensMorrisGame_1.NineMensMorrisGame.BOARD_SIZE; i++) {
    _loop(i);
  }

  return board;
};
},{"./Player":"app/game/Player.ts","./NineMensMorrisGame":"app/game/NineMensMorrisGame.ts","./Coordinate":"app/game/Coordinate.ts"}],"app/game/GameState.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GameState;

(function (GameState) {
  GameState[GameState["INITIAL"] = 0] = "INITIAL";
  GameState[GameState["SELECT_POINT_TO_MOVE"] = 1] = "SELECT_POINT_TO_MOVE";
  GameState[GameState["MOVE_SELECTED_POINT"] = 2] = "MOVE_SELECTED_POINT";
  GameState[GameState["MILL"] = 3] = "MILL";
  GameState[GameState["GAME_OVER"] = 4] = "GAME_OVER";
})(GameState = exports.GameState || (exports.GameState = {}));
},{}],"app/game/GameMoveResult.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GameMoveResult;

(function (GameMoveResult) {
  GameMoveResult[GameMoveResult["SUCCESSFUL_MOVE"] = 0] = "SUCCESSFUL_MOVE";
  GameMoveResult[GameMoveResult["FIRST_MOVE_PART"] = 1] = "FIRST_MOVE_PART";
  GameMoveResult[GameMoveResult["RESTART_MOVE"] = 2] = "RESTART_MOVE";
  GameMoveResult[GameMoveResult["CANNOT_MOVE"] = 3] = "CANNOT_MOVE";
  GameMoveResult[GameMoveResult["MILL"] = 4] = "MILL";
  GameMoveResult[GameMoveResult["OPPONENT_DESTROYED"] = 5] = "OPPONENT_DESTROYED";
  GameMoveResult[GameMoveResult["INVALID_MILL_MOVE"] = 6] = "INVALID_MILL_MOVE";
})(GameMoveResult = exports.GameMoveResult || (exports.GameMoveResult = {}));
},{}],"app/game/GameMoveEngine.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Coordinate_1 = require("./Coordinate");

var GameState_1 = require("./GameState");

var GameMoveResult_1 = require("./GameMoveResult");

var GameMoveEngine =
/*#__PURE__*/
function () {
  function GameMoveEngine(game) {
    _classCallCheck(this, GameMoveEngine);

    this.game = game;
    this.currentMove = null;
  }

  _createClass(GameMoveEngine, [{
    key: "makeMove",
    value: function makeMove(point) {
      if (this.game.isGameOver()) {
        return;
      }

      if (this.game.isMill()) {
        return this.makeMillMove(point);
      } else if (this.game.currentState == GameState_1.GameState.INITIAL) {
        return this.makeInitialMove(point);
      } else {
        return this.makeMoveInNormalPhase(point);
      }
    }
  }, {
    key: "makeInitialMove",
    value: function makeInitialMove(point) {
      if (!this.game.isNoPlayer(point)) {
        return GameMoveResult_1.GameMoveResult.CANNOT_MOVE;
      }

      this.game.addInitialPoint(point);

      if (this.game.detectMill(point)) {
        return GameMoveResult_1.GameMoveResult.MILL;
      }

      this.game.setNextPlayerMove();
      return GameMoveResult_1.GameMoveResult.SUCCESSFUL_MOVE;
    }
  }, {
    key: "makeMoveInNormalPhase",
    value: function makeMoveInNormalPhase(point) {
      if (!this.currentMove) {
        return this.makeFirstMovePart(point);
      }

      return this.makeFinalMovePart(point);
    }
  }, {
    key: "makeFirstMovePart",
    value: function makeFirstMovePart(point) {
      var position = this.game.boardService.position(point);

      if (!position || position.player !== this.game.currentPlayer) {
        return GameMoveResult_1.GameMoveResult.CANNOT_MOVE;
      }

      this.currentMove = {
        point: point,
        neighbours: this.game.possibleMoves(point),
        player: this.game.currentPlayer
      };
      this.game.setState(GameState_1.GameState.MOVE_SELECTED_POINT);
      return GameMoveResult_1.GameMoveResult.FIRST_MOVE_PART;
    }
  }, {
    key: "makeFinalMovePart",
    value: function makeFinalMovePart(point) {
      var pointToMove = this.currentMove.neighbours.find(function (p) {
        return Coordinate_1.areCoordsEquals(p, point);
      });

      if (!pointToMove) {
        this.currentMove = null;
        this.game.setState(GameState_1.GameState.SELECT_POINT_TO_MOVE);
        return GameMoveResult_1.GameMoveResult.RESTART_MOVE;
      }

      this.game.movePoint(this.currentMove.point, point);
      this.currentMove = null;

      if (this.game.detectMill(point)) {
        return GameMoveResult_1.GameMoveResult.MILL;
      }

      this.game.setNextPlayerMove();
      return GameMoveResult_1.GameMoveResult.SUCCESSFUL_MOVE;
    }
  }, {
    key: "makeMillMove",
    value: function makeMillMove(point) {
      if (this.game.isOpponentPoint(point)) {
        this.game.removePoint(point);
        this.game.clearMill();
        this.game.setNextPlayerMove();
        return GameMoveResult_1.GameMoveResult.OPPONENT_DESTROYED;
      }

      return GameMoveResult_1.GameMoveResult.INVALID_MILL_MOVE;
    }
  }]);

  return GameMoveEngine;
}();

exports.GameMoveEngine = GameMoveEngine;
},{"./Coordinate":"app/game/Coordinate.ts","./GameState":"app/game/GameState.ts","./GameMoveResult":"app/game/GameMoveResult.ts"}],"app/game/NineMensMorrisGame.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Player_1 = require("./Player");

var Coordinate_1 = require("./Coordinate");

var InitialGameHelper = __importStar(require("./InitialGameHelper"));

var GameState_1 = require("./GameState");

var GameMoveEngine_1 = require("./GameMoveEngine");

var POINTS_TO_ENABLE_FLYING = 3;
var POINTS_TO_GAME_OVER = 2;

var NineMensMorrisGame =
/*#__PURE__*/
function () {
  function NineMensMorrisGame(movesHistory, boardService) {
    var _this$playerPoints;

    _classCallCheck(this, NineMensMorrisGame);

    this.movesHistory = movesHistory;
    this.boardService = boardService;
    this.currentPlayerMove = Player_1.Player.PLAYER_1;
    this.millPlayer = null;
    this.gameState = GameState_1.GameState.INITIAL;
    this.prevState = GameState_1.GameState.INITIAL;
    this.playerPoints = (_this$playerPoints = {}, _defineProperty(_this$playerPoints, Player_1.Player.PLAYER_1, 0), _defineProperty(_this$playerPoints, Player_1.Player.PLAYER_2, 0), _this$playerPoints);
    this.cannotGoCoordinates = [{
      from: {
        row: 4,
        col: 'c'
      },
      to: {
        row: 4,
        col: 'e'
      }
    }, {
      from: {
        row: 3,
        col: 'd'
      },
      to: {
        row: 5,
        col: 'd'
      }
    }];
    this.gameMoveEngine = new GameMoveEngine_1.GameMoveEngine(this);
    this.initialHandQueue = InitialGameHelper.initHandQueue();
  }

  _createClass(NineMensMorrisGame, [{
    key: "addInitialPoint",
    value: function addInitialPoint(coordinate) {
      if (this.initialHandQueue.length) {
        var position = this.boardService.position(coordinate);
        position.player = position.player === Player_1.Player.NO_PLAYER ? this.currentPlayerMove : position.player;
        this.playerPoints[this.currentPlayer]++;
        this.movesHistory.addInitialMove(coordinate, this.currentPlayer);
      } else throw Error('Initial hand queue is empty!');
    }
  }, {
    key: "setNextPlayerMove",
    value: function setNextPlayerMove() {
      if (this.initialHandQueue.length) {
        this.currentPlayerMove = this.initialHandQueue.pop();
        this.setState(this.initialHandQueue.length ? GameState_1.GameState.INITIAL : GameState_1.GameState.SELECT_POINT_TO_MOVE);
      } else {
        this.setState(GameState_1.GameState.SELECT_POINT_TO_MOVE);
        this.currentPlayerMove = Player_1.nextPlayer(this.currentPlayerMove);
      }
    }
  }, {
    key: "tryToMakeMove",
    value: function tryToMakeMove(coordinate) {
      return this.gameMoveEngine.makeMove(coordinate);
    }
  }, {
    key: "movePoint",
    value: function movePoint(from, to) {
      var fromPosition = this.boardService.position(from);
      var toPosition = this.boardService.position(to);

      if (toPosition.player === Player_1.Player.NO_PLAYER) {
        toPosition.player = fromPosition.player;
        fromPosition.player = Player_1.Player.NO_PLAYER;
        this.movesHistory.addMove({
          from: from,
          to: to,
          player: this.currentPlayer
        });
      }
    }
  }, {
    key: "detectMill",
    value: function detectMill(changedCoordinate) {
      var _this$boardService$fi = this.boardService.findColsAndRowsInLine(changedCoordinate),
          colsInLine = _this$boardService$fi.colsInLine,
          rowsInLine = _this$boardService$fi.rowsInLine;

      var checkMill = function checkMill(inLineArray, coordinate) {
        var inLineIndex = inLineArray.findIndex(function (p) {
          return Coordinate_1.areCoordsEquals(p.coordinate, coordinate);
        });

        for (var i = 0; i < inLineArray.length; i += 3) {
          if (inLineIndex >= i && inLineIndex < i + 3) {
            var currPlayer = inLineArray[inLineIndex].player;
            var millCount = 0;

            for (var j = 0; j < 3; j++) {
              if (currPlayer == inLineArray[i + j].player) millCount++;
            }

            if (millCount == 3) return true;
          }
        }

        return false;
      };

      var isMill = checkMill(colsInLine, changedCoordinate) || checkMill(rowsInLine, changedCoordinate);
      this.millPlayer = isMill ? this.currentPlayer : null;

      if (isMill) {
        this.setState(GameState_1.GameState.MILL);
      }

      return isMill;
    }
  }, {
    key: "isMill",
    value: function isMill() {
      return this.millPlayer !== null;
    }
  }, {
    key: "forEachBoardPosition",
    value: function forEachBoardPosition(func) {
      this.boardService.forEach(func);
    }
  }, {
    key: "isGameOver",
    value: function isGameOver() {
      return this.gameState === GameState_1.GameState.GAME_OVER;
    }
  }, {
    key: "isNoPlayer",
    value: function isNoPlayer(coordinate) {
      var triedPosition = this.boardService.position(coordinate);
      return triedPosition && triedPosition.player == Player_1.Player.NO_PLAYER;
    }
  }, {
    key: "isOpponentPoint",
    value: function isOpponentPoint(point) {
      var position = this.boardService.position(point);
      return this.isOpponentPosition(position);
    }
  }, {
    key: "isOpponentPosition",
    value: function isOpponentPosition(position) {
      return position && position.player != Player_1.Player.NO_PLAYER && position.player != this.currentPlayer;
    }
  }, {
    key: "possibleMoves",
    value: function possibleMoves(coordinate) {
      var _this = this;

      var previousCoordinate = this.movesHistory.getPreviousCoordinate(this.currentPlayer, coordinate);
      return this.findNeighbours(coordinate).filter(function (p) {
        return _this.isNoPlayer(p);
      }).filter(function (p) {
        return !(previousCoordinate && Coordinate_1.areCoordsEquals(previousCoordinate, p));
      });
    }
  }, {
    key: "allOpponentPositions",
    value: function allOpponentPositions() {
      var _this2 = this;

      return this.boardService.filter(function (position) {
        return _this2.isOpponentPosition(position);
      });
    }
  }, {
    key: "findNeighbours",
    value: function findNeighbours(coordinate) {
      if (this.playerPoints[this.currentPlayer] === POINTS_TO_ENABLE_FLYING) {
        return this.boardService.findPlayerCoordinates(Player_1.Player.NO_PLAYER);
      }

      var _this$boardService$fi2 = this.boardService.findColsAndRowsInLine(coordinate),
          colsInLine = _this$boardService$fi2.colsInLine,
          rowsInLine = _this$boardService$fi2.rowsInLine;

      var neighbours = this.findNearestPoints(coordinate, colsInLine, rowsInLine);
      this.filterNeighboursImpossibleToGo(coordinate, neighbours);
      return neighbours;
    }
  }, {
    key: "setState",
    value: function setState(state) {
      if (this.isGameOver()) return;
      this.prevState = this.gameState;
      this.gameState = state;
    }
  }, {
    key: "findNearestPoints",
    value: function findNearestPoints(coordinate, colsInLine, rowsInLine) {
      var sameColumnsIndex = colsInLine.findIndex(function (p) {
        return Coordinate_1.areCoordsEquals(p.coordinate, coordinate);
      });
      var sameRowsIndex = rowsInLine.findIndex(function (p) {
        return Coordinate_1.areCoordsEquals(p.coordinate, coordinate);
      });
      return [colsInLine[sameColumnsIndex + 1], colsInLine[sameColumnsIndex - 1], rowsInLine[sameRowsIndex + 1], rowsInLine[sameRowsIndex - 1]].filter(function (x) {
        return x;
      }).map(function (p) {
        return p.coordinate;
      });
    }
  }, {
    key: "filterNeighboursImpossibleToGo",
    value: function filterNeighboursImpossibleToGo(coordinate, neighbours) {
      this.cannotGoCoordinates.forEach(function (_ref) {
        var from = _ref.from,
            to = _ref.to;

        if (Coordinate_1.areCoordsEquals(coordinate, from)) {
          var i = neighbours.findIndex(function (p) {
            return Coordinate_1.areCoordsEquals(p, to);
          });
          neighbours.splice(i, 1);
        } else if (Coordinate_1.areCoordsEquals(coordinate, to)) {
          var _i = neighbours.findIndex(function (p) {
            return Coordinate_1.areCoordsEquals(p, from);
          });

          neighbours.splice(_i, 1);
        }
      });
    }
  }, {
    key: "findSelectableCoordinates",
    value: function findSelectableCoordinates(coordinate) {
      switch (this.currentState) {
        case GameState_1.GameState.INITIAL:
          return this.boardService.findPlayerCoordinates(Player_1.Player.NO_PLAYER);

        case GameState_1.GameState.SELECT_POINT_TO_MOVE:
          return this.boardService.findPlayerCoordinates(this.currentPlayer);

        case GameState_1.GameState.MILL:
          return this.allOpponentPositions().map(function (p) {
            return p.coordinate;
          });

        case GameState_1.GameState.MOVE_SELECTED_POINT:
          return [].concat(_toConsumableArray(this.possibleMoves(coordinate)), _toConsumableArray(this.boardService.findPlayerCoordinates(this.currentPlayer)));

        default:
          return [];
      }
    }
  }, {
    key: "removePoint",
    value: function removePoint(point) {
      var boardPosition = this.boardService.position(point);
      this.playerPoints[boardPosition.player]--;
      boardPosition.player = Player_1.Player.NO_PLAYER;

      if (Object.values(this.playerPoints).some(function (points) {
        return points === POINTS_TO_GAME_OVER;
      })) {
        this.setState(GameState_1.GameState.GAME_OVER);
      }
    }
  }, {
    key: "clearMill",
    value: function clearMill() {
      this.setState(this.prevState);
      this.millPlayer = null;
    }
  }, {
    key: "getMovesHistory",
    value: function getMovesHistory() {
      return this.movesHistory.getHistory();
    }
  }, {
    key: "currentState",
    get: function get() {
      return this.gameState;
    }
  }, {
    key: "currentPlayer",
    get: function get() {
      return this.currentPlayerMove;
    }
  }]);

  return NineMensMorrisGame;
}();

NineMensMorrisGame.NUMBER_OF_POINTS = 9;
NineMensMorrisGame.BOARD_SIZE = 7;
exports.NineMensMorrisGame = NineMensMorrisGame;
},{"./Player":"app/game/Player.ts","./Coordinate":"app/game/Coordinate.ts","./InitialGameHelper":"app/game/InitialGameHelper.ts","./GameState":"app/game/GameState.ts","./GameMoveEngine":"app/game/GameMoveEngine.ts"}],"app/paint/GameCanvasContext.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Coordinate_1 = require("../game/Coordinate");

var GameCanvasContext =
/*#__PURE__*/
function () {
  function GameCanvasContext(ctx, squareSize) {
    _classCallCheck(this, GameCanvasContext);

    this.ctx = ctx;
    this.squareSize = squareSize;
  }

  _createClass(GameCanvasContext, [{
    key: "setColor",
    value: function setColor(color) {
      this.ctx.strokeStyle = color;
      this.ctx.fillStyle = color;
    }
  }, {
    key: "moveTo",
    value: function moveTo(coordinate) {
      this.ctx.moveTo(this.squareSize * coordinate.colIndex + this.squareSize / 2, this.squareSize * (coordinate.row - 1) + this.squareSize / 2);
    }
  }, {
    key: "lineTo",
    value: function lineTo(coordinate) {
      this.ctx.lineTo(this.squareSize * coordinate.colIndex + this.squareSize / 2, this.squareSize * (coordinate.row - 1) + this.squareSize / 2);
    }
  }, {
    key: "strokeRect",
    value: function strokeRect(start, end) {
      var x = this.squareSize * start.colIndex + this.squareSize / 2;
      var y = this.squareSize * (start.row - 1) + this.squareSize / 2;
      this.ctx.strokeRect(x, y, this.squareSize * end.colIndex - x + this.squareSize / 2, this.squareSize * (end.row - 1) - y + this.squareSize / 2);
    }
  }, {
    key: "stroke",
    value: function stroke() {
      this.ctx.stroke();
    }
  }, {
    key: "fillCircle",
    value: function fillCircle(coordinate, radius) {
      this.drawCircle(coordinate, radius);
      this.ctx.fill();
    }
  }, {
    key: "strokeCircle",
    value: function strokeCircle(coordinate, radius) {
      this.drawCircle(coordinate, radius);
      this.ctx.stroke();
    }
  }, {
    key: "clearAll",
    value: function clearAll() {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.beginPath();
    }
  }, {
    key: "getCoordinate",
    value: function getCoordinate(pos) {
      var row = Math.floor(pos.y / this.squareSize);
      var col = Math.floor(pos.x / this.squareSize);
      return Coordinate_1.coordinatesFromIndexes(row, col);
    }
  }, {
    key: "drawCircle",
    value: function drawCircle(coordinate, radius) {
      var xPosition = coordinate.colIndex * this.squareSize + this.squareSize / 2;
      var yPosition = (coordinate.row - 1) * this.squareSize + this.squareSize / 2;
      this.ctx.beginPath();
      this.ctx.arc(xPosition, yPosition, radius, 0, 2 * Math.PI);
    }
  }]);

  return GameCanvasContext;
}();

exports.GameCanvasContext = GameCanvasContext;
},{"../game/Coordinate":"app/game/Coordinate.ts"}],"app/paint/PaintablePlayer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Player_1 = require("../game/Player");

var players = new Map();
players.set(Player_1.Player.PLAYER_1, {
  color: 'red',
  radius: 10,
  label: 'Player 1'
});
players.set(Player_1.Player.PLAYER_2, {
  color: 'blue',
  radius: 10,
  label: 'Player 2'
});
players.set(Player_1.Player.NO_PLAYER, {
  color: 'black',
  radius: 5,
  label: 'No player'
});

exports.getPaintablePlayer = function (player) {
  return players.get(player);
};
},{"../game/Player":"app/game/Player.ts"}],"app/paint/GameDrawer.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var NineMensMorrisGame_1 = require("../game/NineMensMorrisGame");

var Coordinate_1 = require("../game/Coordinate");

var GameCanvasContext_1 = require("./GameCanvasContext");

var Player_1 = require("../game/Player");

var GameMoveResult_1 = require("../game/GameMoveResult");

var PaintablePlayer_1 = require("./PaintablePlayer");

var GameDrawer =
/*#__PURE__*/
function () {
  function GameDrawer(canvas, game, afterUpdate) {
    _classCallCheck(this, GameDrawer);

    this.canvas = canvas;
    this.game = game;
    this.afterUpdate = afterUpdate;
    this.boardColor = '#212121';
    this.fitToContainer(canvas);
    this.addMouseListener(canvas);
    this.squareSize = canvas.width / NineMensMorrisGame_1.NineMensMorrisGame.BOARD_SIZE;
    this.gameCanvas = new GameCanvasContext_1.GameCanvasContext(canvas.getContext('2d'), this.squareSize);
    this.drawInitialCanvas();
    this.selectablePoints = this.game.findSelectableCoordinates();
  }

  _createClass(GameDrawer, [{
    key: "onMouseClick",
    value: function onMouseClick(point) {
      var gameMoveResult = this.game.tryToMakeMove(point);

      switch (gameMoveResult) {
        case GameMoveResult_1.GameMoveResult.SUCCESSFUL_MOVE:
        case GameMoveResult_1.GameMoveResult.OPPONENT_DESTROYED:
          this.resetCanvasAndDrawGame();
          break;

        case GameMoveResult_1.GameMoveResult.FIRST_MOVE_PART:
          this.drawPossibleMoves(point);
          break;

        case GameMoveResult_1.GameMoveResult.RESTART_MOVE:
          this.resetCanvasAndDrawGame();
          this.onMouseClick(point);
          break;

        case GameMoveResult_1.GameMoveResult.MILL:
          this.resetCanvasAndDrawGame();
          this.drawPossibleMillMoves();
          break;

        case GameMoveResult_1.GameMoveResult.CANNOT_MOVE:
          break;
      }

      this.afterUpdate(gameMoveResult);
      this.selectablePoints = this.game.findSelectableCoordinates(point);
    }
  }, {
    key: "fitToContainer",
    value: function fitToContainer(canvas) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, {
    key: "drawInitialCanvas",
    value: function drawInitialCanvas() {
      this.drawLines();
      this.drawDots();
    }
  }, {
    key: "drawDots",
    value: function drawDots() {
      var _this = this;

      this.game.forEachBoardPosition(function (board) {
        var paintable = PaintablePlayer_1.getPaintablePlayer(board.player);

        if (board.player === Player_1.Player.NO_PLAYER) {
          _this.gameCanvas.setColor(_this.boardColor);

          _this.gameCanvas.fillCircle(board.coordinate, paintable.radius);
        } else {
          _this.gameCanvas.setColor(paintable.color);

          _this.gameCanvas.fillCircle(board.coordinate, paintable.radius);
        }
      });
    }
  }, {
    key: "drawPossibleMoves",
    value: function drawPossibleMoves(point) {
      var _this2 = this;

      this.game.possibleMoves(point).forEach(function (point) {
        _this2.gameCanvas.strokeCircle(point, 15);
      });
    }
  }, {
    key: "drawPossibleMillMoves",
    value: function drawPossibleMillMoves() {
      var _this3 = this;

      this.game.allOpponentPositions().forEach(function (position) {
        _this3.gameCanvas.strokeCircle(position.coordinate, 15);
      });
    }
  }, {
    key: "resetCanvasAndDrawGame",
    value: function resetCanvasAndDrawGame() {
      this.gameCanvas.clearAll();
      this.drawInitialCanvas();
    }
  }, {
    key: "drawLines",
    value: function drawLines() {
      this.gameCanvas.setColor(this.boardColor);
      this.gameCanvas.strokeRect(Coordinate_1.point(1, 'a'), Coordinate_1.point(7, 'g'));
      this.gameCanvas.strokeRect(Coordinate_1.point(2, 'b'), Coordinate_1.point(6, 'f'));
      this.gameCanvas.strokeRect(Coordinate_1.point(3, 'c'), Coordinate_1.point(5, 'e'));
      this.gameCanvas.moveTo(Coordinate_1.point(1, 'd'));
      this.gameCanvas.lineTo(Coordinate_1.point(3, 'd'));
      this.gameCanvas.moveTo(Coordinate_1.point(5, 'd'));
      this.gameCanvas.lineTo(Coordinate_1.point(7, 'd'));
      this.gameCanvas.moveTo(Coordinate_1.point(4, 'a'));
      this.gameCanvas.lineTo(Coordinate_1.point(4, 'c'));
      this.gameCanvas.moveTo(Coordinate_1.point(4, 'e'));
      this.gameCanvas.lineTo(Coordinate_1.point(4, 'g'));
      this.gameCanvas.stroke();
    }
  }, {
    key: "addMouseListener",
    value: function addMouseListener(canvas) {
      var _this4 = this;

      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

      canvas.addEventListener('click', function (e) {
        var pos = getMousePos(canvas, e);

        var point = _this4.gameCanvas.getCoordinate(pos);

        _this4.onMouseClick(point);
      });
      canvas.addEventListener('mousemove', function (e) {
        var pos = getMousePos(canvas, e);

        var point = _this4.gameCanvas.getCoordinate(pos);

        var isSelectable = _this4.selectablePoints.some(function (p) {
          return Coordinate_1.areCoordsEquals(p, point);
        });

        canvas.style.cursor = isSelectable ? 'pointer' : 'default';
      });
    }
  }]);

  return GameDrawer;
}();

exports.GameDrawer = GameDrawer;
},{"../game/NineMensMorrisGame":"app/game/NineMensMorrisGame.ts","../game/Coordinate":"app/game/Coordinate.ts","./GameCanvasContext":"app/paint/GameCanvasContext.ts","../game/Player":"app/game/Player.ts","../game/GameMoveResult":"app/game/GameMoveResult.ts","./PaintablePlayer":"app/paint/PaintablePlayer.ts"}],"app/paint/GameInfoWriter.ts":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var PaintablePlayer_1 = require("./PaintablePlayer");

var Player_1 = require("../game/Player");

var GameState_1 = require("../game/GameState");

var GameInfoWriter =
/*#__PURE__*/
function () {
  function GameInfoWriter(game) {
    var _this$playerPoints, _this$gameStateToText;

    _classCallCheck(this, GameInfoWriter);

    this.game = game;
    this.currentPlayerText = document.getElementById('current-player-text');
    this.moveTypeText = document.getElementById('game-state');
    this.playerPoints = (_this$playerPoints = {}, _defineProperty(_this$playerPoints, Player_1.Player.PLAYER_1, document.getElementById('player-1-points')), _defineProperty(_this$playerPoints, Player_1.Player.PLAYER_2, document.getElementById('player-2-points')), _this$playerPoints);
    this.gameStateToText = (_this$gameStateToText = {}, _defineProperty(_this$gameStateToText, GameState_1.GameState.INITIAL, 'Initial'), _defineProperty(_this$gameStateToText, GameState_1.GameState.MOVE_SELECTED_POINT, 'Move coordinate'), _defineProperty(_this$gameStateToText, GameState_1.GameState.SELECT_POINT_TO_MOVE, 'Select coordinate'), _defineProperty(_this$gameStateToText, GameState_1.GameState.MILL, 'Mill'), _defineProperty(_this$gameStateToText, GameState_1.GameState.GAME_OVER, 'The end'), _this$gameStateToText);
  }

  _createClass(GameInfoWriter, [{
    key: "update",
    value: function update(gameMoveResult) {
      this.updateCurrentPlayerText();
      this.updateGameState();
      this.updateHistoryMoves();
      this.updatePoints();
    }
  }, {
    key: "updateCurrentPlayerText",
    value: function updateCurrentPlayerText() {
      var paintablePlayer = PaintablePlayer_1.getPaintablePlayer(this.game.currentPlayer);
      this.currentPlayerText.innerText = paintablePlayer.label;
      this.currentPlayerText.style.color = paintablePlayer.color;
    }
  }, {
    key: "updateGameState",
    value: function updateGameState() {
      this.moveTypeText.innerText = this.gameStateToText[this.game.currentState] || 'Unknown state';
    }
  }, {
    key: "updateHistoryMoves",
    value: function updateHistoryMoves() {
      console.log(this.game.getMovesHistory());
    }
  }, {
    key: "updatePoints",
    value: function updatePoints() {
      var _this = this;

      Object.entries(this.game.playerPoints).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            player = _ref2[0],
            points = _ref2[1];

        _this.playerPoints[player].innerText = points + '';
      });
    }
  }]);

  return GameInfoWriter;
}();

exports.GameInfoWriter = GameInfoWriter;
},{"./PaintablePlayer":"app/paint/PaintablePlayer.ts","../game/Player":"app/game/Player.ts","../game/GameState":"app/game/GameState.ts"}],"app/game/MovesHistory.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Coordinate_1 = require("./Coordinate");

var MovesHistory =
/*#__PURE__*/
function () {
  function MovesHistory() {
    _classCallCheck(this, MovesHistory);

    this.history = [];
  }

  _createClass(MovesHistory, [{
    key: "addMove",
    value: function addMove(move) {
      this.history.push(move);
    }
  }, {
    key: "addInitialMove",
    value: function addInitialMove(coordinate, player) {
      this.addMove({
        to: coordinate,
        player: player
      });
    }
  }, {
    key: "getHistory",
    value: function getHistory() {
      return this.history;
    }
  }, {
    key: "getPreviousCoordinate",
    value: function getPreviousCoordinate(player, coordinate) {
      for (var i = this.history.length - 1; i >= 0; i--) {
        if (this.history[i].player === player) return Coordinate_1.areCoordsEquals(this.history[i].to, coordinate) ? this.history[i].from : null;
      }

      return null;
    }
  }]);

  return MovesHistory;
}();

exports.MovesHistory = MovesHistory;
},{"./Coordinate":"app/game/Coordinate.ts"}],"app/game/BoardService.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var InitialGameHelper_1 = require("./InitialGameHelper");

var Coordinate_1 = require("./Coordinate");

var BoardService =
/*#__PURE__*/
function () {
  function BoardService() {
    _classCallCheck(this, BoardService);

    this.board = InitialGameHelper_1.initBoard();
  }

  _createClass(BoardService, [{
    key: "position",
    value: function position(point) {
      return this.board.find(function (p) {
        return Coordinate_1.areCoordsEquals(p.coordinate, point);
      });
    }
  }, {
    key: "filter",
    value: function filter(predicate) {
      return this.board.filter(predicate);
    }
  }, {
    key: "findPlayerCoordinates",
    value: function findPlayerCoordinates(player) {
      return this.filter(function (pos) {
        return pos.player === player;
      }).map(function (p) {
        return p.coordinate;
      });
    }
  }, {
    key: "findColsAndRowsInLine",
    value: function findColsAndRowsInLine(point) {
      return this.board.reduce(function (acc, curr) {
        if (Coordinate_1.areCoordsEquals(curr.coordinate, point)) {
          acc.rowsInLine.push(curr);
          acc.colsInLine.push(curr);
        } else if (curr.coordinate.colIndex === point.colIndex) {
          acc.colsInLine.push(curr);
        } else if (curr.coordinate.row === point.row) {
          acc.rowsInLine.push(curr);
        }

        return acc;
      }, {
        colsInLine: [],
        rowsInLine: []
      });
    }
  }, {
    key: "forEach",
    value: function forEach(func) {
      this.board.forEach(func);
    }
  }]);

  return BoardService;
}();

exports.BoardService = BoardService;
},{"./InitialGameHelper":"app/game/InitialGameHelper.ts","./Coordinate":"app/game/Coordinate.ts"}],"app/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var NineMensMorrisGame_1 = require("./game/NineMensMorrisGame");

var GameDrawer_1 = require("./paint/GameDrawer");

var GameInfoWriter_1 = require("./paint/GameInfoWriter");

var MovesHistory_1 = require("./game/MovesHistory");

var BoardService_1 = require("./game/BoardService");

(function () {
  console.log("HELLO IN THE NINE MEN'S MORRIS GAME");
  var game = new NineMensMorrisGame_1.NineMensMorrisGame(new MovesHistory_1.MovesHistory(), new BoardService_1.BoardService());
  var canvas = document.getElementById('game-canvas');
  var infoWriter = new GameInfoWriter_1.GameInfoWriter(game);
  var drawer = new GameDrawer_1.GameDrawer(canvas, game, function (type) {
    return infoWriter.update(type);
  });
  infoWriter.update();
})();
},{"./game/NineMensMorrisGame":"app/game/NineMensMorrisGame.ts","./paint/GameDrawer":"app/paint/GameDrawer.ts","./paint/GameInfoWriter":"app/paint/GameInfoWriter.ts","./game/MovesHistory":"app/game/MovesHistory.ts","./game/BoardService":"app/game/BoardService.ts"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64275" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app/index.ts"], null)
//# sourceMappingURL=/app.af35efec.js.map