import { NineMensMorrisGame } from './game/NineMensMorrisGame';
import { GameDrawer } from './paint/GameDrawer';
import { GameInfoWriter } from './paint/GameInfoWriter';
import { MovesHistory } from './game/MovesHistory';
import { BoardService } from './game/BoardService';
import { Player } from './game/Player';
import { GameMoveResult, NEXT_PLAYER_RESULTS } from './game/GameMoveResult';
import { Coordinate } from './game/Coordinate';
import { AlphaBetaAlgorithm } from './ai/AlphaBetaAlgorithm';
import { GameAlgorithm } from './ai/GameAlgorithm';
import { MillInNextMoveHeuristic } from './ai/heuristics/MillInNextMoveHeuristic';

function makeComputerMove(algorithm: GameAlgorithm, game: NineMensMorrisGame) {
    const tree = algorithm.buildGameTree(Player.PLAYER_2);

    console.log(tree.root.getChildren());

    const bestEvaluation = tree.root
        .getChildren()
        .map(node => node.value.evaluation)
        .reduce((acc, cur) => (acc >= cur ? acc : cur));

    const bestMoves = tree.root
        .getChildren()
        .map(node => node.value)
        .filter(a => a.evaluation === bestEvaluation);

    const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];

    console.log(move);

    move.movesToValidState.forEach((a: Coordinate) => {
        game.tryToMakeMove(a);
    });
}

(function() {
    console.log("HELLO IN THE NINE MEN'S MORRIS GAME");

    const boardService = new BoardService();
    const game = new NineMensMorrisGame(new MovesHistory(), boardService);
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    const infoWriter = new GameInfoWriter(game);

    const minMaxAlgorithm = new AlphaBetaAlgorithm(new MillInNextMoveHeuristic(boardService), game);

    const drawer = new GameDrawer(canvas, game, (result: GameMoveResult, redrawFunc) => {
        infoWriter.update();
        if (NEXT_PLAYER_RESULTS.includes(result)) {
            setTimeout(() => {
                makeComputerMove(minMaxAlgorithm, game);
                infoWriter.update();
                redrawFunc();
            }, 10);
        }
    });

    infoWriter.update();
})();
