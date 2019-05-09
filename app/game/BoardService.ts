import { BoardPosition } from './BoardPosition';
import { initBoard } from './InitialGameHelper';
import { areCoordsEquals, Coordinate } from './Coordinate';
import { Player } from './Player';

export class BoardService {
    private readonly board: BoardPosition[];

    public constructor() {
        this.board = initBoard();
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
}

interface FindInLinePositionResults {
    colsInLine: BoardPosition[];
    rowsInLine: BoardPosition[];
}
