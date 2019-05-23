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
  Player["PLAYER_1"] = "PLAYER_1";
  Player["PLAYER_2"] = "PLAYER_2";
  Player["NO_PLAYER"] = "NO_PLAYER";
})(Player = exports.Player || (exports.Player = {}));

exports.nextPlayer = function (player) {
  return player === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;
};
},{}],"app/game/Coordinate.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function coord(row, col) {
  return {
    row: row,
    col: col
  };
}

exports.coord = coord;

function areCoordsEquals(coord1, coord2) {
  return coord1.row == coord2.row && coord1.col == coord2.col;
}

exports.areCoordsEquals = areCoordsEquals;

function hash(point) {
  return (point.row << 10) + point.col;
}

exports.hash = hash;

function fromHash(hash) {
  var col = hash % 1024;
  var row = hash - col >> 10;
  return coord(row, col);
}

exports.fromHash = fromHash;
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
  var columns = [[1, 4, 7], [2, 4, 6], [3, 4, 5], [1, 2, 3, 5, 6, 7], [3, 4, 5], [2, 4, 6], [1, 4, 7]];
  var board = new Map();

  var _loop = function _loop(i) {
    columns[i - 1].forEach(function (col) {
      board.set(Coordinate_1.hash(Coordinate_1.coord(i, col)), Player_1.Player.NO_PLAYER);
    });
  };

  for (var i = 1; i <= NineMensMorrisGame_1.NineMensMorrisGame.BOARD_SIZE; i++) {
    _loop(i);
  }

  return board;
};
},{"./Player":"app/game/Player.ts","./NineMensMorrisGame":"app/game/NineMensMorrisGame.ts","./Coordinate":"app/game/Coordinate.ts"}],"app/game/GameMoveResult.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GameMoveResult;

(function (GameMoveResult) {
  GameMoveResult["SUCCESSFUL_MOVE"] = "SUCCESSFUL_MOVE";
  GameMoveResult["FIRST_MOVE_PART"] = "FIRST_MOVE_PART";
  GameMoveResult["RESTART_MOVE"] = "RESTART_MOVE";
  GameMoveResult["CANNOT_MOVE"] = "CANNOT_MOVE";
  GameMoveResult["MILL"] = "MILL";
  GameMoveResult["OPPONENT_DESTROYED"] = "OPPONENT_DESTROYED";
  GameMoveResult["INVALID_MILL_MOVE"] = "INVALID_MILL_MOVE";
})(GameMoveResult = exports.GameMoveResult || (exports.GameMoveResult = {}));

exports.NEXT_PLAYER_RESULTS = [GameMoveResult.SUCCESSFUL_MOVE, GameMoveResult.OPPONENT_DESTROYED];
},{}],"app/game/GamePhase.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GamePhase;

(function (GamePhase) {
  GamePhase["INITIAL"] = "INITIAL";
  GamePhase["SELECT_POINT_TO_MOVE"] = "SELECT_POINT_TO_MOVE";
  GamePhase["MOVE_SELECTED_POINT"] = "MOVE_SELECTED_POINT";
  GamePhase["MILL"] = "MILL";
  GamePhase["GAME_OVER"] = "GAME_OVER";
})(GamePhase = exports.GamePhase || (exports.GamePhase = {}));
},{}],"app/game/GameMoveEngine.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Coordinate_1 = require("./Coordinate");

var GameMoveResult_1 = require("./GameMoveResult");

var GamePhase_1 = require("./GamePhase");

