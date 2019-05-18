import { GameHeuristic } from './heuristics/GameHeuristic';
import { nextPlayer, Player } from '../game/Player';
import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { Tree, TreeNode } from '../tree/Tree';
import { GameNodeValue } from '../tree/GameNodeValue';
import { GameMoveResult } from '../game/GameMoveResult';
import { Coordinate } from '../game/Coordinate';
import { GameState } from '../game/GameState';
import { GamePhase } from '../game/GamePhase';

type BetterEvaluation = (a: number, b: number) => number;

export class MinMaxAlgorithm {
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

            this.buildNodesToSearch(parentNode).forEach((node: TreeNode<GameNodeValue>) => {
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

    private buildNodesToSearch(parentNode: TreeNode<GameNodeValue>): TreeNode<GameNodeValue>[] {
        const state = this.game.getState();
        const nodesToSearch: TreeNode<GameNodeValue>[] = [];

        const addToSearch = (movesToValidState: Coordinate[]) => {
            nodesToSearch.push(new TreeNode({ movesToValidState, evaluation: null }, parentNode));
        };

        this.game.findSelectableCoordinates().forEach(coord => {
            this.game.resetState(state);
            const result = this.game.tryToMakeMove(coord);

            if (result === GameMoveResult.MILL) {
                this.game.findSelectableCoordinates(coord).forEach(millCoord => {
                    addToSearch([coord, millCoord]);
                });
            } else if (result === GameMoveResult.FIRST_MOVE_PART) {
                const coordinatesForFinalMove = this.game.findSelectableCoordinates(coord);
                const stateAfterFirstMove = this.game.getState();

                coordinatesForFinalMove.forEach(finalMoveCoordinate => {
                    this.game.resetState(stateAfterFirstMove);
                    const finalMoveResult = this.game.tryToMakeMove(finalMoveCoordinate);

                    if (finalMoveResult === GameMoveResult.MILL) {
                        this.game.findSelectableCoordinates(finalMoveCoordinate).forEach(millCoord => {
                            addToSearch([coord, finalMoveCoordinate, millCoord]);
                        });
                    } else {
                        addToSearch([coord, finalMoveCoordinate]);
                    }
                });
            } else {
                addToSearch([coord]);
            }
        });

        this.game.resetState(state);
        parentNode.setChildren(nodesToSearch);
        return nodesToSearch;
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
