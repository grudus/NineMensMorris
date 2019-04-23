import { NineMensMorrisGame } from './game/NineMensMorrisGame';
import { GameDrawer } from './paint/GameDrawer';

(function() {
    console.log("HELLO IN THE NINE MEN'S MORRIS GAME");

    const game = new NineMensMorrisGame();
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    const drawer = new GameDrawer(canvas, game);
})();
