import { NineMensMorrisGame } from './game/NineMensMorrisGame';
import { GameDrawer } from './paint/GameDrawer';
import { GameInfoWriter } from './paint/GameInfoWriter';
import { MovesHistory } from './game/MovesHistory';
import { BoardService } from './game/BoardService';

(function() {
    console.log("HELLO IN THE NINE MEN'S MORRIS GAME");

    const game = new NineMensMorrisGame(new MovesHistory(), new BoardService());
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    const infoWriter = new GameInfoWriter(game);
    const drawer = new GameDrawer(canvas, game, type => infoWriter.update(type));

    infoWriter.update();
})();
