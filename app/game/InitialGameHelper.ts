import { Player } from './Player';
import { NineMensMorrisGame } from './NineMensMorrisGame';
import { BoardPosition } from './BoardPosition';
import { point } from './Point';

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
        ['a', 'd', 'g'],
        ['b', 'd', 'f'],
        ['c', 'd', 'e'],
        ['a', 'b', 'c', 'e', 'f', 'g'],
        ['c', 'd', 'e'],
        ['b', 'd', 'f'],
        ['a', 'd', 'g'],
    ];
    const board: BoardPosition[] = [];

    for (let i = 1; i <= NineMensMorrisGame.BOARD_SIZE; i++) {
        columns[i - 1].forEach(col => {
            board.push({
                player: Player.NO_PLAYER,
                point: point(i, col),
            });
        });
    }
    return board;
};
