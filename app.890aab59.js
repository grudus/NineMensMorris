parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"RzZT":[function(require,module,exports) {
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),function(e){e[e.PLAYER_1=0]="PLAYER_1",e[e.PLAYER_2=1]="PLAYER_2",e[e.NO_PLAYER=2]="NO_PLAYER"}(e=exports.Player||(exports.Player={})),exports.nextPlayer=function(r){return r===e.PLAYER_1?e.PLAYER_2:e.PLAYER_1};
},{}],"We/a":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var o="a".charCodeAt(0);function r(r,e){return{row:r,col:e,colIndex:e.charCodeAt(0)-o}}function e(r,e){return{row:r+1,col:String.fromCharCode(o+e),colIndex:e}}function t(o,r){return o.row==r.row&&o.col==r.col}exports.point=r,exports.coordinatesFromIndexes=e,exports.areCoordsEquals=t;
},{}],"gKya":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./Player"),r=require("./NineMensMorrisGame"),n=require("./Coordinate");exports.initHandQueue=function(){for(var n=[],i=[e.Player.PLAYER_1,e.Player.PLAYER_2],o=0;o<2*r.NineMensMorrisGame.NUMBER_OF_POINTS;o++)n.push(i[o%i.length]);return n},exports.initBoard=function(){for(var i=[["a","d","g"],["b","d","f"],["c","d","e"],["a","b","c","e","f","g"],["c","d","e"],["b","d","f"],["a","d","g"]],o=[],a=function(r){i[r-1].forEach(function(i){o.push({player:e.Player.NO_PLAYER,coordinate:n.point(r,i)})})},t=1;t<=r.NineMensMorrisGame.BOARD_SIZE;t++)a(t);return o};
},{"./Player":"RzZT","./NineMensMorrisGame":"ew6C","./Coordinate":"We/a"}],"QRW6":[function(require,module,exports) {
"use strict";var E;Object.defineProperty(exports,"__esModule",{value:!0}),function(E){E[E.INITIAL=0]="INITIAL",E[E.SELECT_POINT_TO_MOVE=1]="SELECT_POINT_TO_MOVE",E[E.MOVE_SELECTED_POINT=2]="MOVE_SELECTED_POINT",E[E.MILL=3]="MILL",E[E.GAME_OVER=4]="GAME_OVER"}(E=exports.GameState||(exports.GameState={}));
},{}],"X+Qk":[function(require,module,exports) {
"use strict";var E;Object.defineProperty(exports,"__esModule",{value:!0}),function(E){E[E.SUCCESSFUL_MOVE=0]="SUCCESSFUL_MOVE",E[E.FIRST_MOVE_PART=1]="FIRST_MOVE_PART",E[E.RESTART_MOVE=2]="RESTART_MOVE",E[E.CANNOT_MOVE=3]="CANNOT_MOVE",E[E.MILL=4]="MILL",E[E.OPPONENT_DESTROYED=5]="OPPONENT_DESTROYED",E[E.INVALID_MILL_MOVE=6]="INVALID_MILL_MOVE"}(E=exports.GameMoveResult||(exports.GameMoveResult={}));
},{}],"4Crw":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function a(e,a,i){return a&&t(e.prototype,a),i&&t(e,i),e}Object.defineProperty(exports,"__esModule",{value:!0});var i=require("./Coordinate"),r=require("./GameState"),n=require("./GameMoveResult"),o=function(){function t(a){e(this,t),this.game=a,this.currentMove=null}return a(t,[{key:"makeMove",value:function(e){if(!this.game.isGameOver())return this.game.isMill()?this.makeMillMove(e):this.game.currentState==r.GameState.INITIAL?this.makeInitialMove(e):this.makeMoveInNormalPhase(e)}},{key:"makeInitialMove",value:function(e){return this.game.isNoPlayer(e)?(this.game.addInitialPoint(e),this.game.detectMill(e)?n.GameMoveResult.MILL:(this.game.setNextPlayerMove(),n.GameMoveResult.SUCCESSFUL_MOVE)):n.GameMoveResult.CANNOT_MOVE}},{key:"makeMoveInNormalPhase",value:function(e){return this.currentMove?this.makeFinalMovePart(e):this.makeFirstMovePart(e)}},{key:"makeFirstMovePart",value:function(e){var t=this.game.boardService.position(e);return t&&t.player===this.game.currentPlayer?(this.currentMove={point:e,neighbours:this.game.possibleMoves(e),player:this.game.currentPlayer},this.game.setState(r.GameState.MOVE_SELECTED_POINT),n.GameMoveResult.FIRST_MOVE_PART):n.GameMoveResult.CANNOT_MOVE}},{key:"makeFinalMovePart",value:function(e){return this.currentMove.neighbours.find(function(t){return i.areCoordsEquals(t,e)})?(this.game.movePoint(this.currentMove.point,e),this.currentMove=null,this.game.detectMill(e)?n.GameMoveResult.MILL:(this.game.setNextPlayerMove(),n.GameMoveResult.SUCCESSFUL_MOVE)):(this.currentMove=null,this.game.setState(r.GameState.SELECT_POINT_TO_MOVE),n.GameMoveResult.RESTART_MOVE)}},{key:"makeMillMove",value:function(e){return this.game.isOpponentPoint(e)?(this.game.removePoint(e),this.game.clearMill(),this.game.setNextPlayerMove(),n.GameMoveResult.OPPONENT_DESTROYED):n.GameMoveResult.INVALID_MILL_MOVE}}]),t}();exports.GameMoveEngine=o;
},{"./Coordinate":"We/a","./GameState":"QRW6","./GameMoveResult":"X+Qk"}],"ew6C":[function(require,module,exports) {
"use strict";function e(e){return i(e)||r(e)||t()}function t(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function r(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function i(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function s(e,t,r){return t&&o(e.prototype,t),r&&o(e,r),e}var l=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});var u=require("./Player"),c=require("./Coordinate"),y=l(require("./InitialGameHelper")),h=require("./GameState"),v=require("./GameMoveEngine"),f=3,P=2,p=function(){function t(e,r){var i;a(this,t),this.movesHistory=e,this.boardService=r,this.currentPlayerMove=u.Player.PLAYER_1,this.millPlayer=null,this.gameState=h.GameState.INITIAL,this.prevState=h.GameState.INITIAL,this.playerPoints=(n(i={},u.Player.PLAYER_1,0),n(i,u.Player.PLAYER_2,0),i),this.gameMoveEngine=new v.GameMoveEngine(this),this.initialHandQueue=y.initHandQueue()}return s(t,[{key:"addInitialPoint",value:function(e){if(!this.initialHandQueue.length)throw Error("Initial hand queue is empty!");var t=this.boardService.position(e);t.player=t.player===u.Player.NO_PLAYER?this.currentPlayerMove:t.player,this.playerPoints[this.currentPlayer]++,this.movesHistory.addInitialMove(e,this.currentPlayer)}},{key:"setNextPlayerMove",value:function(){this.initialHandQueue.length?(this.currentPlayerMove=this.initialHandQueue.pop(),this.setState(this.initialHandQueue.length?h.GameState.INITIAL:h.GameState.SELECT_POINT_TO_MOVE)):(this.setState(h.GameState.SELECT_POINT_TO_MOVE),this.currentPlayerMove=u.nextPlayer(this.currentPlayerMove))}},{key:"tryToMakeMove",value:function(e){return this.gameMoveEngine.makeMove(e)}},{key:"movePoint",value:function(e,t){var r=this.boardService.position(e),i=this.boardService.position(t);i.player===u.Player.NO_PLAYER&&(i.player=r.player,r.player=u.Player.NO_PLAYER,this.movesHistory.addMove({from:e,to:t,player:this.currentPlayer}))}},{key:"detectMill",value:function(e){var t=this.boardService.findColsAndRowsInLine(e),r=t.colsInLine,i=t.rowsInLine,n=function(e,t){for(var r=e.findIndex(function(e){return c.areCoordsEquals(e.coordinate,t)}),i=0;i<e.length;i+=3)if(r>=i&&r<i+3){for(var n=e[r].player,a=0,o=0;o<3;o++)n==e[i+o].player&&a++;if(3==a)return!0}return!1},a=n(r,e)||n(i,e);return this.millPlayer=a?this.currentPlayer:null,a&&this.setState(h.GameState.MILL),a}},{key:"isMill",value:function(){return null!==this.millPlayer}},{key:"forEachBoardPosition",value:function(e){this.boardService.forEach(e)}},{key:"isGameOver",value:function(){return this.gameState===h.GameState.GAME_OVER}},{key:"isNoPlayer",value:function(e){var t=this.boardService.position(e);return t&&t.player==u.Player.NO_PLAYER}},{key:"isOpponentPoint",value:function(e){var t=this.boardService.position(e);return this.isOpponentPosition(t)}},{key:"isOpponentPosition",value:function(e){return e&&e.player!=u.Player.NO_PLAYER&&e.player!=this.currentPlayer}},{key:"possibleMoves",value:function(e){var t=this,r=this.movesHistory.getPreviousCoordinate(this.currentPlayer,e);return this.findNeighbours(e).filter(function(e){return t.isNoPlayer(e)}).filter(function(e){return!(r&&c.areCoordsEquals(r,e))})}},{key:"allOpponentPositions",value:function(){var e=this;return this.boardService.filter(function(t){return e.isOpponentPosition(t)})}},{key:"findNeighbours",value:function(e){return this.playerPoints[this.currentPlayer]===f?this.boardService.findPlayerCoordinates(u.Player.NO_PLAYER):this.boardService.findNeighbours(e)}},{key:"setState",value:function(e){this.isGameOver()||(this.prevState=this.gameState,this.gameState=e)}},{key:"findSelectableCoordinates",value:function(t){switch(this.currentState){case h.GameState.INITIAL:return this.boardService.findPlayerCoordinates(u.Player.NO_PLAYER);case h.GameState.SELECT_POINT_TO_MOVE:return this.boardService.findPlayerCoordinates(this.currentPlayer);case h.GameState.MILL:return this.allOpponentPositions().map(function(e){return e.coordinate});case h.GameState.MOVE_SELECTED_POINT:return[].concat(e(this.possibleMoves(t)),e(this.boardService.findPlayerCoordinates(this.currentPlayer)));default:return[]}}},{key:"removePoint",value:function(e){var t=this.boardService.position(e);this.playerPoints[t.player]--,t.player=u.Player.NO_PLAYER,Object.values(this.playerPoints).some(function(e){return e===P})&&this.setState(h.GameState.GAME_OVER)}},{key:"clearMill",value:function(){this.setState(this.prevState),this.millPlayer=null}},{key:"getMovesHistory",value:function(){return this.movesHistory.getHistory()}},{key:"currentState",get:function(){return this.gameState}},{key:"currentPlayer",get:function(){return this.currentPlayerMove}}]),t}();p.NUMBER_OF_POINTS=9,p.BOARD_SIZE=7,exports.NineMensMorrisGame=p;
},{"./Player":"RzZT","./Coordinate":"We/a","./InitialGameHelper":"gKya","./GameState":"QRW6","./GameMoveEngine":"4Crw"}],"TKrj":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}function i(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}Object.defineProperty(exports,"__esModule",{value:!0});var s=require("../game/Coordinate"),r=function(){function t(i,s){e(this,t),this.ctx=i,this.squareSize=s}return i(t,[{key:"setColor",value:function(e){this.ctx.strokeStyle=e,this.ctx.fillStyle=e}},{key:"moveTo",value:function(e){this.ctx.moveTo(this.squareSize*e.colIndex+this.squareSize/2,this.squareSize*(e.row-1)+this.squareSize/2)}},{key:"lineTo",value:function(e){this.ctx.lineTo(this.squareSize*e.colIndex+this.squareSize/2,this.squareSize*(e.row-1)+this.squareSize/2)}},{key:"strokeRect",value:function(e,t){var i=this.squareSize*e.colIndex+this.squareSize/2,s=this.squareSize*(e.row-1)+this.squareSize/2;this.ctx.strokeRect(i,s,this.squareSize*t.colIndex-i+this.squareSize/2,this.squareSize*(t.row-1)-s+this.squareSize/2)}},{key:"stroke",value:function(){this.ctx.stroke()}},{key:"fillCircle",value:function(e,t){this.drawCircle(e,t),this.ctx.fill()}},{key:"strokeCircle",value:function(e,t){this.drawCircle(e,t),this.ctx.stroke()}},{key:"clearAll",value:function(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.ctx.beginPath()}},{key:"getCoordinate",value:function(e){var t=Math.floor(e.y/this.squareSize),i=Math.floor(e.x/this.squareSize);return s.coordinatesFromIndexes(t,i)}},{key:"drawCircle",value:function(e,t){var i=e.colIndex*this.squareSize+this.squareSize/2,s=(e.row-1)*this.squareSize+this.squareSize/2;this.ctx.beginPath(),this.ctx.arc(i,s,t,0,2*Math.PI)}}]),t}();exports.GameCanvasContext=r;
},{"../game/Coordinate":"We/a"}],"Itjq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("../game/Player"),r=new Map;r.set(e.Player.PLAYER_1,{color:"red",radius:10,label:"Player 1"}),r.set(e.Player.PLAYER_2,{color:"blue",radius:10,label:"Player 2"}),r.set(e.Player.NO_PLAYER,{color:"black",radius:5,label:"No player"}),exports.getPaintablePlayer=function(e){return r.get(e)};
},{"../game/Player":"RzZT"}],"si8q":[function(require,module,exports) {
"use strict";function e(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}function a(e,a){for(var t=0;t<a.length;t++){var i=a[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function t(e,t,i){return t&&a(e.prototype,t),i&&a(e,i),e}Object.defineProperty(exports,"__esModule",{value:!0});var i=require("../game/NineMensMorrisGame"),s=require("../game/Coordinate"),n=require("./GameCanvasContext"),o=require("../game/Player"),r=require("../game/GameMoveResult"),l=require("./PaintablePlayer"),v=function(){function a(t,s,o){e(this,a),this.canvas=t,this.game=s,this.afterUpdate=o,this.boardColor="#212121",this.fitToContainer(t),this.addMouseListener(t),this.squareSize=t.width/i.NineMensMorrisGame.BOARD_SIZE,this.gameCanvas=new n.GameCanvasContext(t.getContext("2d"),this.squareSize),this.drawInitialCanvas(),this.selectablePoints=this.game.findSelectableCoordinates()}return t(a,[{key:"onMouseClick",value:function(e){var a=this.game.tryToMakeMove(e);switch(a){case r.GameMoveResult.SUCCESSFUL_MOVE:case r.GameMoveResult.OPPONENT_DESTROYED:this.resetCanvasAndDrawGame();break;case r.GameMoveResult.FIRST_MOVE_PART:this.drawPossibleMoves(e);break;case r.GameMoveResult.RESTART_MOVE:this.resetCanvasAndDrawGame(),this.onMouseClick(e);break;case r.GameMoveResult.MILL:this.resetCanvasAndDrawGame(),this.drawPossibleMillMoves();break;case r.GameMoveResult.CANNOT_MOVE:}this.afterUpdate(a),this.selectablePoints=this.game.findSelectableCoordinates(e)}},{key:"fitToContainer",value:function(e){e.style.width="100%",e.style.height="100%",e.width=e.offsetWidth,e.height=e.offsetHeight}},{key:"drawInitialCanvas",value:function(){this.drawLines(),this.drawDots()}},{key:"drawDots",value:function(){var e=this;this.game.forEachBoardPosition(function(a){var t=l.getPaintablePlayer(a.player);a.player===o.Player.NO_PLAYER?(e.gameCanvas.setColor(e.boardColor),e.gameCanvas.fillCircle(a.coordinate,t.radius)):(e.gameCanvas.setColor(t.color),e.gameCanvas.fillCircle(a.coordinate,t.radius))})}},{key:"drawPossibleMoves",value:function(e){var a=this;this.game.possibleMoves(e).forEach(function(e){a.gameCanvas.strokeCircle(e,15)})}},{key:"drawPossibleMillMoves",value:function(){var e=this;this.game.allOpponentPositions().forEach(function(a){e.gameCanvas.strokeCircle(a.coordinate,15)})}},{key:"resetCanvasAndDrawGame",value:function(){this.gameCanvas.clearAll(),this.drawInitialCanvas()}},{key:"drawLines",value:function(){this.gameCanvas.setColor(this.boardColor),this.gameCanvas.strokeRect(s.point(1,"a"),s.point(7,"g")),this.gameCanvas.strokeRect(s.point(2,"b"),s.point(6,"f")),this.gameCanvas.strokeRect(s.point(3,"c"),s.point(5,"e")),this.gameCanvas.moveTo(s.point(1,"d")),this.gameCanvas.lineTo(s.point(3,"d")),this.gameCanvas.moveTo(s.point(5,"d")),this.gameCanvas.lineTo(s.point(7,"d")),this.gameCanvas.moveTo(s.point(4,"a")),this.gameCanvas.lineTo(s.point(4,"c")),this.gameCanvas.moveTo(s.point(4,"e")),this.gameCanvas.lineTo(s.point(4,"g")),this.gameCanvas.stroke()}},{key:"addMouseListener",value:function(e){var a=this;function t(e,a){var t=e.getBoundingClientRect();return{x:a.clientX-t.left,y:a.clientY-t.top}}e.addEventListener("click",function(i){var s=t(e,i),n=a.gameCanvas.getCoordinate(s);a.onMouseClick(n)}),e.addEventListener("mousemove",function(i){var n=t(e,i),o=a.gameCanvas.getCoordinate(n),r=a.selectablePoints.some(function(e){return s.areCoordsEquals(e,o)});e.style.cursor=r?"pointer":"default"})}}]),a}();exports.GameDrawer=v;
},{"../game/NineMensMorrisGame":"ew6C","../game/Coordinate":"We/a","./GameCanvasContext":"TKrj","../game/Player":"RzZT","../game/GameMoveResult":"X+Qk","./PaintablePlayer":"Itjq"}],"jZTF":[function(require,module,exports) {
"use strict";function e(e,a){return n(e)||r(e,a)||t()}function t(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function r(e,t){var r=[],n=!0,a=!1,i=void 0;try{for(var o,u=e[Symbol.iterator]();!(n=(o=u.next()).done)&&(r.push(o.value),!t||r.length!==t);n=!0);}catch(l){a=!0,i=l}finally{try{n||null==u.return||u.return()}finally{if(a)throw i}}return r}function n(e){if(Array.isArray(e))return e}function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function u(e,t,r){return t&&o(e.prototype,t),r&&o(e,r),e}Object.defineProperty(exports,"__esModule",{value:!0});var l=require("./PaintablePlayer"),s=require("../game/Player"),c=require("../game/GameState"),y=function(){function t(e){var r,n;i(this,t),this.game=e,this.currentPlayerText=document.getElementById("current-player-text"),this.moveTypeText=document.getElementById("game-state"),this.playerPoints=(a(r={},s.Player.PLAYER_1,document.getElementById("player-1-points")),a(r,s.Player.PLAYER_2,document.getElementById("player-2-points")),r),this.gameStateToText=(a(n={},c.GameState.INITIAL,"Initial"),a(n,c.GameState.MOVE_SELECTED_POINT,"Move coordinate"),a(n,c.GameState.SELECT_POINT_TO_MOVE,"Select coordinate"),a(n,c.GameState.MILL,"Mill"),a(n,c.GameState.GAME_OVER,"The end"),n)}return u(t,[{key:"update",value:function(e){this.updateCurrentPlayerText(),this.updateGameState(),this.updateHistoryMoves(),this.updatePoints()}},{key:"updateCurrentPlayerText",value:function(){var e=l.getPaintablePlayer(this.game.currentPlayer);this.currentPlayerText.innerText=e.label,this.currentPlayerText.style.color=e.color}},{key:"updateGameState",value:function(){this.moveTypeText.innerText=this.gameStateToText[this.game.currentState]||"Unknown state"}},{key:"updateHistoryMoves",value:function(){console.log(this.game.getMovesHistory())}},{key:"updatePoints",value:function(){var t=this;Object.entries(this.game.playerPoints).forEach(function(r){var n=e(r,2),a=n[0],i=n[1];t.playerPoints[a].innerText=i+""})}}]),t}();exports.GameInfoWriter=y;
},{"./PaintablePlayer":"Itjq","../game/Player":"RzZT","../game/GameState":"QRW6"}],"wTVz":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function r(e,r,o){return r&&t(e.prototype,r),o&&t(e,o),e}Object.defineProperty(exports,"__esModule",{value:!0});var o=require("./Coordinate"),i=function(){function t(){e(this,t),this.history=[]}return r(t,[{key:"addMove",value:function(e){this.history.push(e)}},{key:"addInitialMove",value:function(e,t){this.addMove({to:e,player:t})}},{key:"getHistory",value:function(){return this.history}},{key:"getPreviousCoordinate",value:function(e,t){for(var r=this.history.length-1;r>=0;r--)if(this.history[r].player===e)return o.areCoordsEquals(this.history[r].to,t)?this.history[r].from:null;return null}}]),t}();exports.MovesHistory=i;
},{"./Coordinate":"We/a"}],"b51U":[function(require,module,exports) {
"use strict";function n(n,o){if(!(n instanceof o))throw new TypeError("Cannot call a class as a function")}function o(n,o){for(var e=0;e<o.length;e++){var r=o[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}function e(n,e,r){return e&&o(n.prototype,e),r&&o(n,r),n}Object.defineProperty(exports,"__esModule",{value:!0});var r=require("./InitialGameHelper"),i=require("./Coordinate"),t=function(){function o(){n(this,o),this.cannotGoCoordinates=[{from:{row:4,col:"c"},to:{row:4,col:"e"}},{from:{row:3,col:"d"},to:{row:5,col:"d"}}],this.board=r.initBoard()}return e(o,[{key:"position",value:function(n){return this.board.find(function(o){return i.areCoordsEquals(o.coordinate,n)})}},{key:"filter",value:function(n){return this.board.filter(n)}},{key:"findPlayerCoordinates",value:function(n){return this.filter(function(o){return o.player===n}).map(function(n){return n.coordinate})}},{key:"findColsAndRowsInLine",value:function(n){return this.board.reduce(function(o,e){return i.areCoordsEquals(e.coordinate,n)?(o.rowsInLine.push(e),o.colsInLine.push(e)):e.coordinate.colIndex===n.colIndex?o.colsInLine.push(e):e.coordinate.row===n.row&&o.rowsInLine.push(e),o},{colsInLine:[],rowsInLine:[]})}},{key:"forEach",value:function(n){this.board.forEach(n)}},{key:"findNeighbours",value:function(n){var o=this.findColsAndRowsInLine(n),e=o.colsInLine,r=o.rowsInLine,i=this.findNearestPoints(n,e,r);return this.filterNeighboursImpossibleToGo(n,i),i}},{key:"filterNeighboursImpossibleToGo",value:function(n,o){this.cannotGoCoordinates.forEach(function(e){var r=e.from,t=e.to;if(i.areCoordsEquals(n,r)){var a=o.findIndex(function(n){return i.areCoordsEquals(n,t)});o.splice(a,1)}else if(i.areCoordsEquals(n,t)){var u=o.findIndex(function(n){return i.areCoordsEquals(n,r)});o.splice(u,1)}})}},{key:"findNearestPoints",value:function(n,o,e){var r=o.findIndex(function(o){return i.areCoordsEquals(o.coordinate,n)}),t=e.findIndex(function(o){return i.areCoordsEquals(o.coordinate,n)});return[o[r+1],o[r-1],e[t+1],e[t-1]].filter(function(n){return n}).map(function(n){return n.coordinate})}}]),o}();exports.BoardService=t;
},{"./InitialGameHelper":"gKya","./Coordinate":"We/a"}],"0/Ws":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./game/NineMensMorrisGame"),r=require("./paint/GameDrawer"),a=require("./paint/GameInfoWriter"),n=require("./game/MovesHistory"),i=require("./game/BoardService");!function(){console.log("HELLO IN THE NINE MEN'S MORRIS GAME");var o=new e.NineMensMorrisGame(new n.MovesHistory,new i.BoardService),t=document.getElementById("game-canvas"),s=new a.GameInfoWriter(o);new r.GameDrawer(t,o,function(e){return s.update(e)});s.update()}();
},{"./game/NineMensMorrisGame":"ew6C","./paint/GameDrawer":"si8q","./paint/GameInfoWriter":"jZTF","./game/MovesHistory":"wTVz","./game/BoardService":"b51U"}]},{},["0/Ws"], null)
//# sourceMappingURL=app.890aab59.js.map