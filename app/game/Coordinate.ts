export interface Coordinate {
    row: number;
    col: number;
}

export function coord(row: number, col: number): Coordinate {
    return { row, col };
}

export function areCoordsEquals(coord1: Coordinate, coord2: Coordinate) {
    return coord1.row == coord2.row && coord1.col == coord2.col;
}

export function hash(point: Coordinate): number {
    return (point.row << 10) + point.col;
}

export function fromHash(hash: number): Coordinate {
    const col = hash % 1024;
    const row = (hash - col) >> 10;
    return coord(row, col);
}
