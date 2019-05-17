export interface Coordinate {
    row: number;
    col: number;
}

export function point(row: number, col: number): Coordinate {
    return { row, col };
}

export function coordinatesFromIndexes(row: number, col: number): Coordinate {
    return { row: row + 1, col: col + 1 };
}

export function areCoordsEquals(coord1: Coordinate, coord2: Coordinate) {
    return coord1.row == coord2.row && coord1.col == coord2.col;
}
