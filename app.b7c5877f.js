parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"RzZT":[function(require,module,exports) {
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),function(e){e.PLAYER_1="PLAYER_1",e.PLAYER_2="PLAYER_2",e.NO_PLAYER="NO_PLAYER"}(e=exports.Player||(exports.Player={})),exports.nextPlayer=function(r){return r===e.PLAYER_1?e.PLAYER_2:e.PLAYER_1};
},{}],"We/a":[function(require,module,exports) {
"use strict";function r(r,o){return{row:r,col:o}}function o(r,o){return r.row==o.row&&r.col==o.col}function e(r){return(r.row<<10)+r.col}function t(o){var e=o%1024;return r(o-e>>10,e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.coord=r,exports.areCoordsEquals=o,exports.hash=e,exports.fromHash=t;
},{}],"gKya":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./Player"),r=require("./NineMensMorrisGame"),n=require("./Coordinate");exports.initHandQueue=function(){for(var n=[],i=[e.Player.PLAYER_1,e.Player.PLAYER_2],o=0;o<2*r.NineMensMorrisGame.NUMBER_OF_POINTS;o++)n.push(i[o%i.length]);return n},exports.initBoard=function(){for(var i=[[1,4,7],[2,4,6],[3,4,5],[1,2,3,5,6,7],[3,4,5],[2,4,6],[1,4,7]],o=new Map,t=function(r){i[r-1].forEach(function(i){o.set(n.hash(n.coord(r,i)),e.Player.NO_PLAYER)})},a=1;a<=r.NineMensMorrisGame.BOARD_SIZE;a++)t(a);return o};
},{"./Player":"RzZT","./NineMensMorrisGame":"ew6C","./Coordinate":"We/a"}],"X+Qk":[function(require,module,exports) {
"use strict";var E;Object.defineProperty(exports,"__esModule",{value:!0}),function(E){E.SUCCESSFUL_MOVE="SUCCESSFUL_MOVE",E.FIRST_MOVE_PART="FIRST_MOVE_PART",E.RESTART_MOVE="RESTART_MOVE",E.CANNOT_MOVE="CANNOT_MOVE",E.MILL="MILL",E.OPPONENT_DESTROYED="OPPONENT_DESTROYED",E.INVALID_MILL_MOVE="INVALID_MILL_MOVE"}(E=exports.GameMoveResult||(exports.GameMoveResult={})),exports.NEXT_PLAYER_RESULTS=[E.SUCCESSFUL_MOVE,E.OPPONENT_DESTROYED];
},{}],"XIk8":[function(require,module,exports) {
"use strict";var E;Object.defineProperty(exports,"__esModule",{value:!0}),function(E){E.INITIAL="INITIAL",E.SELECT_POINT_TO_MOVE="SELECT_POINT_TO_MOVE",E.MOVE_SELECTED_POINT="MOVE_SELECTED_POINT",E.MILL="MILL",E.GAME_OVER="GAME_OVER"}(E=exports.GamePhase||(exports.GamePhase={}));
},{}],"4Crw":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function a(e,a,i){return a&&t(e.prototype,a),i&&t(e,i),e}Object.defineProperty(exports,"__esModule",{value:!0});var i=require("./Coordinate"),r=require("./GameMoveResult"),s=require("./GamePhase"),n=function(){function t(a){e(this,t),this.game=a}return a(t,[{key:"makeMove",value:function(e){if(!this.game.isGameOver())return this.game.isMill()?this.makeMillMove(e):this.game.currentPhase==s.GamePhase.INITIAL?this.makeInitialMove(e):this.makeMoveInNormalPhase(e)}},{key:"makeInitialMove",value:function(e){return this.game.isNoPlayer(e)?(this.game.addInitialPoint(e),this.game.detectMill(e)?r.GameMoveResult.MILL:(this.game.setNextPlayerMove(),r.GameMoveResult.SUCCESSFUL_MOVE)):r.GameMoveResult.CANNOT_MOVE}},{key:"makeMoveInNormalPhase",value:function(e){return this.game.currentMove?this.makeFinalMovePart(e):this.makeFirstMovePart(e)}},{key:"makeFirstMovePart",value:function(e){var t=this.game.boardService.playerAt(e);return t&&t===this.game.currentPlayer?(this.game.currentMove={point:e,neighbours:this.game.possibleMoves(e),player:this.game.currentPlayer},this.game.setPhase(s.GamePhase.MOVE_SELECTED_POINT),r.GameMoveResult.FIRST_MOVE_PART):r.GameMoveResult.CANNOT_MOVE}},{key:"makeFinalMovePart",value:function(e){return this.game.currentMove.neighbours.find(function(t){return i.areCoordsEquals(t,e)})?(this.game.movePoint(this.game.currentMove.point,e),this.game.currentMove=null,this.game.detectMill(e)?r.GameMoveResult.MILL:(this.game.setNextPlayerMove(),r.GameMoveResult.SUCCESSFUL_MOVE)):(this.game.currentMove=null,this.game.setPhase(s.GamePhase.SELECT_POINT_TO_MOVE),r.GameMoveResult.RESTART_MOVE)}},{key:"makeMillMove",value:function(e){return this.game.isOpponentPoint(e)?(this.game.removePoint(e),this.game.clearMill(),this.game.setNextPlayerMove(),r.GameMoveResult.OPPONENT_DESTROYED):r.GameMoveResult.INVALID_MILL_MOVE}}]),t}();exports.GameMoveEngine=n;
},{"./Coordinate":"We/a","./GameMoveResult":"X+Qk","./GamePhase":"XIk8"}],"ew6C":[function(require,module,exports) {
"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function a(e,t,r){return t&&i(e.prototype,t),r&&i(e,r),e}var s=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});var n=require("./Player"),o=require("./Coordinate"),l=s(require("./InitialGameHelper")),u=require("./GameMoveEngine"),h=require("./GameMoveResult"),c=require("./GamePhase"),y=3,P=2,v=function(){function i(e,t){r(this,i),this.movesHistory=e,this.boardService=t,this.state=this.resetState(),this.gameMoveEngine=new u.GameMoveEngine(this),this.boardService.resetBoard(this.state.board)}return a(i,[{key:"resetState",value:function(e){var r,i,a=e||{initialHandQueue:l.initHandQueue(),millPlayer:null,gamePhase:c.GamePhase.INITIAL,prevPhase:c.GamePhase.INITIAL,playerPoints:(r={},t(r,n.Player.PLAYER_1,0),t(r,n.Player.PLAYER_2,0),r),currentPlayerMove:n.Player.PLAYER_1,board:l.initBoard(),history:[],destroyedOpponents:(i={},t(i,n.Player.PLAYER_1,0),t(i,n.Player.PLAYER_2,0),i),currentMove:null,winner:null,movesWithoutMill:0};return this.state=this.clone(a),this.boardService.resetBoard(this.state.board),this.movesHistory.resetHistory(this.state.history),a}},{key:"getState",value:function(){return this.clone(this.state)}},{key:"clone",value:function(t){if(null===t||"object"!==e(t))return t;if(t instanceof Map)return new Map(t);var r=t.constructor();for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(t.isActiveClone=null,r[i]=this.clone(t[i]),delete t.isActiveClone);return r}},{key:"addInitialPoint",value:function(e){if(!this.state.initialHandQueue.length)throw Error("Initial hand queue is empty!");var t=this.boardService.playerAt(e),r=t===n.Player.NO_PLAYER?this.state.currentPlayerMove:t;this.boardService.setPlayer(e,r),this.state.playerPoints[this.currentPlayer]++,this.movesHistory.addInitialMove(e,this.currentPlayer)}},{key:"setNextPlayerMove",value:function(){this.state.initialHandQueue.length?(this.state.currentPlayerMove=this.state.initialHandQueue.pop(),this.setPhase(this.state.initialHandQueue.length?c.GamePhase.INITIAL:c.GamePhase.SELECT_POINT_TO_MOVE)):(this.setPhase(c.GamePhase.SELECT_POINT_TO_MOVE),this.state.currentPlayerMove=n.nextPlayer(this.state.currentPlayerMove))}},{key:"tryToMakeMove",value:function(e){return this.state.movesWithoutMill>i.MOVES_WITHOUT_MILL_TO_GAME_OVER?(this.setGameOver(),h.GameMoveResult.CANNOT_MOVE):(this.state.movesWithoutMill++,this.gameMoveEngine.makeMove(e))}},{key:"movePoint",value:function(e,t){var r=this.boardService.playerAt(e);this.boardService.playerAt(t)===n.Player.NO_PLAYER&&(this.boardService.setPlayer(t,r),this.boardService.setPlayer(e,n.Player.NO_PLAYER),this.movesHistory.addMove({from:e,to:t,player:this.currentPlayer}))}},{key:"detectMill",value:function(e){var t=this.boardService.isCoordinatePartOfMill(e);return this.state.millPlayer=t?this.currentPlayer:null,t&&(this.setPhase(c.GamePhase.MILL),this.state.movesWithoutMill=0),t}},{key:"isMill",value:function(){return null!==this.state.millPlayer}},{key:"forEachBoardPosition",value:function(e){this.boardService.forEach(e)}},{key:"isGameOver",value:function(){return this.state.gamePhase===c.GamePhase.GAME_OVER}},{key:"isNoPlayer",value:function(e){return this.boardService.playerAt(e)===n.Player.NO_PLAYER}},{key:"isOpponentPoint",value:function(e){var t=this.boardService.playerAt(e);return this.isOpponentPosition(t)}},{key:"isOpponentPosition",value:function(e){return e&&e!=n.Player.NO_PLAYER&&e!=this.currentPlayer}},{key:"possibleMoves",value:function(e){var t=this,r=this.movesHistory.getPreviousCoordinate(this.currentPlayer,e);return this.findNeighbours(e).filter(function(e){return t.isNoPlayer(e)}).filter(function(e){return!(r&&o.areCoordsEquals(r,e))})}},{key:"allOpponentPositions",value:function(){var e=this;return this.boardService.filterForCoordinates(function(t){return e.isOpponentPosition(t)})}},{key:"findNeighbours",value:function(e){return this.state.playerPoints[this.currentPlayer]===y?this.boardService.findPlayerCoordinates(n.Player.NO_PLAYER):this.boardService.findNeighbours(e)}},{key:"isFlyingActive",value:function(){return Object.values(this.state.playerPoints).some(function(e){return e===y})}},{key:"setPhase",value:function(e){this.isGameOver()||(e!==c.GamePhase.MOVE_SELECTED_POINT&&(this.state.prevPhase=this.state.gamePhase),this.state.gamePhase=e)}},{key:"findSelectableCoordinates",value:function(e){switch(this.currentPhase){case c.GamePhase.INITIAL:return this.boardService.findPlayerCoordinates(n.Player.NO_PLAYER);case c.GamePhase.SELECT_POINT_TO_MOVE:var t=this.boardService.findPlayerCoordinates(this.currentPlayer);return t.length||this.setGameOver(n.nextPlayer(this.currentPlayer)),t;case c.GamePhase.MILL:return this.allOpponentPositions();case c.GamePhase.MOVE_SELECTED_POINT:return this.possibleMoves(e);default:return[]}}},{key:"removePoint",value:function(e){var t=this.boardService.playerAt(e);this.state.playerPoints[t]--,this.state.destroyedOpponents[this.currentPlayer]++,this.boardService.setPlayer(e,n.Player.NO_PLAYER),!this.state.initialHandQueue.length&&this.state.playerPoints[t]<=P&&this.setGameOver(this.currentPlayer)}},{key:"clearMill",value:function(){this.setPhase(this.state.prevPhase),this.state.millPlayer=null}},{key:"setGameOver",value:function(e){this.setPhase(c.GamePhase.GAME_OVER),this.state.winner=e}},{key:"currentPhase",get:function(){return this.state.gamePhase}},{key:"currentPlayer",get:function(){return this.state.currentPlayerMove}},{key:"currentMove",set:function(e){this.state.currentMove=e},get:function(){return this.state.currentMove}}]),i}();v.NUMBER_OF_POINTS=9,v.BOARD_SIZE=7,v.MOVES_WITHOUT_MILL_TO_GAME_OVER=100,exports.NineMensMorrisGame=v;
},{"./Player":"RzZT","./Coordinate":"We/a","./InitialGameHelper":"gKya","./GameMoveEngine":"4Crw","./GameMoveResult":"X+Qk","./GamePhase":"XIk8"}],"TKrj":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}function i(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}Object.defineProperty(exports,"__esModule",{value:!0});var s=require("../game/Coordinate"),r=function(){function t(i,s){e(this,t),this.ctx=i,this.squareSize=s}return i(t,[{key:"setColor",value:function(e){this.ctx.strokeStyle=e,this.ctx.fillStyle=e}},{key:"moveTo",value:function(e){this.ctx.moveTo(this.squareSize*(e.col-1)+this.squareSize/2,this.squareSize*(e.row-1)+this.squareSize/2)}},{key:"lineTo",value:function(e){this.ctx.lineTo(this.squareSize*(e.col-1)+this.squareSize/2,this.squareSize*(e.row-1)+this.squareSize/2)}},{key:"strokeRect",value:function(e,t){var i=this.squareSize*(e.col-1)+this.squareSize/2,s=this.squareSize*(e.row-1)+this.squareSize/2;this.ctx.strokeRect(i,s,this.squareSize*(t.col-1)-i+this.squareSize/2,this.squareSize*(t.row-1)-s+this.squareSize/2)}},{key:"stroke",value:function(){this.ctx.stroke()}},{key:"fillCircle",value:function(e,t){this.drawCircle(e,t),this.ctx.fill()}},{key:"strokeCircle",value:function(e,t){this.drawCircle(e,t),this.ctx.stroke()}},{key:"clearAll",value:function(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.ctx.beginPath()}},{key:"getCoordinate",value:function(e){var t=Math.floor(e.y/this.squareSize),i=Math.floor(e.x/this.squareSize);return s.coord(t+1,i+1)}},{key:"drawCircle",value:function(e,t){var i=(e.col-1)*this.squareSize+this.squareSize/2,s=(e.row-1)*this.squareSize+this.squareSize/2;this.ctx.beginPath(),this.ctx.arc(i,s,t,0,2*Math.PI)}}]),t}();exports.GameCanvasContext=r;
},{"../game/Coordinate":"We/a"}],"Itjq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("../game/Player"),r=new Map;r.set(e.Player.PLAYER_1,{color:"red",radius:10,label:"Player 1"}),r.set(e.Player.PLAYER_2,{color:"blue",radius:10,label:"Player 2"}),r.set(e.Player.NO_PLAYER,{color:"black",radius:5,label:"No player"}),exports.getPaintablePlayer=function(e){return r.get(e)};
},{"../game/Player":"RzZT"}],"si8q":[function(require,module,exports) {
"use strict";function e(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}function a(e,a){for(var t=0;t<a.length;t++){var o=a[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function t(e,t,o){return t&&a(e.prototype,t),o&&a(e,o),e}Object.defineProperty(exports,"__esModule",{value:!0});var o=require("../game/NineMensMorrisGame"),s=require("../game/Coordinate"),i=require("./GameCanvasContext"),r=require("../game/Player"),n=require("../game/GameMoveResult"),l=require("./PaintablePlayer"),c=function(){function a(t,s,n){e(this,a),this.canvas=t,this.game=s,this.afterUpdate=n,this.boardColor="#212121",this.humanPlayers=[r.Player.PLAYER_1],this.fitToContainer(t),this.addMouseListener(t),this.squareSize=t.width/o.NineMensMorrisGame.BOARD_SIZE,this.gameCanvas=new i.GameCanvasContext(t.getContext("2d"),this.squareSize),this.drawInitialCanvas(),this.selectablePoints=this.game.findSelectableCoordinates()}return t(a,[{key:"onMouseClick",value:function(e){var a=this;if(this.humanPlayers.includes(this.game.currentPlayer)){var t=this.game.tryToMakeMove(e);switch(t){case n.GameMoveResult.SUCCESSFUL_MOVE:case n.GameMoveResult.OPPONENT_DESTROYED:this.redraw(),setTimeout(function(){a.afterUpdate(t,function(){return a.redraw()})});break;case n.GameMoveResult.FIRST_MOVE_PART:this.drawPossibleMoves(e);break;case n.GameMoveResult.RESTART_MOVE:this.redraw(),this.onMouseClick(e);break;case n.GameMoveResult.MILL:this.redraw(),this.drawPossibleMillMoves();break;case n.GameMoveResult.CANNOT_MOVE:}this.selectablePoints=this.game.findSelectableCoordinates(e)}else console.log("NOW IS COMPUTER TURN!")}},{key:"fitToContainer",value:function(e){e.style.width="100%",e.style.height="100%",e.width=e.offsetWidth,e.height=e.offsetHeight}},{key:"drawInitialCanvas",value:function(){this.drawLines(),this.drawDots()}},{key:"drawDots",value:function(){var e=this;this.game.forEachBoardPosition(function(a,t){var o=l.getPaintablePlayer(t);t===r.Player.NO_PLAYER?(e.gameCanvas.setColor(e.boardColor),e.gameCanvas.fillCircle(a,o.radius)):(e.gameCanvas.setColor(o.color),e.gameCanvas.fillCircle(a,o.radius))})}},{key:"drawPossibleMoves",value:function(e){var a=this;this.game.possibleMoves(e).forEach(function(e){a.gameCanvas.strokeCircle(e,15)})}},{key:"drawPossibleMillMoves",value:function(){var e=this;this.game.allOpponentPositions().forEach(function(a){e.gameCanvas.strokeCircle(a,15)})}},{key:"redraw",value:function(){this.gameCanvas.clearAll(),this.drawInitialCanvas()}},{key:"drawLines",value:function(){this.gameCanvas.setColor(this.boardColor),this.gameCanvas.strokeRect(s.coord(1,1),s.coord(7,7)),this.gameCanvas.strokeRect(s.coord(2,2),s.coord(6,6)),this.gameCanvas.strokeRect(s.coord(3,3),s.coord(5,5)),this.gameCanvas.moveTo(s.coord(1,4)),this.gameCanvas.lineTo(s.coord(3,4)),this.gameCanvas.moveTo(s.coord(5,4)),this.gameCanvas.lineTo(s.coord(7,4)),this.gameCanvas.moveTo(s.coord(4,1)),this.gameCanvas.lineTo(s.coord(4,3)),this.gameCanvas.moveTo(s.coord(4,5)),this.gameCanvas.lineTo(s.coord(4,7)),this.gameCanvas.stroke()}},{key:"addMouseListener",value:function(e){var a=this;function t(e,a){var t=e.getBoundingClientRect();return{x:a.clientX-t.left,y:a.clientY-t.top}}e.addEventListener("click",function(o){var s=t(e,o),i=a.gameCanvas.getCoordinate(s);a.onMouseClick(i)}),e.addEventListener("mousemove",function(o){var i=t(e,o),r=a.gameCanvas.getCoordinate(i),n=a.selectablePoints.some(function(e){return s.areCoordsEquals(e,r)});e.style.cursor=n?"pointer":"default"})}}]),a}();exports.GameDrawer=c;
},{"../game/NineMensMorrisGame":"ew6C","../game/Coordinate":"We/a","./GameCanvasContext":"TKrj","../game/Player":"RzZT","../game/GameMoveResult":"X+Qk","./PaintablePlayer":"Itjq"}],"jZTF":[function(require,module,exports) {
"use strict";function e(e,r){return n(e)||a(e,r)||t()}function t(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function a(e,t){var a=[],n=!0,r=!1,o=void 0;try{for(var i,u=e[Symbol.iterator]();!(n=(i=u.next()).done)&&(a.push(i.value),!t||a.length!==t);n=!0);}catch(l){r=!0,o=l}finally{try{n||null==u.return||u.return()}finally{if(r)throw o}}return a}function n(e){if(Array.isArray(e))return e}function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function u(e,t,a){return t&&i(e.prototype,t),a&&i(e,a),e}Object.defineProperty(exports,"__esModule",{value:!0});var l=require("./PaintablePlayer"),s=require("../game/GamePhase"),c=function(){function t(e){var a;o(this,t),this.game=e,this.gamePhaseToText=(r(a={},s.GamePhase.INITIAL,"Initial"),r(a,s.GamePhase.MOVE_SELECTED_POINT,"Move coordinate"),r(a,s.GamePhase.SELECT_POINT_TO_MOVE,"Select coordinate"),r(a,s.GamePhase.MILL,"Mill"),r(a,s.GamePhase.GAME_OVER,"The end"),a)}return u(t,[{key:"update",value:function(){this.updateCurrentPlayerText(),this.updateGameState(),this.updateHistoryMoves(),this.updatePoints()}},{key:"updateCurrentPlayerText",value:function(){var e=l.getPaintablePlayer(this.game.currentPlayer);console.log(e.label)}},{key:"updateGameState",value:function(){console.log("Phase: ",this.gamePhaseToText[this.game.currentPhase])}},{key:"updateHistoryMoves",value:function(){}},{key:"updatePoints",value:function(){Object.entries(this.game.getState().playerPoints).forEach(function(t){var a=e(t,2),n=a[0],r=a[1];console.log("Points:",n,r)})}}]),t}();exports.GameInfoWriter=c;
},{"./PaintablePlayer":"Itjq","../game/GamePhase":"XIk8"}],"wTVz":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function r(e,r,o){return r&&t(e.prototype,r),o&&t(e,o),e}Object.defineProperty(exports,"__esModule",{value:!0});var o=require("./Coordinate"),i=function(){function t(){e(this,t),this.history=[]}return r(t,[{key:"addMove",value:function(e){this.history.push(e)}},{key:"getHistory",value:function(){return this.history}},{key:"resetHistory",value:function(e){this.history=e}},{key:"addInitialMove",value:function(e,t){this.addMove({to:e,player:t})}},{key:"getPreviousCoordinate",value:function(e,t){for(var r=this.history.length-1;r>=0;r--)if(this.history[r].player===e)return o.areCoordsEquals(this.history[r].to,t)?this.history[r].from:null;return null}}]),t}();exports.MovesHistory=i;
},{"./Coordinate":"We/a"}],"b51U":[function(require,module,exports) {
"use strict";function o(o,r){if(!(o instanceof r))throw new TypeError("Cannot call a class as a function")}function r(o,r){for(var c=0;c<r.length;c++){var d=r[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(o,d.key,d)}}function c(o,c,d){return c&&r(o.prototype,c),d&&r(o,d),o}Object.defineProperty(exports,"__esModule",{value:!0});var d=require("./InitialGameHelper"),h=require("./Coordinate"),a=function(){function r(){var c=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d.initBoard();o(this,r),this.board=c,this.neighbours=this.initNeighbours(),this.millCheckPositions=this.initMillCheckPositions()}return c(r,[{key:"resetBoard",value:function(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d.initBoard();this.board=o}},{key:"playerAt",value:function(o){return this.playerAtHash(h.hash(o))}},{key:"playerAtHash",value:function(o){return this.board.get(o)}},{key:"setPlayer",value:function(o,r){this.board.set(h.hash(o),r)}},{key:"filterForCoordinates",value:function(o){var r=[];return this.forEach(function(c,d){o(d)&&r.push(c)}),r}},{key:"findPlayerCoordinates",value:function(o){return this.filterForCoordinates(function(r){return r===o})}},{key:"isCoordinatePartOfMill",value:function(o){var r=this,c=this.playerAt(o);return this.millCheckPositions.get(h.hash(o)).some(function(o){return o.every(function(o){return r.playerAt(o)===c})})}},{key:"forEach",value:function(o){this.board.forEach(function(r,c){o(h.fromHash(c),r)})}},{key:"findNeighbours",value:function(o){return this.neighbours.get(h.hash(o))}},{key:"initNeighbours",value:function(){return new Map([[h.hash(h.coord(1,1)),[h.coord(1,4),h.coord(4,1)]],[h.hash(h.coord(1,4)),[h.coord(1,1),h.coord(1,7),h.coord(2,4)]],[h.hash(h.coord(1,7)),[h.coord(1,4),h.coord(4,7)]],[h.hash(h.coord(2,2)),[h.coord(2,4),h.coord(4,2)]],[h.hash(h.coord(2,4)),[h.coord(1,4),h.coord(2,6),h.coord(3,4),h.coord(2,2)]],[h.hash(h.coord(2,6)),[h.coord(2,4),h.coord(4,6)]],[h.hash(h.coord(3,3)),[h.coord(3,4),h.coord(4,3)]],[h.hash(h.coord(3,4)),[h.coord(3,3),h.coord(2,4),h.coord(3,5)]],[h.hash(h.coord(3,5)),[h.coord(3,4),h.coord(4,5)]],[h.hash(h.coord(4,1)),[h.coord(1,1),h.coord(4,2),h.coord(7,1)]],[h.hash(h.coord(4,2)),[h.coord(4,1),h.coord(2,2),h.coord(6,2),h.coord(4,3)]],[h.hash(h.coord(4,3)),[h.coord(4,2),h.coord(3,3),h.coord(5,3)]],[h.hash(h.coord(4,5)),[h.coord(3,5),h.coord(5,5),h.coord(4,6)]],[h.hash(h.coord(4,6)),[h.coord(4,5),h.coord(2,6),h.coord(4,7),h.coord(6,6)]],[h.hash(h.coord(4,7)),[h.coord(4,6),h.coord(1,7),h.coord(7,7)]],[h.hash(h.coord(5,3)),[h.coord(4,3),h.coord(5,4)]],[h.hash(h.coord(5,4)),[h.coord(5,3),h.coord(5,5),h.coord(6,4)]],[h.hash(h.coord(5,5)),[h.coord(5,4),h.coord(4,5)]],[h.hash(h.coord(6,2)),[h.coord(4,2),h.coord(6,4)]],[h.hash(h.coord(6,4)),[h.coord(6,2),h.coord(5,4),h.coord(6,6),h.coord(7,4)]],[h.hash(h.coord(6,6)),[h.coord(6,4),h.coord(4,6)]],[h.hash(h.coord(7,1)),[h.coord(4,1),h.coord(7,4)]],[h.hash(h.coord(7,4)),[h.coord(7,1),h.coord(6,4),h.coord(7,7)]],[h.hash(h.coord(7,7)),[h.coord(7,4),h.coord(4,7)]]])}},{key:"initMillCheckPositions",value:function(){return new Map([[h.hash(h.coord(1,1)),[[h.coord(4,1),h.coord(7,1)],[h.coord(1,4),h.coord(1,7)]]],[h.hash(h.coord(1,4)),[[h.coord(2,4),h.coord(3,4)],[h.coord(1,1),h.coord(1,7)]]],[h.hash(h.coord(1,7)),[[h.coord(4,7),h.coord(7,7)],[h.coord(1,1),h.coord(1,4)]]],[h.hash(h.coord(2,2)),[[h.coord(2,4),h.coord(2,6)],[h.coord(4,2),h.coord(6,2)]]],[h.hash(h.coord(2,4)),[[h.coord(1,4),h.coord(3,4)],[h.coord(2,2),h.coord(2,6)]]],[h.hash(h.coord(2,6)),[[h.coord(2,2),h.coord(2,4)],[h.coord(4,6),h.coord(6,6)]]],[h.hash(h.coord(3,3)),[[h.coord(3,4),h.coord(3,5)],[h.coord(4,3),h.coord(5,3)]]],[h.hash(h.coord(3,4)),[[h.coord(1,4),h.coord(2,4)],[h.coord(3,3),h.coord(3,5)]]],[h.hash(h.coord(3,5)),[[h.coord(3,3),h.coord(3,4)],[h.coord(4,5),h.coord(5,5)]]],[h.hash(h.coord(4,1)),[[h.coord(4,2),h.coord(4,3)],[h.coord(1,1),h.coord(7,1)]]],[h.hash(h.coord(4,2)),[[h.coord(2,2),h.coord(6,2)],[h.coord(4,1),h.coord(4,3)]]],[h.hash(h.coord(4,3)),[[h.coord(3,3),h.coord(5,3)],[h.coord(4,1),h.coord(4,2)]]],[h.hash(h.coord(4,5)),[[h.coord(3,5),h.coord(5,5)],[h.coord(4,6),h.coord(4,7)]]],[h.hash(h.coord(4,6)),[[h.coord(2,6),h.coord(6,6)],[h.coord(4,5),h.coord(4,7)]]],[h.hash(h.coord(4,7)),[[h.coord(1,7),h.coord(7,7)],[h.coord(4,5),h.coord(4,6)]]],[h.hash(h.coord(5,3)),[[h.coord(3,3),h.coord(4,3)],[h.coord(5,4),h.coord(5,5)]]],[h.hash(h.coord(5,4)),[[h.coord(5,3),h.coord(5,5)],[h.coord(6,4),h.coord(7,4)]]],[h.hash(h.coord(5,5)),[[h.coord(5,3),h.coord(5,4)],[h.coord(2,6),h.coord(4,6)]]],[h.hash(h.coord(6,2)),[[h.coord(2,2),h.coord(4,2)],[h.coord(6,4),h.coord(6,6)]]],[h.hash(h.coord(6,4)),[[h.coord(6,2),h.coord(6,6)],[h.coord(5,4),h.coord(7,4)]]],[h.hash(h.coord(6,6)),[[h.coord(2,6),h.coord(4,6)],[h.coord(6,2),h.coord(6,4)]]],[h.hash(h.coord(7,1)),[[h.coord(1,1),h.coord(4,1)],[h.coord(7,4),h.coord(7,7)]]],[h.hash(h.coord(7,4)),[[h.coord(7,1),h.coord(7,7)],[h.coord(6,4),h.coord(5,4)]]],[h.hash(h.coord(7,7)),[[h.coord(7,1),h.coord(7,4)],[h.coord(1,7),h.coord(4,7)]]]])}}]),r}();exports.BoardService=a;
},{"./InitialGameHelper":"gKya","./Coordinate":"We/a"}],"xm2Z":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}Object.defineProperty(exports,"__esModule",{value:!0});var r=function(){function t(n,r){e(this,t),this.value=n,this.parent=r,this.children=[]}return n(t,[{key:"addChild",value:function(e){e.parent=this,this.children.push(e)}},{key:"getChildren",value:function(){return this.children}},{key:"setChildren",value:function(e){this.children=e}}]),t}();exports.TreeNode=r;var i=function t(n){e(this,t),this.moves=0,this.time=0,this.root=new r(n,null)};exports.Tree=i;
},{}],"qyrq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("../tree/Tree"),t=require("../game/GameMoveResult");function o(o,a){var r=o.getState(),n=[],i=function(t){n.push(new e.TreeNode({movesToValidState:t,evaluation:null},a))};return o.findSelectableCoordinates().forEach(function(e){o.resetState(r);var a=o.tryToMakeMove(e);if(a===t.GameMoveResult.MILL)o.findSelectableCoordinates(e).forEach(function(t){i([e,t])});else if(a===t.GameMoveResult.FIRST_MOVE_PART){var n=o.findSelectableCoordinates(e),l=o.getState();n.forEach(function(a){o.resetState(l),o.tryToMakeMove(a)===t.GameMoveResult.MILL?o.findSelectableCoordinates(a).forEach(function(t){i([e,a,t])}):i([e,a])})}else i([e])}),o.resetState(r),a.setChildren(n),n}exports.buildNodesToSearch=o;
},{"../tree/Tree":"xm2Z","../game/GameMoveResult":"X+Qk"}],"/cW3":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function a(e,a,r){return a&&t(e.prototype,a),r&&t(e,r),e}Object.defineProperty(exports,"__esModule",{value:!0});var r=require("../game/Player"),i=require("../tree/Tree"),n=require("../game/GamePhase"),o=require("./NodeBuilder"),u=function(){function t(a,r){e(this,t),this.heuristic=a,this.game=r,this.moves=0}return a(t,[{key:"buildGameTree",value:function(e){this.moves=0;var t=this.game.getState(),a=this.findOptimalDepth(t),r=new i.Tree({evaluation:0,movesToValidState:null}),n=new Date;this.alphaBeta(t,e,e,-1/0,1/0,a,r.root);var o=new Date-n;return this.game.resetState(t),r.moves=this.moves,r.time=o,this.moves=0,r}},{key:"alphaBeta",value:function(e,t,a,i,n,u,l){var s=this;if(this.game.resetState(e),0===u||this.game.isGameOver())return this.heuristic.calculateBoard(e,a);this.moves++;var h=function(h,m,v,c){var f=h,g=o.buildNodesToSearch(s.game,l),y=!0,d=!1,p=void 0;try{for(var b,S=g[Symbol.iterator]();!(y=(b=S.next()).done);y=!0){var T=b.value;s.game.resetState(e),T.value.movesToValidState.forEach(function(e){s.game.tryToMakeMove(e)});var w=s.alphaBeta(s.game.getState(),r.nextPlayer(t),a,i,n,u-1,T);if(T.value.evaluation=w,f=m(f,w),i=v(i,w),(n=c(n,w))<=i)break}}catch(x){d=!0,p=x}finally{try{y||null==S.return||S.return()}finally{if(d)throw p}}return f};return t===a?h(-1/0,Math.max,Math.max,function(e){return e}):h(1/0,Math.min,function(e){return e},Math.max)}},{key:"findOptimalDepth",value:function(e){return e.gamePhase===n.GamePhase.INITIAL?3:this.game.isFlyingActive()?3:4}}]),t}();exports.AlphaBetaAlgorithm=u;
},{"../game/Player":"RzZT","../tree/Tree":"xm2Z","../game/GamePhase":"XIk8","./NodeBuilder":"qyrq"}],"jSzv":[function(require,module,exports) {
"use strict";function r(r,a){return n(r)||t(r,a)||e()}function e(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function t(r,e){var t=[],n=!0,a=!1,i=void 0;try{for(var o,l=r[Symbol.iterator]();!(n=(o=l.next()).done)&&(t.push(o.value),!e||t.length!==e);n=!0);}catch(u){a=!0,i=u}finally{try{n||null==l.return||l.return()}finally{if(a)throw i}}return t}function n(r){if(Array.isArray(r))return r}function a(r){return l(r)||o(r)||i()}function i(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function o(r){if(Symbol.iterator in Object(r)||"[object Arguments]"===Object.prototype.toString.call(r))return Array.from(r)}function l(r){if(Array.isArray(r)){for(var e=0,t=new Array(r.length);e<r.length;e++)t[e]=r[e];return t}}function u(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}function c(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function f(r,e,t){return e&&c(r.prototype,e),t&&c(r,t),r}Object.defineProperty(exports,"__esModule",{value:!0});var s=require("../../game/Player"),y=require("../../game/GamePhase"),v=function(){function e(r){u(this,e),this.boardService=r,this.millPointsFactor=10}return f(e,[{key:"calculateBoard",value:function(e,t){var n=this;if(e.gamePhase===y.GamePhase.GAME_OVER)return e.winner===t?1e4:-1e4;var i=this.millPointsFactor*(e.destroyedOpponents[t]-e.destroyedOpponents[s.nextPlayer(t)]),o=0,l=a(this.boardService.millCheckPositions.entries()),u=!0,c=!1,f=void 0;try{for(var v,h=l[Symbol.iterator]();!(u=(v=h.next()).done);u=!0){var d=r(v.value,2),p=d[0],m=d[1],b=this.boardService.playerAtHash(p);if(b===s.Player.NO_PLAYER){var w=!0,A=!1,P=void 0;try{for(var g,S=m[Symbol.iterator]();!(w=(g=S.next()).done);w=!0){var O=g.value.map(function(r){return n.boardService.playerAt(r)});O[0]===O[1]&&(o+=O[0]===b?1:-1)}}catch(x){A=!0,P=x}finally{try{w||null==S.return||S.return()}finally{if(A)throw P}}}}}catch(x){c=!0,f=x}finally{try{u||null==h.return||h.return()}finally{if(c)throw f}}return i+o}}]),e}();exports.AlmostMillHeuristic=v;
},{"../../game/Player":"RzZT","../../game/GamePhase":"XIk8"}],"O5Ua":[function(require,module,exports) {
"use strict";function e(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function n(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function r(e,r,t){return r&&n(e.prototype,r),t&&n(e,t),e}Object.defineProperty(exports,"__esModule",{value:!0});var t=require("../../game/Player"),a=require("../../game/GamePhase"),o=function(){function n(){e(this,n)}return r(n,[{key:"calculateBoard",value:function(e,n){return e.gamePhase===a.GamePhase.GAME_OVER?e.winner===n?1e4:-1e4:e.destroyedOpponents[n]-e.destroyedOpponents[t.nextPlayer(n)]}}]),n}();exports.PlayerRemainingPointsHeuristic=o;
},{"../../game/Player":"RzZT","../../game/GamePhase":"XIk8"}],"0/Ws":[function(require,module,exports) {
"use strict";function e(e,r,i){return r in e?Object.defineProperty(e,r,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[r]=i,e}Object.defineProperty(exports,"__esModule",{value:!0});var r=require("./game/NineMensMorrisGame"),i=require("./paint/GameDrawer"),t=require("./paint/GameInfoWriter"),n=require("./game/MovesHistory"),o=require("./game/BoardService"),a=require("./game/Player"),l=require("./game/GameMoveResult"),u=require("./ai/AlphaBetaAlgorithm"),c=require("./ai/heuristics/AlmostMillHeuristic"),s=require("./ai/heuristics/PlayerRemainingPointsHeuristic");function m(e,r,i){var t=e.buildGameTree(i);if(t.root.getChildren().length){console.log("WITHOUT MILL",r.getState().movesWithoutMill);var n=t.root.getChildren().map(function(e){return e.value.evaluation}).reduce(function(e,r){return e>=r?e:r}),o=t.root.getChildren().map(function(e){return e.value}).filter(function(e){return e.evaluation===n}),a=o[Math.floor(Math.random()*o.length)];console.log("CURRENT PLAYER",i),console.log("Moves ".concat(t.moves,", time: ").concat(t.time)),console.log(a),a.movesToValidState.forEach(function(e){r.tryToMakeMove(e)})}else console.log("CANNOT MOVE")}function g(r,i,t,n){var o,l=(e(o={},a.Player.PLAYER_1,new u.AlphaBetaAlgorithm(new s.PlayerRemainingPointsHeuristic,i)),e(o,a.Player.PLAYER_2,new u.AlphaBetaAlgorithm(new c.AlmostMillHeuristic(r),i)),o),g=setInterval(function(){m(l[i.currentPlayer],i,i.currentPlayer),t.update(),n.redraw(),i.isGameOver()&&(console.log("GAME OVER!!!!!!!!!"),clearInterval(g))},500)}function v(e,r,t,n){new i.GameDrawer(e,r,function(e,i){t.update(),l.NEXT_PLAYER_RESULTS.includes(e)&&setTimeout(function(){m(n,r,a.Player.PLAYER_2),t.update(),i()},10)})}!function(){console.log("HELLO IN THE NINE MEN'S MORRIS GAME");var e=new o.BoardService,i=new r.NineMensMorrisGame(new n.MovesHistory,e),a=new t.GameInfoWriter(i);new u.AlphaBetaAlgorithm(new s.PlayerRemainingPointsHeuristic,i);g(e,i,a,{redraw:function(){}}),a.update()}();
},{"./game/NineMensMorrisGame":"ew6C","./paint/GameDrawer":"si8q","./paint/GameInfoWriter":"jZTF","./game/MovesHistory":"wTVz","./game/BoardService":"b51U","./game/Player":"RzZT","./game/GameMoveResult":"X+Qk","./ai/AlphaBetaAlgorithm":"/cW3","./ai/heuristics/AlmostMillHeuristic":"jSzv","./ai/heuristics/PlayerRemainingPointsHeuristic":"O5Ua"}]},{},["0/Ws"], null)
//# sourceMappingURL=app.b7c5877f.js.map