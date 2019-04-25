import { Player } from './Player';
import { BoardPosition } from './BoardPosition';
import { arePointsEqual, Point } from './Point';
import * as InitialGameHelper from './InitialGameHelper';

export class NineMensMorrisGame {
    public static readonly NUMBER_OF_POINTS = 9;
    public static readonly BOARD_SIZE = 7;
    public readonly board: BoardPosition[];

    private initialHandQueue: Player[];
    private currentPlayerMove = Player.PLAYER_1;

    public constructor() {
        this.initialHandQueue = InitialGameHelper.initHandQueue();
        this.board = InitialGameHelper.initBoard();
    }

    public makeMove(point: Point) {
        console.log(point);
        console.log(this.possibleMoves(point));
        if (this.initialHandQueue.length) {
            const position = this.board.find(p => arePointsEqual(p.point, point));
            position.player = position.player === Player.NO_PLAYER ? this.currentPlayerMove : position.player;
            this.currentPlayerMove = this.initialHandQueue.pop();
        }
    }

    public canMakeMove(point: Point): boolean {
        const triedPosition = this.board.find(p => arePointsEqual(p.point, point));
        return triedPosition && triedPosition.player == Player.NO_PLAYER;
    }

    public possibleMoves(point: Point): Point[] {
        return this.findNeighbours(point).filter(p => this.canMakeMove(p));
    }

    public findNeighbours(point: Point): Point[] {
        const { colsInLine, rowsInLine } = this.findColsAndRowsInLine(point);
        const neighbours: Point[] = this.findNearestPoints(point, colsInLine, rowsInLine);
        this.filterNeighboursImpossibleToGo(point, neighbours);

        return neighbours;
    }

    private findColsAndRowsInLine(point: Point): { colsInLine: Point[]; rowsInLine: Point[] } {
        return this.board.reduce(
            (acc, curr) => {
                if (arePointsEqual(curr.point, point)) {
                    acc.rowsInLine.push(point);
                    acc.colsInLine.push(point);
                } else if (curr.point.colIndex === point.colIndex) {
                    acc.colsInLine.push(curr.point);
                } else if (curr.point.row === point.row) {
                    acc.rowsInLine.push(curr.point);
                }
                return acc;
            },
            { colsInLine: [], rowsInLine: [] },
        );
    }

    private findNearestPoints(point: Point, colsInLine: Point[], rowsInLine: Point[]) {
        const sameColumnsIndex = colsInLine.indexOf(point);
        const sameRowsIndex = rowsInLine.indexOf(point);

        return [
            colsInLine[sameColumnsIndex + 1],
            colsInLine[sameColumnsIndex - 1],
            rowsInLine[sameRowsIndex + 1],
            rowsInLine[sameRowsIndex - 1],
        ].filter(x => x);
    }

    private filterNeighboursImpossibleToGo(point: Point, neighbours: Point[]) {
        const cannotGoPoints = [
            { from: { row: 4, col: 'c' }, to: { row: 4, col: 'e' } },
            { from: { row: 3, col: 'd' }, to: { row: 5, col: 'd' } },
        ];

        cannotGoPoints.forEach(({ from, to }) => {
            if (arePointsEqual(point, from)) {
                const i = neighbours.findIndex(p => arePointsEqual(p, to));
                neighbours.splice(i, 1);
            } else if (arePointsEqual(point, to)) {
                const i = neighbours.findIndex(p => arePointsEqual(p, from));
                neighbours.splice(i, 1);
            }
        });
    }
}
