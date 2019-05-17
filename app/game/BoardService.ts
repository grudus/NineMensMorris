import { BoardPosition } from './BoardPosition';
import { initBoard } from './InitialGameHelper';
import { areCoordsEquals, Coordinate } from './Coordinate';
import { Player } from './Player';

export class BoardService {
    private readonly cannotGoCoordinates = [
        { from: { row: 4, col: 'c' }, to: { row: 4, col: 'e' } },
        { from: { row: 3, col: 'd' }, to: { row: 5, col: 'd' } },
    ];

    public constructor(private board: BoardPosition[] = initBoard()) {}

    public resetBoard(board = initBoard()) {
        this.board = board;
    }

    public position(point: Coordinate): BoardPosition {
        return this.board.find(p => areCoordsEquals(p.coordinate, point));
    }

    public filter(predicate: (position: BoardPosition) => boolean): BoardPosition[] {
        return this.board.filter(predicate);
    }

    public findPlayerCoordinates(player: Player): Coordinate[] {
        return this.filter(pos => pos.player === player).map(p => p.coordinate);
    }

    public findColsAndRowsInLine(point: Coordinate): FindInLinePositionResults {
        return this.board.reduce(
            (acc, curr) => {
                if (areCoordsEquals(curr.coordinate, point)) {
                    acc.rowsInLine.push(curr);
                    acc.colsInLine.push(curr);
                } else if (curr.coordinate.colIndex === point.colIndex) {
                    acc.colsInLine.push(curr);
                } else if (curr.coordinate.row === point.row) {
                    acc.rowsInLine.push(curr);
                }
                return acc;
            },
            { colsInLine: [], rowsInLine: [] },
        );
    }

    public forEach(func: (pos: BoardPosition) => void) {
        this.board.forEach(func);
    }

    public findNeighbours(coordinate: Coordinate): Coordinate[] {
        const { colsInLine, rowsInLine } = this.findColsAndRowsInLine(coordinate);
        const neighbours: Coordinate[] = this.findNearestPoints(coordinate, colsInLine, rowsInLine);
        this.filterNeighboursImpossibleToGo(coordinate, neighbours);

        return neighbours;
    }

    private filterNeighboursImpossibleToGo(coordinate: Coordinate, neighbours: Coordinate[]) {
        this.cannotGoCoordinates.forEach(({ from, to }) => {
            if (areCoordsEquals(coordinate, from)) {
                const i = neighbours.findIndex(p => areCoordsEquals(p, to));
                neighbours.splice(i, 1);
            } else if (areCoordsEquals(coordinate, to)) {
                const i = neighbours.findIndex(p => areCoordsEquals(p, from));
                neighbours.splice(i, 1);
            }
        });
    }

    private findNearestPoints(
        coordinate: Coordinate,
        colsInLine: BoardPosition[],
        rowsInLine: BoardPosition[],
    ): Coordinate[] {
        const sameColumnsIndex = colsInLine.findIndex(p => areCoordsEquals(p.coordinate, coordinate));
        const sameRowsIndex = rowsInLine.findIndex(p => areCoordsEquals(p.coordinate, coordinate));

        return [
            colsInLine[sameColumnsIndex + 1],
            colsInLine[sameColumnsIndex - 1],
            rowsInLine[sameRowsIndex + 1],
            rowsInLine[sameRowsIndex - 1],
        ]
            .filter(x => x)
            .map(p => p.coordinate);
    }
}

interface FindInLinePositionResults {
    colsInLine: BoardPosition[];
    rowsInLine: BoardPosition[];
}
