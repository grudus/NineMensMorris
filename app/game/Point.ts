export interface Point extends PartialPoint {
    colIndex: number;
}

interface PartialPoint {
    row: number;
    col: string;
}

const A_CODE = 'a'.charCodeAt(0);

export function point(row: number, col: string): Point {
    return { row, col, colIndex: col.charCodeAt(0) - A_CODE };
}

export function pointFromIndexes(row: number, col: number): Point {
    return { row: row + 1, col: String.fromCharCode(A_CODE + col), colIndex: col };
}

export function arePointsEqual(point1: PartialPoint, point2: PartialPoint) {
    return point1.row == point2.row && point1.col == point2.col;
}
