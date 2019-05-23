import { GameHeuristic } from './heuristics/GameHeuristic';
import { nextPlayer, Player } from '../game/Player';
import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { Tree, TreeNode } from '../tree/Tree';
import { GameNodeValue } from '../tree/GameNodeValue';
import { GameState } from '../game/GameState';
import { GamePhase } from '../game/GamePhase';
import { GameAlgorithm } from './GameAlgorithm';
import { buildNodesToSearch } from './NodeBuilder';

type BetterEvaluation = (a: number, b: number) => number;
type BetterAlpha = (alpha: number, evaluation: number) => number;
type BetterBeta = (beta: number, evaluation: number) => number;

export class AlphaBetaAlgorithm implements GameAlgorithm {
    private moves = 0;

    public constructor(private heuristic: GameHeuristic, private game: NineMensMorrisGame) {}

    public buildGameTree(maximizingPlayer: Player): Tree<GameNodeValue> {
        this.moves = 0;
        const initialState = this.game.getState();
        const depth = this.findOptimalDepth(initialState);
        const tree = new Tree<GameNodeValue>({ evaluation: 0, movesToValidState: null });

        const timeStart = new Date();
        this.alphaBeta(initialState, maximizingPlayer, maximizingPlayer, -Infinity, Infinity, depth, tree.root);
        // @ts-ignore
        const timeElapsed = new Date() - timeStart;
        this.game.resetState(initialState);

        tree.moves = this.moves;
        tree.time = timeElapsed;
        this.moves = 0;

        return tree;
    }

    private alphaBeta(
        state: GameState,
        currentPlayer: Player,
        maximizingPlayer: Player,
        alpha: number,
        beta: number,
        depth: number,
        parentNode: TreeNode<GameNodeValue>,
    ): number {
        this.game.resetState(state);

        if (depth === 0 || this.game.isGameOver()) {
            return this.heuristic.calculateBoard(state, maximizingPlayer);
        }

        this.moves++;

        const _alphaOrBeta = (
            initialEvaluation: number,
            betterEvaluation: BetterEvaluation,
            nextAlpha: BetterAlpha,
            nextBeta: BetterBeta,
        ): number => {
            let bestEvaluation = initialEvaluation;

            const nodesToSearch = buildNodesToSearch(this.game, parentNode);

            for (const node of nodesToSearch) {
                this.game.resetState(state);

                node.value.movesToValidState.forEach(coord => {
                    this.game.tryToMakeMove(coord);
                });

                const evaluation = this.alphaBeta(
                    this.game.getState(),
                    nextPlayer(currentPlayer),
                    maximizingPlayer,
                    alpha,
                    beta,
                    depth - 1,
                    node,
                );

                node.value.evaluation = evaluation;
                bestEvaluation = betterEvaluation(bestEvaluation, evaluation);
                alpha = nextAlpha(alpha, evaluation);
                beta = nextBeta(beta, evaluation);

                if (beta <= alpha) {
                    break;
                }
            }

            return bestEvaluation;
        };

        if (currentPlayer === maximizingPlayer) {
            return _alphaOrBeta(-Infinity, Math.max, Math.max, _beta => _beta);
        } else {
            return _alphaOrBeta(Infinity, Math.min, _alpha => _alpha, Math.max);
        }
    }

    private findOptimalDepth(state: GameState): number {
        if (state.gamePhase === GamePhase.INITIAL) {
            return 3;
        }
        if (this.game.isFlyingActive()) {
            return 3;
        }
        return 4;
    }
}
