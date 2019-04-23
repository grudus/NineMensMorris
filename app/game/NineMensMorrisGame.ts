import { Player } from './Player';
import { BoardPosition } from './BoardPosition';
import { arePointsEqual, Point, point } from './Point';

export class NineMensMorrisGame {
    private static readonly NUMBER_OF_POINTS = 9;

    public static readonly BOARD_SIZE = 7;
    public readonly board: BoardPosition[];

    private initialHandQueue: Player[];
    private currentPlayerMove = Player.PLAYER_1;

    public constructor() {
        this.initialHandQueue = this.initHandQueue();
        this.board = this.initBoard();
    }

    public makeMove(point: Point) {
        if (this.initialHandQueue.length) {
            const position = this.board.find(p => arePointsEqual(p.point, point));
            position.player = position.player === Player.NO_PLAYER ? this.currentPlayerMove : position.player;
            this.currentPlayerMove = this.initialHandQueue.pop();
        }
    }

    public isPointValid(point: Point): boolean {
        return this.board.some(p => arePointsEqual(p.point, point));
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
                board.push({
                    player: Player.NO_PLAYER,
                    point: point(i, col),
                });
            });
        }
        return board;
    }
}
