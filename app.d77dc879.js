parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"RzZT":[function(require,module,exports) {
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),function(e){e[e.PLAYER_1=0]="PLAYER_1",e[e.PLAYER_2=1]="PLAYER_2",e[e.NO_PLAYER=2]="NO_PLAYER"}(e=exports.Player||(exports.Player={})),exports.nextPlayer=function(r){return r===e.PLAYER_1?e.PLAYER_2:e.PLAYER_1};
},{}],"vQ6z":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var o="a".charCodeAt(0);function r(r,e){return{row:r,col:e,colIndex:e.charCodeAt(0)-o}}function e(r,e){return{row:r+1,col:String.fromCharCode(o+e),colIndex:e}}function t(o,r){return o.row==r.row&&o.col==r.col}exports.point=r,exports.pointFromIndexes=e,exports.arePointsEqual=t;
},{}],"gKya":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./Player"),r=require("./NineMensMorrisGame"),n=require("./Point");exports.initHandQueue=function(){for(var n=[],i=[e.Player.PLAYER_1,e.Player.PLAYER_2],o=0;o<2*r.NineMensMorrisGame.NUMBER_OF_POINTS;o++)n.push(i[o%i.length]);return n},exports.initBoard=function(){for(var i=[["a","d","g"],["b","d","f"],["c","d","e"],["a","b","c","e","f","g"],["c","d","e"],["b","d","f"],["a","d","g"]],o=[],t=function(r){i[r-1].forEach(function(i){o.push({player:e.Player.NO_PLAYER,point:n.point(r,i)})})},a=1;a<=r.NineMensMorrisGame.BOARD_SIZE;a++)t(a);return o};
},{"./Player":"RzZT","./NineMensMorrisGame":"ew6C","./Point":"vQ6z"}],"XIk8":[function(require,module,exports) {
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),function(e){e[e.INITIAL=0]="INITIAL",e[e.NORMAL=1]="NORMAL"}(e=exports.GamePhase||(exports.GamePhase={}));
},{}],"X+Qk":[function(require,module,exports) {
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),function(e){e.SUCCESSFUL_MOVE="SUCCESSFUL_MOVE",e.FIRST_MOVE_PART="FIRST_MOVE_PART",e.RESTART_MOVE="RESTART_MOVE",e.CANNOT_MOVE="CANNOT_MOVE",e.MILL="MILL"}(e=exports.GameMoveResult||(exports.GameMoveResult={}));
},{}],"4Crw":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function r(e,r,a){return r&&t(e.prototype,r),a&&t(e,a),e}Object.defineProperty(exports,"__esModule",{value:!0});var a=require("./Point"),n=require("./GamePhase"),i=require("./GameMoveResult"),o=function(){function t(r){e(this,t),this.game=r,this.currentMove=null}return r(t,[{key:"makeMove",value:function(e){return this.game.currentPhase==n.GamePhase.INITIAL?this.makeInitialMove(e):this.makeMoveInNormalPhase(e)}},{key:"makeInitialMove",value:function(e){return this.game.isNoPlayer(e)?(this.game.addInitialPoint(e),this.game.isMill(e)?i.GameMoveResult.MILL:i.GameMoveResult.SUCCESSFUL_MOVE):i.GameMoveResult.CANNOT_MOVE}},{key:"makeMoveInNormalPhase",value:function(e){return this.currentMove?this.makeFinalMovePart(e):this.makeFirstMovePart(e)}},{key:"makeFirstMovePart",value:function(e){var t=this.game.findPosition(e);return t&&t.player===this.game.currentPlayer?(this.currentMove={point:e,neighbours:this.game.findNeighbours(e),player:this.game.currentPlayer},i.GameMoveResult.FIRST_MOVE_PART):i.GameMoveResult.CANNOT_MOVE}},{key:"makeFinalMovePart",value:function(e){return this.currentMove.neighbours.find(function(t){return a.arePointsEqual(t,e)})?(this.game.movePoint(this.currentMove.point,e),this.currentMove=null,this.game.isMill(e)?i.GameMoveResult.MILL:i.GameMoveResult.SUCCESSFUL_MOVE):(this.currentMove=null,i.GameMoveResult.RESTART_MOVE)}}]),t}();exports.GameMoveEngine=o;
},{"./Point":"vQ6z","./GamePhase":"XIk8","./GameMoveResult":"X+Qk"}],"ew6C":[function(require,module,exports) {
"use strict";function e(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function n(e,n){for(var r=0;r<n.length;r++){var i=n[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function r(e,r,i){return r&&n(e.prototype,r),i&&n(e,i),e}var i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n.default=e,n};Object.defineProperty(exports,"__esModule",{value:!0});var t=require("./Player"),o=require("./Point"),a=i(require("./InitialGameHelper")),u=require("./GamePhase"),s=require("./GameMoveEngine"),l=function(){function n(){e(this,n),this.currentPlayerMove=t.Player.PLAYER_1,this.cannotGoPoints=[{from:{row:4,col:"c"},to:{row:4,col:"e"}},{from:{row:3,col:"d"},to:{row:5,col:"d"}}],this.gameMoveEngine=new s.GameMoveEngine(this),this.initialHandQueue=a.initHandQueue(),this.board=a.initBoard()}return r(n,[{key:"addInitialPoint",value:function(e){if(!this.initialHandQueue.length)throw Error("Initial hand queue is empty!");var n=this.board.find(function(n){return o.arePointsEqual(n.point,e)});n.player=n.player===t.Player.NO_PLAYER?this.currentPlayerMove:n.player,this.currentPlayerMove=this.initialHandQueue.pop()}},{key:"tryToMakeMove",value:function(e){return this.gameMoveEngine.makeMove(e)}},{key:"movePoint",value:function(e,n){var r=this.board.find(function(n){return o.arePointsEqual(n.point,e)}),i=this.board.find(function(e){return o.arePointsEqual(e.point,n)});i.player===t.Player.NO_PLAYER&&(i.player=r.player,r.player=t.Player.NO_PLAYER,this.currentPlayerMove=t.nextPlayer(this.currentPlayerMove))}},{key:"isMill",value:function(e){var n=this.findColsAndRowsInLine(e),r=n.colsInLine,i=n.rowsInLine,t=function(e,n){for(var r=e.findIndex(function(e){return o.arePointsEqual(e.point,n)}),i=0;i<e.length;i+=3)if(r>=i&&r<i+3){for(var t=e[r].player,a=0,u=0;u<3;u++)t==e[i+u].player&&a++;if(3==a)return!0}return!1};return t(r,e)||t(i,e)}},{key:"isNoPlayer",value:function(e){var n=this.findPosition(e);return n&&n.player==t.Player.NO_PLAYER}},{key:"findPosition",value:function(e){return this.board.find(function(n){return o.arePointsEqual(n.point,e)})}},{key:"possibleMoves",value:function(e){var n=this;return this.findNeighbours(e).filter(function(e){return n.isNoPlayer(e)})}},{key:"findNeighbours",value:function(e){var n=this.findColsAndRowsInLine(e),r=n.colsInLine,i=n.rowsInLine,t=this.findNearestPoints(e,r,i);return this.filterNeighboursImpossibleToGo(e,t),t}},{key:"findColsAndRowsInLine",value:function(e){return this.board.reduce(function(n,r){return o.arePointsEqual(r.point,e)?(n.rowsInLine.push(r),n.colsInLine.push(r)):r.point.colIndex===e.colIndex?n.colsInLine.push(r):r.point.row===e.row&&n.rowsInLine.push(r),n},{colsInLine:[],rowsInLine:[]})}},{key:"findNearestPoints",value:function(e,n,r){var i=n.findIndex(function(n){return o.arePointsEqual(n.point,e)}),t=r.findIndex(function(n){return o.arePointsEqual(n.point,e)});return[n[i+1],n[i-1],r[t+1],r[t-1]].filter(function(e){return e}).map(function(e){return e.point})}},{key:"filterNeighboursImpossibleToGo",value:function(e,n){this.cannotGoPoints.forEach(function(r){var i=r.from,t=r.to;if(o.arePointsEqual(e,i)){var a=n.findIndex(function(e){return o.arePointsEqual(e,t)});n.splice(a,1)}else if(o.arePointsEqual(e,t)){var u=n.findIndex(function(e){return o.arePointsEqual(e,i)});n.splice(u,1)}})}},{key:"currentPhase",get:function(){return this.initialHandQueue.length?u.GamePhase.INITIAL:u.GamePhase.NORMAL}},{key:"currentPlayer",get:function(){return this.currentPlayerMove}}]),n}();l.NUMBER_OF_POINTS=9,l.BOARD_SIZE=7,exports.NineMensMorrisGame=l;
},{"./Player":"RzZT","./Point":"vQ6z","./InitialGameHelper":"gKya","./GamePhase":"XIk8","./GameMoveEngine":"4Crw"}],"TKrj":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}function i(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}Object.defineProperty(exports,"__esModule",{value:!0});var s=require("../game/Point"),r=function(){function t(i,s){e(this,t),this.ctx=i,this.squareSize=s}return i(t,[{key:"setColor",value:function(e){this.ctx.strokeStyle=e,this.ctx.fillStyle=e}},{key:"moveTo",value:function(e){this.ctx.moveTo(this.squareSize*e.colIndex+this.squareSize/2,this.squareSize*(e.row-1)+this.squareSize/2)}},{key:"lineTo",value:function(e){this.ctx.lineTo(this.squareSize*e.colIndex+this.squareSize/2,this.squareSize*(e.row-1)+this.squareSize/2)}},{key:"strokeRect",value:function(e,t){var i=this.squareSize*e.colIndex+this.squareSize/2,s=this.squareSize*(e.row-1)+this.squareSize/2;this.ctx.strokeRect(i,s,this.squareSize*t.colIndex-i+this.squareSize/2,this.squareSize*(t.row-1)-s+this.squareSize/2)}},{key:"stroke",value:function(){this.ctx.stroke()}},{key:"fillCircle",value:function(e,t){this.drawCircle(e,t),this.ctx.fill()}},{key:"strokeCircle",value:function(e,t){this.drawCircle(e,t),this.ctx.stroke()}},{key:"clearCircle",value:function(e,t){this.drawCircle(e,t),this.ctx.clip(),this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}},{key:"clearAll",value:function(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.ctx.beginPath()}},{key:"getPoint",value:function(e){var t=Math.floor(e.y/this.squareSize),i=Math.floor(e.x/this.squareSize);return s.pointFromIndexes(t,i)}},{key:"drawCircle",value:function(e,t){var i=e.colIndex*this.squareSize+this.squareSize/2,s=(e.row-1)*this.squareSize+this.squareSize/2;this.ctx.beginPath(),this.ctx.arc(i,s,t,0,2*Math.PI)}}]),t}();exports.GameCanvasContext=r;
},{"../game/Point":"vQ6z"}],"Itjq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("../game/Player"),r=new Map;r.set(e.Player.PLAYER_1,{color:"red",radius:10,label:"Player 1"}),r.set(e.Player.PLAYER_2,{color:"blue",radius:10,label:"Player 2"}),r.set(e.Player.NO_PLAYER,{color:"black",radius:5,label:"No player"}),exports.getPaintablePlayer=function(e){return r.get(e)};
},{"../game/Player":"RzZT"}],"si8q":[function(require,module,exports) {
"use strict";function e(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}function a(e,a){for(var t=0;t<a.length;t++){var i=a[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function t(e,t,i){return t&&a(e.prototype,t),i&&a(e,i),e}Object.defineProperty(exports,"__esModule",{value:!0});var i=require("../game/NineMensMorrisGame"),n=require("../game/Point"),s=require("./GameCanvasContext"),o=require("../game/Player"),r=require("../game/GameMoveResult"),l=require("./PaintablePlayer"),v=function(){function a(t,n,o){e(this,a),this.canvas=t,this.game=n,this.afterUpdate=o,this.boardColor="#212121",this.fitToContainer(t),this.addMouseListener(t),this.squareSize=t.width/i.NineMensMorrisGame.BOARD_SIZE,this.gameCanvas=new s.GameCanvasContext(t.getContext("2d"),this.squareSize),this.drawInitialCanvas()}return t(a,[{key:"onMouseClick",value:function(e){var a=this.game.tryToMakeMove(e);switch(console.log(a),a){case r.GameMoveResult.SUCCESSFUL_MOVE:case r.GameMoveResult.MILL:this.resetCanvasAndDrawGame();break;case r.GameMoveResult.FIRST_MOVE_PART:this.drawPossibleMoves(e);break;case r.GameMoveResult.RESTART_MOVE:this.resetCanvasAndDrawGame(),this.onMouseClick(e);break;case r.GameMoveResult.CANNOT_MOVE:}this.afterUpdate()}},{key:"fitToContainer",value:function(e){e.style.width="100%",e.style.height="100%",e.width=e.offsetWidth,e.height=e.offsetHeight}},{key:"drawInitialCanvas",value:function(){this.drawLines(),this.drawDots()}},{key:"drawDots",value:function(){var e=this;this.game.board.forEach(function(a){var t=l.getPaintablePlayer(a.player);a.player===o.Player.NO_PLAYER?(e.gameCanvas.setColor(e.boardColor),e.gameCanvas.fillCircle(a.point,t.radius)):(e.gameCanvas.setColor(t.color),e.gameCanvas.fillCircle(a.point,t.radius))})}},{key:"drawPossibleMoves",value:function(e){var a=this;this.game.possibleMoves(e).forEach(function(e){a.gameCanvas.strokeCircle(e,15)})}},{key:"resetCanvasAndDrawGame",value:function(){this.gameCanvas.clearAll(),this.drawInitialCanvas()}},{key:"drawLines",value:function(){this.gameCanvas.setColor(this.boardColor),this.gameCanvas.strokeRect(n.point(1,"a"),n.point(7,"g")),this.gameCanvas.strokeRect(n.point(2,"b"),n.point(6,"f")),this.gameCanvas.strokeRect(n.point(3,"c"),n.point(5,"e")),this.gameCanvas.moveTo(n.point(1,"d")),this.gameCanvas.lineTo(n.point(3,"d")),this.gameCanvas.moveTo(n.point(5,"d")),this.gameCanvas.lineTo(n.point(7,"d")),this.gameCanvas.moveTo(n.point(4,"a")),this.gameCanvas.lineTo(n.point(4,"c")),this.gameCanvas.moveTo(n.point(4,"e")),this.gameCanvas.lineTo(n.point(4,"g")),this.gameCanvas.stroke()}},{key:"addMouseListener",value:function(e){var a=this;e.addEventListener("click",function(t){var i=function(e,a){var t=e.getBoundingClientRect();return{x:a.clientX-t.left,y:a.clientY-t.top}}(e,t),n=a.gameCanvas.getPoint(i);a.onMouseClick(n)})}}]),a}();exports.GameDrawer=v;
},{"../game/NineMensMorrisGame":"ew6C","../game/Point":"vQ6z","./GameCanvasContext":"TKrj","../game/Player":"RzZT","../game/GameMoveResult":"X+Qk","./PaintablePlayer":"Itjq"}],"jZTF":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function r(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}Object.defineProperty(exports,"__esModule",{value:!0});var n=require("./PaintablePlayer"),a=function(){function t(r){e(this,t),this.game=r,this.currentPlayerText=document.getElementById("current-player-text")}return r(t,[{key:"update",value:function(){this.updateCurrentPlayerText()}},{key:"updateCurrentPlayerText",value:function(){var e=n.getPaintablePlayer(this.game.currentPlayer);this.currentPlayerText.innerText=e.label,this.currentPlayerText.style.color=e.color}}]),t}();exports.GameInfoWriter=a;
},{"./PaintablePlayer":"Itjq"}],"0/Ws":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./game/NineMensMorrisGame"),r=require("./paint/GameDrawer"),n=require("./paint/GameInfoWriter");!function(){console.log("HELLO IN THE NINE MEN'S MORRIS GAME");var a=new e.NineMensMorrisGame,t=document.getElementById("game-canvas"),i=new n.GameInfoWriter(a);new r.GameDrawer(t,a,function(){return i.update()});i.update()}();
},{"./game/NineMensMorrisGame":"ew6C","./paint/GameDrawer":"si8q","./paint/GameInfoWriter":"jZTF"}]},{},["0/Ws"], null)
//# sourceMappingURL=app.d77dc879.js.map