var GameMoveEngine =
/*#__PURE__*/
function () {
  function GameMoveEngine(game) {
    _classCallCheck(this, GameMoveEngine);

    this.game = game;
  }

  _createClass(GameMoveEngine, [{
    key: "makeMove",
    value: function makeMove(point) {
      if (this.game.isGameOver()) {
        return;
      }

      if (this.game.isMill()) {
        return this.makeMillMove(point);
      } else if (this.game.currentPhase == GamePhase_1.GamePhase.INITIAL) {
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
      if (!this.game.currentMove) {
        return this.makeFirstMovePart(point);
      }

      return this.makeFinalMovePart(point);
    }
  }, {
    key: "makeFirstMovePart",
    value: function makeFirstMovePart(point) {
      var player = this.game.boardService.playerAt(point);

      if (!player || player !== this.game.currentPlayer) {
        return GameMoveResult_1.GameMoveResult.CANNOT_MOVE;
      }

      this.game.currentMove = {
        point: point,
        neighbours: this.game.possibleMoves(point),
        player: this.game.currentPlayer
      };
      this.game.setPhase(GamePhase_1.GamePhase.MOVE_SELECTED_POINT);
      return GameMoveResult_1.GameMoveResult.FIRST_MOVE_PART;
    }
  }, {
    key: "makeFinalMovePart",
    value: function makeFinalMovePart(point) {
      var pointToMove = this.game.currentMove.neighbours.find(function (p) {
        return Coordinate_1.areCoordsEquals(p, point);
      });

      if (!pointToMove) {
        this.game.currentMove = null;
        this.game.setPhase(GamePhase_1.GamePhase.SELECT_POINT_TO_MOVE);
        return GameMoveResult_1.GameMoveResult.RESTART_MOVE;
      }

      this.game.movePoint(this.game.currentMove.point, point);
      this.game.currentMove = null;

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
},{"./Coordinate":"app/game/Coordinate.ts","./GameMoveResult":"app/game/GameMoveResult.ts","./GamePhase":"app/game/GamePhase.ts"}],"app/game/NineMensMorrisGame.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var GameMoveEngine_1 = require("./GameMoveEngine");

var GamePhase_1 = require("./GamePhase");

var POINTS_TO_ENABLE_FLYING = 3;
var POINTS_TO_GAME_OVER = 2;

var NineMensMorrisGame =
/*#__PURE__*/
function () {
  function NineMensMorrisGame(movesHistory, boardService) {
    _classCallCheck(this, NineMensMorrisGame);

    this.movesHistory = movesHistory;
    this.boardService = boardService;
    this.state = this.resetState();
    this.gameMoveEngine = new GameMoveEngine_1.GameMoveEngine(this);
    this.boardService.resetBoard(this.state.board);
  }

  _createClass(NineMensMorrisGame, [{
    key: "resetState",
    value: function resetState(state) {
      var _playerPoints, _destroyedOpponents;

      var newState = state || {
        initialHandQueue: InitialGameHelper.initHandQueue(),
        millPlayer: null,
        gamePhase: GamePhase_1.GamePhase.INITIAL,
        prevPhase: GamePhase_1.GamePhase.INITIAL,
        playerPoints: (_playerPoints = {}, _defineProperty(_playerPoints, Player_1.Player.PLAYER_1, 0), _defineProperty(_playerPoints, Player_1.Player.PLAYER_2, 0), _playerPoints),
        currentPlayerMove: Player_1.Player.PLAYER_1,
        board: InitialGameHelper.initBoard(),
        history: [],
        destroyedOpponents: (_destroyedOpponents = {}, _defineProperty(_destroyedOpponents, Player_1.Player.PLAYER_1, 0), _defineProperty(_destroyedOpponents, Player_1.Player.PLAYER_2, 0), _destroyedOpponents),
        currentMove: null,
        winner: null
      };
      this.state = this.clone(newState);
      this.boardService.resetBoard(this.state.board);
      this.movesHistory.resetHistory(this.state.history);
      return newState;
    }
  }, {
    key: "getState",
    value: function getState() {
      return this.clone(this.state);
    }
  }, {
    key: "clone",
    value: function clone(obj) {
      if (obj === null || _typeof(obj) !== 'object') return obj;

      if (obj instanceof Map) {
        return new Map(obj);
      }

      var temp = obj.constructor(); // changed

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj['isActiveClone'] = null;
          temp[key] = this.clone(obj[key]);
          delete obj['isActiveClone'];
        }
      }

      return temp;
    }
  }, {
    key: "addInitialPoint",
    value: function addInitialPoint(coordinate) {
      if (this.state.initialHandQueue.length) {
        var player = this.boardService.playerAt(coordinate);
        var newPlayer = player === Player_1.Player.NO_PLAYER ? this.state.currentPlayerMove : player;
        this.boardService.setPlayer(coordinate, newPlayer);
        this.state.playerPoints[this.currentPlayer]++;
        this.movesHistory.addInitialMove(coordinate, this.currentPlayer);
      } else throw Error('Initial hand queue is empty!');
    }
  }, {
    key: "setNextPlayerMove",
    value: function setNextPlayerMove() {
      if (this.state.initialHandQueue.length) {
        this.state.currentPlayerMove = this.state.initialHandQueue.pop();
        this.setPhase(this.state.initialHandQueue.length ? GamePhase_1.GamePhase.INITIAL : GamePhase_1.GamePhase.SELECT_POINT_TO_MOVE);
      } else {
        this.setPhase(GamePhase_1.GamePhase.SELECT_POINT_TO_MOVE);
        this.state.currentPlayerMove = Player_1.nextPlayer(this.state.currentPlayerMove);
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
      var fromPlayer = this.boardService.playerAt(from);
      var toPlayer = this.boardService.playerAt(to);

      if (toPlayer === Player_1.Player.NO_PLAYER) {
        this.boardService.setPlayer(to, fromPlayer);
        this.boardService.setPlayer(from, Player_1.Player.NO_PLAYER);
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
      var isMill = this.boardService.isCoordinatePartOfMill(changedCoordinate);
      this.state.millPlayer = isMill ? this.currentPlayer : null;

      if (isMill) {
        this.setPhase(GamePhase_1.GamePhase.MILL);
      }

      return isMill;
    }
  }, {
    key: "isMill",
    value: function isMill() {
      return this.state.millPlayer !== null;
    }
  }, {
    key: "forEachBoardPosition",
    value: function forEachBoardPosition(func) {
      this.boardService.forEach(func);
    }
  }, {
    key: "isGameOver",
    value: function isGameOver() {
      return this.state.gamePhase === GamePhase_1.GamePhase.GAME_OVER;
    }
  }, {
    key: "isNoPlayer",
    value: function isNoPlayer(coordinate) {
      return this.boardService.playerAt(coordinate) === Player_1.Player.NO_PLAYER;
    }
  }, {
    key: "isOpponentPoint",
    value: function isOpponentPoint(point) {
      var player = this.boardService.playerAt(point);
      return this.isOpponentPosition(player);
    }
  }, {
    key: "isOpponentPosition",
    value: function isOpponentPosition(player) {
      return player && player != Player_1.Player.NO_PLAYER && player != this.currentPlayer;
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

      return this.boardService.filterForCoordinates(function (player) {
        return _this2.isOpponentPosition(player);
      });
    }
  }, {
    key: "findNeighbours",
    value: function findNeighbours(coordinate) {
      if (this.state.playerPoints[this.currentPlayer] === POINTS_TO_ENABLE_FLYING) {
        return this.boardService.findPlayerCoordinates(Player_1.Player.NO_PLAYER);
      }

      return this.boardService.findNeighbours(coordinate);
    }
  }, {
    key: "isFlyingActive",
    value: function isFlyingActive() {
      return Object.values(this.state.playerPoints).some(function (points) {
        return points === POINTS_TO_ENABLE_FLYING;
      });
    }
  }, {
    key: "setPhase",
    value: function setPhase(phase) {
      if (this.isGameOver()) return;
      if (phase !== GamePhase_1.GamePhase.MOVE_SELECTED_POINT) this.state.prevPhase = this.state.gamePhase;
      this.state.gamePhase = phase;
    }
  }, {
    key: "findSelectableCoordinates",
    value: function findSelectableCoordinates(coordinate) {
      switch (this.currentPhase) {
        case GamePhase_1.GamePhase.INITIAL:
          return this.boardService.findPlayerCoordinates(Player_1.Player.NO_PLAYER);

        case GamePhase_1.GamePhase.SELECT_POINT_TO_MOVE:
          var selectable = this.boardService.findPlayerCoordinates(this.currentPlayer);

          if (!selectable.length) {
            this.setGameOver(Player_1.nextPlayer(this.currentPlayer));
          }

          return selectable;

        case GamePhase_1.GamePhase.MILL:
          return this.allOpponentPositions();

        case GamePhase_1.GamePhase.MOVE_SELECTED_POINT:
          return this.possibleMoves(coordinate);

        default:
          return [];
      }
    }
  }, {
    key: "removePoint",
    value: function removePoint(point) {
      var playerToRemove = this.boardService.playerAt(point);
      this.state.playerPoints[playerToRemove]--;
      this.state.destroyedOpponents[this.currentPlayer]++;
      this.boardService.setPlayer(point, Player_1.Player.NO_PLAYER);

      if (!this.state.initialHandQueue.length && this.state.playerPoints[playerToRemove] <= POINTS_TO_GAME_OVER) {
        this.setGameOver(this.currentPlayer);
      }
    }
  }, {
    key: "clearMill",
    value: function clearMill() {
      this.setPhase(this.state.prevPhase);
      this.state.millPlayer = null;
    }
  }, {
    key: "setGameOver",
    value: function setGameOver(winner) {
      this.setPhase(GamePhase_1.GamePhase.GAME_OVER);
      this.state.winner = winner;
    }
  }, {
    key: "currentPhase",
    get: function get() {
      return this.state.gamePhase;
    }
  }, {
    key: "currentPlayer",
    get: function get() {
      return this.state.currentPlayerMove;
    }
  }, {
    key: "currentMove",
    set: function set(move) {
      this.state.currentMove = move;
    },
    get: function get() {
      return this.state.currentMove;
    }
  }]);

  return NineMensMorrisGame;
}();

NineMensMorrisGame.NUMBER_OF_POINTS = 9;
NineMensMorrisGame.BOARD_SIZE = 7;
exports.NineMensMorrisGame = NineMensMorrisGame;
},{"./Player":"app/game/Player.ts","./Coordinate":"app/game/Coordinate.ts","./InitialGameHelper":"app/game/InitialGameHelper.ts","./GameMoveEngine":"app/game/GameMoveEngine.ts","./GamePhase":"app/game/GamePhase.ts"}],"app/paint/GameCanvasContext.ts":[function(require,module,exports) {
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
      this.ctx.moveTo(this.squareSize * (coordinate.col - 1) + this.squareSize / 2, this.squareSize * (coordinate.row - 1) + this.squareSize / 2);
    }
  }, {
    key: "lineTo",
    value: function lineTo(coordinate) {
      this.ctx.lineTo(this.squareSize * (coordinate.col - 1) + this.squareSize / 2, this.squareSize * (coordinate.row - 1) + this.squareSize / 2);
    }
  }, {
    key: "strokeRect",
    value: function strokeRect(start, end) {
      var x = this.squareSize * (start.col - 1) + this.squareSize / 2;
      var y = this.squareSize * (start.row - 1) + this.squareSize / 2;
      this.ctx.strokeRect(x, y, this.squareSize * (end.col - 1) - x + this.squareSize / 2, this.squareSize * (end.row - 1) - y + this.squareSize / 2);
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
      return Coordinate_1.coord(row + 1, col + 1);
    }
  }, {
    key: "drawCircle",
    value: function drawCircle(coordinate, radius) {
      var xPosition = (coordinate.col - 1) * this.squareSize + this.squareSize / 2;
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
    this.humanPlayers = [Player_1.Player.PLAYER_1];
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
      var _this = this;

      if (!this.humanPlayers.includes(this.game.currentPlayer)) {
        console.log('NOW IS COMPUTER TURN!');
        return;
      }

      var gameMoveResult = this.game.tryToMakeMove(point);

      switch (gameMoveResult) {
        case GameMoveResult_1.GameMoveResult.SUCCESSFUL_MOVE:
        case GameMoveResult_1.GameMoveResult.OPPONENT_DESTROYED:
          this.redraw();
          setTimeout(function () {
            _this.afterUpdate(gameMoveResult, function () {
              return _this.redraw();
            });
          });
          break;

        case GameMoveResult_1.GameMoveResult.FIRST_MOVE_PART:
          this.drawPossibleMoves(point);
          break;

        case GameMoveResult_1.GameMoveResult.RESTART_MOVE:
          this.redraw();
          this.onMouseClick(point);
          break;

        case GameMoveResult_1.GameMoveResult.MILL:
          this.redraw();
          this.drawPossibleMillMoves();
          break;

        case GameMoveResult_1.GameMoveResult.CANNOT_MOVE:
          break;
      }

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
      var _this2 = this;

      this.game.forEachBoardPosition(function (coordinate, player) {
        var paintable = PaintablePlayer_1.getPaintablePlayer(player);

        if (player === Player_1.Player.NO_PLAYER) {
          _this2.gameCanvas.setColor(_this2.boardColor);

          _this2.gameCanvas.fillCircle(coordinate, paintable.radius);
        } else {
          _this2.gameCanvas.setColor(paintable.color);

          _this2.gameCanvas.fillCircle(coordinate, paintable.radius);
        }
      });
    }
  }, {
    key: "drawPossibleMoves",
    value: function drawPossibleMoves(point) {
      var _this3 = this;

      this.game.possibleMoves(point).forEach(function (point) {
        _this3.gameCanvas.strokeCircle(point, 15);
      });
    }
  }, {
    key: "drawPossibleMillMoves",
    value: function drawPossibleMillMoves() {
      var _this4 = this;

      this.game.allOpponentPositions().forEach(function (coordinate) {
        _this4.gameCanvas.strokeCircle(coordinate, 15);
      });
    }
  }, {
    key: "redraw",
    value: function redraw() {
      this.gameCanvas.clearAll();
      this.drawInitialCanvas();
    }
  }, {
    key: "drawLines",
    value: function drawLines() {
      this.gameCanvas.setColor(this.boardColor);
      this.gameCanvas.strokeRect(Coordinate_1.coord(1, 1), Coordinate_1.coord(7, 7));
      this.gameCanvas.strokeRect(Coordinate_1.coord(2, 2), Coordinate_1.coord(6, 6));
      this.gameCanvas.strokeRect(Coordinate_1.coord(3, 3), Coordinate_1.coord(5, 5));
      this.gameCanvas.moveTo(Coordinate_1.coord(1, 4));
      this.gameCanvas.lineTo(Coordinate_1.coord(3, 4));
      this.gameCanvas.moveTo(Coordinate_1.coord(5, 4));
      this.gameCanvas.lineTo(Coordinate_1.coord(7, 4));
      this.gameCanvas.moveTo(Coordinate_1.coord(4, 1));
      this.gameCanvas.lineTo(Coordinate_1.coord(4, 3));
      this.gameCanvas.moveTo(Coordinate_1.coord(4, 5));
      this.gameCanvas.lineTo(Coordinate_1.coord(4, 7));
      this.gameCanvas.stroke();
    }
  }, {
    key: "addMouseListener",
    value: function addMouseListener(canvas) {
      var _this5 = this;

      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

      canvas.addEventListener('click', function (e) {
        var pos = getMousePos(canvas, e);

        var point = _this5.gameCanvas.getCoordinate(pos);

        _this5.onMouseClick(point);
      });
      canvas.addEventListener('mousemove', function (e) {
        var pos = getMousePos(canvas, e);

        var point = _this5.gameCanvas.getCoordinate(pos);

        var isSelectable = _this5.selectablePoints.some(function (p) {
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

var GamePhase_1 = require("../game/GamePhase");

var GameInfoWriter =
/*#__PURE__*/
function () {
  function GameInfoWriter(game) {
    var _this$playerPoints, _this$gamePhaseToText;

    _classCallCheck(this, GameInfoWriter);

    this.game = game;
    this.currentPlayerText = document.getElementById('current-player-text');
    this.moveTypeText = document.getElementById('game-state');
    this.playerPoints = (_this$playerPoints = {}, _defineProperty(_this$playerPoints, Player_1.Player.PLAYER_1, document.getElementById('player-1-points')), _defineProperty(_this$playerPoints, Player_1.Player.PLAYER_2, document.getElementById('player-2-points')), _this$playerPoints);
    this.gamePhaseToText = (_this$gamePhaseToText = {}, _defineProperty(_this$gamePhaseToText, GamePhase_1.GamePhase.INITIAL, 'Initial'), _defineProperty(_this$gamePhaseToText, GamePhase_1.GamePhase.MOVE_SELECTED_POINT, 'Move coordinate'), _defineProperty(_this$gamePhaseToText, GamePhase_1.GamePhase.SELECT_POINT_TO_MOVE, 'Select coordinate'), _defineProperty(_this$gamePhaseToText, GamePhase_1.GamePhase.MILL, 'Mill'), _defineProperty(_this$gamePhaseToText, GamePhase_1.GamePhase.GAME_OVER, 'The end'), _this$gamePhaseToText);
  }

  _createClass(GameInfoWriter, [{
    key: "update",
    value: function update() {
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
      this.moveTypeText.innerText = this.gamePhaseToText[this.game.currentPhase] || 'Unknown phase';
    }
  }, {
    key: "updateHistoryMoves",
    value: function updateHistoryMoves() {// console.log(this.game.getMovesHistory());
    }
  }, {
    key: "updatePoints",
    value: function updatePoints() {
      var _this = this;

      Object.entries(this.game.getState().playerPoints).forEach(function (_ref) {
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
},{"./PaintablePlayer":"app/paint/PaintablePlayer.ts","../game/Player":"app/game/Player.ts","../game/GamePhase":"app/game/GamePhase.ts"}],"app/game/MovesHistory.ts":[function(require,module,exports) {
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
    key: "getHistory",
    value: function getHistory() {
      return this.history;
    }
  }, {
    key: "resetHistory",
    value: function resetHistory(history) {
      this.history = history;
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
    key: "getPreviousCoordinate",
    value: function getPreviousCoordinate(player, coordinate) {
      for (var i = this.history.length - 1; i >= 0; i--) {
        if (this.history[i].player === player) {
          return Coordinate_1.areCoordsEquals(this.history[i].to, coordinate) ? this.history[i].from : null;
        }
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
    var board = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : InitialGameHelper_1.initBoard();

    _classCallCheck(this, BoardService);

    this.board = board;
    this.neighbours = this.initNeighbours();
    this.millCheckPositions = this.initMillCheckPositions();
  }

  _createClass(BoardService, [{
    key: "resetBoard",
    value: function resetBoard() {
      var board = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : InitialGameHelper_1.initBoard();
      this.board = board;
    }
  }, {
    key: "playerAt",
    value: function playerAt(coordinate) {
      return this.playerAtHash(Coordinate_1.hash(coordinate));
    }
  }, {
    key: "playerAtHash",
    value: function playerAtHash(hash) {
      return this.board.get(hash);
    }
  }, {
    key: "setPlayer",
    value: function setPlayer(coordinate, player) {
      this.board.set(Coordinate_1.hash(coordinate), player);
    }
  }, {
    key: "filterForCoordinates",
    value: function filterForCoordinates(predicate) {
      var result = [];
      this.forEach(function (coord, player) {
        if (predicate(player)) result.push(coord);
      });
      return result;
    }
  }, {
    key: "findPlayerCoordinates",
    value: function findPlayerCoordinates(player) {
      return this.filterForCoordinates(function (_player) {
        return _player === player;
      });
    }
  }, {
    key: "isCoordinatePartOfMill",
    value: function isCoordinatePartOfMill(coordinate) {
      var _this = this;

      var coordPlayer = this.playerAt(coordinate);
      var millCoordsToCheck = this.millCheckPositions.get(Coordinate_1.hash(coordinate));
      return millCoordsToCheck.some(function (coords) {
        return coords.every(function (_coord) {
          return _this.playerAt(_coord) === coordPlayer;
        });
      });
    }
  }, {
    key: "forEach",
    value: function forEach(func) {
      this.board.forEach(function (player, hash) {
        func(Coordinate_1.fromHash(hash), player);
      });
    }
  }, {
    key: "findNeighbours",
    value: function findNeighbours(coordinate) {
      return this.neighbours.get(Coordinate_1.hash(coordinate));
    }
  }, {
    key: "initNeighbours",
    value: function initNeighbours() {
      return new Map([[Coordinate_1.hash(Coordinate_1.coord(1, 1)), [Coordinate_1.coord(1, 4), Coordinate_1.coord(4, 1)]], [Coordinate_1.hash(Coordinate_1.coord(1, 4)), [Coordinate_1.coord(1, 1), Coordinate_1.coord(1, 7), Coordinate_1.coord(2, 4)]], [Coordinate_1.hash(Coordinate_1.coord(1, 7)), [Coordinate_1.coord(1, 4), Coordinate_1.coord(4, 7)]], [Coordinate_1.hash(Coordinate_1.coord(2, 2)), [Coordinate_1.coord(2, 4), Coordinate_1.coord(4, 2)]], [Coordinate_1.hash(Coordinate_1.coord(2, 4)), [Coordinate_1.coord(1, 4), Coordinate_1.coord(2, 6), Coordinate_1.coord(3, 4), Coordinate_1.coord(2, 2)]], [Coordinate_1.hash(Coordinate_1.coord(2, 6)), [Coordinate_1.coord(2, 4), Coordinate_1.coord(4, 6)]], [Coordinate_1.hash(Coordinate_1.coord(3, 3)), [Coordinate_1.coord(3, 4), Coordinate_1.coord(4, 3)]], [Coordinate_1.hash(Coordinate_1.coord(3, 4)), [Coordinate_1.coord(3, 3), Coordinate_1.coord(2, 4), Coordinate_1.coord(3, 5)]], [Coordinate_1.hash(Coordinate_1.coord(3, 5)), [Coordinate_1.coord(3, 4), Coordinate_1.coord(4, 5)]], [Coordinate_1.hash(Coordinate_1.coord(4, 1)), [Coordinate_1.coord(1, 1), Coordinate_1.coord(4, 2), Coordinate_1.coord(7, 1)]], [Coordinate_1.hash(Coordinate_1.coord(4, 2)), [Coordinate_1.coord(4, 1), Coordinate_1.coord(2, 2), Coordinate_1.coord(6, 2), Coordinate_1.coord(4, 3)]], [Coordinate_1.hash(Coordinate_1.coord(4, 3)), [Coordinate_1.coord(4, 2), Coordinate_1.coord(3, 3), Coordinate_1.coord(5, 3)]], [Coordinate_1.hash(Coordinate_1.coord(4, 5)), [Coordinate_1.coord(3, 5), Coordinate_1.coord(5, 5), Coordinate_1.coord(4, 6)]], [Coordinate_1.hash(Coordinate_1.coord(4, 6)), [Coordinate_1.coord(4, 5), Coordinate_1.coord(2, 6), Coordinate_1.coord(4, 7), Coordinate_1.coord(6, 6)]], [Coordinate_1.hash(Coordinate_1.coord(4, 7)), [Coordinate_1.coord(4, 6), Coordinate_1.coord(1, 7), Coordinate_1.coord(7, 7)]], [Coordinate_1.hash(Coordinate_1.coord(5, 3)), [Coordinate_1.coord(4, 3), Coordinate_1.coord(5, 4)]], [Coordinate_1.hash(Coordinate_1.coord(5, 4)), [Coordinate_1.coord(5, 3), Coordinate_1.coord(5, 5), Coordinate_1.coord(6, 4)]], [Coordinate_1.hash(Coordinate_1.coord(5, 5)), [Coordinate_1.coord(5, 4), Coordinate_1.coord(4, 5)]], [Coordinate_1.hash(Coordinate_1.coord(6, 2)), [Coordinate_1.coord(4, 2), Coordinate_1.coord(6, 4)]], [Coordinate_1.hash(Coordinate_1.coord(6, 4)), [Coordinate_1.coord(6, 2), Coordinate_1.coord(5, 4), Coordinate_1.coord(6, 6), Coordinate_1.coord(7, 4)]], [Coordinate_1.hash(Coordinate_1.coord(6, 6)), [Coordinate_1.coord(6, 4), Coordinate_1.coord(4, 6)]], [Coordinate_1.hash(Coordinate_1.coord(7, 1)), [Coordinate_1.coord(4, 1), Coordinate_1.coord(7, 4)]], [Coordinate_1.hash(Coordinate_1.coord(7, 4)), [Coordinate_1.coord(7, 1), Coordinate_1.coord(6, 4), Coordinate_1.coord(7, 7)]], [Coordinate_1.hash(Coordinate_1.coord(7, 7)), [Coordinate_1.coord(7, 4), Coordinate_1.coord(4, 7)]]]);
    }
  }, {
    key: "initMillCheckPositions",
    value: function initMillCheckPositions() {
      return new Map([[Coordinate_1.hash(Coordinate_1.coord(1, 1)), [[Coordinate_1.coord(4, 1), Coordinate_1.coord(7, 1)], [Coordinate_1.coord(1, 4), Coordinate_1.coord(1, 7)]]], [Coordinate_1.hash(Coordinate_1.coord(1, 4)), [[Coordinate_1.coord(2, 4), Coordinate_1.coord(3, 4)], [Coordinate_1.coord(1, 1), Coordinate_1.coord(1, 7)]]], [Coordinate_1.hash(Coordinate_1.coord(1, 7)), [[Coordinate_1.coord(4, 7), Coordinate_1.coord(7, 7)], [Coordinate_1.coord(1, 1), Coordinate_1.coord(1, 4)]]], [Coordinate_1.hash(Coordinate_1.coord(2, 2)), [[Coordinate_1.coord(2, 4), Coordinate_1.coord(2, 6)], [Coordinate_1.coord(4, 2), Coordinate_1.coord(6, 2)]]], [Coordinate_1.hash(Coordinate_1.coord(2, 4)), [[Coordinate_1.coord(1, 4), Coordinate_1.coord(3, 4)], [Coordinate_1.coord(2, 2), Coordinate_1.coord(2, 6)]]], [Coordinate_1.hash(Coordinate_1.coord(2, 6)), [[Coordinate_1.coord(2, 2), Coordinate_1.coord(2, 4)], [Coordinate_1.coord(4, 6), Coordinate_1.coord(6, 6)]]], [Coordinate_1.hash(Coordinate_1.coord(3, 3)), [[Coordinate_1.coord(3, 4), Coordinate_1.coord(3, 5)], [Coordinate_1.coord(4, 3), Coordinate_1.coord(5, 3)]]], [Coordinate_1.hash(Coordinate_1.coord(3, 4)), [[Coordinate_1.coord(1, 4), Coordinate_1.coord(2, 4)], [Coordinate_1.coord(3, 3), Coordinate_1.coord(3, 5)]]], [Coordinate_1.hash(Coordinate_1.coord(3, 5)), [[Coordinate_1.coord(3, 3), Coordinate_1.coord(3, 4)], [Coordinate_1.coord(4, 5), Coordinate_1.coord(5, 5)]]], [Coordinate_1.hash(Coordinate_1.coord(4, 1)), [[Coordinate_1.coord(4, 2), Coordinate_1.coord(4, 3)], [Coordinate_1.coord(1, 1), Coordinate_1.coord(7, 1)]]], [Coordinate_1.hash(Coordinate_1.coord(4, 2)), [[Coordinate_1.coord(2, 2), Coordinate_1.coord(6, 2)], [Coordinate_1.coord(4, 1), Coordinate_1.coord(4, 3)]]], [Coordinate_1.hash(Coordinate_1.coord(4, 3)), [[Coordinate_1.coord(3, 3), Coordinate_1.coord(5, 3)], [Coordinate_1.coord(4, 1), Coordinate_1.coord(4, 2)]]], [Coordinate_1.hash(Coordinate_1.coord(4, 5)), [[Coordinate_1.coord(3, 5), Coordinate_1.coord(5, 5)], [Coordinate_1.coord(4, 6), Coordinate_1.coord(4, 7)]]], [Coordinate_1.hash(Coordinate_1.coord(4, 6)), [[Coordinate_1.coord(2, 6), Coordinate_1.coord(6, 6)], [Coordinate_1.coord(4, 5), Coordinate_1.coord(4, 7)]]], [Coordinate_1.hash(Coordinate_1.coord(4, 7)), [[Coordinate_1.coord(1, 7), Coordinate_1.coord(7, 7)], [Coordinate_1.coord(4, 5), Coordinate_1.coord(4, 6)]]], [Coordinate_1.hash(Coordinate_1.coord(5, 3)), [[Coordinate_1.coord(3, 3), Coordinate_1.coord(4, 3)], [Coordinate_1.coord(5, 4), Coordinate_1.coord(5, 5)]]], [Coordinate_1.hash(Coordinate_1.coord(5, 4)), [[Coordinate_1.coord(5, 3), Coordinate_1.coord(5, 5)], [Coordinate_1.coord(6, 4), Coordinate_1.coord(7, 4)]]], [Coordinate_1.hash(Coordinate_1.coord(5, 5)), [[Coordinate_1.coord(5, 3), Coordinate_1.coord(5, 4)], [Coordinate_1.coord(2, 6), Coordinate_1.coord(4, 6)]]], [Coordinate_1.hash(Coordinate_1.coord(6, 2)), [[Coordinate_1.coord(2, 2), Coordinate_1.coord(4, 2)], [Coordinate_1.coord(6, 4), Coordinate_1.coord(6, 6)]]], [Coordinate_1.hash(Coordinate_1.coord(6, 4)), [[Coordinate_1.coord(6, 2), Coordinate_1.coord(6, 6)], [Coordinate_1.coord(5, 4), Coordinate_1.coord(7, 4)]]], [Coordinate_1.hash(Coordinate_1.coord(6, 6)), [[Coordinate_1.coord(2, 6), Coordinate_1.coord(4, 6)], [Coordinate_1.coord(6, 2), Coordinate_1.coord(6, 4)]]], [Coordinate_1.hash(Coordinate_1.coord(7, 1)), [[Coordinate_1.coord(1, 1), Coordinate_1.coord(4, 1)], [Coordinate_1.coord(7, 4), Coordinate_1.coord(7, 7)]]], [Coordinate_1.hash(Coordinate_1.coord(7, 4)), [[Coordinate_1.coord(7, 1), Coordinate_1.coord(7, 7)], [Coordinate_1.coord(6, 4), Coordinate_1.coord(5, 4)]]], [Coordinate_1.hash(Coordinate_1.coord(7, 7)), [[Coordinate_1.coord(7, 1), Coordinate_1.coord(7, 4)], [Coordinate_1.coord(1, 7), Coordinate_1.coord(4, 7)]]]]);
    }
  }]);

  return BoardService;
}();

exports.BoardService = BoardService;
},{"./InitialGameHelper":"app/game/InitialGameHelper.ts","./Coordinate":"app/game/Coordinate.ts"}],"app/tree/Tree.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TreeNode =
/*#__PURE__*/
function () {
  function TreeNode(value, parent) {
    _classCallCheck(this, TreeNode);

    this.value = value;
    this.parent = parent;
    this.children = [];
  }

  _createClass(TreeNode, [{
    key: "addChild",
    value: function addChild(node) {
      node.parent = this;
      this.children.push(node);
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      return this.children;
    }
  }, {
    key: "setChildren",
    value: function setChildren(children) {
      this.children = children;
    }
  }]);

  return TreeNode;
}();

exports.TreeNode = TreeNode;

var Tree = function Tree(root) {
  _classCallCheck(this, Tree);

  this.root = new TreeNode(root, null);
};

exports.Tree = Tree;
},{}],"app/ai/NodeBuilder.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Tree_1 = require("../tree/Tree");

var GameMoveResult_1 = require("../game/GameMoveResult");

function buildNodesToSearch(game, parentNode) {
  var state = game.getState();
  var nodesToSearch = [];

  var addToSearch = function addToSearch(movesToValidState) {
    nodesToSearch.push(new Tree_1.TreeNode({
      movesToValidState: movesToValidState,
      evaluation: null
    }, parentNode));
  };

  game.findSelectableCoordinates().forEach(function (coord) {
    game.resetState(state);
    var result = game.tryToMakeMove(coord);

    if (result === GameMoveResult_1.GameMoveResult.MILL) {
      game.findSelectableCoordinates(coord).forEach(function (millCoord) {
        addToSearch([coord, millCoord]);
      });
    } else if (result === GameMoveResult_1.GameMoveResult.FIRST_MOVE_PART) {
      var coordinatesForFinalMove = game.findSelectableCoordinates(coord);
      var stateAfterFirstMove = game.getState();
      coordinatesForFinalMove.forEach(function (finalMoveCoordinate) {
        game.resetState(stateAfterFirstMove);
        var finalMoveResult = game.tryToMakeMove(finalMoveCoordinate);

        if (finalMoveResult === GameMoveResult_1.GameMoveResult.MILL) {
          game.findSelectableCoordinates(finalMoveCoordinate).forEach(function (millCoord) {
            addToSearch([coord, finalMoveCoordinate, millCoord]);
          });
        } else {
          addToSearch([coord, finalMoveCoordinate]);
        }
      });
    } else {
      addToSearch([coord]);
    }
  });
  game.resetState(state);
  parentNode.setChildren(nodesToSearch);
  return nodesToSearch;
}

exports.buildNodesToSearch = buildNodesToSearch;
},{"../tree/Tree":"app/tree/Tree.ts","../game/GameMoveResult":"app/game/GameMoveResult.ts"}],"app/ai/AlphaBetaAlgorithm.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Player_1 = require("../game/Player");

var Tree_1 = require("../tree/Tree");

var GamePhase_1 = require("../game/GamePhase");

var NodeBuilder_1 = require("./NodeBuilder");

var AlphaBetaAlgorithm =
/*#__PURE__*/
function () {
  function AlphaBetaAlgorithm(heuristic, game) {
    _classCallCheck(this, AlphaBetaAlgorithm);

    this.heuristic = heuristic;
    this.game = game;
  }

  _createClass(AlphaBetaAlgorithm, [{
    key: "buildGameTree",
    value: function buildGameTree(maximizingPlayer) {
      var initialState = this.game.getState();
      var depth = this.findOptimalDepth(initialState);
      var tree = new Tree_1.Tree({
        evaluation: 0,
        movesToValidState: null
      });
      this.alphaBeta(initialState, maximizingPlayer, maximizingPlayer, -Infinity, Infinity, depth, tree.root);
      this.game.resetState(initialState);
      return tree;
    }
  }, {
    key: "alphaBeta",
    value: function alphaBeta(state, currentPlayer, maximizingPlayer, alpha, beta, depth, parentNode) {
      var _this = this;

      this.game.resetState(state);

      if (depth === 0 || this.game.isGameOver()) {
        return this.heuristic.calculateBoard(state, maximizingPlayer);
      }

      var _alphaOrBeta = function _alphaOrBeta(initialEvaluation, betterEvaluation, nextAlpha, nextBeta) {
        var bestEvaluation = initialEvaluation;
        var nodesToSearch = NodeBuilder_1.buildNodesToSearch(_this.game, parentNode);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = nodesToSearch[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var node = _step.value;

            _this.game.resetState(state);

            node.value.movesToValidState.forEach(function (coord) {
              _this.game.tryToMakeMove(coord);
            });

            var evaluation = _this.alphaBeta(_this.game.getState(), Player_1.nextPlayer(currentPlayer), maximizingPlayer, alpha, beta, depth - 1, node);

            node.value.evaluation = evaluation;
            bestEvaluation = betterEvaluation(bestEvaluation, evaluation);
            alpha = nextAlpha(alpha, evaluation);
            beta = nextBeta(beta, evaluation);

            if (beta <= alpha) {
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return bestEvaluation;
      };

      if (currentPlayer === maximizingPlayer) {
        return _alphaOrBeta(-Infinity, Math.max, Math.max, function (_beta) {
          return _beta;
        });
      } else {
        return _alphaOrBeta(Infinity, Math.min, function (_alpha) {
          return _alpha;
        }, Math.max);
      }
    }
  }, {
    key: "findOptimalDepth",
    value: function findOptimalDepth(state) {
      if (state.gamePhase === GamePhase_1.GamePhase.INITIAL) {
        return 3;
      }

      if (this.game.isFlyingActive()) {
        return 3;
      }

      return 4;
    }
  }]);

  return AlphaBetaAlgorithm;
}();

exports.AlphaBetaAlgorithm = AlphaBetaAlgorithm;
},{"../game/Player":"app/game/Player.ts","../tree/Tree":"app/tree/Tree.ts","../game/GamePhase":"app/game/GamePhase.ts","./NodeBuilder":"app/ai/NodeBuilder.ts"}],"app/ai/heuristics/AlmostMillHeuristic.ts":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Player_1 = require("../../game/Player");

var GamePhase_1 = require("../../game/GamePhase");

var AlmostMillHeuristic =
/*#__PURE__*/
function () {
  function AlmostMillHeuristic(boardService) {
    _classCallCheck(this, AlmostMillHeuristic);

    this.boardService = boardService;
    this.millPointsFactor = 10;
  }

  _createClass(AlmostMillHeuristic, [{
    key: "calculateBoard",
    value: function calculateBoard(state, player) {
      var _this = this;

      if (state.gamePhase === GamePhase_1.GamePhase.GAME_OVER) {
        return state.winner === player ? 10000 : -10000;
      }

      var millPoints = this.millPointsFactor * (state.destroyedOpponents[player] - state.destroyedOpponents[Player_1.nextPlayer(player)]);
      var almostMillPoints = 0;

      var millCheckPositions = _toConsumableArray(this.boardService.millCheckPositions.entries());

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = millCheckPositions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              coordinateHash = _step$value[0],
              millCheckCoords = _step$value[1];

          var _player = this.boardService.playerAtHash(coordinateHash);

          if (_player !== Player_1.Player.NO_PLAYER) {
            continue;
          }

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = millCheckCoords[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var millCoords = _step2.value;
              var almostMillPlayer = millCoords.map(function (_c) {
                return _this.boardService.playerAt(_c);
              });

              if (almostMillPlayer[0] === almostMillPlayer[1]) {
                almostMillPoints += almostMillPlayer[0] === _player ? 1 : -1;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return millPoints + almostMillPoints;
    }
  }]);

  return AlmostMillHeuristic;
}();

exports.AlmostMillHeuristic = AlmostMillHeuristic;
},{"../../game/Player":"app/game/Player.ts","../../game/GamePhase":"app/game/GamePhase.ts"}],"app/ai/heuristics/PlayerRemainingPointsHeuristic.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Player_1 = require("../../game/Player");

var GamePhase_1 = require("../../game/GamePhase");

var PlayerRemainingPointsHeuristic =
/*#__PURE__*/
function () {
  function PlayerRemainingPointsHeuristic() {
    _classCallCheck(this, PlayerRemainingPointsHeuristic);
  }

  _createClass(PlayerRemainingPointsHeuristic, [{
    key: "calculateBoard",
    value: function calculateBoard(state, player) {
      if (state.gamePhase === GamePhase_1.GamePhase.GAME_OVER) {
        return state.winner === player ? 10000 : -10000;
      }

      return state.destroyedOpponents[player] - state.destroyedOpponents[Player_1.nextPlayer(player)];
    }
  }]);

  return PlayerRemainingPointsHeuristic;
}();

exports.PlayerRemainingPointsHeuristic = PlayerRemainingPointsHeuristic;
},{"../../game/Player":"app/game/Player.ts","../../game/GamePhase":"app/game/GamePhase.ts"}],"app/index.ts":[function(require,module,exports) {
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var NineMensMorrisGame_1 = require("./game/NineMensMorrisGame");

var GameDrawer_1 = require("./paint/GameDrawer");

var GameInfoWriter_1 = require("./paint/GameInfoWriter");

var MovesHistory_1 = require("./game/MovesHistory");

var BoardService_1 = require("./game/BoardService");

var Player_1 = require("./game/Player");

var GameMoveResult_1 = require("./game/GameMoveResult");

var AlphaBetaAlgorithm_1 = require("./ai/AlphaBetaAlgorithm");

var AlmostMillHeuristic_1 = require("./ai/heuristics/AlmostMillHeuristic");

var PlayerRemainingPointsHeuristic_1 = require("./ai/heuristics/PlayerRemainingPointsHeuristic");

function makeComputerMove(algorithm, game, player) {
  var tree = algorithm.buildGameTree(player);
  console.log(tree.root.getChildren());

  if (!tree.root.getChildren().length) {
    console.log('CANNOT MOVE');
    return;
  }

  var bestEvaluation = tree.root.getChildren().map(function (node) {
    return node.value.evaluation;
  }).reduce(function (acc, cur) {
    return acc >= cur ? acc : cur;
  });
  var bestMoves = tree.root.getChildren().map(function (node) {
    return node.value;
  }).filter(function (a) {
    return a.evaluation === bestEvaluation;
  });
  var move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  console.log("CURRENT PLAYER", player);
  console.log(move);
  move.movesToValidState.forEach(function (a) {
    game.tryToMakeMove(a);
  });
}

function aiBattle(boardService, game, infoWriter, drawer) {
  var _algorithms;

  var algorithms = (_algorithms = {}, _defineProperty(_algorithms, Player_1.Player.PLAYER_1, new AlphaBetaAlgorithm_1.AlphaBetaAlgorithm(new PlayerRemainingPointsHeuristic_1.PlayerRemainingPointsHeuristic(), game)), _defineProperty(_algorithms, Player_1.Player.PLAYER_2, new AlphaBetaAlgorithm_1.AlphaBetaAlgorithm(new AlmostMillHeuristic_1.AlmostMillHeuristic(boardService), game)), _algorithms);
  var previousPlayerMove = Player_1.Player.NO_PLAYER;
  var intervalId = setInterval(function () {
    if (previousPlayerMove === game.currentPlayer) {
      console.log('return');
      return;
    }

    previousPlayerMove = game.currentPlayer;
    var startTime = new Date();
    makeComputerMove(algorithms[game.currentPlayer], game, game.currentPlayer);
    console.log('TIME ELAPSED: ', new Date() - startTime);
    infoWriter.update();
    drawer.redraw();

    if (game.isGameOver()) {
      console.log("GAME OVER!!!!!!!!!");
      clearInterval(intervalId);
    }
  }, 500);
}

function userComputer(canvas, game, infoWriter, minMaxAlgorithm) {
  var drawer = new GameDrawer_1.GameDrawer(canvas, game, function (result, redrawFunc) {
    infoWriter.update();

    if (GameMoveResult_1.NEXT_PLAYER_RESULTS.includes(result)) {
      setTimeout(function () {
        makeComputerMove(minMaxAlgorithm, game, Player_1.Player.PLAYER_2);
        infoWriter.update();
        redrawFunc();
      }, 10);
    }
  });
}

(function () {
  console.log("HELLO IN THE NINE MEN'S MORRIS GAME");
  var boardService = new BoardService_1.BoardService();
  var game = new NineMensMorrisGame_1.NineMensMorrisGame(new MovesHistory_1.MovesHistory(), boardService);
  var canvas = document.getElementById('game-canvas');
  var infoWriter = new GameInfoWriter_1.GameInfoWriter(game);
  var minMaxAlgorithm = new AlphaBetaAlgorithm_1.AlphaBetaAlgorithm(new PlayerRemainingPointsHeuristic_1.PlayerRemainingPointsHeuristic(), game);
  userComputer(canvas, game, infoWriter, minMaxAlgorithm); //
  // aiBattle(boardService, game, infoWriter, new GameDrawer(canvas, game, a => a));

  infoWriter.update();
})();
},{"./game/NineMensMorrisGame":"app/game/NineMensMorrisGame.ts","./paint/GameDrawer":"app/paint/GameDrawer.ts","./paint/GameInfoWriter":"app/paint/GameInfoWriter.ts","./game/MovesHistory":"app/game/MovesHistory.ts","./game/BoardService":"app/game/BoardService.ts","./game/Player":"app/game/Player.ts","./game/GameMoveResult":"app/game/GameMoveResult.ts","./ai/AlphaBetaAlgorithm":"app/ai/AlphaBetaAlgorithm.ts","./ai/heuristics/AlmostMillHeuristic":"app/ai/heuristics/AlmostMillHeuristic.ts","./ai/heuristics/PlayerRemainingPointsHeuristic":"app/ai/heuristics/PlayerRemainingPointsHeuristic.ts"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52763" + '/');

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