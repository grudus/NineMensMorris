import { NineMensMorrisGame } from './game/NineMensMorrisGame';
import { MovesHistory } from './game/MovesHistory';
import { BoardService } from './game/BoardService';
import { Player } from './game/Player';
import { Coordinate } from './game/Coordinate';
import { AlphaBetaAlgorithm } from './ai/AlphaBetaAlgorithm';
import { GameAlgorithm } from './ai/GameAlgorithm';
import { AlmostMillHeuristic } from './ai/heuristics/AlmostMillHeuristic';
import { PlayerRemainingPointsHeuristic } from './ai/heuristics/PlayerRemainingPointsHeuristic';
import { MillInNextMoveHeuristic } from './ai/heuristics/MillInNextMoveHeuristic';
import { MinMaxAlgorithm } from "./ai/MinMaxAlgorithm";

function endGameAndPrintResults(game: NineMensMorrisGame, alghoritms, totalMoves, totalTime, intervalId) {
    let state = game.getState();
    console.log('GAME OVER', state.gamePhase);
    clearInterval(intervalId);
    console.log('Player,Alghoritm,Heuristic,TotalMoves,TotalTime,Points,Winner,depth');

    for (const p of [Player.PLAYER_1, Player.PLAYER_2]) {
        console.log(
            `${p},${alghoritms[p].name()},${totalMoves[p]},${totalTime[p]},${state.playerPoints[p]},${state.winner},${
                alghoritms[p].depth
            }`,
        );
    }
}

function makeComputerMove(
    algorithm: GameAlgorithm,
    game: NineMensMorrisGame,
    player: Player,
    alghoritms,
    totalMoves,
    totalTime,
    intervalId,
) {
    const tree = algorithm.buildGameTree(player);

    if (!tree.root.getChildren().length) {
        endGameAndPrintResults(game, alghoritms, totalMoves, totalTime, intervalId);
        return;
    }

    let state = game.getState();
    console.log(
        `Time: ${tree.time}, Moves: ${tree.moves}, WithoutMill: ${state.movesWithoutMill}, Points1: ${
            state.playerPoints[Player.PLAYER_1]
        }, Points2: ${state.playerPoints[Player.PLAYER_2]}`,
    );

    const bestEvaluation = tree.root
        .getChildren()
        .map(node => node.value.evaluation)
        .reduce((acc, cur) => (acc >= cur ? acc : cur));

    const bestMoves = tree.root
        .getChildren()
        .map(node => node.value)
        .filter(a => a.evaluation === bestEvaluation);

    const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];

    totalMoves[player] += tree.moves;
    totalTime[player] += tree.time;

    move.movesToValidState.forEach((a: Coordinate) => {
        game.tryToMakeMove(a);
    });
}

function aiBattle(boardService: BoardService, game: NineMensMorrisGame, alghoritms, totalMoves, totalTime) {
    const intervalId = setInterval(() => {
        makeComputerMove(
            alghoritms[game.currentPlayer],
            game,
            game.currentPlayer,
            alghoritms,
            totalMoves,
            totalTime,
            intervalId,
        );

        if (game.isGameOver()) {
            endGameAndPrintResults(game, alghoritms, totalMoves, totalTime, intervalId);
        }
    }, 500);
}

(function() {
    console.log("HELLO IN THE NINE MEN'S MORRIS GAME");

    const boardService = new BoardService();

    const game = new NineMensMorrisGame(new MovesHistory(), boardService);

    const heuristics = [
        new PlayerRemainingPointsHeuristic(),
        new AlmostMillHeuristic(boardService),
        new MillInNextMoveHeuristic(boardService),
    ];

    const algorithms = {
        [Player.PLAYER_1]: new MinMaxAlgorithm(heuristics[1], game, 3),
        [Player.PLAYER_2]: new AlphaBetaAlgorithm(heuristics[1], game, 5),
    };

    let totalTime = { [Player.PLAYER_1]: 0, [Player.PLAYER_2]: 0 };
    let totalMoves = { [Player.PLAYER_1]: 0, [Player.PLAYER_2]: 0 };

    aiBattle(boardService, game, algorithms, totalMoves, totalTime);
})();
