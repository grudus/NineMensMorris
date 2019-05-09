export interface Coordinate extends PartialCoordinate {
    colIndex: number;
}

interface PartialCoordinate {
    row: number;
    col: string;
}

const A_CODE = 'a'.charCodeAt(0);

export function point(row: number, col: string): Coordinate {
    return { row, col, colIndex: col.charCodeAt(0) - A_CODE };
}

export function coordinatesFromIndexes(row: number, col: number): Coordinate {
    return { row: row + 1, col: String.fromCharCode(A_CODE + col), colIndex: col };
}

export function areCoordsEquals(coord1: PartialCoordinate, coord2: PartialCoordinate) {
    return coord1.row == coord2.row && coord1.col == coord2.col;
}
