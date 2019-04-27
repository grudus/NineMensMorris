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

    private cannotGoPoints = [
        { from: { row: 4, col: 'c' }, to: { row: 4, col: 'e' } },
        { from: { row: 3, col: 'd' }, to: { row: 5, col: 'd' } },
    ];

    public constructor() {
        this.initialHandQueue = InitialGameHelper.initHandQueue();
        this.board = InitialGameHelper.initBoard();
    }

    public makeMove(point: Point) {
        if (this.initialHandQueue.length) {
            const position = this.board.find(p => arePointsEqual(p.point, point));
            position.player = position.player === Player.NO_PLAYER ? this.currentPlayerMove : position.player;
            this.currentPlayerMove = this.initialHandQueue.pop();
        }
        console.log('IS MILL?', this.isMill(point));
    }

    public isMill(changedPoint: Point): boolean {
        const { colsInLine, rowsInLine } = this.findColsAndRowsInLine(changedPoint);

        const checkMill = (inLineArray: BoardPosition[], point: Point): boolean => {
            const inLineIndex = inLineArray.findIndex(p => arePointsEqual(p.point, point));
            for (let i = 0; i < inLineArray.length; i += 3) {
                if (inLineIndex >= i && inLineIndex < i + 3) {
                    const currPlayer = inLineArray[inLineIndex].player;
                    let millCount = 0;
                    for (let j = 0; j < 3; j++) {
                        if (currPlayer == inLineArray[i + j].player) millCount++;
                    }
                    if (millCount == 3) return true;
                }
            }
            return false;
        };

        return checkMill(colsInLine, changedPoint) || checkMill(rowsInLine, changedPoint);
    }

    public canMakeMove(point: Point): boolean {
        const triedPosition: BoardPosition = this.board.find(p => arePointsEqual(p.point, point));
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

    private findColsAndRowsInLine(point: Point): FindInLinePointsResults {
        return this.board.reduce(
            (acc, curr) => {
                if (arePointsEqual(curr.point, point)) {
                    acc.rowsInLine.push(curr);
                    acc.colsInLine.push(curr);
                } else if (curr.point.colIndex === point.colIndex) {
                    acc.colsInLine.push(curr);
                } else if (curr.point.row === point.row) {
                    acc.rowsInLine.push(curr);
                }
                return acc;
            },
            { colsInLine: [], rowsInLine: [] },
        );
    }

    private findNearestPoints(point: Point, colsInLine: BoardPosition[], rowsInLine: BoardPosition[]): Point[] {
        const sameColumnsIndex = colsInLine.findIndex(p => arePointsEqual(p.point, point));
        const sameRowsIndex = rowsInLine.findIndex(p => arePointsEqual(p.point, point));

        return [
            colsInLine[sameColumnsIndex + 1],
            colsInLine[sameColumnsIndex - 1],
            rowsInLine[sameRowsIndex + 1],
            rowsInLine[sameRowsIndex - 1],
        ]
            .filter(x => x)
            .map(p => p.point);
    }

    private filterNeighboursImpossibleToGo(point: Point, neighbours: Point[]) {
        this.cannotGoPoints.forEach(({ from, to }) => {
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

interface FindInLinePointsResults {
    colsInLine: BoardPosition[];
    rowsInLine: BoardPosition[];
}
