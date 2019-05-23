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
import { AlmostMillHeuristic } from './ai/heuristics/AlmostMillHeuristic';
import { PlayerRemainingPointsHeuristic } from './ai/heuristics/PlayerRemainingPointsHeuristic';

let intervalId = 0;
let totalTime = { [Player.PLAYER_1]: 0, [Player.PLAYER_2]: 0 };
let totalMoves = { [Player.PLAYER_1]: 0, [Player.PLAYER_2]: 0 };

function endGameAndPrintResults(game: NineMensMorrisGame) {
    let state = game.getState();
    console.log('GAME OVER', state.gamePhase);
    clearInterval(intervalId);
    console.log(
        'totalMovesPlayer1,totalMovesPlayer2,totalTimePlayer1,totalTimePlayer2,winner,player1Points,player2Points',
    );
    console.log(
        `${totalMoves[Player.PLAYER_1]},${totalMoves[Player.PLAYER_2]},${totalTime[Player.PLAYER_1]},${
            totalTime[Player.PLAYER_2]
        },${state.winner},${state.playerPoints[Player.PLAYER_1]},${state.playerPoints[Player.PLAYER_2]}`,
    );
}

function makeComputerMove(algorithm: GameAlgorithm, game: NineMensMorrisGame, player: Player) {
    const tree = algorithm.buildGameTree(player);

    if (!tree.root.getChildren().length) {
        endGameAndPrintResults(game);
        return;
    }

    console.log('WITHOUT MILL', game.getState().movesWithoutMill);

    const bestEvaluation = tree.root
        .getChildren()
        .map(node => node.value.evaluation)
        .reduce((acc, cur) => (acc >= cur ? acc : cur));

    const bestMoves = tree.root
        .getChildren()
        .map(node => node.value)
        .filter(a => a.evaluation === bestEvaluation);

    const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];

    console.log('CURRENT PLAYER', player);
    console.log(`Moves ${tree.moves}, time: ${tree.time}`);
    console.log(move);

    totalMoves[player] += tree.moves;
    totalTime[player] += tree.time;

    move.movesToValidState.forEach((a: Coordinate) => {
        game.tryToMakeMove(a);
    });
}

function aiBattle(
    boardService: BoardService,
    game: NineMensMorrisGame,
    infoWriter: GameInfoWriter,
    drawer: GameDrawer,
) {
    const algorithms = {
        [Player.PLAYER_1]: new AlphaBetaAlgorithm(new PlayerRemainingPointsHeuristic(), game),
        [Player.PLAYER_2]: new AlphaBetaAlgorithm(new AlmostMillHeuristic(boardService), game),
    };

    intervalId = setInterval(() => {
        makeComputerMove(algorithms[game.currentPlayer], game, game.currentPlayer);
        infoWriter.update();
        drawer.redraw();

        if (game.isGameOver()) {
            endGameAndPrintResults(game);
        }
    }, 500);
}

function userComputer(canvas, game, infoWriter, minMaxAlgorithm) {
    const drawer = new GameDrawer(canvas, game, (result: GameMoveResult, redrawFunc) => {
        infoWriter.update();
        if (NEXT_PLAYER_RESULTS.includes(result)) {
            setTimeout(() => {
                makeComputerMove(minMaxAlgorithm, game, Player.PLAYER_2);
                infoWriter.update();
                redrawFunc();
            }, 10);
        }
    });
}

(function() {
    console.log("HELLO IN THE NINE MEN'S MORRIS GAME");

    const boardService = new BoardService();
    const game = new NineMensMorrisGame(new MovesHistory(), boardService);
    // const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    const infoWriter = new GameInfoWriter(game);

    const minMaxAlgorithm = new AlphaBetaAlgorithm(new PlayerRemainingPointsHeuristic(), game);

    // userComputer(canvas, game, infoWriter, minMaxAlgorithm);

    const MockDrawer = () => {
        return {
            redraw: () => {},
        };
    };
    // @ts-ignore
    aiBattle(boardService, game, infoWriter, MockDrawer());
    infoWriter.update();
})();
