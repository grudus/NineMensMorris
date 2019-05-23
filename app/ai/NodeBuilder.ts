import { TreeNode } from '../tree/Tree';
import { GameNodeValue } from '../tree/GameNodeValue';
import { Coordinate } from '../game/Coordinate';
import { GameMoveResult } from '../game/GameMoveResult';
import { NineMensMorrisGame } from '../game/NineMensMorrisGame';

export function buildNodesToSearch(
    game: NineMensMorrisGame,
    parentNode: TreeNode<GameNodeValue>,
): TreeNode<GameNodeValue>[] {
    const state = game.getState();
    const nodesToSearch: TreeNode<GameNodeValue>[] = [];

    const addToSearch = (movesToValidState: Coordinate[]) => {
        nodesToSearch.push(new TreeNode({ movesToValidState, evaluation: null }, parentNode));
    };

    game.findSelectableCoordinates().forEach(coord => {
        game.resetState(state);
        const result = game.tryToMakeMove(coord);

        if (result === GameMoveResult.MILL) {
            game.findSelectableCoordinates(coord).forEach(millCoord => {
                addToSearch([coord, millCoord]);
            });
        } else if (result === GameMoveResult.FIRST_MOVE_PART) {
            const coordinatesForFinalMove = game.findSelectableCoordinates(coord);
            const stateAfterFirstMove = game.getState();

            coordinatesForFinalMove.forEach(finalMoveCoordinate => {
                game.resetState(stateAfterFirstMove);
                const finalMoveResult = game.tryToMakeMove(finalMoveCoordinate);

                if (finalMoveResult === GameMoveResult.MILL) {
                    game.findSelectableCoordinates(finalMoveCoordinate).forEach(millCoord => {
                        addToSearch([coord, finalMoveCoordinate, millCoord]);
                    });
                } else {
                    addToSearch([coord, finalMoveCoordinate]);
                }
            });
        } else if (result === GameMoveResult.CANNOT_MOVE_DUE_TO_GAME_END) {
        } else {
            addToSearch([coord]);
        }
    });

    game.resetState(state);
    parentNode.setChildren(nodesToSearch);
    return nodesToSearch;
}
