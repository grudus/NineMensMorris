import { Player } from './Player';
import { BoardPosition } from './BoardPosition';

export class NineMensMorrisGame {
    private static NUMBER_OF_POINTS = 9;
    private static BOARD_SIZE = 7;
    private board: BoardPosition[];

    private initialHandQueue: Player[];

    public constructor() {
        this.initialHandQueue = this.initHandQueue();
        this.board = this.initBoard();
    }

    private initHandQueue(): Player[] {
        const queue = [];
        const players = [Player.PLAYER_1, Player.PLAYER_2];
        for (let i = 0; i < NineMensMorrisGame.NUMBER_OF_POINTS * 2; i++) {
            queue.push(players[i % players.length]);
        }
        return queue;
    }

    private initBoard(): BoardPosition[] {
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
                board.push({ player: Player.NO_PLAYER, point: { row: i, col } });
            });
        }
        return board;
    }
}
