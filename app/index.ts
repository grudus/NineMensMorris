import { NineMensMorrisGame, NineMensMorrisState } from './game/NineMensMorrisGame';
import { GameDrawer } from './paint/GameDrawer';
import { GameInfoWriter } from './paint/GameInfoWriter';
import { MovesHistory } from './game/MovesHistory';
import { BoardService } from './game/BoardService';
import { MinMaxAlgorithm } from './ai/MinMaxAlgorithm';
import { PlayerRemainingPointsHeuristic } from './ai/heuristics/PlayerRemainingPointsHeuristic';
import { Player } from './game/Player';
import { GameMoveResult, NEXT_PLAYER_RESULTS } from './game/GameMoveResult';
import { Coordinate } from './game/Coordinate';

function makeComputerMove(minMaxAlgorithm: MinMaxAlgorithm, state: NineMensMorrisState, game: NineMensMorrisGame) {
    const tree = minMaxAlgorithm.minMax(state, Player.PLAYER_2);

    const bestMove = tree.root
        .getChildren()
        .map(node => node.value)
        .filter(value => value.validMove)
        .reduce((acc, cur) => (acc.evaluation >= cur.evaluation ? acc : cur));

    const possibleMoves = tree.root
        .getChildren()
        .map(node => node.value)
        .filter(value => value.validMove)
        .filter(a => a.evaluation === bestMove.evaluation)
        .filter(a => a && a.move);
    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];


    game.resetState(state);
    game.tryToMakeMove(move.move);
    move.nextMoves.forEach((a: Coordinate) => {
        game.tryToMakeMove(a);
    });
}

(function() {
    console.log("HELLO IN THE NINE MEN'S MORRIS GAME");

    const game = new NineMensMorrisGame(new MovesHistory(), new BoardService());
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    const infoWriter = new GameInfoWriter(game);

    const minMaxAlgorithm = new MinMaxAlgorithm(new PlayerRemainingPointsHeuristic(), game);

    const drawer = new GameDrawer(canvas, game, (result: GameMoveResult) => {
        const state = game.getState();
        if (NEXT_PLAYER_RESULTS.includes(result)) makeComputerMove(minMaxAlgorithm, state, game);
        infoWriter.update();
    });

    infoWriter.update();
})();
