import { NineMensMorrisGame } from './game/NineMensMorrisGame';
import { GameCanvasDrawer } from './paint/GameCanvasDrawer';

(function() {
    console.log("HELLO IN THE NINE MEN'S MORRIS GAME");

    const game = new NineMensMorrisGame();
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    const drawer = new GameCanvasDrawer(canvas, game);

    debugger;
})();
