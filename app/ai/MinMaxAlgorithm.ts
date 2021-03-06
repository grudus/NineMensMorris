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

export class MinMaxAlgorithm implements GameAlgorithm {
    public constructor(private heuristic: GameHeuristic, private game: NineMensMorrisGame) {}

    public buildGameTree(currentPlayer: Player): Tree<GameNodeValue> {
        const initialState = this.game.getState();
        const depth = this.findOptimalDepth(initialState);

        const tree = new Tree<GameNodeValue>({ evaluation: 0, movesToValidState: null });
        this.minMax(initialState, currentPlayer, currentPlayer, depth, tree.root);
        this.game.resetState(initialState);
        return tree;
    }

    private minMax(
        state: GameState,
        currentPlayer: Player,
        maximizingPlayer: Player,
        depth: number,
        parentNode: TreeNode<GameNodeValue>,
    ): number {
        this.game.resetState(state);

        if (depth === 0 || this.game.isGameOver()) {
            return this.heuristic.calculateBoard(state, Player.PLAYER_2);
        }

        const _minOrMax = (initialEvaluation: number, betterEvaluation: BetterEvaluation): number => {
            let bestEvaluation = initialEvaluation;

            buildNodesToSearch(this.game, parentNode).forEach((node: TreeNode<GameNodeValue>) => {
                this.game.resetState(state);

                node.value.movesToValidState.forEach(coord => {
                    this.game.tryToMakeMove(coord);
                });

                const evaluation = this.minMax(
                    this.game.getState(),
                    nextPlayer(currentPlayer),
                    maximizingPlayer,
                    depth - 1,
                    node,
                );

                node.value.evaluation = evaluation;
                bestEvaluation = betterEvaluation(bestEvaluation, evaluation);
            });

            return bestEvaluation;
        };

        if (currentPlayer === maximizingPlayer) {
            return _minOrMax(-Infinity, Math.max);
        } else {
            return _minOrMax(Infinity, Math.min);
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
