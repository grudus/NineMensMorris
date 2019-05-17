import { Player } from './Player';
import { NineMensMorrisGame } from './NineMensMorrisGame';
import { BoardPosition } from './BoardPosition';
import { point } from './Coordinate';

export const initHandQueue = (): Player[] => {
    const queue = [];
    const players = [Player.PLAYER_1, Player.PLAYER_2];
    for (let i = 0; i < NineMensMorrisGame.NUMBER_OF_POINTS * 2; i++) {
        queue.push(players[i % players.length]);
    }
    return queue;
};

export const initBoard = (): BoardPosition[] => {
    const columns = [
        [1, 4, 7],
        [2, 4, 6],
        [3, 4, 5],
        [1, 2, 3, 5, 6, 7],
        [3, 4, 5],
        [2, 4, 6],
        [1, 4, 7],
    ];
    const board: BoardPosition[] = [];

    for (let i = 1; i <= NineMensMorrisGame.BOARD_SIZE; i++) {
        columns[i - 1].forEach(col => {
            board.push({
                player: Player.NO_PLAYER,
                coordinate: point(i, col),
            });
        });
    }
    return board;
};
