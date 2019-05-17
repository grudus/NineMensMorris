import { GameHeuristic } from './heuristics/GameHeuristic';
import { nextPlayer, Player } from '../game/Player';
import { NineMensMorrisGame, NineMensMorrisState } from '../game/NineMensMorrisGame';
import { Tree, TreeNode } from '../tree/Tree';
import { GameNodeValue } from '../tree/GameNodeValue';
import { Coordinate } from '../game/Coordinate';
import { GameMoveResult } from '../game/GameMoveResult';

export class MinMaxAlgorithm {
    public constructor(private heuristic: GameHeuristic, private game: NineMensMorrisGame) {}

    public minMax(state: NineMensMorrisState, currentPlayer: Player): Tree<GameNodeValue> {
        const tree: Tree<GameNodeValue> = new Tree();
        tree.root = new TreeNode<GameNodeValue>({ evaluation: 0, move: null, validMove: false }, null);
        this._minMax(state, 3, currentPlayer, true, tree.root, currentPlayer);
        return tree;
    }

    private _minMax(
        state: NineMensMorrisState,
        depth: number,
        currentPlayer: Player,
        isMaximizingPlayer: boolean,
        parentNode: TreeNode<GameNodeValue>,
        initialPlayer: Player,
    ): number {
        this.game.resetState(state);

        if (depth === 0 || this.game.isGameOver()) {
            return this.heuristic.calculateBoard(state, Player.PLAYER_2);
        }

        const doComputerMove = (initEval, nextEval): number => {
            let bestEval = initEval;

            this.game.findSelectableCoordinates().forEach((coord: Coordinate) => {
                this.game.resetState(state);
                const result = this.game.tryToMakeMove(coord);

                const newNode = new TreeNode<GameNodeValue>(
                    { evaluation: null, move: coord, nextMoves: [], validMove: true },
                    parentNode,
                );

                if (result === GameMoveResult.MILL) {
                    const millCoord = this.game.findSelectableCoordinates(coord)[0];
                    this.game.tryToMakeMove(millCoord);
                    newNode.value.nextMoves.push(millCoord);
                }

                if (result === GameMoveResult.FIRST_MOVE_PART) {
                    const nextMove = this.game.findSelectableCoordinates(coord)[0];
                    if (!nextMove) {
                        newNode.value.validMove = false;
                        this.game.resetState(state);
                    } else {
                        const nextMoveResult = this.game.tryToMakeMove(nextMove);
                        newNode.value.nextMoves.push(nextMove);
                        if (nextMoveResult === GameMoveResult.MILL) {
                            const millCoord = this.game.findSelectableCoordinates(coord)[0];
                            this.game.tryToMakeMove(millCoord);
                            newNode.value.nextMoves.push(millCoord);
                        }
                    }
                }

                parentNode.addChild(newNode);
                const updatedState = this.game.getState();

                const evaluation = this._minMax(
                    updatedState,
                    depth - 1,
                    nextPlayer(currentPlayer),
                    !isMaximizingPlayer,
                    newNode,
                    initialPlayer,
                );

                newNode.value.evaluation = evaluation;
                bestEval = nextEval(bestEval, evaluation);
            });

            return bestEval;
        };

        if (isMaximizingPlayer) {
            return doComputerMove(-Infinity, Math.max);
        } else {
            return doComputerMove(Infinity, Math.min);
        }
    }
}
